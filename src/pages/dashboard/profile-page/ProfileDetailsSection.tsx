import { CircleUserRound } from 'lucide-react'

import { getReadableValue, type ProfileForm } from './profilePageUtils'

type ProfileDetailsSectionProps = {
  fieldClass: string
  isEditing: boolean
  profileForm: ProfileForm
  readonlyClass: string
  onFieldChange: <K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) => void
}

function ProfileDetailsSection({
  fieldClass,
  isEditing,
  onFieldChange,
  profileForm,
  readonlyClass,
}: ProfileDetailsSectionProps) {
  return (
    <section className="border border-black/10 bg-white p-5 transition">
      <div className="flex items-center gap-3 border-b border-black/10 pb-4">
        <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <CircleUserRound className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Profile details</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Name, email, phone, and avatar path from your account.
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            Full name
            <input
              className={fieldClass}
              onChange={(event) => onFieldChange('name', event.target.value)}
              placeholder="Milla"
              required
              type="text"
              value={profileForm.name}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Email address
            <input
              className={readonlyClass}
              disabled
              type="email"
              value={profileForm.email}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Phone number
            <input
              className={fieldClass}
              onChange={(event) => onFieldChange('phone', event.target.value)}
              placeholder="01700000000"
              type="tel"
              value={profileForm.phone}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Avatar path
            <input
              className={fieldClass}
              onChange={(event) => onFieldChange('avatar', event.target.value)}
              placeholder="/uploads/profile.jpg"
              type="text"
              value={profileForm.avatar}
            />
          </label>
        </div>
      ) : (
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ['Full name', profileForm.name],
            ['Email address', profileForm.email],
            ['Phone number', profileForm.phone],
            ['Avatar path', profileForm.avatar],
          ].map(([label, value]) => (
            <div className="grid gap-2 text-sm font-bold" key={label}>
              <dt>{label}</dt>
              <dd className={readonlyClass}>{getReadableValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export default ProfileDetailsSection
