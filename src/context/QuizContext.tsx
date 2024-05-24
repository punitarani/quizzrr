// src/context/QuizContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface QuizContextProps {
  topic: string;
  setTopic: (topic: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  level: string;
  setLevel: (level: string) => void;
  length: string;
  setLength: (length: string) => void;
  contentSummary: string | null;
  setContentSummary: (outline: string | null) => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [topic, setTopic] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [contentSummary, setContentSummary] = useState<string | null>(null);

  return (
    <QuizContext.Provider
      value={{
        topic,
        setTopic,
        subject,
        setSubject,
        level,
        setLevel,
        length,
        setLength,
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
