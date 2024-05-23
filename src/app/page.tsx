"use client";

import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { GetOutline } from "~/app/_components/get-outline";
import { useQuizContext } from "~/context/QuizContext";

const Page: React.FC = () => {
  const { topic, setTopic, outline, setOutline } = useQuizContext();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showOutline, setShowOutline] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOutline(true);
    setIsDisabled(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-5 pt-20 md:px-20">
      <form className="w-full max-w-xl lg:max-w-3xl" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Get quizzed on..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-300 focus:outline-none focus:ring"
          disabled={isDisabled}
        />
      </form>
      <div className="mt-4 w-full max-w-xl lg:max-w-3xl">
        {showOutline && <GetOutline topic={topic} />}
      </div>
    </div>
  );
};

export default Page;
