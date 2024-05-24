//

import React, { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface QuizOutlineProps {
  outline: string | null;
  isLoading: boolean;
  error: boolean;
}

const QuizOutline: React.FC<QuizOutlineProps> = ({
  outline,
  isLoading,
  error,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => prev + (100 - prev) * 0.05);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-6">
        <Progress
          value={progress}
          className="w-[60%] transition-all duration-1000 ease-out"
        />
        <p className="mt-2 text-gray-500">Generating Quiz Outline...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error generating quiz content summary");
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error generating quiz outline. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Quiz Outline</h2>
      {outline ? (
        <ReactMarkdown className="prose">{outline}</ReactMarkdown>
      ) : (
        <div className="text-gray-500">No outline available</div>
      )}
    </div>
  );
};

export default QuizOutline;
