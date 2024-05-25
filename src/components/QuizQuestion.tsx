//src/components/QuizQuestion.tsx

import React, { useCallback, useState, useEffect } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import type { QuizAnswerData, QuizQuestionUserAnswerData } from "~/types";

interface QuizQuestionProps {
  question: string;
  description: string;
  isValidating: boolean;
  validation?: QuizAnswerData | null;
  onSubmit: (question: string, answer: string, description: string) => void;
  onAnswer: (answer: QuizQuestionUserAnswerData) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  description,
  isValidating,
  validation,
  onSubmit,
  onAnswer,
}) => {
  const [answer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();

      // Prevent submitting an empty answer
      if (!answer) {
        return;
      }

      // Prevent submitting the same answer multiple times
      if (!submitted) {
        setSubmitted(true);
        onSubmit(question, answer, description);
      }
    },
    [answer, description, onSubmit, question, submitted],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  useEffect((): void => {
    console.log(
      "submitted",
      submitted,
      "isValidating",
      isValidating,
      "validation",
      validation,
    );
    if (submitted && !isValidating && validation) {
      setCorrect(validation.isCorrect);
      setExplanation(validation.feedback);
    }
  }, [submitted, isValidating, validation]);

  useEffect((): void => {
    console.log("submitted", submitted, "correct", correct);
    if (submitted && correct !== null) {
      onAnswer({
        question: question,
        description: description,
        userAnswer: answer,
        isCorrect: correct,
        correctAnswer: explanation,
        feedback: explanation,
      });
    }
  }, [
    answer,
    correct,
    description,
    explanation,
    onAnswer,
    question,
    submitted,
  ]);

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold">{question}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
        <Textarea
          placeholder="Your answer..."
          value={answer}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setUserAnswer(e.target.value)
          }
          className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
            submitted && correct !== null
              ? correct
                ? "border-green-500"
                : "border-red-500"
              : "border-gray-300 focus:border-blue-300"
          }`}
          disabled={submitted}
          rows={1}
          style={{
            resize: "none",
            overflow: "hidden",
            height: "auto",
            minHeight: "1.5em",
          }}
          onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
        />
        {(!submitted || (submitted && isValidating)) && (
          <Button
            type="submit"
            className="mt-2"
            disabled={!answer || submitted}
          >
            Submit
          </Button>
        )}
      </form>
      {submitted && correct !== null && explanation && (
        <div
          className={`mt-4 rounded-md p-2 ${
            correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          <p>{explanation}</p>
        </div>
      )}
      {submitted && isValidating && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Validating answer...</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
