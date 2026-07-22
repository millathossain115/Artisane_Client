import { useState } from 'react'
import { Ticket, Copy, Check } from 'lucide-react'
import { useGetActivePromoQuery } from '../../features/promo/promoApi'

function VoucherBanner() {
  const { data: promo } = useGetActivePromoQuery()
  const [copied, setCopied] = useState(false)

  const voucherCode = promo.voucherCode || promo.code
  const voucherDiscount = promo.voucherDiscountPercent ?? promo.discountPercent ?? 15

  if (!promo || !promo.isActive || promo.enableVoucher === false || !voucherCode) {
    return null
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-dashed border-[#8f3f1d]/40 bg-[#f8f3ea] p-4 text-[#181512]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#8f3f1d] text-white">
            <Ticket className="h-5 w-5" />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8f3f1d]">
              Exclusive Coupon Voucher
            </span>
            <h4 className="text-sm font-bold sm:text-base">
              Use voucher code <span className="font-mono font-black text-[#8f3f1d] bg-white px-2 py-0.5 border border-[#8f3f1d]/20">{voucherCode}</span> for an additional {voucherDiscount}% OFF at checkout!
            </h4>
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-2 bg-[#8f3f1d] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#181512]"
          type="button"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Coupon Code
            </>
          )}
        </button>
      </div>
    </section>
  )
}

export default VoucherBanner
