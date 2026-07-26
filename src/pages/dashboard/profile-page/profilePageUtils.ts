import type { ProfileGender } from '../../../features/auth/authApi'

export type ProfileGenderInput = '' | ProfileGender

export type ProfileForm = {
  address: string
  alternativePhone: string
  avatar: string
  avatarFile: File | null
  city: string
  dateOfBirth: string
  email: string
  gender: ProfileGenderInput
  name: string
  phone: string
  postalCode: string
}

export const emptyProfileForm: ProfileForm = {
  address: '',
  alternativePhone: '',
  avatar: '',
  avatarFile: null,
  city: '',
  dateOfBirth: '',
  email: '',
  gender: '',
  name: '',
  phone: '',
  postalCode: '',
}

export function createProfileForm(profile: Partial<ProfileForm>): ProfileForm {
  return {
    address: profile.address ?? '',
    alternativePhone: profile.alternativePhone ?? '',
    avatar: profile.avatar ?? '',
    avatarFile: null,
    city: profile.city ?? '',
    dateOfBirth: normalizeProfileDate(profile.dateOfBirth),
    email: profile.email ?? '',
    gender: profile.gender ?? '',
    name: profile.name ?? '',
    phone: profile.phone ?? '',
    postalCode: profile.postalCode ?? '',
  }
}

export const genderOptions: Array<{
  label: string
  value: ProfileGenderInput
}> = [
  { label: 'Select gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
]

export function getGenderLabel(value: ProfileGenderInput | undefined) {
  if (!value) {
    return 'Not added'
  }

  return genderOptions.find((option) => option.value === value)?.label ?? 'Not added'
}

export function normalizeProfileDate(value?: string) {
  if (!value) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.toISOString().slice(0, 10)
}

export function getReadableValue(value: string | undefined) {
  return value?.trim() || 'Not added'
}

export function getErrorMessage(error: unknown) {
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
