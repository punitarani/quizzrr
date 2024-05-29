// src/server/api/routers/quiz/validateAnswer.ts

import { generateObject } from "ai";
import { z } from "zod";

import { llama3_8b } from "~/lib/llm";
import type { QuizAnswerData, QuizInfoData, QuizQuestionData } from "~/types";

export async function validateAnswer(
  info: QuizInfoData,
  content: string,
  question: QuizQuestionData,
  answer: string,
): Promise<QuizAnswerData> {
  const schema = z.object({
    userAnswer: z.string(),
    correctAnswer: z.string(),
    isCorrect: z.boolean(),
    feedback: z.string(),
  });

  const systemPrompt =
    "You are an AI that validates quiz answers based on provided content and questions. " +
    "Your task is to determine if the user's answer is correct, generate the correct answer, " +
    "and provide feedback. Ensure the feedback is clear and concise.\n\n" +
    "[BEGIN EXAMPLES]\n\n" +
    "Example 1:\n" +
    "{\n" +
    "  userAnswer: 'Dendrites receive electrical signals from other neurons.',\n" +
    "  correctAnswer: 'Dendrites receive electrical signals from other neurons.',\n" +
    "  isCorrect: true,\n" +
    "  feedback: 'Correct! Dendrites are responsible for receiving signals from other neurons.'\n" +
    "}\n\n" +
    "Example 2:\n" +
    "{\n" +
    "  userAnswer: 'Backpropagation is a type of neural network.',\n" +
    "  correctAnswer: 'Backpropagation is an algorithm used for training neural networks.',\n" +
    "  isCorrect: false,\n" +
    "  feedback: 'Incorrect. Backpropagation is an algorithm used for training neural networks.'\n" +
    "}\n\n" +
    "[END EXAMPLES]";

  const userPrompt =
    `Validate if the given answer is correct for the given question.\n` +
    `Generate the correct answer and provide feedback if it is correct or not.\n` +
    `Topic: ${info.topic}\n` +
    `Subject: ${info.subject}\n` +
    `Level: ${info.level}\n` +
    `Quiz Content:\n${content}\n\n` +
    `Question:\n${question.question}\n\n` +
    `Answer:\n${answer}\n\n`;

  console.log("validateAnswer userPrompt", userPrompt);

  const { object } = await generateObject({
    model: llama3_8b,
    temperature: 0.2,
    system: systemPrompt,
    prompt: userPrompt,
    schema: schema,
  });

  return object;
}
