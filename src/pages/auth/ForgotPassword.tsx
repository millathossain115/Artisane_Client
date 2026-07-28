import { Mail, Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import artistImage from '../../assets/home-banners/artist-optimized.jpg'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import { forgotPassword } from '../../features/auth/authApi'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await forgotPassword({
        email: email.trim().toLowerCase(),
      })
      const message =
        response.message || 'If an account exists, reset instructions were sent.'

      setStatus(message)
      toast.success(message)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to send reset instructions right now.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#181512]">
      <Navbar />

      <main>
        <section className="w-full pb-10 lg:pb-14">
          <div className="grid overflow-hidden border border-black/10 bg-white shadow-[0_18px_45px_rgba(24,21,18,0.08)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
            <aside className="relative min-h-[20rem] overflow-hidden bg-[#181512] text-white lg:min-h-[36rem]">
              <img
                alt="Artist studio with handmade work"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
                src={artistImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/88 via-[#181512]/36 to-[#181512]/8" />
              <div className="relative flex h-full min-h-[20rem] flex-col justify-end p-6 sm:p-8 lg:min-h-[36rem] lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
                  Account recovery
                </p>
                <h1 className="mt-3 max-w-md font-display text-4xl font-bold leading-tight sm:text-5xl">
                  Reset access to Artisane.
                </h1>
              </div>
            </aside>

            <section className="flex items-center bg-white">
              <div className="mx-auto w-full max-w-lg p-5 sm:p-8 lg:p-10">
                <p className="text-sm font-bold text-[#7a3f1d]">
                  Forgot password
                </p>
                <h2 className="mt-1 text-3xl font-bold">Send reset link</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                  Enter your account email and check your inbox for reset
                  instructions.
                </p>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b5f53]">
                      Email address
                    </span>
                    <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
                      <Mail className="h-4 w-4 text-[#7a3f1d]" />
                      <input
                        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                        type="email"
                        value={email}
                      />
                    </span>
                  </label>

                  {error ? (
                    <p className="border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                      {error}
                    </p>
                  ) : null}

                  {status ? (
                    <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      {status}
                    </p>
                  ) : null}

                  <button
                    className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:pointer-events-none disabled:opacity-60"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Sending...' : 'Send reset link'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                <p className="mt-5 text-center text-sm font-medium text-[#6b5f53]">
                  Remembered your password?{' '}
                  <Link
                    className="font-bold text-[#181512] transition hover:text-[#7a3f1d]"
                    to="/login"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ForgotPassword
