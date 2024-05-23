"use client";

import React, { useState } from "react";
import { GetOutline } from "~/app/_components/get-outline";
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
    outline,
    setOutline,
  } = useQuizContext();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showOutline, setShowOutline] = useState<boolean>(false);

  const handleFormSubmit = (data: {
    topic: string;
    subject: string;
    level: string;
    length: string;
  }) => {
    setTopic(data.topic);
    setSubject(data.subject);
    setLevel(data.level);
    setShowOutline(true);
    setIsDisabled(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-5 pt-20 md:px-20">
      <QuizInputForm onSubmit={handleFormSubmit} isDisabled={isDisabled} />
      <div className="mt-4 w-full max-w-xl lg:max-w-3xl">
        {showOutline && <GetOutline topic={topic} />}
      </div>
    </div>
  );
};

export default Page;
