import { Eye, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import paletteImage from '../../assets/palette-optimized.jpg'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import {
  loginWithGoogle,
  register,
  saveAuthSession,
} from '../../features/auth/authApi'
import { syncCartForCurrentUser } from '../../features/cart/cartSlice'
import { useAppDispatch } from '../../redux/hooks'
import GoogleAuthButton from './GoogleAuthButton'

function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleAuthSuccess(message: string) {
    dispatch(syncCartForCurrentUser())
    setStatus(message)

    window.setTimeout(() => {
      navigate('/')
    }, 500)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await register({ name, email, phone, password })

      if (!response.data) {
        throw new Error('Registration succeeded but no auth data was returned.')
      }

      saveAuthSession(response.data)
      handleAuthSuccess(response.message)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to register right now.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleCredential(credential: string) {
    setStatus('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await loginWithGoogle({ credential })

      if (!response.data) {
        throw new Error('Google login succeeded but no auth data was returned.')
      }

      saveAuthSession(response.data)
      handleAuthSuccess(response.message)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to continue with Google right now.'
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
          <div className="grid overflow-hidden border border-black/10 bg-white shadow-[0_18px_45px_rgba(24,21,18,0.08)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <section className="flex items-center bg-white">
              <div className="mx-auto w-full max-w-lg p-5 sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-bold text-[#7a3f1d]">
                  Join the marketplace
                </p>
                <h1 className="mt-1 text-3xl font-bold">Register</h1>
                <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                  Create an account to save favorite pieces, checkout faster,
                  and follow maker drops.
                </p>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b5f53]">
                    Full name
                  </span>
                  <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
                    <UserRound className="h-4 w-4 text-[#7a3f1d]" />
                    <input
                      className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      required
                      type="text"
                      value={name}
                    />
                  </span>
                </label>

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

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b5f53]">
                    Phone number
                  </span>
                  <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
                    <UserRound className="h-4 w-4 text-[#7a3f1d]" />
                    <input
                      className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="01700000000"
                      required
                      type="tel"
                      value={phone}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b5f53]">
                    Password
                  </span>
                  <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
                    <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
                    <input
                      className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                      minLength={6}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create password"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                    />
                    <button
                      aria-label="Show password"
                      className="text-[#6b5f53] transition hover:text-[#181512]"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </span>
                </label>

                <label className="inline-flex items-start gap-2.5 text-xs font-medium leading-6 text-[#6b5f53]">
                  <input
                    className="mt-1 h-4 w-4 accent-[#181512]"
                    type="checkbox"
                  />
                  I agree to receive order updates and accept the Artisane
                  terms.
                </label>

                <div className="grid gap-3 pt-1">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8a7d71]">
                    <span className="h-px flex-1 bg-black/10" />
                    or
                    <span className="h-px flex-1 bg-black/10" />
                  </div>
                  <GoogleAuthButton
                    disabled={isSubmitting}
                    onCredential={handleGoogleCredential}
                  />
                </div>

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
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                  <ShieldCheck className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-5 text-center text-sm font-medium text-[#6b5f53]">
                Already have an account?{' '}
                <Link
                  className="font-bold text-[#181512] transition hover:text-[#7a3f1d]"
                  to="/login"
                >
                  Login
                </Link>
              </p>
              </div>
            </section>

            <aside className="relative min-h-[20rem] overflow-hidden bg-[#181512] text-white lg:min-h-[42rem]">
              <img
                alt="Handmade color palette"
                className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-700 hover:scale-[1.02]"
                src={paletteImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/90 via-[#181512]/36 to-[#181512]/8" />
              <div className="relative flex h-full min-h-[20rem] flex-col justify-end p-6 sm:p-8 lg:min-h-[42rem] lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
                  Maker-first shopping
                </p>
                <h2 className="mt-3 max-w-md font-display text-4xl font-bold leading-tight sm:text-5xl">
                  Create your Artisane account.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/78">
                  Save carts, manage delivery details, and revisit pieces you
                  love.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Register
