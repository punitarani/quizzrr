// src/lib/llm.ts

import { createOpenAI } from '@ai-sdk/openai'
import type { OpenAIProvider } from '@ai-sdk/openai'

export const groq: OpenAIProvider = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

export const llama3_8b = groq('llama3-8b-8192')
export const llama3_70b = groq('llama3-70b-8192')
export const mixtral_8x7b = groq('mixtral-8x7b-32768')
export const gemma_7b = groq('gemma-7b-it')
