'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/app/action'
import { WandSparkles } from 'lucide-react'
import { LiteratureReview } from './literature-review'

export function GenerateReview() {
  const { submit } = useActions<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <LiteratureReview />
    }

    const responseMessage = await submit(formData, false, true)
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      responseMessage
    ])
  }

  return (
    <div className="flex justify-start w-full">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 relative flex items-center space-x-1"
      >
        <Button type="submit" variant={'outline'}>
          Generate PDF
          <WandSparkles size={18} className="ml-2" />
        </Button>
      </form>
    </div>
  )
}
