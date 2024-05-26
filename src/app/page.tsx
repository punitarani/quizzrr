"use client";

import React, { useState } from "react";
import { GetSummary } from "~/app/_components/get-summary";
import { GetOutline } from "~/app/_components/get-outline";
import { QuizRunner } from "~/app/_components/get-quiz-runner";
import { useQuizContext } from "~/context/QuizContext";
import QuizInputForm from "~/components/QuizInputForm";
import type { QuizInfoData } from "~/types";

const Page: React.FC = () => {
  const { quizInfo, setQuizInfo } = useQuizContext();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showSummary, setshowSummary] = useState<boolean>(false);
  const [contentSummary, setContentSummary] = useState<string | null>(null);
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [quizOutline, setQuizOutline] = useState<string | null>(null);
  const [runQuiz, setRunQuiz] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleFormSubmit = (data: QuizInfoData) => {
    setQuizInfo(data);
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

  const handleQuizComplete = (score: number) => {
    setScore(score);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-5 pt-20 md:px-20">
      <QuizInputForm onSubmit={handleFormSubmit} isDisabled={formSubmitted} />
      <div className="mt-4 w-full max-w-xl lg:max-w-3xl">
        {quizInfo && showSummary && (
          <GetSummary quizInfo={quizInfo} onComplete={handleSummaryComplete} />
        )}
        {quizInfo && showOutline && contentSummary != null && (
          <GetOutline
            quizInfo={quizInfo}
            content={contentSummary}
            onComplete={handleOutlineComplete}
          />
        )}
        {quizInfo &&
          runQuiz &&
          contentSummary != null &&
          quizOutline != null && (
            <QuizRunner
              quizInfo={quizInfo}
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
