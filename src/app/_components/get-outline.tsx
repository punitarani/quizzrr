// src/app/_components/get-outline.tsx

"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import QuizOutline from "~/components/QuizOutline";

interface GetOutlineProps {
  topic: string;
  subject: string;
  level: string;
  length: string;
  content: string;
  onComplete?: (outline: string) => void;
}

export const GetOutline: React.FC<GetOutlineProps> = ({
  topic,
  subject,
  level,
  length,
  content,
  onComplete,
}) => {
  const [outline, setOutline] = useState<string | null>(null);

  const { data, error, isLoading } = api.quiz.outline.useQuery({
    info: {
      topic,
      subject,
      level,
    },
    summary: content,
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
