"use client";

import React, { useState } from "react";
import { GetSummary } from "~/app/_components/get-summary";
import { GetOutline } from "~/app/_components/get-outline";
import { QuizRunner } from "~/app/_components/get-quiz-runner";
import { useQuizContext } from "~/context/QuizContext";
import QuizInputForm from "~/components/QuizInputForm";

const Page: React.FC = () => {
  const {
    topic,
    setTopic,
    subject,
    setSubject,
    level,
    setLevel,
    length,
    setLength,
  } = useQuizContext();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showSummary, setshowSummary] = useState<boolean>(false);
  const [contentSummary, setContentSummary] = useState<string | null>(null);
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [quizOutline, setQuizOutline] = useState<string | null>(null);
  const [runQuiz, setRunQuiz] = useState<boolean>(false);

  const handleFormSubmit = (data: {
    topic: string;
    subject: string;
    level: string;
    length: string;
  }) => {
    setTopic(data.topic);
    setSubject(data.subject);
    setLevel(data.level);
    setLength(data.length);
    setshowSummary(true);
    setFormSubmitted(true);
  };

  const handleSummaryComplete = (content: string) => {
    setContentSummary(content);
    setShowOutline(true);
  };

  const handleOutlineComplete = (outline: string) => {
    setQuizOutline(outline);
    setRunQuiz(true);
  };

  const handleQuizComplete = (score: number) => {};

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-5 pt-20 md:px-20">
      <QuizInputForm onSubmit={handleFormSubmit} isDisabled={formSubmitted} />
      <div className="mt-4 w-full max-w-xl lg:max-w-3xl">
        {showSummary && (
          <GetSummary
            topic={topic}
            subject={subject}
            level={level}
            length={length}
            onComplete={handleSummaryComplete}
          />
        )}
        {showOutline && contentSummary != null && (
          <GetOutline
            topic={topic}
            subject={subject}
            level={level}
            length={length}
            content={contentSummary}
            onComplete={handleOutlineComplete}
          />
        )}
        {runQuiz && contentSummary != null && quizOutline != null && (
          <QuizRunner
            topic={topic}
            subject={subject}
            level={level}
            length={length}
            content={contentSummary}
            outline={quizOutline}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
