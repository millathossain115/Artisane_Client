export type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong'

export const PASSWORD_POLICY_TEXT =
  'Use 8-100 characters with at least one letter and one number.'

export function isPasswordMediumEnough(password: string) {
  return (
    password.length >= 8 &&
    password.length <= 100 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  )
}

export function getPasswordStrength(password: string): {
  level: PasswordStrengthLevel
  score: number
  label: string
} {
  if (!password) {
    return { level: 'empty', score: 0, label: 'Password strength' }
  }

  const checks = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /\d/.test(password),
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length

  if (!isPasswordMediumEnough(password)) {
    return { level: 'weak', score: Math.min(score, 2), label: 'Weak' }
  }

  if (password.length >= 10 && score >= 4) {
    return { level: 'strong', score, label: 'Strong' }
  }

  return { level: 'medium', score: Math.max(score, 3), label: 'Medium' }
}
