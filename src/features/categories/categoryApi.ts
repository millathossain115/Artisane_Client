import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errorSources?: { path: string; message: string }[]
}

export type Category = {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export type CategoryPayload = {
  name: string
  slug: string
  description?: string
  image?: File
}

export type UpdateCategoryPayload = Partial<CategoryPayload> & {
  id: string
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

  return formData
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
    getCategories: builder.query<Category[], void>({
      providesTags: ['Category'],
      query: () => '/categories',
      transformResponse: (response: ApiResponse<Category[]>) =>
        response.data ?? [],
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
