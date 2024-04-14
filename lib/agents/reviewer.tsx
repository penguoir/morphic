import { OpenAI } from 'ai/openai'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { ExperimentalMessage, experimental_streamObject } from 'ai'
import { PartialLiteratureReview, literatureReviewSchema } from '@/lib/schema/literature-review'
import { LiteratureReview } from '@/components/literature-review'

export async function reviewer(
    uiStream: ReturnType<typeof createStreamableUI>,
    messages: ExperimentalMessage[]
  ) {
    const openai = new OpenAI({
      baseUrl: process.env.OPENAI_API_BASE, // optional base URL for proxies etc.
      apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY
      organization: '' // optional organization
    })
    const objectStream = createStreamableValue<PartialLiteratureReview>()
    uiStream.update(<LiteratureReview literatureReview={objectStream.value} />)
  
    let finalLiteratureReview: PartialLiteratureReview = {}
    await experimental_streamObject({
      model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo'),
      system: `You are an expert academic researcher. Your role is to generate a
      literature review using only information from the previous conversation.
      Write the review in git`,
      messages,
      schema: literatureReviewSchema
    })
      .then(async result => {
        for await (const obj of result.partialObjectStream) {
          if (obj) {
            objectStream.update(obj)
            finalLiteratureReview = obj
          }
        }
      })
      .finally(() => {
        objectStream.done()
      })
    return finalLiteratureReview
  }
  