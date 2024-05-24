// src/components/QuizContentSummary.tsx

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Progress } from "~/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

interface QuizContentSummaryProps {
  summary: string | null;
  isLoading: boolean;
  error: boolean;
}

const QuizContentSummary: React.FC<QuizContentSummaryProps> = ({
  summary,
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
    <Accordion type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <h2 className="text-xl font-semibold">Content Summary</h2>
        </AccordionTrigger>
        <AccordionContent>
          {summary ? (
            <ReactMarkdown className="prose">{summary}</ReactMarkdown>
          ) : (
            <div className="text-gray-500">No summary available</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default QuizContentSummary;
