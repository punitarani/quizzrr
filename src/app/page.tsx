"use client";

import React, { useState } from "react";
import { GetSummary } from "~/app/_components/get-summary";
import { GetOutline } from "~/app/_components/get-outline";
import { QuizRunner } from "~/app/_components/get-quiz-runner";
import { useQuizContext } from "~/context/QuizContext";
import QuizInputForm from "~/components/QuizInputForm";
import type { QuizInfoData } from "~/types";

const Page: React.FC = () => {
  const {
    quizInfo,
    setQuizInfo,
    summary,
    setSummary,
    outline,
    setOutline,
    score,
    setScore,
  } = useQuizContext();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showSummary, setshowSummary] = useState<boolean>(false);
  const [showOutline, setShowOutline] = useState<boolean>(false);
  const [runQuiz, setRunQuiz] = useState<boolean>(false);

  // Handle the submission of the input form
  const handleFormSubmit = (data: QuizInfoData) => {
    setQuizInfo(data);
    setshowSummary(true);
    setFormSubmitted(true);
  };

  // Handle the summary generation completion
  const handleSummaryComplete = (content: string) => {
    setSummary(content);
    setShowOutline(true);
  };

  // Handle the outline generation completion
  const handleOutlineComplete = (outline: string) => {
    setOutline(outline);
    setRunQuiz(true);
  };

  // Handle the quiz completion
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
        {quizInfo && showOutline && summary != null && (
          <GetOutline
            quizInfo={quizInfo}
            content={summary}
            onComplete={handleOutlineComplete}
          />
        )}
        {quizInfo && runQuiz && summary != null && outline != null && (
          <QuizRunner
            quizInfo={quizInfo}
            content={summary}
            outline={outline}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
