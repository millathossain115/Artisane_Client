import { useEffect, useState } from 'react'
import { ArrowRight, Check, Copy, Flame, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetActivePromoQuery } from '../../features/promo/promoApi'

function calculateTimeLeft(endsAt?: string) {
  if (!endsAt) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }

  const difference = new Date(endsAt).getTime() - new Date().getTime()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  }
}

function FlashDealModal() {
  const { data: promo, isLoading } = useGetActivePromoQuery()
  const [isDismissed, setIsDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  // Derive initial validity
  const isPromoValid = Boolean(
    promo &&
    promo.isActive &&
    promo.enableAutoDiscount !== false &&
    promo.endsAt
  )

  const isAlreadyDismissed = Boolean(
    promo?._id && sessionStorage.getItem(`promo_dismissed_${promo._id}`) === 'true'
  )

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(promo?.endsAt))

  useEffect(() => {
    if (!promo?.endsAt) return

    const timer = setInterval(() => {
      const nextTime = calculateTimeLeft(promo.endsAt)
      setTimeLeft(nextTime)
      if (nextTime.isExpired) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [promo?.endsAt])

  if (
    isLoading ||
    !isPromoValid ||
    isDismissed ||
    isAlreadyDismissed ||
    timeLeft.isExpired
  ) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (promo?._id) {
      sessionStorage.setItem(`promo_dismissed_${promo._id}`, 'true')
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={handleDismiss}
      />

      {/* Artisane Styled Modal */}
      <div className="relative w-full max-w-md border border-black/10 bg-[#f6f0e5] p-6 text-[#181512] shadow-2xl">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-black/10 bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
          onClick={handleDismiss}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon Badge */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#8f3f1d] text-white">
          <Flame className="h-6 w-6" />
        </div>

        {/* Header Text */}
        <div className="mt-4 text-center">
          <span className="inline-block bg-[#8f3f1d] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Flash Deal
          </span>
          <h2 className="mt-2 text-2xl font-bold text-[#181512]">
            {promo.title}
          </h2>
          {promo.description && (
            <p className="mt-2 text-xs text-[#6b5f53] leading-relaxed">
              {promo.description}
            </p>
          )}
        </div>

        {/* Minimal Timer Grid */}
        <div className="mt-5 flex items-center justify-center gap-2 border border-black/10 bg-white p-3">
          <div className="text-center min-w-10">
            <span className="block text-lg font-bold text-[#181512]">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-semibold text-[#6b5f53] uppercase">
              Days
            </span>
          </div>
          <span className="font-bold text-[#8f3f1d]">:</span>
          <div className="text-center min-w-10">
            <span className="block text-lg font-bold text-[#181512]">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-semibold text-[#6b5f53] uppercase">
              Hrs
            </span>
          </div>
          <span className="font-bold text-[#8f3f1d]">:</span>
          <div className="text-center min-w-10">
            <span className="block text-lg font-bold text-[#181512]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-semibold text-[#6b5f53] uppercase">
              Min
            </span>
          </div>
          <span className="font-bold text-[#8f3f1d]">:</span>
          <div className="text-center min-w-10">
            <span className="block text-lg font-bold text-[#181512]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-semibold text-[#6b5f53] uppercase">
              Sec
            </span>
          </div>
        </div>

        {/* Promo Code Box */}
        {promo.enableVoucher !== false && promo.code && (
          <div className="mt-4 flex items-center justify-between gap-2 border border-dashed border-[#8f3f1d]/40 bg-[#f8f3ea] p-3">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-[#6b5f53]">
                Promo Code
              </span>
              <code className="text-base font-bold tracking-widest text-[#7a3f1d]">
                {promo.code}
              </code>
            </div>
            <button
              className="inline-flex items-center gap-1.5 border border-[#181512] bg-[#181512] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#7a3f1d]"
              onClick={handleCopyCode}
              type="button"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
        )}

        {/* CTA Actions */}
        <div className="mt-5 flex flex-col gap-2">
          {promo.buttonLink && (
            <Link
              className="flex items-center justify-center gap-2 bg-[#8f3f1d] py-3 text-center text-xs font-bold text-white transition hover:bg-[#181512]"
              onClick={handleDismiss}
              to={promo.buttonLink}
            >
              {promo.buttonText || 'Shop Offer'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            className="py-1 text-center text-xs font-semibold text-[#6b5f53] hover:text-[#181512]"
            onClick={handleDismiss}
            type="button"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlashDealModal
