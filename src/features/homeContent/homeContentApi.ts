import { baseApi } from '../../redux/api/baseApi'

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T | null
}

export type HomeHeroSlide = {
  _id?: string
  eyebrow: string
  title: string
  description: string
  image?: string
  imageAlt: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  isActive: boolean
  sortOrder: number
}

export type HomeHeroContent = {
  _id?: string
  isActive: boolean
  autoplaySeconds: number
  fadeMs: number
  slides: HomeHeroSlide[]
  createdAt?: string
  updatedAt?: string
}

export type UpdateHomeHeroSlidePayload = Omit<HomeHeroSlide, '_id'> & {
  _id?: string
}

export type UpdateHomeHeroPayload = {
  isActive: boolean
  autoplaySeconds: number
  fadeMs: number
  slides: UpdateHomeHeroSlidePayload[]
  imageFiles?: Record<number, File | undefined>
}

function createHomeHeroFormData(payload: UpdateHomeHeroPayload) {
  const formData = new FormData()
  const { imageFiles, ...hero } = payload

  formData.append('hero', JSON.stringify(hero))

  Object.entries(imageFiles ?? {}).forEach(([index, file]) => {
    if (file) {
      formData.append(`slideImage-${index}`, file)
    }
  })

  return formData
}

export const homeContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeHero: builder.query<HomeHeroContent | null, void>({
      providesTags: ['HomeContent'],
      query: () => '/home-content/hero',
      transformResponse: (response: ApiResponse<HomeHeroContent | null>) =>
        response.data,
    }),
    updateHomeHero: builder.mutation<HomeHeroContent, UpdateHomeHeroPayload>({
      invalidatesTags: ['HomeContent'],
      query: (payload) => ({
        body: createHomeHeroFormData(payload),
        method: 'PATCH',
        url: '/home-content/hero',
      }),
      transformResponse: (response: ApiResponse<HomeHeroContent>) =>
        response.data!,
    }),
  }),
})

export const { useGetHomeHeroQuery, useUpdateHomeHeroMutation } =
  homeContentApi
