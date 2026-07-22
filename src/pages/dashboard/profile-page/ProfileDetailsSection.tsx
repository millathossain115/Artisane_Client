import { CircleUserRound, Pencil, Save, Upload } from 'lucide-react'

import { getReadableValue, type ProfileForm } from './profilePageUtils'

type ProfileDetailsSectionProps = {
  fieldClass: string
  isEditing: boolean
  isFormChanged: boolean
  isSaving: boolean
  onCancelEdit: () => void
  onFieldChange: <K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) => void
  onRequestSave: () => void
  onStartEditing: () => void
  profileForm: ProfileForm
  readonlyClass: string
}

function ProfileDetailsSection({
  fieldClass,
  isEditing,
  isFormChanged,
  isSaving,
  onCancelEdit,
  onFieldChange,
  onRequestSave,
  onStartEditing,
  profileForm,
  readonlyClass,
}: ProfileDetailsSectionProps) {
  const avatarLabel =
    profileForm.avatarFile?.name ||
    (profileForm.avatar ? 'Current profile photo' : 'No photo selected')

  return (
    <section className="border border-black/10 bg-white p-5 transition">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <CircleUserRound className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Profile details</h2>
              <span className="text-xs font-bold text-[#7a3f1d]">
                ({isEditing ? 'Editing' : 'Read-only'})
              </span>
            </div>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {isEditing
                ? 'Update fields below, then save changes.'
                : 'Name, email, phone, and profile photo from your account.'}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              className="inline-flex min-h-10 items-center justify-center border border-black/10 bg-white px-3 text-sm font-bold text-[#6b5f53] transition hover:border-[#181512]"
              onClick={onCancelEdit}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving || !isFormChanged}
              onClick={onRequestSave}
              type="button"
            >
              <Save className="h-4 w-4" />
              Save profile
            </button>
          </div>
        ) : (
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            onClick={onStartEditing}
            type="button"
          >
            <Pencil className="h-4 w-4" />
            Edit profile
          </button>
        )}
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
            Profile photo
            <span className="flex min-h-12 cursor-pointer items-center justify-between gap-3 border border-black/10 bg-white px-3 text-sm font-medium transition hover:border-[#181512]">
              <span className="truncate text-[#4f463d]">{avatarLabel}</span>
              <Upload className="h-4 w-4 shrink-0 text-[#7a3f1d]" />
              <input
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null

                  onFieldChange('avatarFile', file)

                  if (file) {
                    onFieldChange('avatar', URL.createObjectURL(file))
                  }
                }}
                type="file"
              />
            </span>
            {profileForm.avatar ? (
              <img
                alt="Profile preview"
                className="h-20 w-20 border border-black/10 object-cover"
                src={profileForm.avatar}
              />
            ) : null}
          </label>
        </div>
      ) : (
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ['Full name', profileForm.name],
            ['Email address', profileForm.email],
            ['Phone number', profileForm.phone],
            ['Profile photo', profileForm.avatar],
          ].map(([label, value]) => (
            <div className="grid gap-2 text-sm font-bold" key={label}>
              <dt>{label}</dt>
              <dd className={readonlyClass}>
                {label === 'Profile photo' && value ? (
                  <img
                    alt="Profile"
                    className="h-16 w-16 border border-black/10 object-cover"
                    src={value}
                  />
                ) : (
                  getReadableValue(value)
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export default ProfileDetailsSection
