export type ProfileForm = {
  address: string
  avatar: string
  city: string
  email: string
  name: string
  phone: string
  postalCode: string
}

export const emptyProfileForm: ProfileForm = {
  address: '',
  avatar: '',
  city: '',
  email: '',
  name: '',
  phone: '',
  postalCode: '',
}

export function createProfileForm(profile: Partial<ProfileForm>): ProfileForm {
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
