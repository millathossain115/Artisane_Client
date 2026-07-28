import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  getStoredUser,
  isAdminRole,
  saveStoredUser,
} from '../../../features/auth/authApi'
import {
  type UpdateProfilePayload,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from '../../../features/auth/profileApi'
import { adminNavItems } from '../../admin/adminNavItems'
import { userNavItems } from '../user-dashboard/userNavItems'
import AccountSummaryCard from './AccountSummaryCard'
import ChangePasswordPanel from './ChangePasswordPanel'
import ConfirmSaveModal from './ConfirmSaveModal'
import ProfileDetailsSection from './ProfileDetailsSection'
import {
  createProfileForm,
  emptyProfileForm,
  getErrorMessage,
  normalizeProfileDate,
  type ProfileForm,
} from './profilePageUtils'

function ProfilePage() {
  const storedUser = getStoredUser()
  const isAdminProfile = isAdminRole(storedUser?.role)
  const sidebarItems = isAdminProfile ? adminNavItems : userNavItems
  const [profileForm, setProfileForm] = useState<ProfileForm>(() => ({
    ...emptyProfileForm,
    alternativePhone: storedUser?.alternativePhone ?? '',
    dateOfBirth: normalizeProfileDate(storedUser?.dateOfBirth),
    email: storedUser?.email ?? '',
    gender: storedUser?.gender ?? '',
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
    alternativePhone:
      savedProfileForm?.alternativePhone ??
      profile?.alternativePhone ??
      storedUser?.alternativePhone ??
      '',
    avatar: savedProfileForm?.avatar ?? profile?.avatar ?? '',
    city: savedProfileForm?.city ?? profile?.city ?? '',
    dateOfBirth:
      savedProfileForm?.dateOfBirth ??
      profile?.dateOfBirth ??
      storedUser?.dateOfBirth ??
      '',
    email: savedProfileForm?.email ?? profile?.email ?? storedUser?.email ?? '',
    gender:
      savedProfileForm?.gender ?? profile?.gender ?? storedUser?.gender ?? '',
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
      alternativePhone: profileForm.alternativePhone.trim() || undefined,
      avatar,
      city: profileForm.city.trim() || undefined,
      dateOfBirth: profileForm.dateOfBirth || undefined,
      gender: profileForm.gender || undefined,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim() || undefined,
      postalCode: profileForm.postalCode.trim() || undefined,
    }

    try {
      const updatedProfile = await updateMyProfile(payload).unwrap()

      if (updatedProfile) {
        const nextProfileForm: ProfileForm = {
          address: updatedProfile.address ?? '',
          alternativePhone: updatedProfile.alternativePhone ?? '',
          avatar: updatedProfile.avatar ?? '',
          avatarFile: null,
          city: updatedProfile.city ?? '',
          dateOfBirth: updatedProfile.dateOfBirth ?? '',
          email: updatedProfile.email ?? profileForm.email,
          gender: updatedProfile.gender ?? '',
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
      toast.success('Profile details saved successfully.')
    } catch (caughtError) {
      const message = getErrorMessage(caughtError)
      setError(message)
      toast.error(message)
    }
  }

  const isFormChanged =
    profileForm.name !== loadedProfileForm.name ||
    profileForm.phone !== loadedProfileForm.phone ||
    profileForm.alternativePhone !== loadedProfileForm.alternativePhone ||
    profileForm.dateOfBirth !== loadedProfileForm.dateOfBirth ||
    profileForm.gender !== loadedProfileForm.gender ||
    Boolean(profileForm.avatarFile)

  return (
    <DashboardLayout
      actions={[
        isAdminProfile
          ? { label: 'Back to dashboard', to: '/dashboard' }
          : { label: 'Back to orders', to: '/dashboard/orders' },
      ]}
      eyebrow="Account profile"
      helperText={
        isAdminProfile
          ? 'Keep admin contact details current for marketplace operations.'
          : 'Keep profile details current for account updates and checkout.'
      }
      layoutVariant={isAdminProfile ? 'admin' : 'customer'}
      sidebarItems={sidebarItems}
      subtitle={
        isAdminProfile
          ? 'Manage admin profile and contact information.'
          : 'Manage profile details, contact information, and profile photo.'
      }
      title="My profile"
      workspaceLabel={
        isAdminProfile ? 'Marketplace studio' : 'Collector account'
      }
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

      <div className="grid gap-6 xl:grid-cols-[1fr_0.48fr]">
        <div className="grid gap-6">
          <ProfileDetailsSection
            fieldClass={fieldClass}
            isEditing={isEditing}
            isFormChanged={isFormChanged}
            isSaving={isSaving}
            onCancelEdit={() => setIsEditing(false)}
            onFieldChange={updateField}
            onRequestSave={handleRequestSave}
            onStartEditing={handleStartEditing}
            profileForm={visibleProfileForm}
            readonlyClass={readonlyClass}
            savedAvatar={loadedProfileForm.avatar}
          />

          <ChangePasswordPanel />
        </div>

        <AccountSummaryCard
          error={error}
          profileForm={visibleProfileForm}
          status={status}
        />
      </div>

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
