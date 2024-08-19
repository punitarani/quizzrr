'use client'

import type { GoogleCredentialResponse } from '@/types'
import { createClient } from '@/utils/supabase/client'
import React, { useEffect } from 'react'

const supabase = createClient()

// Extend the Window interface
declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          initialize: (params: any) => void
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          renderButton: (element: HTMLElement | null, options: any) => void
        }
      }
    }
    handleSignInWithGoogle: (
      response: GoogleCredentialResponse,
    ) => Promise<void>
  }
}

async function handleSignInWithGoogle(
  response: GoogleCredentialResponse,
): Promise<void> {
  await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  })
}

const GoogleSignin = () => {
  useEffect(() => {
    // Attach the Google callback function to the window object
    window.handleSignInWithGoogle = handleSignInWithGoogle

    // Ensure Google Sign-In is initialized and rendered
    if (window?.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleSignInWithGoogle,
        auto_select: true,
        itp_support: true,
      })
      window.google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        { theme: 'outline', size: 'large' },
      )
    }
  }, [])

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-auto_select="true"
        data-itp_support="true"
      ></div>
      <div
        id="g_id_signin"
        className="g_id_signin"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  )
}

export default GoogleSignin
