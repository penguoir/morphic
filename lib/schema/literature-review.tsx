import { DeepPartial } from 'ai'
import { z } from 'zod'

export const literatureReviewSchema = z.object({
  content: z.string().describe('The content of the literature review'),
})

export type PartialLiteratureReview = DeepPartial<typeof literatureReviewSchema>
