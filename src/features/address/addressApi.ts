import { API_BASE_URL } from '../../config/api'
import { getAuthHeader } from '../auth/authApi'

export type UserAddress = {
  _id: string
  user: string
  label: string
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  districtId?: string
  districtName?: string
  zoneId?: string
  zoneName?: string
  postalCode?: string
  country?: string
  isDefault: boolean
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

const ADDRESS_BASE_URL = `${API_BASE_URL}/addresses`

export async function fetchMyAddresses(): Promise<UserAddress[]> {
  const response = await fetch(`${ADDRESS_BASE_URL}/my-addresses`, {
    headers: {
      ...getAuthHeader(),
    },
  })

  const payload: ApiResponse<UserAddress[]> = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Failed to load addresses')
  }

  return payload.data
}

export async function createAddress(data: Omit<UserAddress, '_id' | 'user'>): Promise<UserAddress> {
  const response = await fetch(ADDRESS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })

  const payload: ApiResponse<UserAddress> = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Failed to create address')
  }

  return payload.data
}

export async function updateAddress(
  id: string,
  data: Partial<Omit<UserAddress, '_id' | 'user'>>
): Promise<UserAddress> {
  const response = await fetch(`${ADDRESS_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  })

  const payload: ApiResponse<UserAddress> = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Failed to update address')
  }

  return payload.data
}

export async function deleteAddress(id: string): Promise<void> {
  const response = await fetch(`${ADDRESS_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  })

  const payload: ApiResponse<unknown> = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Failed to delete address')
  }
}

export async function setDefaultAddress(id: string): Promise<UserAddress> {
  const response = await fetch(`${ADDRESS_BASE_URL}/${id}/set-default`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeader(),
    },
  })

  const payload: ApiResponse<UserAddress> = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Failed to set default address')
  }

  return payload.data
}
