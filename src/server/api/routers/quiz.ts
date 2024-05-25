// src/server/api/routers/quiz.ts

import { generateText } from "ai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { llama3_70b } from "~/lib/llm";

async function generateContentSummary(topic: string) {
  const { text } = await generateText({
    model: llama3_70b,
    system:
      "Generate a clear and concise content summary for the given topic.\n" +
      "It needs to only include the main topics without subtopics in logical order. " +
      "Do not include any examples, explanations, title, and other details.\n\n" +
      "[BEGIN EXAMPLE]\n\nuser: ANNs\nassistant:\n* Introduction to ANNs\n* Types of ANNs\n* Components of ANNs\n* How ANNs Work\n* Training ANNs\n* Applications of ANNs\n\n[END EXAMPLE]\n\n" +
      "Generate the response in pretty and simple markdown format using bullet points.",
    prompt: topic,
  });
  return text;
}

async function generateQuizOutline(
  topic: string,
  outline: string,
  subject: string,
  level: string,
) {
  const prompt = `Topic: ${topic}\nSubject: ${subject}\nLevel: ${level}\n\nContent Summary:\n${outline}`;

  const { text } = await generateText({
    model: llama3_70b,
    system:
      "Generate a quiz outline for the given topic.\n" +
      "It needs to include details on the content of the questions without the questions themselves. " +
      "The questions should cover the main topics and key points of the content.\n" +
      "Use the content, subject and level to determine the quiz material and outline. " +
      "Do not include any examples, explanations, title, and other details\n" +
      "[BEGIN EXAMPLE]\n\nuser: ANNs\nassistant:\n* **Introduction to ANNs**\n* **Inspiration from the human brain**\n* **Basic concepts and terminology**\n* **Types of ANNs**\n  * Feedforward neural networks\n  * Recurrent neural networks (RNNs)\n  * Convolutional neural networks (CNNs)\n  * Other types (e.g. autoencoders, generative adversarial networks)\n* **Components of ANNs**\n  * Artificial neurons (nodes)\n  * Weights and biases\n  * Activation functions\n  * Layers (input, hidden, output)\n* **How ANNs Work**\n  * Forward propagation\n  * Backpropagation\n  * Gradient descent\n  * Optimization algorithms\n* **Training ANNs**\n  * Supervised, unsupervised, and reinforcement learning\n  * Data preprocessing and preparation\n  * Overfitting and regularization techniques\n  * Model evaluation metrics\n* **Applications of ANNs**\n  * Image and speech recognition\n  * Natural language processing\n  * Game playing and decision making\n  * Other applications (e.g. recommender systems, autonomous vehicles)\n\n[END EXAMPLE]\n\n" +
      "Generate the response in markdown format using bullet points.",
    prompt: prompt,
  });
  return text;
}

async function generateQuestion(
  topic: string,
  subject: string,
  level: string,
  content: string,
  outline: string,
  history: { question: string; description: string; correct: boolean }[],
): Promise<{ question: string; description: string; difficulty: string }> {
  return {
    question: "Guess 0 or 1",
    description: "50% chance of getting it right",
    difficulty: "Medium",
  };
}

async function validateAnswer(
  topic: string,
  subject: string,
  content: string,
  question: string,
  description: string,
  answer: string,
): Promise<{
  user: string;
  correct: boolean;
  answer: string;
  feedback: string;
}> {
  const correctAnswer = Math.round(Math.random()).toString();
  const isCorrect = answer == correctAnswer;
  const feedback = `The correct answer is ${correctAnswer}.`;

  return {
    user: answer,
    correct: isCorrect,
    answer: correctAnswer,
    feedback: feedback,
  };
}

export const quizRouter = createTRPCRouter({
  content: publicProcedure
    .input(z.object({ topic: z.string() }))
    .query(async ({ input }) => {
      const content = await generateContentSummary(input.topic);
      return { content: content };
    }),

  outline: publicProcedure
    .input(
      z.object({
        topic: z.string(),
        content: z.string(),
        subject: z.string(),
        level: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const outline = await generateQuizOutline(
        input.topic,
        input.content,
        input.subject,
        input.level,
      );
      return { outline: outline };
    }),

  generateQuestion: publicProcedure
    .input(
      z.object({
        topic: z.string(),
        subject: z.string(),
        level: z.string(),
        content: z.string(),
        outline: z.string(),
        history: z.array(
          z.object({
            question: z.string(),
            description: z.string(),
            correct: z.boolean(),
          }),
        ),
      }),
    )
    .query(async ({ input }) => {
      const { topic, subject, level, content, outline, history } = input;
      return await generateQuestion(
        topic,
        subject,
        level,
        content,
        outline,
        history,
      );
    }),

  validateAnswer: publicProcedure
    .input(
      z.object({
        topic: z.string(),
        subject: z.string(),
        content: z.string(),
        question: z.string(),
        description: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { topic, subject, content, question, description, answer } = input;
      return await validateAnswer(
        topic,
        subject,
        content,
        question,
        description,
        answer,
      );
    }),
});
