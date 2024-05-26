// src/server/api/routers/quiz.ts

import { generateText } from "ai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { llama3_70b } from "~/lib/llm";
import {
  type QuizAnswerData,
  type QuizInfoData,
  type QuizQuestionData,
  type QuizQuestionUserAnswerData,
  QuizInfoSchema,
  QuizQuestionSchema,
  QuizQuestionUserAnswerSchema,
} from "~/types";

async function generateContentSummary(quizInfo: QuizInfoData) {
  const prompt =
    `Generate a clear and concise content summary for the given quizInfo.\n` +
    `Topic: ${quizInfo.topic}\n` +
    `Subject: ${quizInfo.subject}\n` +
    `Level: ${quizInfo.level}\n`;

  const { text } = await generateText({
    model: llama3_70b,
    system:
      "Generate a clear and concise content summary for the given quizInfo.\n" +
      "It needs to only include the main topics without subtopics in logical order. " +
      "Do not include any examples, explanations, title, and other details.\n\n" +
      "[BEGIN EXAMPLE]\n\n" +
      "user: ANNs\n" +
      "assistant:\n" +
      "* Introduction to ANNs\n" +
      "* Types of ANNs\n" +
      "* Components of ANNs\n" +
      "* How ANNs Work\n" +
      "* Training ANNs\n" +
      "* Applications of ANNs\n\n" +
      "[END EXAMPLE]\n\n" +
      "Generate the response in pretty and simple markdown format using bullet points.",
    prompt: prompt,
  });
  return text;
}

async function generateQuizOutline(
  info: QuizInfoData,
  summary: string,
): Promise<string> {
  const systemPrompt =
    "Generate a quiz outline for the given topic.\n" +
    "It needs to include details on the content of the questions without the questions themselves. " +
    "The questions should cover the main topics and key points of the content.\n" +
    "Use the content, subject and level to determine the quiz material and outline. " +
    `Do not include any examples, explanations, titles, or other extraneous details.\n\n` +
    `[BEGIN EXAMPLE]\n\n` +
    `user: ANNs\n` +
    `assistant:\n` +
    `* **Introduction to ANNs**\n` +
    `* **Inspiration from the human brain**\n` +
    `* **Basic concepts and terminology**\n` +
    `* **Types of ANNs**\n` +
    `  * Feedforward neural networks\n` +
    `  * Recurrent neural networks (RNNs)\n` +
    `  * Convolutional neural networks (CNNs)\n` +
    `  * Other types (e.g. autoencoders, generative adversarial networks)\n` +
    `* **Components of ANNs**\n` +
    `  * Artificial neurons (nodes)\n` +
    `  * Weights and biases\n` +
    `  * Activation functions\n` +
    `  * Layers (input, hidden, output)\n` +
    `* **How ANNs Work**\n` +
    `  * Forward propagation\n` +
    `  * Backpropagation\n` +
    `  * Gradient descent\n` +
    `  * Optimization algorithms\n` +
    `* **Training ANNs**\n` +
    `  * Supervised, unsupervised, and reinforcement learning\n` +
    `  * Data preprocessing and preparation\n` +
    `  * Overfitting and regularization techniques\n` +
    `  * Model evaluation metrics\n` +
    `* **Applications of ANNs**\n` +
    `  * Image and speech recognition\n` +
    `  * Natural language processing\n` +
    `  * Game playing and decision making\n` +
    `  * Other applications (e.g. recommender systems, autonomous vehicles)\n\n` +
    `[END EXAMPLE]\n\n` +
    `Generate the response in markdown format using bullet points.`;

  const userPrompt =
    `Generate a detailed quiz outline for the given topic, subject, and level based on the provided content summary.\n` +
    `Topic: ${info.topic}\n` +
    `Subject: ${info.subject}\n` +
    `Level: ${info.level}\n` +
    `Length: ${info.length}\n\n` +
    `Content Summary:\n${summary}`;

  const { text } = await generateText({
    model: llama3_70b,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return text;
}

async function generateQuestion(
  info: QuizInfoData,
  content: string,
  outline: string,
  history: QuizQuestionUserAnswerData[],
): Promise<QuizQuestionData> {
  return {
    question: "Guess 0 or 1",
    description: "50% chance of getting it right",
    difficulty: "Medium",
  };
}

async function validateAnswer(
  info: QuizInfoData,
  content: string,
  question: QuizQuestionData,
  answer: string,
): Promise<QuizAnswerData> {
  const correctAnswer = Math.round(Math.random()).toString();
  const isCorrect = answer == correctAnswer;
  const feedback = `The correct answer is ${correctAnswer}.`;

  return {
    userAnswer: answer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect,
    feedback: feedback,
  };
}

async function checkCompletion(
  info: QuizInfoData,
  summary: string,
  history: QuizQuestionUserAnswerData[],
): Promise<boolean> {
  return Math.random() < 0.2;
}

export const quizRouter = createTRPCRouter({
  content: publicProcedure
    .input(
      z.object({
        info: QuizInfoSchema,
      }),
    )
    .query(async ({ input }): Promise<{ content: string }> => {
      const content = await generateContentSummary(input.info);
      return { content: content };
    }),

  outline: publicProcedure
    .input(
      z.object({
        info: QuizInfoSchema,
        summary: z.string(),
      }),
    )
    .query(async ({ input }): Promise<{ outline: string }> => {
      const outline = await generateQuizOutline(
        QuizInfoSchema.parse(input.info),
        input.summary,
      );
      return { outline: outline };
    }),

  generateQuestion: publicProcedure
    .input(
      z.object({
        info: QuizInfoSchema,
        content: z.string(),
        outline: z.string(),
        history: z.array(QuizQuestionUserAnswerSchema),
      }),
    )
    .query(async ({ input }): Promise<QuizQuestionData> => {
      const {
        info,
        content,
        outline,
        history,
      }: {
        info: QuizInfoData;
        content: string;
        outline: string;
        history: QuizQuestionUserAnswerData[];
      } = input;
      return await generateQuestion(info, content, outline, history);
    }),

  validateAnswer: publicProcedure
    .input(
      z.object({
        info: QuizInfoSchema,
        content: z.string(),
        question: QuizQuestionSchema,
        answer: z.string(),
      }),
    )
    .mutation(async ({ input }): Promise<QuizAnswerData> => {
      const {
        info,
        content,
        question,
        answer,
      }: {
        info: QuizInfoData;
        content: string;
        question: QuizQuestionData;
        answer: string;
      } = input;
      return await validateAnswer(info, content, question, answer);
    }),

  checkCompletion: publicProcedure
    .input(
      z.object({
        info: QuizInfoSchema,
        summary: z.string(),
        history: z.array(QuizQuestionUserAnswerSchema),
      }),
    )
    .mutation(async ({ input }): Promise<boolean> => {
      const {
        info,
        summary,
        history,
      }: {
        info: QuizInfoData;
        summary: string;
        history: QuizQuestionUserAnswerData[];
      } = input;
      return await checkCompletion(info, summary, history);
    }),
});
