// src/app/_components/get-quiz-runner.tsx "use client";
import React, { useEffect, useState } from "react";
import { GenerateQuestion } from "~/app/_components/generate-question";

interface GetQuizRunnerProps {
  topic: string;
  subject: string;
  level: string;
  length: string;
  content: string;
  outline: string;
  onComplete?: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  answer: string;
}

export const QuizRunner: React.FC<GetQuizRunnerProps> = ({
  topic,
  subject,
  level,
  content,
  outline,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    generateQuestion(0); // Generate the first question
  }, []);

  const generateQuestion = (index: number) => {
    const newQuestion: Question = {
      id: index,
      question: `Question ${index + 1}`,
      answer: `Answer ${index + 1}`,
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleAnswerSubmit = (questionId: number, answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionId] = answer;
    setUserAnswers(updatedAnswers);

    const question = questions.find((q) => q.id === questionId);
    if (question && answer === question.answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(score);
      }
    }

    // Generate the next question if there are more questions
    if (currentQuestionIndex < 9) {
      generateQuestion(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="my-4 flex flex-col space-y-4">
      {questions.map((question, index) => (
        <div key={question.id}>
          {index <= currentQuestionIndex && (
            <GenerateQuestion
              key={question.id}
              topic={topic}
              subject={subject}
              level={level}
              content={content}
              outline={outline}
              onComplete={(correct) =>
                handleAnswerSubmit(question.id, correct ? question.answer : "")
              }
            />
          )}
        </div>
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
