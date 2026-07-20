import { Star } from 'lucide-react'

import type { Review } from '../../../features/reviews/reviewApi'

export type ReviewVisibilityFilter = 'all' | 'hidden' | 'visible'

export type AdminReviewMessage = {
  text: string
  type: 'error' | 'success'
}

export type ReviewConfirmTarget = {
  review: Review
  type: 'delete' | 'visibility'
}

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

export function getReviewProductName(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return 'Product'
  }

  return review.product.name ?? 'Product'
}

export function getReviewUserName(review: Review) {
  if (!review.user || typeof review.user === 'string') {
    return 'User'
  }

  return review.user.name || review.user.email || 'User'
}

export function getReviewUserEmail(review: Review) {
  if (!review.user || typeof review.user === 'string') {
    return ''
  }

  return review.user.email ?? ''
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

export function matchesSearch(review: Review, term: string) {
  const normalized = term.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [
    review.comment,
    getReviewProductName(review),
    getReviewUserName(review),
    getReviewUserEmail(review),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalized))
}
