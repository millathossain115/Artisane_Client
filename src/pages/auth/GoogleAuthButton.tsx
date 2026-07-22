import { useEffect, useRef, useState } from 'react'

type GoogleCredentialResponse = {
  credential?: string
}

type GoogleAuthButtonProps = {
  disabled?: boolean
  onCredential: (credential: string) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            callback: (response: GoogleCredentialResponse) => void
            client_id: string
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              shape?: 'rectangular'
              size?: 'large'
              text?: 'continue_with' | 'signin_with' | 'signup_with'
              theme?: 'outline'
              width?: number
            },
          ) => void
        }
      }
    }
  }
}

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  string | undefined

function loadGoogleScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)

    if (existingScript) {
      // In React Strict Mode, the script might be injected by the first mount
      // but not yet fully loaded by the second mount. We wait for it here.
      const intervalId = setInterval(() => {
        if (window.google) {
          clearInterval(intervalId)
          resolve()
        }
      }, 50)

      setTimeout(() => {
        clearInterval(intervalId)
        reject(new Error('Google login failed to load.'))
      }, 10000)
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.id = GOOGLE_SCRIPT_ID
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google login failed to load.'))
    script.src = 'https://accounts.google.com/gsi/client'
    document.head.appendChild(script)
  })
}

function GoogleAuthButton({ disabled, onCredential }: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const callbackRef = useRef(onCredential)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    callbackRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    let cancelled = false

    async function renderGoogleButton() {
      if (!googleClientId) {
        setLoadError('Google login is not configured.')
        return
      }

      try {
        await loadGoogleScript()

        if (cancelled || !buttonRef.current || !window.google) {
          return
        }

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.initialize({
          callback: (response) => {
            if (response.credential) {
              callbackRef.current(response.credential)
            }
          },
          client_id: googleClientId,
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          shape: 'rectangular',
          size: 'large',
          text: 'continue_with',
          theme: 'outline',
          width: Math.min(buttonRef.current.clientWidth || 384, 384),
        })
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Google login failed to load.',
        )
      }
    }

    renderGoogleButton()

    return () => {
      cancelled = true
    }
  }, [])

  if (loadError) {
    return (
      <p className="border border-[#c85f2f]/25 bg-[#fff5ef] px-4 py-3 text-sm font-semibold text-[#8f3f1d]">
        {loadError}
      </p>
    )
  }

  return (
    <div
      className={`flex min-h-11 justify-center ${
        disabled ? 'pointer-events-none opacity-60' : ''
      }`}
      ref={buttonRef}
    />
  )
}

export default GoogleAuthButton
