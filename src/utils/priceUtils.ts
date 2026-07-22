import type { PromoBannerData } from '../features/promo/promoApi'

export type PriceInfo = {
  originalPrice: number
  finalPrice: number
  discountAmount: number
  discountPercent: number
  hasDiscount: boolean
}

export function getProductPriceInfo(
  originalPrice: number,
  promo?: PromoBannerData | null,
): PriceInfo {
  if (
    !promo ||
    !promo.isActive ||
    !promo.discountPercent ||
    promo.discountPercent <= 0
  ) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      hasDiscount: false,
    }
  }

  // Check if promo has expired
  if (promo.endsAt && new Date(promo.endsAt).getTime() <= Date.now()) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      hasDiscount: false,
    }
  }

  const discountPercent = Math.min(Math.max(promo.discountPercent, 0), 100)
  const discountAmount = Math.round((originalPrice * discountPercent) / 100)
  const finalPrice = Math.max(0, originalPrice - discountAmount)

  return {
    originalPrice,
    finalPrice,
    discountAmount,
    discountPercent,
    hasDiscount: discountPercent > 0,
  }
}
