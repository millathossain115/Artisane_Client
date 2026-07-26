import {
  CircleHelp,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react'

const trustItems = [
  {
    icon: CreditCard,
    title: 'Secure payment',
  },
  {
    icon: Truck,
    title: 'Fast delivery',
  },
  {
    icon: RotateCcw,
    title: 'Easy returns',
  },
  {
    icon: CircleHelp,
    title: 'Support',
  },
  {
    icon: ShieldCheck,
    title: 'Authentic craft',
  },
]

function HomeTrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="bg-[#181512] grid grid-cols-1 px-4 py-2 sm:grid-cols-3 sm:py-4 lg:grid-cols-5 lg:px-8">
        {trustItems.map((item, index) => {
          const Icon = item.icon
          const hasDivider = index !== 0

          return (
            <div
              className={`flex min-w-0 items-center justify-center gap-3 px-3 py-3 text-center sm:flex-col sm:gap-2 sm:px-2 sm:py-2 ${
                hasDivider
                  ? 'border-t border-white/10 sm:border-t-0 sm:border-l'
                  : ''
              }`}
              key={item.title}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center text-[#caa66a] sm:h-8 sm:w-8">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <h2 className="max-w-full text-xs font-bold leading-tight text-white sm:text-xs lg:text-sm">
                {item.title}
              </h2>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HomeTrustStrip
