// src/server/api/routers/quiz/checkCompletion.ts

import { generateObject } from "ai";
import { z } from "zod";

import { llama3_8b } from "~/lib/llm";
import { formatQuizQAData } from "~/lib/utils";
import type { QuizInfoData, QuizQuestionAnswerData } from "~/types";

export async function checkCompletion(
  info: QuizInfoData,
  summary: string,
  history: QuizQuestionAnswerData[],
): Promise<boolean> {
  const schema = z.object({
    complete: z.boolean(),
  });

  // Ensure the quiz has at least 3 questions answered
  if (history.length < 3) {
    return false;
  }

  const formattedHistory = formatQuizQAData(history, ["question", "answer"]);

  const systemPrompt =
    "You are an AI that checks if a quiz is complete based on the provided history. " +
    "Your task is to determine if the quiz has covered all necessary topics and is complete. " +
    "Do not include any extraneous information or examples.\n\n" +
    "Return `true` if the quiz is complete based on the length and user's progress, otherwise return `false`.";

  const userPrompt =
    `Check if the quiz is complete based on the provided history.\n` +
    `Topic: ${info.topic}\n` +
    `Subject: ${info.subject}\n` +
    `Level: ${info.level}\n` +
    `Length: ${info.length} (Short: 5-10 questions, Medium: 10-20 questions, Long: 20+ questions)\n\n` +
    `Quiz Content Summary:\n${summary}\n\n` +
    `Quiz History:\n${formattedHistory}\n\n`;

  console.log("checkCompletion userPrompt", userPrompt);

  const { object } = await generateObject({
    model: llama3_8b,
    temperature: 0.2,
    system: systemPrompt,
    prompt: userPrompt,
    schema: schema,
  });

  return object.complete;
}
