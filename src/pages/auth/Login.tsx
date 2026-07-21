import type { FormEvent } from 'react'
import { useState } from 'react'
import { ArrowLeft, Eye, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import artistImage from '../../assets/artist-optimized.jpg'
import {
  login,
  loginWithGoogle,
  saveAuthSession,
  type AuthData,
} from '../../features/auth/authApi'
import {
  addToCart,
  syncCartForCurrentUser,
  type CartItem,
} from '../../features/cart/cartSlice'
import { useAppDispatch } from '../../redux/hooks'
import GoogleAuthButton from './GoogleAuthButton'

const demoAccounts = [
  {
    email: 'userdemo111@gmail.com',
    label: 'Login as user',
    password: 'user111',
  },
  {
    email: 'admindemo111@gmail.com',
    label: 'Login as admin',
    password: 'admin111',
  },
]

type LoginLocationState = {
  buyNowItem?: CartItem
  from?: {
    pathname?: string
  }
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const locationState = location.state as LoginLocationState | null
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleLoginSuccess(authData: AuthData, message: string) {
    saveAuthSession(authData)
    dispatch(syncCartForCurrentUser())
    if (authData.user.role !== 'admin' && locationState?.buyNowItem) {
      dispatch(addToCart(locationState.buyNowItem))
    }
    setStatus(message)

    window.setTimeout(() => {
      const redirectPath =
        locationState?.from?.pathname && locationState.from.pathname !== '/login'
          ? locationState.from.pathname
          : '/'

      navigate(authData.user.role === 'admin' ? '/dashboard' : redirectPath, {
        replace: true,
      })
    }, 500)
  }

  async function loginWithCredentials(credentials: {
    email: string
    password: string
  }) {
    setStatus('')
    setError('')
    setIsSubmitting(true)

    try {
      const response = await login(credentials)

      if (!response.data) {
        throw new Error('Login succeeded but no auth data was returned.')
      }

      handleLoginSuccess(response.data, response.message)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to login right now.',
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

      handleLoginSuccess(response.data, response.message)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to login with Google right now.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await loginWithCredentials({ email, password })
  }

  async function handleDemoLogin(credentials: {
    email: string
    password: string
  }) {
    setEmail(credentials.email)
    setPassword(credentials.password)
    await loginWithCredentials(credentials)
  }

  return (
    <main className="grid min-h-screen bg-[#f8f3ea] text-[#181512] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#181512] lg:block">
        <img
          alt="Artist studio with handmade work"
          className="absolute inset-0 h-full w-full object-cover opacity-68 transition-transform duration-1000 hover:scale-105"
          src={artistImage}
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
            <p className="text-xs font-bold uppercase tracking-widest text-[#f1c9a6]">Welcome back</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              Sign in to continue collecting craft.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              Track orders, save favorites, and get early access to limited
              maker drops.
            </p>
          </div>
        </div>
      </section>

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
              Account access
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight">Login</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b5f53]">
              Use your Artisane account to manage orders and saved pieces.
            </p>
          </div>

          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div className="grid gap-2 rounded-xl border border-white/40 bg-white/60 p-3 shadow-sm backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7a3f1d]">
                Development login
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {demoAccounts.map((account) => (
                  <button
                    className="min-h-9 rounded-lg border border-black/10 bg-white/50 px-3 text-xs font-bold shadow-sm transition-all hover:border-[#181512]/30 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                    key={account.email}
                    onClick={() => handleDemoLogin(account)}
                    type="button"
                  >
                    {account.label}
                  </button>
                ))}
              </div>
            </div>

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
              <span className="text-xs font-bold uppercase tracking-wider text-[#6b5f53]">Password</span>
              <span className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/40 bg-white/60 px-3 py-2.5 shadow-sm transition-all focus-within:border-[#7a3f1d]/50 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#7a3f1d]/20">
                <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
                <input
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                  minLength={6}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
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

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="inline-flex items-center gap-2 font-semibold text-[#6b5f53]">
                <input className="h-4 w-4 rounded accent-[#181512] transition-all" type="checkbox" />
                Remember me
              </label>
              <a
                className="font-bold text-[#7a3f1d] transition-colors hover:text-[#181512]"
                href="#"
              >
                Forgot password?
              </a>
            </div>

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
              {isSubmitting ? 'Logging in...' : 'Login'}
              <ShieldCheck className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-center text-sm font-medium text-[#6b5f53]">
            New to Artisane?{' '}
            <Link className="font-bold text-[#181512] transition-colors hover:text-[#7a3f1d]" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
