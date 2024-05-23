// src/server/api/routers/quiz.ts

import { generateText } from "ai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { llama3_70b } from "~/lib/llm";

async function generateOutline(topic: string) {
  const { text } = await generateText({
    model: llama3_70b,
    system:
      "Generate a clear and concise outline for the given topic. " +
      "It needs to only include the main topics without subtopics in logical order. " +
      "Do not include any examples, explanations, title, and other details. " +
      "Generate the response in pretty and simple markdown format using bullet points.",
    prompt: topic,
  });
  console.log(`Generated outline for ${topic}: ${text}`);
  return text;
}

export const quizRouter = createTRPCRouter({
  outline: publicProcedure
    .input(z.object({ topic: z.string() }))
    .query(async ({ input }) => {
      const outline = await generateOutline(input.topic);
      return { outline: outline };
    }),
});
