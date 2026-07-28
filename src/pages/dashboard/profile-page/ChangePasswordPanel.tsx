import { Eye, LockKeyhole, ShieldCheck } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import PasswordStrengthMeter from '../../../components/auth/PasswordStrengthMeter'
import {
  changePassword,
  clearAuthSession,
} from '../../../features/auth/authApi'
import { isPasswordMediumEnough } from '../../../features/auth/passwordStrength'

function ChangePasswordPanel() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isPasswordValid = isPasswordMediumEnough(newPassword)
  const isConfirmValid = newPassword === confirmPassword && confirmPassword.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')

    if (!isConfirmValid) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
      })
      const message = response.message || 'Password changed successfully'

      setStatus(message)
      toast.success('Password changed. Please login again.')
      window.setTimeout(() => {
        clearAuthSession()
        navigate('/login', { replace: true })
      }, 700)
    } catch (caughtError) {
      const msg =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to change password right now.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border border-black/10 bg-white p-5 transition">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Security</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              Change your account password.
            </p>
          </div>
        </div>
      </div>

      <form className="mt-5 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">
          Current password
          <span className="flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
            <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
              required
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
            />
            <button
              aria-label="Show password fields"
              className="text-[#6b5f53] transition hover:text-[#181512]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              <Eye className="h-4 w-4" />
            </button>
          </span>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          New password
          <span className="flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
            <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
              minLength={8}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Create password"
              required
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
            />
          </span>
          <PasswordStrengthMeter password={newPassword} />
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Confirm password
          <span className="flex min-h-12 items-center gap-3 border border-black/10 bg-white px-3 transition focus-within:border-[#181512]">
            <LockKeyhole className="h-4 w-4 text-[#7a3f1d]" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8a7d71]"
              minLength={8}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
              required
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
            />
          </span>
          {confirmPassword && !isConfirmValid ? (
            <span className="text-xs font-bold text-red-700">
              Passwords do not match.
            </span>
          ) : null}
        </label>

        {(status || error) && (
          <p
            className={`md:col-span-2 border px-3 py-2 text-xs font-semibold ${
              error
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {error || status}
          </p>
        )}

        <div className="md:col-span-2">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:pointer-events-none disabled:opacity-60"
            disabled={
              isSubmitting ||
              !currentPassword ||
              !isPasswordValid ||
              !isConfirmValid
            }
            type="submit"
          >
            {isSubmitting ? 'Changing...' : 'Change password'}
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  )
}

export default ChangePasswordPanel
