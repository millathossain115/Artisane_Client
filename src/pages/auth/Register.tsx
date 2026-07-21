import {
  ArrowLeft,
  Eye,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import paletteImage from '../../assets/palette-optimized.jpg'
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
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to register right now.',
      )
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
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to continue with Google right now.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f8f3ea] text-[#181512] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hero-enter relative flex min-h-screen items-center px-4 py-6 sm:px-6 lg:px-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-[#f1c9a6]/30 blur-3xl" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-[#e6d0bb]/40 blur-3xl" />
        </div>
        <div className="mx-auto w-full max-w-md relative z-10 rounded-2xl border border-white/50 bg-white/40 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8">
          <Link
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#6b5f53] transition-colors hover:text-[#181512]"
            to="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          <div>
            <p className="text-sm font-semibold text-[#7a3f1d]">
              Join the marketplace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Register</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#6b5f53]">
              Create an account to save favorite pieces, checkout faster, and
              follow maker drops.
            </p>
          </div>

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">Full name</span>
              <span className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 px-3 py-2.5 shadow-sm transition-all focus-within:border-[#7a3f1d]/50 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#7a3f1d]/20">
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">Email address</span>
              <span className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 px-3 py-2.5 shadow-sm transition-all focus-within:border-[#7a3f1d]/50 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#7a3f1d]/20">
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">Phone number</span>
              <span className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 px-3 py-2.5 shadow-sm transition-all focus-within:border-[#7a3f1d]/50 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#7a3f1d]/20">
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">Password</span>
              <span className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 px-3 py-2.5 shadow-sm transition-all focus-within:border-[#7a3f1d]/50 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#7a3f1d]/20">
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

            <label className="inline-flex items-start gap-2.5 text-xs font-medium leading-relaxed text-[#6b5f53]">
              <input
                className="mt-0.5 h-4 w-4 rounded accent-[#181512] transition-all"
                type="checkbox"
              />
              I agree to receive order updates and accept the Artisane terms.
            </label>

            <div className="grid gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#8a7d71]">
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
               <p className="rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-semibold text-red-700 backdrop-blur-sm">
                {error}
              </p>
            ) : null}

            {status ? (
               <p className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-700 backdrop-blur-sm">
                {status}
              </p>
            ) : null}

            <button
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#181512] px-5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#7a3f1d] hover:shadow-lg disabled:pointer-events-none disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <ShieldCheck className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-center text-sm font-medium text-[#6b5f53]">
            Already have an account?{' '}
            <Link className="font-bold text-[#181512] transition-colors hover:text-[#7a3f1d]" to="/login">
              Login
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-[#181512] lg:block">
        <img
          alt="Handmade color palette"
          className="absolute inset-0 h-full w-full object-cover opacity-72 transition-transform duration-1000 hover:scale-105"
          src={paletteImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/90 via-[#181512]/40 to-[#181512]/10" />
        <div className="hero-enter relative flex min-h-screen flex-col justify-between p-12 text-white">
          <Link className="inline-flex w-fit items-center gap-3 transition-opacity hover:opacity-80" to="/">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm text-base font-bold text-[#181512]">
              A
            </span>
            <span className="font-display text-2xl font-bold tracking-tight">Artisane</span>
          </Link>

          <div className="max-w-md">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f1c9a6]">
              Maker-first shopping
            </p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              Discover limited batches before they sell out.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              New members get early access to curated edits, saved carts, and
              faster checkout.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
