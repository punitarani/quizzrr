// src/context/QuizContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { QuizInfoData } from "~/types";

interface QuizContextProps {
  quizInfo: QuizInfoData | null;
  setQuizInfo: (quizInfo: QuizInfoData) => void;
  contentSummary: string | null;
  setContentSummary: (outline: string | null) => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [quizInfo, setQuizInfo] = useState<QuizInfoData | null>(null);
  const [contentSummary, setContentSummary] = useState<string | null>(null);

  return (
    <QuizContext.Provider
      value={{
        quizInfo: quizInfo,
        setQuizInfo: setQuizInfo,
        contentSummary: contentSummary,
        setContentSummary: setContentSummary,
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
