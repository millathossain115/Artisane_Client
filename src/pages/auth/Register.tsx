import type { FormEvent } from 'react'
import { useState } from 'react'
import {
  ArrowLeft,
  Eye,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import paletteImage from '../../assets/palette-optimized.jpg'
import { register, saveAuthSession } from '../../features/auth/authApi'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setStatus(response.message)

      window.setTimeout(() => {
        navigate('/')
      }, 500)
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

  return (
    <main className="grid min-h-screen bg-[#f8f3ea] text-[#181512] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hero-enter flex min-h-screen items-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#6b5f53] transition hover:text-[#181512]"
            to="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          <div>
            <p className="text-sm font-semibold text-[#7a3f1d]">
              Join the marketplace
            </p>
            <h1 className="mt-2 text-4xl font-bold">Register</h1>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              Create an account to save favorite pieces, checkout faster, and
              follow maker drops.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-bold">Full name</span>
              <span className="mt-2 flex items-center gap-3 border border-black/10 bg-white px-4 py-3 transition focus-within:border-[#181512]">
                <UserRound className="h-5 w-5 text-[#7a3f1d]" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                  type="text"
                  value={name}
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold">Email address</span>
              <span className="mt-2 flex items-center gap-3 border border-black/10 bg-white px-4 py-3 transition focus-within:border-[#181512]">
                <Mail className="h-5 w-5 text-[#7a3f1d]" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold">Phone number</span>
              <span className="mt-2 flex items-center gap-3 border border-black/10 bg-white px-4 py-3 transition focus-within:border-[#181512]">
                <UserRound className="h-5 w-5 text-[#7a3f1d]" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="01700000000"
                  required
                  type="tel"
                  value={phone}
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold">Password</span>
              <span className="mt-2 flex items-center gap-3 border border-black/10 bg-white px-4 py-3 transition focus-within:border-[#181512]">
                <LockKeyhole className="h-5 w-5 text-[#7a3f1d]" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
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
                  <Eye className="h-5 w-5" />
                </button>
              </span>
            </label>

            <label className="inline-flex items-start gap-3 text-sm leading-6 text-[#6b5f53]">
              <input
                className="mt-1 h-4 w-4 accent-[#181512]"
                type="checkbox"
              />
              I agree to receive order updates and accept the Artisane terms.
            </label>

            {error ? (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            {status ? (
              <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {status}
              </p>
            ) : null}

            <button
              className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:bg-[#6b5f53]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              <ShieldCheck className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6b5f53]">
            Already have an account?{' '}
            <Link className="font-bold text-[#181512]" to="/login">
              Login
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-[#181512] lg:block">
        <img
          alt="Handmade color palette"
          className="absolute inset-0 h-full w-full object-cover opacity-72"
          src={paletteImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.08),rgba(24,21,18,0.82))]" />
        <div className="hero-enter relative flex min-h-screen flex-col justify-between p-10 text-white">
          <Link className="inline-flex w-fit items-center gap-3" to="/">
            <span className="grid h-10 w-10 place-items-center bg-white text-base font-bold text-[#181512]">
              A
            </span>
            <span className="font-display text-2xl font-bold">Artisane</span>
          </Link>

          <div className="max-w-md">
            <p className="text-sm font-semibold text-[#f1c9a6]">
              Maker-first shopping
            </p>
            <h2 className="mt-3 text-5xl font-bold leading-tight">
              Discover limited batches before they sell out.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/78">
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
