import {
  getPasswordStrength,
  PASSWORD_POLICY_TEXT,
} from '../../features/auth/passwordStrength'

type PasswordStrengthMeterProps = {
  password: string
}

const levelClass = {
  empty: 'bg-black/10',
  weak: 'bg-red-500',
  medium: 'bg-[#b47818]',
  strong: 'bg-emerald-600',
}

function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password)
  const activeBars =
    strength.level === 'empty'
      ? 0
      : strength.level === 'weak'
        ? 1
        : strength.level === 'medium'
          ? 2
          : 3

  return (
    <div className="mt-2">
      <div className="grid grid-cols-3 gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            className={`h-1.5 ${
              index < activeBars ? levelClass[strength.level] : 'bg-black/10'
            }`}
            key={index}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        <span
          className={
            strength.level === 'weak'
              ? 'text-red-700'
              : strength.level === 'strong'
                ? 'text-emerald-700'
                : 'text-[#7a3f1d]'
          }
        >
          {strength.label}
        </span>
        <span className="text-[#6b5f53]">{PASSWORD_POLICY_TEXT}</span>
      </div>
    </div>
  )
}

export default PasswordStrengthMeter
