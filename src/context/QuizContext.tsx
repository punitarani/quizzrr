// src/context/QuizContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface QuizContextProps {
  topic: string;
  setTopic: (topic: string) => void;
  outline: string | null;
  setOutline: (outline: string | null) => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [topic, setTopic] = useState<string>("");
  const [outline, setOutline] = useState<string | null>(null);

  return (
    <QuizContext.Provider value={{ topic, setTopic, outline, setOutline }}>
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
