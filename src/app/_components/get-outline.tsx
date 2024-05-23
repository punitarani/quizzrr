// src/app/_components/get-outline.tsx

"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Outline from "~/components/Outline";

interface GetOutlineProps {
  topic: string;
}

export const GetOutline: React.FC<GetOutlineProps> = ({ topic }) => {
  const [summary, setSummary] = useState<string | null>(null);

  const { data, error, isLoading } = api.quiz.outline.useQuery({ topic });

  useEffect(() => {
    if (data) {
      setSummary(data.outline);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading outline</div>;
  }

  return <Outline summary={summary} />;
};