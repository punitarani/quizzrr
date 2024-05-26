// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  QuizAnswerData,
  QuizQuestionAnswerData,
  QuizQuestionData,
} from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuizQAData(
  history: QuizQuestionAnswerData[],
  fields: (keyof QuizQuestionAnswerData)[],
): string {
  return history
    .map((entry) =>
      fields
        .map((field) => {
          const value = (entry as Record<string, unknown>)[field];
          if (typeof value === "object" && value !== null) {
            return `${String(field)}: ${JSON.stringify(value, null, 2)}`;
          }
          return `${String(field)}: ${value !== undefined ? String(value) : "N/A"}`;
        })
        .join("\n"),
    )
    .join("\n\n");
}
