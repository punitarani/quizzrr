// src/server/api/routers/quiz/validateAnswer.ts

import { generateObject } from 'ai'
import { z } from 'zod'

import { llama3_8b } from '~/lib/llm'
import type { QuizAnswerData, QuizInfoData, QuizQuestionData } from '~/types'
import type { ChatMessage } from '../types'

const examples: ChatMessage[] = [
  {
    role: 'user',
    content:
      `Topic: Neural Networks\n` +
      `Subject: Computer Science\n` +
      `Level: College\n` +
      `Quiz Content:\nNeural networks are a set of algorithms, modeled loosely after the human brain, that are designed to recognize patterns. They interpret sensory data through a kind of machine perception, labeling or clustering raw input. The patterns they recognize are numerical, contained in vectors, into which all real-world data, be it images, sound, text or time series, must be translated.\n\n` +
      `Question:\nWhat is the primary function of the dendrites in a neuron?\n\n` +
      `Answer:\nDendrites receive electrical signals from other neurons.`,
  },
  {
    role: 'assistant',
    content:
      '{\n' +
      '  "userAnswer": "Dendrites receive electrical signals from other neurons.",\n' +
      '  "correctAnswer": "Dendrites receive electrical signals from other neurons.",\n' +
      '  "isCorrect": true,\n' +
      '  "feedback": "Correct! Dendrites are responsible for receiving signals from other neurons."\n' +
      '}',
  },
  {
    role: 'user',
    content:
      `Topic: Neural Networks\n` +
      `Subject: Computer Science\n` +
      `Level: College\n` +
      `Quiz Content:\nNeural networks are a set of algorithms, modeled loosely after the human brain, that are designed to recognize patterns. They interpret sensory data through a kind of machine perception, labeling or clustering raw input. The patterns they recognize are numerical, contained in vectors, into which all real-world data, be it images, sound, text or time series, must be translated.\n\n` +
      `Question:\nWhat is backpropagation?\n\n` +
      `Answer:\nBackpropagation is a type of neural network.`,
  },
  {
    role: 'assistant',
    content:
      '{\n' +
      '  "userAnswer": "Backpropagation is a type of neural network.",\n' +
      '  "correctAnswer": "Backpropagation is an algorithm used for training neural networks.",\n' +
      '  "isCorrect": false,\n' +
      '  "feedback": "Incorrect. Backpropagation is an algorithm used for training neural networks."\n' +
      '}',
  },
]

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
  })

  const userPrompt =
    `Validate if the given answer is correct for the given question.\n` +
    `Generate the correct answer and provide feedback if it is correct or not.\n` +
    `Topic: ${info.topic}\n` +
    `Subject: ${info.subject}\n` +
    `Level: ${info.level}\n` +
    `Quiz Content:\n${content}\n\n` +
    `Question:\n${question.question}\n\n` +
    `Answer:\n${answer}\n\n`

  const chatHistory: ChatMessage[] = [
    ...examples,
    { role: 'user', content: userPrompt },
  ]

  const { object } = await generateObject({
    model: llama3_8b,
    temperature: 0.2,
    system:
      'You are an AI that validates quiz answers based on provided content and questions. ' +
      "Your task is to determine if the user's answer is correct, generate the correct answer, " +
      'and provide feedback. Ensure the feedback is clear and concise.',
    messages: chatHistory,
    schema: schema,
  })

  return object
}
