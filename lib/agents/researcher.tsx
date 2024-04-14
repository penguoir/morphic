import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import {
  ExperimentalMessage,
  ToolCallPart,
  ToolResultPart,
  experimental_streamText
} from 'ai'
import { searchSchema } from '@/lib/schema/search'
import { Section } from '@/components/section'
import { OpenAI } from 'ai/openai'
import { ToolBadge } from '@/components/tool-badge'
import { SearchSkeleton } from '@/components/search-skeleton'
import { SearchResults } from '@/components/search-results'
import { BotMessage } from '@/components/message'
import Exa from 'exa-js'
import { SearchResultsImageSection } from '@/components/search-results-image'
import { Card } from '@/components/ui/card'
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamText: ReturnType<typeof createStreamableValue<string>>,
  messages: ExperimentalMessage[]
) {
  const openai = new OpenAI({
    baseUrl: process.env.OPENAI_API_BASE, // optional base URL for proxies etc.
    apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY
    organization: '' // optional organization
  })

  let fullResponse = ''
  let hasError = false
  const answerSection = (
    <Section title="Answer">
      <BotMessage content={streamText.value} />
    </Section>
  )

  const result = await experimental_streamText({
    model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo'),
    maxTokens: 2500,
    system: `As a professional search expert, you possess the ability to search for any information on the web. 
    For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
    If there are any images relevant to your answer, be sure to include them as well.
    Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
    Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly.
    `,
    messages,
    tools: {
      search: {
        description: 'Search the web for papers',
        parameters: searchSchema,
        execute: async ({
          query,
          max_results,
          search_depth
        }: {
          query: string
          max_results: number
          search_depth: 'basic' | 'advanced'
        }) => {
          uiStream.update(
            <Section>
              <ToolBadge tool="search">{`${query}`}</ToolBadge>
            </Section>
          )

          uiStream.append(
            <Section>
              <SearchSkeleton />
            </Section>
          )

          let searchResult
          let context
          try {
            searchResult = await exaSearch(query, max_results)
            await registerDocumentsOnVectorDB(searchResult)

            // Not the first request
            if (messages.filter((message) => message.role === 'user').length > 1) {
              const relevantDocuments = await loadRelevantDocuments(messages)
              context = relevantDocuments.map((document) => ({
                pageContent: document[0].pageContent,
                metadata: document[0].metadata,
                url: document[0].metadata.url
              }))
            }
          } catch (error) {
            console.error('Search API error:', error)
            hasError = true
          }

          if (hasError) {
            fullResponse += `\nAn error occurred while searching for "${query}.`
            uiStream.update(
              <Card className="p-4 mt-2 text-sm">
                {`An error occurred while searching for "${query}".`}
              </Card>
            )

            return searchResult
          }

          // uiStream.update(
          //   <Section title="Images">
          //     <SearchResultsImageSection
          //       images={searchResult.images}
          //       query={searchResult.query}
          //     />
          //   </Section>
          // )

          uiStream.update(
            <Section title="Papers">
              <SearchResults results={searchResult.results} />
            </Section>
          )

          uiStream.append(answerSection)

          return context || searchResult
        }
      }
    }
  })

  const toolCalls: ToolCallPart[] = []
  const toolResponses: ToolResultPart[] = []
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta':
        if (delta.textDelta) {
          // If the first text delata is available, add a ui section
          if (fullResponse.length === 0 && delta.textDelta.length > 0) {
            // Update the UI
            uiStream.update(answerSection)
          }

          fullResponse += delta.textDelta
          streamText.update(fullResponse)
        }
        break
      case 'tool-call':
        toolCalls.push(delta)
        break
      case 'tool-result':
        toolResponses.push(delta)
        break
      case 'error':
        hasError = true
        fullResponse += `\nError occurred while executing the tool`
        break
    }
  }
  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls]
  })

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses })
  }

  return { result, fullResponse, hasError }
}

async function exaSearch(query: string, maxResults: number = 10): Promise<any> {
  const apiKey = process.env.EXA_API_KEY
  const exa = new Exa(apiKey)
  return exa.searchAndContents(`${query} ONLY RETURN PDF PAPERS`, {
    highlights: true,
    numResults: maxResults,
    category: 'papers',
    includeDomains: ['https://arxiv.org/']
  })
}

async function registerDocumentsOnVectorDB(searchResult: any) {
    fetch("http://academorphic.vercel.app/api/embedding", {
      method: "POST",
      body: JSON.stringify({ urls: searchResult.results.map((result: any) => result.url) })
    })
}

async function loadRelevantDocuments(messages: ExperimentalMessage[]) {
    const context = messages.map((message: ExperimentalMessage) => message.content).join('\n')

    const vectorDB = await QdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings(),
        {
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            collectionName: 'arxiv-papers-1'
        }
    )

    const embeddedContext = await new OpenAIEmbeddings().embedQuery(context)
    const relevantDocuments = await vectorDB.similaritySearchVectorWithScore(embeddedContext, 10)

    return relevantDocuments
}
