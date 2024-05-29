// src/server/api/routers/quiz/generateSummary.ts

import { generateText } from 'ai'

import { llama3_8b } from '~/lib/llm'
import type { QuizInfoData } from '~/types'

export async function generateContentSummary(quizInfo: QuizInfoData) {
  const systemPrompt =
    'Generate a clear and concise content summary for the given quizInfo.\n' +
    'It needs to only include the main topics without subtopics in logical order. ' +
    'Do not include any examples, explanations, title, and other details.\n\n' +
    '[BEGIN EXAMPLE]\n\n' +
    'user: ANNs\n' +
    'assistant:\n' +
    '* Introduction to ANNs\n' +
    '* Types of ANNs\n' +
    '* Components of ANNs\n' +
    '* How ANNs Work\n' +
    '* Training ANNs\n' +
    '* Applications of ANNs\n\n' +
    '[END EXAMPLE]\n\n' +
    'Generate the response in pretty and simple markdown format using bullet points.'

  const userPrompt =
    `Generate a clear and concise content summary for the given quizInfo.\n` +
    `Topic: ${quizInfo.topic}\n` +
    `Subject: ${quizInfo.subject}\n` +
    `Level: ${quizInfo.level}\n` +
    `Generate the response in markdown format using bullet points without any extra information.`

  const { text } = await generateText({
    model: llama3_8b,
    temperature: 0.2,
    system: systemPrompt,
    prompt: userPrompt,
  })

  return text
}
