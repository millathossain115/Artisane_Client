import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Save } from 'lucide-react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import { getStoredUser, saveStoredUser } from '../../../features/auth/authApi'
import {
  type UpdateProfilePayload,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '../../../features/auth/profileApi'
import { adminNavItems } from '../../admin/adminNavItems'
import { userNavItems } from '../user-dashboard/userNavItems'
import AccountSummaryCard from './AccountSummaryCard'
import ConfirmSaveModal from './ConfirmSaveModal'
import ProfileAddressSection from './ProfileAddressSection'
import ProfileDetailsSection from './ProfileDetailsSection'
import {
  createProfileForm,
  emptyProfileForm,
  getErrorMessage,
  type ProfileForm,
} from './profilePageUtils'

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
  const [savedProfileForm, setSavedProfileForm] = useState<ProfileForm | null>(
    null,
  )
  const {
    data: profile,
    isError: hasProfileError,
    isLoading: isProfileLoading,
  } = useGetMyProfileQuery()
  const [updateMyProfile, { isLoading: isSaving }] =
    useUpdateMyProfileMutation()

  const loadedProfileForm = createProfileForm({
    address: savedProfileForm?.address ?? profile?.address ?? '',
    avatar: savedProfileForm?.avatar ?? profile?.avatar ?? '',
    city: savedProfileForm?.city ?? profile?.city ?? '',
    email: savedProfileForm?.email ?? profile?.email ?? storedUser?.email ?? '',
    name: savedProfileForm?.name ?? profile?.name ?? storedUser?.name ?? '',
    phone: savedProfileForm?.phone ?? profile?.phone ?? storedUser?.phone ?? '',
    postalCode: savedProfileForm?.postalCode ?? profile?.postalCode ?? '',
  })
  const visibleProfileForm = isEditing ? profileForm : loadedProfileForm
  const fieldClass =
    'min-h-12 border border-black/10 bg-white px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]'
  const readonlyClass =
    'min-h-12 border border-black/10 bg-[#f8f3ea] px-3 py-3 text-sm font-semibold text-[#4f463d]'

  useEffect(() => {
    if (!profile) {
      return
    }

    saveStoredUser(profile)
  }, [profile])

  useEffect(() => {
    if (!profileForm.avatar.startsWith('blob:')) {
      return
    }

    return () => URL.revokeObjectURL(profileForm.avatar)
  }, [profileForm.avatar])

  function updateField<K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) {
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

    const avatar =
      profileForm.avatarFile ?? (profileForm.avatar.trim() || undefined)
    const payload: UpdateProfilePayload = {
      address: profileForm.address.trim() || undefined,
      avatar,
      city: profileForm.city.trim() || undefined,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim() || undefined,
      postalCode: profileForm.postalCode.trim() || undefined,
    }

    try {
      const updatedProfile = await updateMyProfile(payload).unwrap()

      if (updatedProfile) {
        const nextProfileForm = {
          address: updatedProfile.address ?? '',
          avatar: updatedProfile.avatar ?? '',
          avatarFile: null,
          city: updatedProfile.city ?? '',
          email: updatedProfile.email ?? profileForm.email,
          name: updatedProfile.name ?? '',
          phone: updatedProfile.phone ?? '',
          postalCode: updatedProfile.postalCode ?? '',
        }

        setProfileForm(nextProfileForm)
        setSavedProfileForm(nextProfileForm)
      }

      setIsEditing(false)
      setIsConfirmOpen(false)
      setStatus('Profile details saved.')
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

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
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={handleRequestSave}
              type="button"
            >
              <Save className="h-4 w-4" />
              Save profile
            </button>
          ) : (
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
              onClick={handleStartEditing}
              type="button"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          )}
        </div>

        <div className="grid gap-6">
          <ProfileDetailsSection
            fieldClass={fieldClass}
            isEditing={isEditing}
            onFieldChange={updateField}
            profileForm={visibleProfileForm}
            readonlyClass={readonlyClass}
          />
          <ProfileAddressSection
            fieldClass={fieldClass}
            isAdminProfile={isAdminProfile}
            isEditing={isEditing}
            onFieldChange={updateField}
            profileForm={visibleProfileForm}
            readonlyClass={readonlyClass}
          />
        </div>

        <AccountSummaryCard
          error={error}
          isAdminProfile={isAdminProfile}
          profileForm={visibleProfileForm}
          status={status}
        />
      </form>

      {isConfirmOpen ? (
        <ConfirmSaveModal
          isSaving={isSaving}
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmSave}
        />
      ) : null}
    </DashboardLayout>
  )
}

export default ProfilePage
