import type { UserRole, UserStatus } from '../../../features/users/userApi'

export const PAGE_SIZE_OPTIONS = [5, 10, 20]

export type UserEditForm = {
  address: string
  city: string
  email: string
  name: string
  phone: string
  postalCode: string
  role: UserRole
  status: UserStatus
}

export function getEmptyEditForm(): UserEditForm {
  return {
    address: '',
    city: '',
    email: '',
    name: '',
    phone: '',
    postalCode: '',
    role: 'user',
    status: 'active',
  }
}

export function formatDate(value?: string) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (!parts.length) {
    return 'U'
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function formatRole(role?: UserRole) {
  return role === 'admin' ? 'Admin' : 'User'
}

export function formatStatus(status?: UserStatus) {
  return status === 'blocked' ? 'Blocked' : 'Active'
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback
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

  return fallback
}
