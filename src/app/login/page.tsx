'use client'

import GoogleSignin from '@/components/GoogleSignin'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const supabase = createClient()

const LoginPage = () => {
  const router = useRouter()

  // Redirect to /dashboard if user is already logged in
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          router.push('/dashboard')
        }
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return (
    <main className="w-full min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <GoogleSignin />
    </main>
  )
}

export default LoginPage
