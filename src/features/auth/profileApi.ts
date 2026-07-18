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
  avatar?: string
  city?: string
  name: string
  phone?: string
  postalCode?: string
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
        query: (body) => ({
          body,
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
