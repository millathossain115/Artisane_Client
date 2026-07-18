import { useEffect, useState, type FormEvent } from 'react'
import {
  CircleUserRound,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
} from 'lucide-react'

import DashboardLayout from '../../components/layout/DashboardLayout'
import { getStoredUser, saveStoredUser } from '../../features/auth/authApi'
import {
  type UpdateProfilePayload,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '../../features/auth/profileApi'
import { adminNavItems } from './adminNavItems'
import { userNavItems } from './userNavItems'

type ProfileForm = {
  address: string
  avatar: string
  city: string
  email: string
  name: string
  phone: string
  postalCode: string
}

const emptyProfileForm: ProfileForm = {
  address: '',
  avatar: '',
  city: '',
  email: '',
  name: '',
  phone: '',
  postalCode: '',
}

function getReadableValue(value: string | undefined) {
  return value?.trim() || 'Not added'
}

function createProfileForm(profile: Partial<ProfileForm>): ProfileForm {
  return {
    address: profile.address ?? '',
    avatar: profile.avatar ?? '',
    city: profile.city ?? '',
    email: profile.email ?? '',
    name: profile.name ?? '',
    phone: profile.phone ?? '',
    postalCode: profile.postalCode ?? '',
  }
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') {
    return 'Failed to update profile'
  }

  const errorRecord = error as Record<string, unknown>
  const data = errorRecord.data

  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>

    if (typeof dataRecord.message === 'string') {
      return dataRecord.message
    }
  }

  if (typeof errorRecord.message === 'string') {
    return errorRecord.message
  }

  return 'Failed to update profile'
}

function ProfilePage() {
  const storedUser = getStoredUser()
  const isAdminProfile = storedUser?.role === 'admin'
  const sidebarItems = isAdminProfile ? adminNavItems : userNavItems
  const [profileForm, setProfileForm] = useState<ProfileForm>(() => ({
    ...emptyProfileForm,
    email: storedUser?.email ?? '',
    name: storedUser?.name ?? '',
    phone: storedUser?.phone ?? '',
  }))
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const {
    data: profile,
    isError: hasProfileError,
    isLoading: isProfileLoading,
  } = useGetMyProfileQuery()
  const [updateMyProfile, { isLoading: isSaving }] =
    useUpdateMyProfileMutation()
  const loadedProfileForm = createProfileForm({
    address: profile?.address ?? '',
    avatar: profile?.avatar ?? '',
    city: profile?.city ?? '',
    email: profile?.email ?? storedUser?.email ?? '',
    name: profile?.name ?? storedUser?.name ?? '',
    phone: profile?.phone ?? storedUser?.phone ?? '',
    postalCode: profile?.postalCode ?? '',
  })
  const visibleProfileForm = isEditing ? profileForm : loadedProfileForm

  useEffect(() => {
    if (!profile) {
      return
    }

    saveStoredUser(profile)
  }, [profile])

  function updateField(field: keyof ProfileForm, value: string) {
    setStatus('')
    setError('')
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleStartEditing() {
    setStatus('')
    setError('')
    setProfileForm(loadedProfileForm)
    setIsEditing(true)
  }

  function handleRequestSave() {
    if (!isEditing) {
      return
    }

    setIsConfirmOpen(true)
  }

  async function handleConfirmSave() {
    if (!isEditing) {
      return
    }

    const payload: UpdateProfilePayload = {
      address: profileForm.address.trim() || undefined,
      avatar: profileForm.avatar.trim() || undefined,
      city: profileForm.city.trim() || undefined,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim() || undefined,
      postalCode: profileForm.postalCode.trim() || undefined,
    }

    try {
      const updatedProfile = await updateMyProfile(payload).unwrap()

      if (updatedProfile) {
        setProfileForm({
          address: updatedProfile.address ?? '',
          avatar: updatedProfile.avatar ?? '',
          city: updatedProfile.city ?? '',
          email: updatedProfile.email ?? profileForm.email,
          name: updatedProfile.name ?? '',
          phone: updatedProfile.phone ?? '',
          postalCode: updatedProfile.postalCode ?? '',
        })
      }

      setIsEditing(false)
      setIsConfirmOpen(false)
      setStatus('Profile details saved.')
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  const fieldClass =
    'min-h-12 border border-black/10 bg-white px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]'
  const readonlyClass =
    'min-h-12 border border-black/10 bg-[#f8f3ea] px-3 py-3 text-sm font-semibold text-[#4f463d]'
  const sectionClass = `border bg-white p-5 transition ${
    isEditing
      ? 'border-[#7a3f1d]/50 shadow-[0_18px_32px_rgba(24,21,18,0.08)]'
      : 'border-black/10'
  }`
  const actionButtonClass =
    'inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold transition'

  return (
    <DashboardLayout
      actions={[{ label: 'Back to dashboard', to: '/dashboard' }]}
      eyebrow="Account profile"
      helperText={
        isAdminProfile
          ? 'Keep admin contact details current for marketplace operations.'
          : 'Keep contact and address details ready for faster checkout.'
      }
      sidebarItems={sidebarItems}
      subtitle={
        isAdminProfile
          ? 'Manage admin profile and contact information.'
          : 'Manage profile details, contact information, and saved address.'
      }
      title="My profile"
      workspaceLabel={isAdminProfile ? 'Marketplace studio' : 'Collector account'}
    >
      {(isProfileLoading || hasProfileError) && (
        <div
          className={`mb-4 border px-4 py-3 text-sm font-semibold ${
            hasProfileError
              ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              : 'border-black/10 bg-white text-[#6b5f53]'
          }`}
        >
          {hasProfileError
            ? 'Failed to load profile. Showing locally saved account info.'
            : 'Loading profile details...'}
        </div>
      )}

      <form
        className="grid gap-6 xl:grid-cols-[1fr_0.48fr]"
        onSubmit={(event: FormEvent<HTMLFormElement>) =>
          event.preventDefault()
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-white p-4 xl:col-span-2">
          <div>
            <p className="text-sm font-bold text-[#7a3f1d]">
              {isEditing ? 'Editing profile' : 'Profile is read-only'}
            </p>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {isEditing
                ? 'Update fields below, then save changes.'
                : 'Click edit to update profile details.'}
            </p>
          </div>

          {isEditing ? (
            <button
              className={`${actionButtonClass} bg-[#181512] text-white hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60`}
              disabled={isSaving}
              onClick={handleRequestSave}
              type="button"
            >
              <Save className="h-4 w-4" />
              Save profile
            </button>
          ) : (
            <button
              className={`${actionButtonClass} border border-black/10 bg-white text-[#181512] hover:border-[#181512]`}
              onClick={handleStartEditing}
              type="button"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          )}
        </div>

        <div className="grid gap-6">
          <section className={sectionClass}>
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
                    onChange={(event) => updateField('name', event.target.value)}
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
                    onChange={(event) =>
                      updateField('phone', event.target.value)
                    }
                    placeholder="01700000000"
                    type="tel"
                    value={profileForm.phone}
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold">
                  Avatar path
                  <input
                    className={fieldClass}
                    onChange={(event) =>
                      updateField('avatar', event.target.value)
                    }
                    placeholder="/uploads/profile.jpg"
                    type="text"
                    value={profileForm.avatar}
                  />
                </label>
              </div>
            ) : (
              <dl className="mt-5 grid gap-5 md:grid-cols-2">
                {[
                  ['Full name', visibleProfileForm.name],
                  ['Email address', visibleProfileForm.email],
                  ['Phone number', visibleProfileForm.phone],
                  ['Avatar path', visibleProfileForm.avatar],
                ].map(([label, value]) => (
                  <div className="grid gap-2 text-sm font-bold" key={label}>
                    <dt>{label}</dt>
                    <dd className={readonlyClass}>
                      {getReadableValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {!isAdminProfile && (
            <section className={sectionClass}>
              <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold">Address details</h2>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    Saved address fields supported by the profile API.
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold md:col-span-2">
                    Address
                    <input
                      className={fieldClass}
                      onChange={(event) =>
                        updateField('address', event.target.value)
                      }
                      placeholder="Dhaka, Bangladesh"
                      type="text"
                      value={profileForm.address}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    City
                    <input
                      className={fieldClass}
                      onChange={(event) => updateField('city', event.target.value)}
                      placeholder="Dhaka"
                      type="text"
                      value={profileForm.city}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    Postal code
                    <input
                      className={fieldClass}
                      onChange={(event) =>
                        updateField('postalCode', event.target.value)
                      }
                      placeholder="1207"
                      type="text"
                      value={profileForm.postalCode}
                    />
                  </label>
                </div>
              ) : (
                <dl className="mt-5 grid gap-5 md:grid-cols-2">
                  {[
                    ['Address', visibleProfileForm.address],
                    ['City', visibleProfileForm.city],
                    ['Postal code', visibleProfileForm.postalCode],
                  ].map(([label, value]) => (
                    <div
                      className={`grid gap-2 text-sm font-bold ${
                        label === 'Address' ? 'md:col-span-2' : ''
                      }`}
                      key={label}
                    >
                      <dt>{label}</dt>
                      <dd className={readonlyClass}>
                        {getReadableValue(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}
        </div>

        <aside className="h-fit border border-black/10 bg-[#181512] p-5 text-white">
          <h2 className="text-2xl font-bold">Account summary</h2>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              [Mail, 'Email', visibleProfileForm.email || 'Not added'],
              [Phone, 'Phone', visibleProfileForm.phone || 'Not added'],
              ...(!isAdminProfile
                ? [
                    [
                      MapPin,
                      'Address',
                      visibleProfileForm.city ||
                        visibleProfileForm.postalCode ||
                        visibleProfileForm.address ||
                        'Not added',
                    ],
                  ]
                : []),
            ].map(([Icon, label, value]) => (
              <div
                className="flex gap-3 border-t border-white/10 pt-3"
                key={label as string}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center bg-white text-[#181512]">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <dt className="font-bold text-[#f1c9a6]">{label as string}</dt>
                  <dd className="mt-1 break-words text-white/75">
                    {value as string}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          {(status || error) && (
            <p
              className={`mt-5 border px-4 py-3 text-sm font-semibold ${
                error
                  ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
                  : 'border-[#f1c9a6]/30 bg-white/10 text-[#f1c9a6]'
              }`}
            >
              {error || status}
            </p>
          )}
        </aside>
      </form>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
            role="dialog"
          >
            <p className="text-sm font-bold text-[#7a3f1d]">Confirm update</p>
            <h2 className="mt-2 text-2xl font-bold">Save profile changes?</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
              This will update your account profile using the saved API.
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                disabled={isSaving}
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                onClick={handleConfirmSave}
                type="button"
              >
                {isSaving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Confirm save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ProfilePage
