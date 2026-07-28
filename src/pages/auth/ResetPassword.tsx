import { Eye, LockKeyhole, ShieldCheck } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import paletteImage from '../../assets/home-banners/palette-optimized.jpg'
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import { resetPassword } from '../../features/auth/authApi'
import { isPasswordMediumEnough } from '../../features/auth/passwordStrength'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isPasswordValid = isPasswordMediumEnough(password)
  const isConfirmValid = password === confirmPassword && confirmPassword.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')

    if (!token) {
      setError('Reset link is missing or invalid.')
      return
    }

    if (!isConfirmValid) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await resetPassword({ password, token })
      const message = response.message || 'Password reset successfully'

      setStatus(message)
      toast.success(message)
      window.setTimeout(() => {
        navigate('/login', { replace: true })
      }, 700)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to reset password right now.'
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
                <p className="text-sm font-bold text-[#7a3f1d]">
                  New password
                </p>
                <h1 className="mt-1 text-3xl font-bold">Reset password</h1>
                <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                  Create a new password for your Artisane account.
                </p>

                {!token ? (
                  <p className="mt-5 border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                    Reset link is missing or invalid.
                  </p>
                ) : null}

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b5f53]">
                      New password
                    </span>
                    <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
                      <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
                      <input
                        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                        minLength={8}
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
                    <PasswordStrengthMeter password={password} />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b5f53]">
                      Confirm password
                    </span>
                    <span className="mt-2 flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
                      <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
                      <input
                        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
                        minLength={8}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Repeat password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                      />
                    </span>
                    {confirmPassword && !isConfirmValid ? (
                      <span className="mt-2 block text-xs font-bold text-red-700">
                        Passwords do not match.
                      </span>
                    ) : null}
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
                    disabled={
                      isSubmitting || !token || !isPasswordValid || !isConfirmValid
                    }
                    type="submit"
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset password'}
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                </form>

                <p className="mt-5 text-center text-sm font-medium text-[#6b5f53]">
                  Back to{' '}
                  <Link
                    className="font-bold text-[#181512] transition hover:text-[#7a3f1d]"
                    to="/login"
                  >
                    login
                  </Link>
                </p>
              </div>
            </section>

            <aside className="relative min-h-[20rem] overflow-hidden bg-[#181512] text-white lg:min-h-[38rem]">
              <img
                alt="Handmade color palette"
                className="absolute inset-0 h-full w-full object-cover opacity-72"
                src={paletteImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181512]/90 via-[#181512]/36 to-[#181512]/8" />
              <div className="relative flex h-full min-h-[20rem] flex-col justify-end p-6 sm:p-8 lg:min-h-[38rem] lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
                  Secure account
                </p>
                <h2 className="mt-3 max-w-md font-display text-4xl font-bold leading-tight sm:text-5xl">
                  Choose a stronger password.
                </h2>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ResetPassword
