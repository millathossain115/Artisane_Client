import { Star } from 'lucide-react'

import type { Review } from '../../../features/reviews/reviewApi'
import { getAssetUrl } from '../../../utils/productDisplay'

export type UserReviewMessage = {
  text: string
  type: 'error' | 'success'
}

export type ReviewDraft = {
  comment: string
  rating: number
}

export type ReviewMode = 'my-reviews' | 'to-review'

export function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    data?: {
      errorSources?: { message: string }[]
      message?: string
    }
    message?: string
  }

  return (
    apiError.data?.errorSources?.[0]?.message ??
    apiError.data?.message ??
    apiError.message ??
    fallback
  )
}

export function clampRating(value: number) {
  return Math.min(5, Math.max(1, value))
}

export function getReviewProductName(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return 'Product'
  }

  return review.product.name ?? 'Product'
}

export function getReviewProductCategory(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return 'Product'
  }

  return typeof review.product.category === 'string'
    ? 'Product'
    : review.product.category?.name ?? 'Product'
}

export function getReviewProductImage(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return ''
  }

  return getAssetUrl(review.product.images?.[0])
}

export function renderStars(value: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      className={`h-4 w-4 ${
        index < value ? 'fill-[#7a3f1d] text-[#7a3f1d]' : 'text-[#d2c5b5]'
      }`}
      key={index}
    />
  ))
}
