import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: UserListMeta
  errorSources?: { path: string; message: string }[]
}

export type UserRole = 'admin' | 'user'
export type UserStatus = 'active' | 'blocked'

export type AdminUser = {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  avatar?: string
  role?: UserRole
  status?: UserStatus
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export type UserListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type UserListResult = {
  data: AdminUser[]
  meta: UserListMeta
}

export type UserStats = {
  totalUsers: number
  totalAdmins: number
  totalCustomers: number
  activeUsers: number
  blockedUsers: number
  roleSummary?: { _id: UserRole; count: number }[]
  statusSummary?: { _id: UserStatus; count: number }[]
}

export type UserQueryParams = {
  city?: string
  hasPhone?: boolean
  limit?: number
  page?: number
  role?: UserRole
  searchTerm?: string
  sortBy?: 'email' | 'name' | 'newest'
  sortOrder?: 'asc' | 'desc'
  status?: UserStatus
}

export type UserPayload = {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  avatar?: string
  role?: UserRole
  status?: UserStatus
}

export type UpdateUserPayload = UserPayload & {
  id: string
}

function createUserParams(params?: UserQueryParams | void) {
  if (!params) {
    return undefined
  }

  const searchParams: Record<string, boolean | number | string> = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams[key] = value
    }
  })

  return searchParams
}

function createUserListResult(
  response: ApiResponse<AdminUser[]>,
  params?: UserQueryParams | void,
): UserListResult {
  const data = response.data ?? []
  const page = (params && params.page) ?? 1
  const limit = (params && params.limit) ?? data.length
  const total = response.meta?.total ?? data.length
  const totalPage =
    response.meta?.totalPage ?? Math.max(1, Math.ceil(total / (limit || 1)))

  return {
    data,
    meta: {
      limit: response.meta?.limit ?? limit,
      page: response.meta?.page ?? page,
      total,
      totalPage,
    },
  }
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      invalidatesTags: ['User', 'Dashboard'],
      query: (id) => ({
        method: 'DELETE',
        url: `/users/${id}`,
      }),
    }),
    getUserStats: builder.query<UserStats, UserQueryParams | void>({
      providesTags: ['User'],
      query: (params) => ({
        params: createUserParams(params ?? undefined),
        url: '/users/stats',
      }),
      transformResponse: (response: ApiResponse<UserStats>) =>
        response.data ?? {
          activeUsers: 0,
          blockedUsers: 0,
          totalAdmins: 0,
          totalCustomers: 0,
          totalUsers: 0,
        },
    }),
    getUsers: builder.query<UserListResult, UserQueryParams | void>({
      providesTags: ['User'],
      query: (params) => ({
        params: createUserParams(params ?? undefined),
        url: '/users',
      }),
      transformResponse: (
        response: ApiResponse<AdminUser[]>,
        _meta,
        params,
      ) => createUserListResult(response, params ?? undefined),
    }),
    updateUser: builder.mutation<AdminUser | null, UpdateUserPayload>({
      invalidatesTags: (_result, _error, { id }) => [
        'User',
        'Dashboard',
        { id, type: 'User' },
      ],
      query: ({ id, ...payload }) => ({
        body: payload,
        method: 'PATCH',
        url: `/users/${id}`,
      }),
      transformResponse: (response: ApiResponse<AdminUser>) =>
        response.data ?? null,
    }),
  }),
})

export const {
  useDeleteUserMutation,
  useGetUserStatsQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userApi
