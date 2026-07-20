import type { WishlistItem } from '../../../features/wishlists/wishlistApi'

export type WishlistMessage = {
  text: string
  type: 'error' | 'success'
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

export function formatWishlistDate(value?: string) {
  if (!value) {
    return 'Recently'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getVisibleWishlistIds(items: WishlistItem[]) {
  return new Set(items.map((item) => item._id))
}
