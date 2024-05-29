// src/app/_components/get-quiz-runner.tsx "use client";

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GenerateQuestion } from '~/app/_components/generate-question'
import { useQuizContext } from '~/context/QuizContext'
import { api } from '~/trpc/react'
import type { QuizInfoData, QuizQuestionAnswerData } from '~/types'

interface GetQuizRunnerProps {
  quizInfo: QuizInfoData
  content: string
  outline: string
  onComplete?: (score: number) => void
}

interface Question {
  id: number
  question: React.ReactNode
}

export const QuizRunner: React.FC<GetQuizRunnerProps> = ({
  quizInfo,
  content,
  outline,
  onComplete,
}) => {
  const { qaData, setQAData } = useQuizContext()

  const isInitialMount = useRef(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false)
  const [questionIndex, setQuestionIndex] = useState<number>(0)

  // Handle the completion of the quiz
  const { mutate: checkCompletion } = api.quiz.checkCompletion.useMutation({
    onSuccess: (data) => {
      console.log('Quiz completion data', data)
      if (data) {
        setQuizCompleted(true)
        if (onComplete) {
          onComplete(score)
        }
      } else {
        generateQuestion()
      }
    },
    onError: (error) => {
      console.error('Quiz completion error', error)
    },
  })

  // Handle the generation of a question
  const onQuestionCallback = useCallback(
    (data: QuizQuestionAnswerData) => {
      const updatedQAData: QuizQuestionAnswerData[] = [...qaData, data]
      setQAData(updatedQAData)
      console.log('onQuestionCallback', updatedQAData)
    },
    [qaData, setQAData],
  )

  // Handle the validation of an answer
  const onAnswerCallback = useCallback(
    (data: QuizQuestionAnswerData) => {
      // Update the question data with the answer
      const updatedQAData = qaData.map((question) =>
        question.id === data.id
          ? { ...question, answer: data.answer }
          : question,
      )
      setQAData(updatedQAData)
      console.log('onAnswerCallback', updatedQAData)

      console.log(`Correct: ${data?.answer?.isCorrect}`)
      if (data?.answer?.isCorrect) {
        setScore((prevScore) => prevScore + 1)
      }

      // Check if the quiz is completed
      console.log('Checking completion', updatedQAData)
      checkCompletion({
        info: quizInfo,
        summary: content,
        history: updatedQAData,
      })

      setQuestionIndex((prevIndex) => {
        return prevIndex + 1
      })
    },
    [checkCompletion, content, qaData, quizInfo, setQAData],
  )

  // Generate a new question
  const generateQuestion = useCallback(() => {
    const newQuestion: Question = {
      id: questionIndex,
      question: (
        <GenerateQuestion
          onQuestion={onQuestionCallback}
          onAnswer={onAnswerCallback}
        />
      ),
    }
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion])
  }, [questionIndex, onQuestionCallback, onAnswerCallback])

  // Generate the first question on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      generateQuestion()
      isInitialMount.current = false
    }
  })

  return (
    <div className="my-4 flex flex-col space-y-4">
      {questions.map((question) => (
        <div key={question.id}>{question.question}</div>
      ))}
      {quizCompleted && (
        <div
          className="border-l-4 border-green-500 bg-green-100 p-4 text-green-700"
          role="alert"
        >
          <p className="font-bold">Congratulations!</p>
          <p>You have completed the quiz.</p>
          <p>
            Your final score is: {score}/{questions.length}
          </p>
        </div>
      )}
    </div>
  )
}

export default QuizRunner
