import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'What is a Sliding Context Window in LLMs?',
    message: 'Research papers related to what is a Sliding Context Window in Large Language Models?'
  },
  {
    heading: 'Applications of Reinforcement Learning on Human Feedback',
    message: 'Research papers related to applications of Reinforcement Learning on Human Feedback'
  },
  {
    heading: 'Gene Editing Techniques: CRISPR-Cas9 Explained',
    message: 'Research papers related to  Gene Editing Techniques: CRISPR-Cas9 Explained'
  },
  {
    heading: 'Quantum Computing: The Future of Processing Power',
    message: 'Research papers related to Quantum Computing: The Future of Processing Power'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
