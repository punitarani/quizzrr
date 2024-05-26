// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  QuizAnswerData,
  QuizQuestionData,
  QuizQuestionUserAnswerData,
} from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatQuizQAData(
  history: (QuizAnswerData | QuizQuestionData | QuizQuestionUserAnswerData)[],
  fields: (
    | keyof QuizAnswerData
    | keyof QuizQuestionData
    | keyof QuizQuestionUserAnswerData
  )[],
): string {
  return history
    .map((entry) =>
      fields
        .map(
          (field) =>
            `${String(field)}: ${field in entry ? String((entry as Record<string, unknown>)[field]) : "N/A"}`,
        )
        .join("\n"),
    )
    .join("\n\n");
}
