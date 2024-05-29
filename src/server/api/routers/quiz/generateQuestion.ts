// src/server/api/routers/quiz/generateQuestion.ts

import { generateObject } from "ai";
import { z } from "zod";

import { llama3_8b } from "~/lib/llm";
import { formatQuizQAData } from "~/lib/utils";
import type {
  QuizInfoData,
  QuizQuestionAnswerData,
  QuizQuestionData,
} from "~/types";

export async function generateQuestion(
  info: QuizInfoData,
  content: string,
  outline: string,
  history: QuizQuestionAnswerData[],
): Promise<QuizQuestionData> {
  const schema = z.object({
    question: z.string(),
    description: z.string(),
    difficulty: z.string(),
  });

  const formattedHistory = formatQuizQAData(history, ["question"]);

  const systemPrompt =
    "You are an AI that generates quiz questions based on provided content, outline, and user history. " +
    "Your task is to create a question that is relevant to the given topic, subject, and level.\n" +
    "If the user has answered similar questions in the past, try to generate a new question. " +
    "If the user answered the previous question incorrectly, generate a question one lever easier and lower to test the understanding. " +
    "If the user answered the previous question correctly, generate a question one level harder and higher to challenge the knowledge.\n" +
    "Ensure the question is clear, concise, and appropriately challenging. " +
    "Do not include any extraneous information or examples.\n\n" +
    "[BEGIN EXAMPLE 1]\n" +
    "{\n" +
    "  question: 'What is the primary function of the dendrites in a neuron?',\n" +
    "  description: 'This question tests the understanding of the basic structure and function of neurons.',\n" +
    "  difficulty: 'easy'\n" +
    "}\n" +
    "[END EXAMPLE 1]\n\n" +
    "[BEGIN EXAMPLE 2]\n" +
    "{\n" +
    "  question: 'Explain the process of backpropagation in training neural networks.',\n" +
    "  description: 'This question assesses the knowledge of the backpropagation algorithm used in neural network training.',\n" +
    "  difficulty: 'medium'\n" +
    "}\n" +
    "[END EXAMPLE 2]";

  const userPrompt =
    `Generate the next question based on the quiz outline and history.\n` +
    `Topic: ${info.topic}\n` +
    `Subject: ${info.subject}\n` +
    `Level: ${info.level}\n` +
    `Length: ${info.length} (Short: 5-10 questions, Medium: 10-20 questions, Long: 20+ questions)\n\n` +
    `Quiz Content:\n${content}\n\n` +
    `Quiz Outline:\n${outline}\n\n` +
    `Quiz History:\n${formattedHistory}\n\n`;

  console.log("generateQuestion userPrompt", userPrompt);

  const { object } = await generateObject({
    model: llama3_8b,
    temperature: 0.2,
    system: systemPrompt,
    prompt: userPrompt,
    schema: schema,
  });

  return object;
}
