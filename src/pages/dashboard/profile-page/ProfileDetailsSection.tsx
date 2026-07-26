import { useState } from 'react'
import { CircleUserRound, Pencil, Save, Upload, X } from 'lucide-react'

import {
  genderOptions,
  getGenderLabel,
  getReadableValue,
  type ProfileForm,
} from './profilePageUtils'

const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024

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
  savedAvatar: string
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
  savedAvatar,
}: ProfileDetailsSectionProps) {
  const [avatarWarning, setAvatarWarning] = useState('')
  const avatarLabel =
    profileForm.avatarFile?.name ||
    (profileForm.avatar ? 'Current profile photo' : 'No photo selected')

  function handleAvatarChange(file: File | null) {
    if (!file) {
      setAvatarWarning('')
      onFieldChange('avatarFile', null)
      return
    }

    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      setAvatarWarning('Profile photo must be 5 MB or smaller.')
      return
    }

    setAvatarWarning('')
    onFieldChange('avatarFile', file)
    onFieldChange('avatar', URL.createObjectURL(file))
  }

  function handleRemoveSelectedAvatar() {
    setAvatarWarning('')
    onFieldChange('avatarFile', null)
    onFieldChange('avatar', savedAvatar)
  }

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
                : 'Name, contact details, personal details, and profile photo from your account.'}
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
          <div className="md:col-span-2">
            <p className="text-sm font-bold">Profile photo</p>
            <label
              className={`mt-2 grid cursor-pointer gap-4 border border-dashed p-4 transition hover:border-[#181512] sm:grid-cols-[104px_1fr] sm:items-center ${
                avatarWarning
                  ? 'border-red-300 bg-red-50'
                  : 'border-black/20 bg-[#f8f3ea]/45'
              }`}
            >
              <span className="relative grid h-24 w-24 place-items-center overflow-hidden border border-black/10 bg-white text-[#7a3f1d]">
                {profileForm.avatar ? (
                  <img
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    src={profileForm.avatar}
                  />
                ) : (
                  <CircleUserRound className="h-8 w-8" />
                )}
                {profileForm.avatarFile ? (
                  <button
                    aria-label="Remove selected profile photo"
                    className="absolute right-1 top-1 grid h-7 w-7 place-items-center bg-white text-[#181512] shadow-sm transition hover:bg-[#181512] hover:text-white"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleRemoveSelectedAvatar()
                    }}
                    title="Remove selected photo"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </span>
              <span className="min-w-0">
                <span className="inline-flex min-h-10 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]">
                  <Upload className="h-4 w-4" />
                  Upload photo
                </span>
                <span className="mt-3 block truncate text-sm font-semibold text-[#4f463d]">
                  {avatarLabel}
                </span>
                <span className="mt-1 block text-xs font-semibold text-[#6b5f53]">
                  JPG, PNG, or WebP. Max file size 5 MB.
                </span>
                {avatarWarning ? (
                  <span className="mt-2 block text-xs font-bold text-red-700">
                    {avatarWarning}
                  </span>
                ) : null}
              </span>
              <input
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  handleAvatarChange(event.target.files?.[0] ?? null)
                  event.target.value = ''
                }}
                type="file"
              />
            </label>
          </div>

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
            Alternative phone
            <input
              className={fieldClass}
              onChange={(event) =>
                onFieldChange('alternativePhone', event.target.value)
              }
              placeholder="01800000000"
              type="tel"
              value={profileForm.alternativePhone}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Date of birth
            <input
              className={fieldClass}
              onChange={(event) =>
                onFieldChange('dateOfBirth', event.target.value)
              }
              type="date"
              value={profileForm.dateOfBirth}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Gender
            <select
              className={fieldClass}
              onChange={(event) =>
                onFieldChange('gender', event.target.value as ProfileForm['gender'])
              }
              value={profileForm.gender}
            >
              {genderOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

        </div>
      ) : (
        <>
          <div className="mt-5 flex items-center gap-4 border border-black/10 bg-[#f8f3ea]/45 p-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden border border-black/10 bg-white text-[#7a3f1d]">
              {profileForm.avatar ? (
                <img
                  alt="Profile"
                  className="h-full w-full object-cover"
                  src={profileForm.avatar}
                />
              ) : (
                <CircleUserRound className="h-7 w-7" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">Profile photo</p>
              <p className="mt-1 text-sm font-semibold text-[#6b5f53]">
                {profileForm.avatar ? 'Photo added' : 'No photo added'}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              ['Full name', profileForm.name],
              ['Email address', profileForm.email],
              ['Phone number', profileForm.phone],
              ['Alternative phone', profileForm.alternativePhone],
              ['Date of birth', profileForm.dateOfBirth],
              ['Gender', getGenderLabel(profileForm.gender)],
            ].map(([label, value]) => (
              <div className="grid gap-2 text-sm font-bold" key={label}>
                <dt>{label}</dt>
                <dd className={readonlyClass}>{getReadableValue(value)}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  )
}

export default ProfileDetailsSection
