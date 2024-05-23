// src/components/Outline.tsx

import React from "react";
import ReactMarkdown from "react-markdown";

interface OutlineProps {
    summary: string | null;
}

const Outline: React.FC<OutlineProps> = ({ summary }) => {
    return (
        <div className="mb-4 rounded-lg border border-gray-300 bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Quiz Outline</h2>
            {summary ? (
                <ReactMarkdown className="prose">{summary}</ReactMarkdown>
            ) : (
                <div className="text-gray-500">No summary available</div>
            )}
        </div>
    );
};

export default Outline;
