"use client";

import React, { useEffect, useState } from "react";
import QuizQuestion from "~/components/QuizQuestion";
import { api } from "~/trpc/react";

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
  const [difficulty, setDifficulty] = useState<string>("");

  const { data: questionResponse } = api.quiz.generateQuestion.useQuery(
    {
      topic: topic,
      subject: subject,
      level: level,
      content: content,
      outline: outline,
      history: [],
    },
    {
      enabled: true,
    },
  );

  useEffect(() => {
    if (questionResponse) {
      setQuestion(questionResponse.question);
      setDescription(questionResponse.description);
      setDifficulty(questionResponse.difficulty);
    } else {
      // TODO: Handle error
    }
  }, [questionResponse]);

  const onSubmit = async (
    question: string,
    answer: string,
    description: string,
  ): Promise<[boolean, string]> => {
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
