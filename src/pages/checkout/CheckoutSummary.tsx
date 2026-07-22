import { useState } from 'react'
import type { CartItem } from '../../features/cart/cartSlice'
import { useGetActivePromoQuery } from '../../features/promo/promoApi'
import { formatPrice, getAssetUrl } from '../../utils/productDisplay'
import { Ticket, Check } from 'lucide-react'

type CheckoutSummaryProps = {
  cartItems: CartItem[]
  subtotal: number
}

function CheckoutSummary({ cartItems, subtotal }: CheckoutSummaryProps) {
  const { data: promo } = useGetActivePromoQuery()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null)
  const [couponError, setCouponError] = useState('')

  // 1. Automatic Site-Wide Flash Discount
  const autoDiscountPercent = (promo && promo.isActive && promo.enableAutoDiscount !== false)
    ? (promo.autoDiscountPercent ?? promo.discountPercent ?? 10)
    : 0

  const autoDiscountAmount = Math.round((subtotal * autoDiscountPercent) / 100)
  const priceAfterAutoDiscount = Math.max(0, subtotal - autoDiscountAmount)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')

    if (!couponCode.trim()) return

    const validVoucherCode = promo?.voucherCode || promo?.code
    const validVoucherPercent = promo?.voucherDiscountPercent ?? promo?.discountPercent ?? 15

    if (
      promo &&
      promo.isActive &&
      promo.enableVoucher !== false &&
      validVoucherCode &&
      validVoucherCode.toUpperCase() === couponCode.trim().toUpperCase()
    ) {
      setAppliedCoupon({
        code: validVoucherCode,
        percent: validVoucherPercent,
      })
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  // 2. Voucher Coupon Discount (Calculated on top)
  const couponDiscountAmount = appliedCoupon
    ? Math.round((priceAfterAutoDiscount * appliedCoupon.percent) / 100)
    : 0

  const finalTotal = Math.max(0, priceAfterAutoDiscount - couponDiscountAmount)

  return (
    <aside className="border border-black/10 bg-[#181512] p-5 text-white lg:sticky lg:top-28">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
        Cart summary
      </p>
      <h2 className="mt-3 text-3xl font-bold">Your craft box</h2>

      <div className="mt-5 grid gap-4">
        {cartItems.length ? (
          cartItems.map((item) => {
            const imageUrl = getAssetUrl(item.image)

            return (
              <article
                className="grid grid-cols-[64px_1fr] gap-3 border-t border-white/10 pt-4"
                key={item.id}
              >
                <div className="h-16 overflow-hidden bg-white/10">
                  {imageUrl ? (
                    <img
                      alt={item.name}
                      className="h-full w-full object-cover"
                      src={imageUrl}
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-bold">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-white/62">
                    Qty {item.quantity}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#f1c9a6]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </article>
            )
          })
        ) : (
          <div className="border-t border-white/10 pt-5 text-sm text-white/70">
            Cart empty. Add products before checkout.
          </div>
        )}
      </div>

      {/* Coupon Code Input */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#f1c9a6] mb-2">
          Promo / Voucher Coupon
        </label>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 p-2.5 text-xs text-emerald-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Coupon '{appliedCoupon.code}' Applied ({appliedCoupon.percent}% OFF)
            </span>
            <button
              onClick={() => setAppliedCoupon(null)}
              className="text-white/60 hover:text-white underline text-[11px]"
              type="button"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter Code (e.g. ARTISANE10)"
                className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#f1c9a6] focus:outline-none uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1 bg-[#8f3f1d] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#a64b23]"
            >
              <Ticket className="h-3.5 w-3.5" />
              Apply
            </button>
          </form>
        )}
        {couponError && (
          <p className="mt-1 text-[11px] text-red-400 font-medium">{couponError}</p>
        )}
      </div>

      <div className="mt-5 border-t border-white/10 pt-5 space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs text-white/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {autoDiscountAmount > 0 ? (
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-2">
            <span>Site-Wide Flash Deal ({autoDiscountPercent}% OFF)</span>
            <span>-{formatPrice(autoDiscountAmount)}</span>
          </div>
        ) : null}

        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-2">
            <span>Coupon Voucher '{appliedCoupon.code}' ({appliedCoupon.percent}% OFF)</span>
            <span>-{formatPrice(couponDiscountAmount)}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 text-sm font-bold border-t border-white/10 pt-3">
          <span>Total Payable</span>
          <span className="text-2xl text-[#f1c9a6]">{formatPrice(finalTotal)}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/62">
          Final total, stock, and order status are confirmed by server.
        </p>
      </div>
    </aside>
  )
}

export default CheckoutSummary
