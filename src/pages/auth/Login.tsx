import type { FormEvent } from 'react'
import { useState } from 'react'
import { Eye, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import artistImage from '../../assets/home-banners/artist-optimized.jpg'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import {
  login,
  loginWithGoogle,
  isAdminRole,
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
  const locationState = location.state as LoginLocationState | undefined
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleLoginSuccess(authData: AuthData, message: string) {
    saveAuthSession(authData)
    dispatch(syncCartForCurrentUser())
    const isAdmin = isAdminRole(authData.user.role)

    if (!isAdmin && locationState?.buyNowItem) {
      dispatch(addToCart(locationState.buyNowItem))
    }
    setStatus(message)

    window.setTimeout(() => {
      const redirectPath =
        locationState?.from?.pathname &&
        locationState.from.pathname !== '/login'
          ? locationState.from.pathname
          : '/'

      navigate(isAdmin ? '/dashboard' : redirectPath, {
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
      const response = await login({
        ...credentials,
        email: credentials.email.trim().toLowerCase(),
      })

      if (!response.data) {
        throw new Error('Login succeeded but no auth data was returned.')
      }

      handleLoginSuccess(response.data, response.message)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to login right now.'
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

      handleLoginSuccess(response.data, response.message)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to login with Google right now.'
      setError(msg)
      toast.error(msg)
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
    <div className="min-h-screen bg-[#f8f3ea] text-[#181512]">
      <Navbar />

      <main>
        <section className="w-full pb-10 lg:pb-14">
          <div className="grid overflow-hidden border border-black/10 bg-white shadow-[0_18px_45px_rgba(24,21,18,0.08)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
            <aside className="relative min-h-[20rem] overflow-hidden bg-[#181512] text-white lg:min-h-[42rem]">
              <img
                alt="Artist studio with handmade work"
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 hover:scale-[1.02]"
                src={artistImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/88 via-[#181512]/36 to-[#181512]/8" />
              <div className="relative flex h-full min-h-[20rem] flex-col justify-end p-6 sm:p-8 lg:min-h-[42rem] lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
                  Welcome back
                </p>
                <h1 className="mt-3 max-w-md font-display text-4xl font-bold leading-tight sm:text-5xl">
                  Login to your Artisane account.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/78">
                  Track orders, save favorites, and checkout faster with your
                  saved account details.
                </p>
              </div>
            </aside>

            <section className="flex items-center bg-white">
              <div className="mx-auto w-full max-w-lg p-5 sm:p-8 lg:p-10">
                <div>
                  <p className="text-sm font-bold text-[#7a3f1d]">
                    Account access
                  </p>
                  <h2 className="mt-1 text-3xl font-bold">Login</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                    Use your Artisane account to manage orders and saved pieces.
                  </p>
                </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-3 border border-black/10 bg-[#f8f3ea] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
                    Development login
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {demoAccounts.map((account) => (
                      <button
                        className="min-h-10 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-60"
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
                      Password
                    </span>
                    <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
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
                      <input
                        className="h-4 w-4 accent-[#181512]"
                        type="checkbox"
                      />
                      Remember me
                    </label>
                    <a
                      className="font-bold text-[#7a3f1d] transition hover:text-[#181512]"
                      href="#"
                    >
                      Forgot password?
                    </a>
                  </div>

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
                    {isSubmitting ? 'Logging in...' : 'Login'}
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                </form>

                <p className="mt-5 text-center text-sm font-medium text-[#6b5f53]">
                  New to Artisane?{' '}
                  <Link
                    className="font-bold text-[#181512] transition hover:text-[#7a3f1d]"
                    to="/register"
                  >
                    Create an account
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

export default Login
