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
      system: `As a professional literature review researcher, your primary objective is to understand the research papers 
      the user has viewed and write a literature review based on the user's input. 
      It should be between 2000 and 3000 words and include a summary of the key points.
      You also need a section that discusses the strengths and weaknesses of the research papers.
      Finally, you should provide a conclusion that synthesizes the information and offers insights into the topic.
      Remember to cite the sources of the research papers you reference in your
      literature review. Use the Harvard referencing system. The last section should be a list of the sources you referenced.
     `,
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
  