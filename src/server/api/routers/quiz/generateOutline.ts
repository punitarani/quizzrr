// src/server/api/routers/quiz/generateOutline.ts

import { generateText } from "ai";

import { llama3_8b } from "~/lib/llm";
import type { QuizInfoData } from "~/types";

export async function generateQuizOutline(
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
