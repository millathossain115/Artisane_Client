import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  meta?: CategoryListMeta
  errorSources?: { path: string; message: string }[]
}

export type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive?: boolean
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export type CategoryPayload = {
  name: string
  slug: string
  description?: string
  image?: File
  isActive?: boolean
}

export type UpdateCategoryPayload = Partial<CategoryPayload> & {
  id: string
}

export type CategoryListMeta = {
  limit: number
  page: number
  total: number
  totalPage: number
}

export type CategoryListResult = {
  data: Category[]
  meta: CategoryListMeta
}

export type CategoryQueryParams = {
  hasImage?: boolean
  limit?: number
  page?: number
  searchTerm?: string
  slug?: string
  sortBy?: 'createdAt' | 'name' | 'slug' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

function createCategoryFormData(payload: Partial<CategoryPayload>) {
  const formData = new FormData()

  if (payload.name) {
    formData.append('name', payload.name)
  }

  if (payload.slug) {
    formData.append('slug', payload.slug)
  }

  if (payload.description) {
    formData.append('description', payload.description)
  }

  if (payload.image) {
    formData.append('image', payload.image)
  }

  if (payload.isActive !== undefined) {
    formData.append('isActive', String(payload.isActive))
  }

  return formData
}

function createCategoryParams(params?: CategoryQueryParams) {
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

function createCategoryListResult(
  response: ApiResponse<Category[]>,
  params?: CategoryQueryParams,
): CategoryListResult {
  const data = response.data ?? []
  const page = params?.page ?? 1
  const limit = params?.limit ?? data.length
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

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category | null, CategoryPayload>({
      invalidatesTags: ['Category'],
      query: (payload) => ({
        body: createCategoryFormData(payload),
        method: 'POST',
        url: '/categories/create-category',
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        response.data ?? null,
    }),
    deleteCategory: builder.mutation<ApiResponse<null>, string>({
      invalidatesTags: ['Category'],
      query: (id) => ({
        method: 'DELETE',
        url: `/categories/${id}`,
      }),
    }),
    getCategories: builder.query<CategoryListResult, CategoryQueryParams | void>({
      providesTags: ['Category'],
      query: (params) => ({
        params: createCategoryParams(params ?? undefined),
        url: '/categories',
      }),
      transformResponse: (
        response: ApiResponse<Category[]>,
        _meta,
        params,
      ) => createCategoryListResult(response, params ?? undefined),
    }),
    getCategoryById: builder.query<Category | null, string>({
      providesTags: (_result, _error, id) => [{ id, type: 'Category' }],
      query: (id) => `/categories/${id}`,
      transformResponse: (response: ApiResponse<Category>) =>
        response.data ?? null,
    }),
    updateCategory: builder.mutation<Category | null, UpdateCategoryPayload>({
      invalidatesTags: (_result, _error, { id }) => [
        'Category',
        { id, type: 'Category' },
      ],
      query: ({ id, ...payload }) => ({
        body: createCategoryFormData(payload),
        method: 'PATCH',
        url: `/categories/${id}`,
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        response.data ?? null,
    }),
  }),
})

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} = categoryApi
