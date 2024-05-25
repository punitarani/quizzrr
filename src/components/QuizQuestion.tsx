//src/components/QuizQuestion.tsx

import React, { useCallback, useState, useEffect } from "react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

interface QuizQuestionProps {
  question: string;
  description: string;
  onSubmit: (
    question: string,
    answer: string,
    description: string,
  ) => Promise<[boolean, string]>;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  description,
  onSubmit,
}) => {
  const [answer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      if (!answer) {
        return;
      }

      setSubmitted(true);

      const validatedAnswer = await onSubmit(question, answer, description);
      setCorrect(validatedAnswer[0]);
      setExplanation(validatedAnswer[1]);
    },
    [answer, description, onSubmit, question],
  );

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      void handleSubmit(e as unknown as React.FormEvent).then(() => {
        // handle the result of handleSubmit here if needed
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        void handleSubmit(e as unknown as React.FormEvent).then(() => {
          // handle the result of handleSubmit here if needed
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [answer, handleSubmit]);

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-lg font-semibold">{question}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
        <Textarea
          placeholder="Your answer..."
          value={answer}
          onChange={(e) => setUserAnswer(e.target.value)}
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
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" className="mt-2" disabled={submitted}>
          Submit
        </Button>
      </form>
      {submitted && correct !== null && explanation && (
        <div
          className={`mt-4 rounded-md p-2 ${correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
