import { baseApi } from '../../redux/api/baseApi'
import { saveStoredUser, type AuthUser } from './authApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errorSources?: { path: string; message: string }[]
}

export type UserProfile = AuthUser & {
  address?: string
  avatar?: string
  city?: string
  postalCode?: string
}

export type UpdateProfilePayload = {
  address?: string
  avatar?: File | string
  city?: string
  name: string
  phone?: string
  postalCode?: string
}

function createProfileFormData(payload: UpdateProfilePayload) {
  const formData = new FormData()

  formData.append('name', payload.name)

  if (payload.address !== undefined) {
    formData.append('address', payload.address)
  }

  if (payload.avatar !== undefined) {
    formData.append('avatar', payload.avatar)
  }

  if (payload.city !== undefined) {
    formData.append('city', payload.city)
  }

  if (payload.phone !== undefined) {
    formData.append('phone', payload.phone)
  }

  if (payload.postalCode !== undefined) {
    formData.append('postalCode', payload.postalCode)
  }

  return formData
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserProfile | null, void>({
      providesTags: ['Auth'],
      query: () => ({
        method: 'GET',
        url: '/auth/me',
      }),
      transformResponse: (response: ApiResponse<UserProfile>) =>
        response.data ?? null,
    }),
    updateMyProfile: builder.mutation<UserProfile | null, UpdateProfilePayload>(
      {
        invalidatesTags: ['Auth', 'Dashboard'],
        query: (payload) => ({
          body: createProfileFormData(payload),
          method: 'PATCH',
          url: '/auth/me',
        }),
        transformResponse: (response: ApiResponse<UserProfile>) => {
          if (response.data) {
            saveStoredUser(response.data)
          }

          return response.data ?? null
        },
      },
    ),
  }),
})

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = profileApi
