// src/context/QuizContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { QuizInfoData } from "~/types";

interface QuizContextProps {
  quizInfo: QuizInfoData | null;
  setQuizInfo: (quizInfo: QuizInfoData) => void;
  summary: string | null;
  setSummary: (outline: string | null) => void;
  outline: string | null;
  setOutline: (outline: string | null) => void;
  score: number;
  setScore: (score: number) => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [quizInfo, setQuizInfo] = useState<QuizInfoData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [outline, setOutline] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  return (
    <QuizContext.Provider
      value={{
        quizInfo: quizInfo,
        setQuizInfo: setQuizInfo,
        summary: summary,
        setSummary: setSummary,
        outline: outline,
        setOutline: setOutline,
        score: score,
        setScore: setScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};
