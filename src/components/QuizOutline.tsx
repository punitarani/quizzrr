import { AlertCircle } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Progress } from '~/components/ui/progress'

interface QuizOutlineProps {
  outline: string | null
  isLoading: boolean
  error: boolean
}

const QuizOutline: React.FC<QuizOutlineProps> = ({
  outline,
  isLoading,
  error,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => prev + (100 - prev) * 0.05)
      }, 10)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="text-xl font-semibold">Loading Quiz Outline</h2>
          </AccordionTrigger>
          <AccordionContent>
            <Progress
              value={progress}
              className="w-full transition-all duration-1000 ease-out"
            />
            <p className="mt-2 text-gray-500">Generating Quiz Outline...</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  if (error) {
    console.error('Error generating quiz content summary')
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error generating quiz outline. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Accordion type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <h2 className="text-xl font-semibold">Quiz Outline</h2>
        </AccordionTrigger>
        <AccordionContent>
          {outline ? (
            <ReactMarkdown className="prose">{outline}</ReactMarkdown>
          ) : (
            <div className="text-gray-500">No outline available</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default QuizOutline
