'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/app/action'
import { UserMessage } from './user-message'
import { SparklesIcon } from 'lucide-react'

export function GenerateReview() {
  const [input, setInput] = useState('')
  const { submit } = useActions<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <UserMessage message={input} isFirstMessage={false} />
    }

    const responseMessage = await submit(formData)
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      responseMessage
    ])

    setInput('')
  }

  return (
    <div className="flex justify-start w-full">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 relative flex items-center space-x-1"
      >
        <Button
          type="submit"
          variant={'outline'}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium leading-5 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SparklesIcon size={20} className="mr-2" />
          Generate
        </Button>
      </form>
    </div>
  )
}
