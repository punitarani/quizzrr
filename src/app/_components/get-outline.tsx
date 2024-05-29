// src/app/_components/get-outline.tsx

'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import QuizOutline from '~/components/QuizOutline'
import { api } from '~/trpc/react'
import type { QuizInfoData } from '~/types'

interface GetOutlineProps {
  quizInfo: QuizInfoData
  content: string
  onComplete?: (outline: string) => void
}

export const GetOutline: React.FC<GetOutlineProps> = ({
  quizInfo,
  content,
  onComplete,
}) => {
  const [outline, setOutline] = useState<string | null>(null)

  const { data, error, isLoading } = api.quiz.outline.useQuery({
    info: quizInfo,
    summary: content,
  })

  useEffect(() => {
    if (data) {
      setOutline(data.outline)
      if (onComplete) {
        onComplete(data.outline)
      }
    }
  }, [data, onComplete])

  return <QuizOutline outline={outline} isLoading={isLoading} error={!!error} />
}
