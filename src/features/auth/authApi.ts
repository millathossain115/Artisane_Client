import { API_BASE_URL } from '../../config/api'

const AUTH_BASE_URL = `${API_BASE_URL}/auth`

const ACCESS_TOKEN_KEY = 'artisane_access_token'
const REFRESH_TOKEN_KEY = 'artisane_refresh_token'
const USER_KEY = 'artisane_user'

export type AuthUser = {
  _id: string
  name: string
  email: string
  phone?: string
  profileImage?: string
  avatar?: string
  role: 'admin' | 'user'
}

export type AuthData = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errorSources?: { path: string; message: string }[]
}

export type LoginPayload = {
  email: string
  password: string
}

export type GoogleLoginPayload = {
  credential: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  phone: string
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const result = (await response.json()) as ApiResponse<T>

  if (!response.ok || !result.success) {
    const detail = result.errorSources?.[0]?.message
    throw new Error(detail ?? result.message ?? 'Request failed')
  }

  return result
}

export async function login(payload: LoginPayload) {
  return request<AuthData>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginWithGoogle(payload: GoogleLoginPayload) {
  return request<AuthData>('/google', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function register(payload: RegisterPayload) {
  return request<AuthData>('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getCurrentUser(accessToken: string) {
  return request<AuthUser>('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export function saveAuthSession(authData: AuthData) {
  localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(authData.user))
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user) as AuthUser
  } catch {
    return null
  }
}

export function saveStoredUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
