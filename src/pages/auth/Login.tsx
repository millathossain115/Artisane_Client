import type { FormEvent } from 'react'
import { useState } from 'react'
import { ArrowLeft, Eye, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import artistImage from '../../assets/artist-optimized.jpg'
import { login, saveAuthSession } from '../../features/auth/authApi'
import {
  addToCart,
  syncCartForCurrentUser,
  type CartItem,
} from '../../features/cart/cartSlice'
import { useAppDispatch } from '../../redux/hooks'

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

      const authData = response.data

      saveAuthSession(authData)
      dispatch(syncCartForCurrentUser())
      if (authData.user.role !== 'admin' && locationState?.buyNowItem) {
        dispatch(addToCart(locationState.buyNowItem))
      }
      setStatus(response.message)

      window.setTimeout(() => {
        const redirectPath =
          locationState?.from?.pathname && locationState.from.pathname !== '/login'
            ? locationState.from.pathname
            : '/'

        navigate(authData.user.role === 'admin' ? '/dashboard' : redirectPath, {
          replace: true,
        })
      }, 500)
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
          className="absolute inset-0 h-full w-full object-cover opacity-68"
          src={artistImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.18),rgba(24,21,18,0.86))]" />
        <div className="hero-enter relative flex min-h-screen flex-col justify-between p-10 text-white">
          <Link className="inline-flex w-fit items-center gap-3" to="/">
            <span className="grid h-10 w-10 place-items-center bg-white text-base font-bold text-[#181512]">
              A
            </span>
            <span className="font-display text-2xl font-bold">Artisane</span>
          </Link>

          <div className="max-w-md">
            <p className="text-sm font-semibold text-[#f1c9a6]">Welcome back</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight">
              Sign in to continue collecting craft.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/78">
              Track orders, save favorites, and get early access to limited
              maker drops.
            </p>
          </div>
        </div>
      </section>

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
              Account access
            </p>
            <h2 className="mt-2 text-4xl font-bold">Login</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              Use your Artisane account to manage orders and saved pieces.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-2 border border-black/10 bg-white p-3">
              <p className="text-xs font-bold uppercase text-[#7a3f1d]">
                Development login
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {demoAccounts.map((account) => (
                  <button
                    className="min-h-11 border border-black/10 px-3 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-60"
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
              <span className="text-sm font-bold">Password</span>
              <span className="mt-2 flex items-center gap-3 border border-black/10 bg-white px-4 py-3 transition focus-within:border-[#181512]">
                <LockKeyhole className="h-5 w-5 text-[#7a3f1d]" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a7d71]"
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
                  <Eye className="h-5 w-5" />
                </button>
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 font-semibold text-[#6b5f53]">
                <input className="h-4 w-4 accent-[#181512]" type="checkbox" />
                Remember me
              </label>
              <a
                className="font-bold text-[#7a3f1d] hover:text-[#181512]"
                href="#"
              >
                Forgot password?
              </a>
            </div>

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
              {isSubmitting ? 'Logging in...' : 'Login'}
              <ShieldCheck className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6b5f53]">
            New to Artisane?{' '}
            <Link className="font-bold text-[#181512]" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
