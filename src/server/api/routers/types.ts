// src/server/api/routers/types.ts

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
