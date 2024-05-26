// src/app/_components/get-summary.tsx

"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import QuizContentSummary from "~/components/QuizContentSummary";
import type { QuizInfoData } from "~/types";

interface GetOutlineProps {
  quizInfo: QuizInfoData;
  onComplete?: (content: string) => void;
}

export const GetSummary: React.FC<GetOutlineProps> = ({
  quizInfo,
  onComplete,
}) => {
  const [summary, setSummary] = useState<string | null>(null);

  const { data, error, isLoading } = api.quiz.content.useQuery({
    info: quizInfo,
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
