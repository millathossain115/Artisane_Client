import type { PromoBannerData } from '../../../features/promo/promoApi'

export type PromoBannerFormState = {
  autoDiscountPercent: number
  buttonLink: string
  buttonText: string
  description: string
  enableAutoDiscount: boolean
  enableVoucher: boolean
  endsAt: string
  isActive: boolean
  title: string
  voucherButtonLink: string
  voucherButtonText: string
  voucherCode: string
  voucherDescription: string
  voucherDiscountPercent: number
  voucherEndsAt: string
  voucherTitle: string
}

export type PromoBannerMessage = {
  text: string
  type: 'success' | 'error'
}

export const PRESET_REDIRECT_OPTIONS = [
  { label: 'Shop Catalog (/products)', value: '/products' },
  { label: 'Categories Page (/categories)', value: '/categories' },
  { label: 'Main Store Front (/shop)', value: '/shop' },
  { label: 'Checkout Page (/checkout)', value: '/checkout' },
  { label: 'Custom URL Path...', value: 'custom' },
]

export const fieldClass =
  'w-full border border-black/10 bg-[#fbf8f3] px-3.5 py-2.5 text-sm font-medium transition focus:border-[#8f3f1d] focus:bg-white focus:outline-none'

export function getDefaultEndDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16)
}

export function getInitialPromoFormState(
  promo?: PromoBannerData | null,
): PromoBannerFormState {
  return {
    isActive: promo?.isActive ?? true,

    enableAutoDiscount: promo?.enableAutoDiscount ?? true,
    title: promo?.title || 'Special Store-Wide Flash Deal',
    description:
      promo?.description ||
      'Limited time automatic store discount applied on all crafts',
    autoDiscountPercent:
      promo?.autoDiscountPercent ?? promo?.discountPercent ?? 10,
    endsAt: promo?.endsAt
      ? new Date(promo.endsAt).toISOString().slice(0, 16)
      : getDefaultEndDate(),
    buttonText: promo?.buttonText || 'Shop Starter Kits',
    buttonLink: promo?.buttonLink || '/products',

    enableVoucher: promo?.enableVoucher ?? true,
    voucherTitle: promo?.voucherTitle || 'Exclusive Customer Coupon',
    voucherDescription:
      promo?.voucherDescription ||
      'Apply voucher code at checkout to claim extra savings',
    voucherCode: promo?.voucherCode || promo?.code || 'ARTISANE10',
    voucherDiscountPercent: promo?.voucherDiscountPercent ?? 15,
    voucherEndsAt: promo?.voucherEndsAt
      ? new Date(promo.voucherEndsAt).toISOString().slice(0, 16)
      : promo?.endsAt
        ? new Date(promo.endsAt).toISOString().slice(0, 16)
        : getDefaultEndDate(),
    voucherButtonText: promo?.voucherButtonText || 'Claim Voucher',
    voucherButtonLink: promo?.voucherButtonLink || '/products',
  }
}

export function getLoadedPromoFormState(
  promo: PromoBannerData,
): PromoBannerFormState {
  return {
    isActive: promo.isActive ?? true,

    enableAutoDiscount: promo.enableAutoDiscount ?? true,
    title: promo.title || 'Special Store-Wide Flash Deal',
    description: promo.description || '',
    autoDiscountPercent:
      promo.autoDiscountPercent ?? promo.discountPercent ?? 10,
    endsAt: promo.endsAt
      ? new Date(promo.endsAt).toISOString().slice(0, 16)
      : promo.flashSaleEndsAt
        ? new Date(promo.flashSaleEndsAt).toISOString().slice(0, 16)
        : getDefaultEndDate(),
    buttonText: promo.buttonText || 'Shop Starter Kits',
    buttonLink: promo.buttonLink || '/products',

    enableVoucher: promo.enableVoucher ?? true,
    voucherTitle: promo.voucherTitle || 'Exclusive Customer Coupon',
    voucherDescription: promo.voucherDescription || '',
    voucherCode: promo.voucherCode || promo.code || 'ARTISANE10',
    voucherDiscountPercent: promo.voucherDiscountPercent ?? 15,
    voucherEndsAt: promo.voucherEndsAt
      ? new Date(promo.voucherEndsAt).toISOString().slice(0, 16)
      : getDefaultEndDate(),
    voucherButtonText: promo.voucherButtonText || 'Claim Voucher',
    voucherButtonLink: promo.voucherButtonLink || '/products',
  }
}

export function getPromoErrorMessage(err: unknown) {
  return err && typeof err === 'object' && 'data' in err
    ? (err as { data?: { message?: string } }).data?.message ||
        'Failed to update promo banner'
    : 'Failed to update promo banner'
}
