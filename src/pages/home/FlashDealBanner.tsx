import { useEffect, useState } from 'react'
import { Copy, Check, Flame, ArrowRight } from 'lucide-react'
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

function FlashDealBanner() {
  const { data: promo, isLoading } = useGetActivePromoQuery()
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(promo?.endsAt))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!promo?.endsAt) return

    setTimeLeft(calculateTimeLeft(promo.endsAt))
    const timer = setInterval(() => {
      const nextTime = calculateTimeLeft(promo.endsAt)
      setTimeLeft(nextTime)
      if (nextTime.isExpired) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [promo?.endsAt])

  if (isLoading || !promo || !promo.isActive || timeLeft.isExpired) {
    return null
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="border-y border-black/10 bg-[#181512] px-4 py-3.5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-[#8f3f1d] text-white">
            <Flame className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="bg-[#8f3f1d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Flash Deal
              </span>
              {promo.description && (
                <span className="hidden text-xs text-[#f1c9a6] sm:inline">
                  {promo.description}
                </span>
              )}
            </div>
            <h3 className="mt-0.5 text-base font-bold text-white sm:text-lg">
              {promo.title}
            </h3>
          </div>
        </div>

        {/* Right: Timer & Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Project styled Timer */}
          <div className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold">
            <span className="text-[#f1c9a6]">
              {String(timeLeft.days).padStart(2, '0')}d
            </span>
            <span className="text-white/40">:</span>
            <span className="text-[#f1c9a6]">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-white/40">:</span>
            <span className="text-[#f1c9a6]">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-white/40">:</span>
            <span className="text-[#f1c9a6]">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          {/* Copy Code */}
          <button
            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
            onClick={handleCopyCode}
            title="Click to copy code"
            type="button"
          >
            <span>Code:</span>
            <code className="font-bold uppercase tracking-wider text-[#f1c9a6]">
              {promo.code}
            </code>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          {/* CTA Link */}
          {promo.buttonLink && (
            <Link
              className="inline-flex items-center gap-1.5 bg-[#8f3f1d] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#a64b23]"
              to={promo.buttonLink}
            >
              {promo.buttonText || 'Shop offer'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default FlashDealBanner
