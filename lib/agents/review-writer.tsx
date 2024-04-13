import { ExperimentalMessage, experimental_generateObject } from 'ai'
import { OpenAI } from 'ai/openai'
import { nextActionSchema } from '../schema/next-action'

// Decide whether inquiry is required for the user input
export async function litwriter(messages: ExperimentalMessage[]) {
  const openai = new OpenAI({
    baseUrl: process.env.OPENAI_API_BASE, // optional base URL for proxies etc.
    apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY
    organization: '' // optional organization
  })

  const result = await experimental_generateObject({
    model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo'),
    system: `As a professional tasked with conducting a literature review, your objective is to thoroughly understand the topic provided and gather relevant information from available sources. 
    Your decision should be based on a careful assessment of the available literature, considering factors such as relevance, comprehensiveness, and currency. 
    Aim to deliver a literature review that not only meets the requirements of the task but also adds value by contributing new insights or perspectives to the existing body of knowledge on the subject matter.
    Choose wisely to ensure that you fulfill your role as a diligent researcher and provide a literature review that meets the highest standards of academic rigor and relevance.
    `,
    messages,
    schema: nextActionSchema
  })

  return result
}
