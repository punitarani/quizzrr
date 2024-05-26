// src/types/interfaces.ts

import { z } from "zod";

export const QuizInfoSchema = z.object({
  topic: z.string(),
  subject: z.string(),
  level: z.string(),
  length: z.string().optional(),
});
export type QuizInfoData = z.infer<typeof QuizInfoSchema>;

export const QuizQuestionSchema = z.object({
  question: z.string(),
  description: z.string(),
  difficulty: z.string(),
});
export type QuizQuestionData = z.infer<typeof QuizQuestionSchema>;

export const QuizAnswerSchema = z.object({
  userAnswer: z.string(),
  correctAnswer: z.string(),
  isCorrect: z.boolean(),
  feedback: z.string(),
});
export type QuizAnswerData = z.infer<typeof QuizAnswerSchema>;

export const QuizQuestionUserAnswerSchema = z.object({
  question: z.string(),
  description: z.string(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  isCorrect: z.boolean(),
  feedback: z.string(),
});
export type QuizQuestionUserAnswerData = z.infer<
  typeof QuizQuestionUserAnswerSchema
>;

export const QuizQuestionAnswerSchema = z.object({
  id: z.string(),
  question: QuizQuestionSchema,
  answer: QuizAnswerSchema.optional(),
});
export type QuizQuestionAnswerData = z.infer<typeof QuizQuestionAnswerSchema>;
