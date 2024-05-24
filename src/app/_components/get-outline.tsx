// src/app/_components/get-outline.tsx

"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import QuizOutline from "~/components/QuizOutline";

interface GetOutlineProps {
  topic: string;
  content: string;
  subject: string;
  level: string;
  length: string;
  onComplete?: (outline: string) => void;
}

export const GetOutline: React.FC<GetOutlineProps> = ({
  topic,
  content,
  subject,
  level,
  length,
  onComplete,
}) => {
  const [outline, setOutline] = useState<string | null>(null);

  const { data, error, isLoading } = api.quiz.outline.useQuery({
    topic,
    content,
    subject,
    level,
  });

  useEffect(() => {
    if (data) {
      setOutline(data.outline);
      if (onComplete) {
        onComplete(data.outline);
      }
    }
  }, [data, onComplete]);

  return (
    <QuizOutline outline={outline} isLoading={isLoading} error={!!error} />
  );
};
