import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import type React from 'react'
import { TRPCReactProvider } from '~/trpc/react'

import { Inter as FontSans } from 'next/font/google'

import { cn } from '~/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'quizzrr',
  description: 'quizzrr',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

import { QuizProvider } from '~/context/QuizContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <QuizProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </QuizProvider>
      </body>
    </html>
  )
}
