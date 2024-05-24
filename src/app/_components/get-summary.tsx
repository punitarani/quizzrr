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
}

export const GetSummary: React.FC<GetOutlineProps> = ({
  topic,
  subject,
  level,
  length,
}) => {
  const [summary, setSummary] = useState<string | null>(null);

  const { data, error, isLoading } = api.quiz.outline.useQuery({ topic });

  useEffect(() => {
    if (data) {
      setSummary(data.outline);
    }
  }, [data]);

  return (
    <QuizContentSummary
      summary={summary}
      isLoading={isLoading}
      error={!!error}
    />
  );
};
