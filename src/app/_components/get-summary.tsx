// src/app/_components/get-summary.tsx

"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import QuizContentSummary from "~/components/QuizContentSummary";

interface GetOutlineProps {
  topic: string;
  subject: string;
  level: string;
  length: string;
  onComplete?: (content: string) => void;
}

export const GetSummary: React.FC<GetOutlineProps> = ({
  topic,
  subject,
  level,
  length,
  onComplete,
}) => {
  const [summary, setSummary] = useState<string | null>(null);

  const { data, error, isLoading } = api.quiz.content.useQuery({
    topic,
  });

  useEffect(() => {
    if (data) {
      setSummary(data.content);
      if (onComplete) {
        onComplete(data.content);
      }
    }
  }, [data, onComplete]);

  return (
    <QuizContentSummary
      summary={summary}
      isLoading={isLoading}
      error={!!error}
    />
  );
};
