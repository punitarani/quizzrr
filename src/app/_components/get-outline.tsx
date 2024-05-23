// src/app/_components/get-outline.tsx

"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Outline from "~/components/Outline";

interface GetOutlineProps {
  topic: string;
  subject: string;
  level: string;
  length: string;
}

export const GetOutline: React.FC<GetOutlineProps> = ({
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

  return <Outline summary={summary} isLoading={isLoading} error={!!error} />;
};
