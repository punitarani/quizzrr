// src/components/Outline.tsx

import React from "react";
import ReactMarkdown from "react-markdown";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface OutlineProps {
  summary: string | null;
  isLoading: boolean;
  error: boolean;
}

const Outline: React.FC<OutlineProps> = ({ summary, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (error) {
    console.error("Error generating quiz outline");
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
      {summary ? (
        <ReactMarkdown className="prose">{summary}</ReactMarkdown>
      ) : (
        <div className="text-gray-500">No summary available</div>
      )}
    </div>
  );
};

export default Outline;
