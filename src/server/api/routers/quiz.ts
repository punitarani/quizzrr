// src/server/api/routers/quiz.ts

import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type QuizAnswerData,
  type QuizInfoData,
  type QuizQuestionData,
  type QuizQuestionAnswerData,
  QuizInfoSchema,
  QuizQuestionSchema,
  QuizQuestionAnswerSchema,
} from "~/types";

import { checkCompletion } from "./quiz/checkCompletion";
import { generateQuizOutline } from "./quiz/generateOutline";
import { generateContentSummary } from "./quiz/generateSummary";
import { generateQuestion } from "./quiz/generateQuestion";
import { validateAnswer } from "./quiz/validateAnswer";

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
