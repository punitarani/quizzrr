// src/server/api/routers/quiz/generateSummary.ts

import { generateText } from 'ai'

import { llama3_8b } from '~/lib/llm'
import type { QuizInfoData } from '~/types'
import type { ChatMessage } from '../types'

const examples: ChatMessage[] = [
  {
    role: 'user',
    content:
      `Topic: Neural Networks\n` +
      `Subject: Computer Science\n` +
      `Level: Middle School`,
  },
  {
    role: 'assistant',
    content:
      '- **What is a Neural Network?**: Introduction to the basic concept of neural networks and how they are inspired by the human brain.\n' +
      '- **Neurons**: Explanation of what a neuron is and how it functions within a neural network.\n' +
      '- **Layers of a Neural Network**: Understanding the input, hidden, and output layers.\n' +
      '- **Training a Neural Network**: Basic idea of how neural networks learn from data.\n' +
      '- **Applications**: Examples of everyday applications of neural networks (like voice assistants, image recognition).',
  },
  {
    role: 'user',
    content:
      `Topic: Neural Networks\n` +
      `Subject: Computer Science\n` +
      `Level: High School`,
  },
  {
    role: 'assistant',
    content:
      '- **Basics of Neural Networks**: Deeper dive into the structure and function of neural networks, including neurons and synapses.\n' +
      '- **Types of Neural Networks**: Overview of different types of neural networks (e.g., feedforward, convolutional, recurrent).\n' +
      '- **Activation Functions**: Explanation of activation functions and their role in neural networks.\n' +
      '- **Training and Optimization**: Introduction to training techniques, including backpropagation and gradient descent.\n' +
      '- **Evaluation Metrics**: Basics of how to measure the performance of a neural network.\n' +
      '- **Practical Applications**: Discussion of various applications in more detail, such as in healthcare, finance, and entertainment.',
  },
  {
    role: 'user',
    content:
      `Topic: Neural Networks\n` +
      `Subject: Computer Science\n` +
      `Level: College`,
  },
  {
    role: 'assistant',
    content:
      '- **Mathematical Foundations**: In-depth exploration of the mathematical principles behind neural networks, including linear algebra and calculus.\n' +
      '- **Architectures of Neural Networks**: Detailed study of various architectures (e.g., CNNs, RNNs, GANs) and their specific use cases.\n' +
      '- **Learning Algorithms**: Comprehensive overview of learning algorithms, including supervised, unsupervised, and reinforcement learning.\n' +
      '- **Optimization Techniques**: Advanced techniques for optimizing neural networks, such as Adam, RMSprop, and regularization methods.\n' +
      '- **Evaluation and Validation**: Detailed methods for evaluating and validating neural networks, including cross-validation and overfitting/underfitting considerations.\n' +
      '- **Advanced Applications**: Exploration of cutting-edge applications and research areas in neural networks, such as autonomous vehicles, natural language processing, and bioinformatics.',
  },
]

export async function generateContentSummary(quizInfo: QuizInfoData) {
  const userPrompt =
    `Topic: ${quizInfo.topic}\n` +
    `Subject: ${quizInfo.subject}\n` +
    `Level: ${quizInfo.level}\n`

  const history: ChatMessage[] = [
    ...examples,
    { role: 'user', content: userPrompt },
  ]

  const { text } = await generateText({
    model: llama3_8b,
    temperature: 0.2,
    system:
      'Generate a clear and concise technical content summary for the given quiz.',
    messages: history,
  })

  return text
}
