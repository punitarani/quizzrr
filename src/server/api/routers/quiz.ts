// src/server/api/routers/quiz.ts

import { generateObject, generateText } from "ai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { llama3_8b } from "~/lib/llm";
import {
  type QuizAnswerData,
  type QuizInfoData,
  type QuizQuestionData,
  type QuizQuestionAnswerData,
  QuizInfoSchema,
  QuizQuestionSchema,
  QuizQuestionAnswerSchema,
} from "~/types";
import { formatQuizQAData } from "~/lib/utils";

async function generateContentSummary(quizInfo: QuizInfoData) {
  const systemPrompt =
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
    "Generate the response in pretty and simple markdown format using bullet points.";

  const userPrompt =
    `Generate a clear and concise content summary for the given quizInfo.\n` +
    `Topic: ${quizInfo.topic}\n` +
    `Subject: ${quizInfo.subject}\n` +
    `Level: ${quizInfo.level}\n` +
    `Generate the response in markdown format using bullet points without any extra information.`;

  const { text } = await generateText({
    model: llama3_8b,
    temperature: 0.2,
    system: systemPrompt,
    prompt: userPrompt,
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
    `Content Summary:\n${summary}` +
    `Generate the response in markdown format using bullet points without any extra information.`;

  const { text } = await generateText({
    model: llama3_8b,
    temperature: 0.2,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return text;
}

async function generateQuestion(
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

async function validateAnswer(
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

async function checkCompletion(
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
        history: z.array(QuizQuestionAnswerSchema),
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
        history: QuizQuestionAnswerData[];
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
        history: z.array(QuizQuestionAnswerSchema),
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
        history: QuizQuestionAnswerData[];
      } = input;
      return await checkCompletion(info, summary, history);
    }),
});
