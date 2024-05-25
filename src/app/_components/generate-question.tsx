// src/app/_components/generate-question.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [validationComplete, setValidationComplete] = useState(false);

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

  const { mutate: validateAnswer } = api.quiz.validateAnswer.useMutation({
    onSuccess: (data) => {
      setCorrectAnswer(data.correct);
      setFeedback(data.feedback);
      setValidationComplete(true);
      if (onComplete) {
        onComplete(data.correct);
      }
    },
    onError: (error) => {
      console.error("Answer validation error", error);
    },
  });

  // Set the question and description when the response is received
  useEffect(() => {
    if (questionResponse) {
      setQuestion(questionResponse.question);
      setDescription(questionResponse.description);
      setDifficulty(questionResponse.difficulty);
    } else {
      // TODO: Handle error
    }
  }, [questionResponse]);

  // Handle the submission of an answer
  const onSubmit = useCallback(
    (question: string, answer: string, description: string): void => {
      setSubmitted(true);
      setUserAnswer(answer);
      validateAnswer({
        topic,
        subject,
        content,
        question,
        description,
        answer,
      });
    },
    [topic, subject, content, validateAnswer],
  );

  return (
    <QuizQuestion
      question={question}
      description={description}
      validation={
        correctAnswer !== null
          ? { correct: correctAnswer, feedback: feedback }
          : undefined
      }
      isValidating={!validationComplete}
      onSubmit={onSubmit}
    />
  );
};
