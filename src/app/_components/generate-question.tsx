// src/app/_components/generate-question.tsx

"use client";

import React, { useEffect, useState } from "react";
import QuizQuestion from "~/components/QuizQuestion";

interface GetQuestionProps {
  topic: string;
  subject: string;
  level: string;
  content: string;
  outline: string;
  onComplete?: (correct: boolean) => void;
}

export const GenerateQuestion: React.FC<GetQuestionProps> = ({
  topic,
  subject,
  level,
  content,
  outline,
  onComplete,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    setQuestion("Guess 0 or 1");
    setDescription("50% chance of getting it right");
  }, []);

  const onSubmit = (
    question: string,
    answer: string,
    description?: string,
  ): [boolean, string] => {
    const correctAnswer = Math.round(Math.random());
    const isCorrect = answer === correctAnswer.toString();
    const feedback = `The correct answer is ${correctAnswer}.`;

    if (onComplete) {
      onComplete(isCorrect);
    }

    return [isCorrect, feedback];
  };

  return (
    <QuizQuestion
      question={question}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
