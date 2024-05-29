// src/app/_components/generate-question.tsx

import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import QuizQuestion from '~/components/QuizQuestion'
import { useQuizContext } from '~/context/QuizContext'
import { api } from '~/trpc/react'
import type { QuizAnswerData, QuizQuestionAnswerData } from '~/types'

import { v4 as uuidv4 } from 'uuid'

interface GetQuestionProps {
  onQuestion: (data: QuizQuestionAnswerData) => void
  onAnswer: (data: QuizQuestionAnswerData) => void
}

export const GenerateQuestion: React.FC<GetQuestionProps> = ({
  onQuestion,
  onAnswer,
}) => {
  const { quizInfo, summary, outline, qaData } = useQuizContext()
  if (quizInfo === null || summary === null || outline === null) {
    throw new Error('Quiz context has null values')
  }

  const [questionAnswer, setQuestionAnswer] =
    useState<QuizQuestionAnswerData | null>(null)
  const [answerData, setAnswerData] = useState<QuizAnswerData | null>(null)
  const [validationComplete, setValidationComplete] = useState(false)

  const { data: questionResponse, refetch: fetchQuestion } =
    api.quiz.generateQuestion.useQuery(
      {
        info: quizInfo,
        content: summary,
        outline: outline,
        history: qaData,
      },
      {
        enabled: false,
      },
    )

  const { mutate: validateAnswer } = api.quiz.validateAnswer.useMutation({
    onSuccess: (data) => {
      setAnswerData(data)
      setValidationComplete(true)
      if (onAnswer && questionAnswer) {
        setQuestionAnswer((prevQAData) =>
          prevQAData ? { ...prevQAData, answer: data } : null,
        )
        onAnswer(questionAnswer)
      }
    },
    onError: (error) => {
      console.error('Answer validation error', error)
    },
  })

  // Fetch the question when the component mounts
  useEffect(() => {
    if (questionAnswer === null) {
      fetchQuestion()
        .then((r) => r)
        .catch((e) => console.error(e))
    }
  }, [fetchQuestion, questionAnswer])

  // Set the question data when it is generated
  useEffect(() => {
    if (questionResponse) {
      setQuestionAnswer({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        id: uuidv4(),
        question: questionResponse,
      })
    } else {
      // TODO: Handle error
    }
  }, [questionResponse])

  // Handle the submission of an answer
  const onSubmitCallback = useCallback(
    (data: QuizQuestionAnswerData, submittedAnswer: string): void => {
      if (questionAnswer) {
        validateAnswer({
          info: quizInfo,
          content: summary,
          question: data.question,
          answer: submittedAnswer,
        })
      }
    },
    [questionAnswer, quizInfo, summary, validateAnswer],
  )

  // Handle the generation of the question
  useEffect(() => {
    if (questionAnswer) {
      onQuestion(questionAnswer)
    }
  }, [questionAnswer, onQuestion])

  // Handle the validation of the answer
  const onAnswerCallback = useCallback((data: QuizQuestionAnswerData): void => {
    setQuestionAnswer(data)
  }, [])

  return (
    <QuizQuestion
      data={questionAnswer}
      validation={answerData}
      isValidating={!validationComplete}
      onSubmit={onSubmitCallback}
      onAnswer={onAnswerCallback}
    />
  )
}
