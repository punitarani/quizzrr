// src/app/_components/generate-question.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import QuizQuestion from "~/components/QuizQuestion";
import { api } from "~/trpc/react";
import type {
  QuizAnswerData,
  QuizQuestionData,
  QuizQuestionUserAnswerData,
} from "~/types";

interface GetQuestionProps {
  topic: string;
  subject: string;
  level: string;
  content: string;
  outline: string;
  onComplete?: (answer: QuizQuestionUserAnswerData) => void;
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
  const [answerData, setAnswerData] = useState<QuizAnswerData | null>(null);
  const [validationComplete, setValidationComplete] = useState(false);

  const [questionData, setQuestionData] = useState<QuizQuestionData | null>(
    null,
  );
  const [userAnswerData, setUserAnswerData] =
    useState<QuizQuestionUserAnswerData | null>(null);

  const { data: questionResponse } = api.quiz.generateQuestion.useQuery(
    {
      info: {
        topic: topic,
        subject: subject,
        level: level,
      },
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
      setCorrectAnswer(data.isCorrect);
      setFeedback(data.feedback);
      setAnswerData(data);
      setValidationComplete(true);
      if (onComplete) {
        onComplete({
          question: question,
          description: description,
          userAnswer: userAnswer,
          correctAnswer: data.correctAnswer,
          isCorrect: data.isCorrect,
          feedback: data.feedback,
        });
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
      setQuestionData(questionResponse);
    } else {
      // TODO: Handle error
    }
  }, [questionResponse]);

  // Handle the submission of an answer
  const onSubmitCallback = useCallback(
    (question: string, answer: string, description: string): void => {
      setSubmitted(true);
      setUserAnswer(answer);

      if (questionData) {
        validateAnswer({
          info: {
            topic,
            subject,
            level,
          },
          content,
          question: questionData,
          answer,
        });
      }
    },
    [validateAnswer, topic, subject, level, content, questionData],
  );

  // Handle the validation of the answer
  const onAnswerCallback = useCallback(
    (answerData: QuizQuestionUserAnswerData): void => {
      setUserAnswerData(answerData);
    },
    [],
  );

  return (
    <QuizQuestion
      question={question}
      description={description}
      validation={answerData}
      isValidating={!validationComplete}
      onSubmit={onSubmitCallback}
      onAnswer={onAnswerCallback}
    />
  );
};
