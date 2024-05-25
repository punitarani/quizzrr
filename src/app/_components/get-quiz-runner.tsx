// src/app/_components/get-quiz-runner.tsx "use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GenerateQuestion } from "~/app/_components/generate-question";
import { api } from "~/trpc/react";
import type { QuizInfoData, QuizQuestionUserAnswerData } from "~/types";

interface GetQuizRunnerProps {
  quizInfo: QuizInfoData;
  content: string;
  outline: string;
  onComplete?: (score: number) => void;
}

interface Question {
  id: number;
  question: React.ReactNode;
}

export const QuizRunner: React.FC<GetQuizRunnerProps> = ({
  quizInfo,
  content,
  outline,
  onComplete,
}) => {
  const isInitialMount = useRef(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [qaData, setQAData] = useState<QuizQuestionUserAnswerData[]>([]);

  // Handle the completion of the quiz
  const { mutate: checkCompletion } = api.quiz.checkCompletion.useMutation({
    onSuccess: (data) => {
      console.log("Quiz completion data", data);
      if (data) {
        setQuizCompleted(true);
        if (onComplete) {
          onComplete(score);
        }
      } else {
        generateQuestion();
      }
    },
    onError: (error) => {
      console.error("Quiz completion error", error);
    },
  });

  // Handle the submission of an answer
  const handleAnswerSubmit = useCallback(
    (answer: QuizQuestionUserAnswerData) => {
      setQAData((prevData) => [...prevData, answer]);

      console.log(`Correct: ${answer.isCorrect}`);
      if (answer.isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      // Check if the quiz is completed
      checkCompletion({
        info: quizInfo,
        summary: content,
        history: qaData,
      });

      setQuestionIndex((prevIndex) => {
        return prevIndex + 1;
      });
    },
    [onComplete, score],
  );

  // Generate a new question
  const generateQuestion = useCallback(() => {
    const newQuestion: Question = {
      id: questionIndex,
      question: (
        <GenerateQuestion
          quizInfo={quizInfo}
          content={content}
          outline={outline}
          onComplete={handleAnswerSubmit}
        />
      ),
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  }, [content, outline, handleAnswerSubmit, questionIndex, quizInfo]);

  // Generate the first question on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      generateQuestion();
      isInitialMount.current = false;
    }
  });

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
  );
};

export default QuizRunner;
