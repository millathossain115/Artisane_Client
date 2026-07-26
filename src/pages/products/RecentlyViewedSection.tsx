import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import RecentShelfCard from './RecentShelfCard'
import type { RecentProduct } from './recentProducts'

type RecentlyViewedSectionProps = {
  actionLabel?: string
  actionTo?: string
  products: RecentProduct[]
}

function RecentlyViewedSection({
  actionLabel = 'Explore more',
  actionTo = '/products',
  products,
}: RecentlyViewedSectionProps) {
  if (!products.length) {
    return null
  }

  return (
    <section className="bg-[#181512] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
              Recently viewed
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Pick up where you left off
            </h2>
          </div>
          <Link
            className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1c9a6]"
            to={actionTo}
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {products.slice(0, 5).map((item, index) => (
            <RecentShelfCard
              key={item.id ? `${item.id}-${index}` : index}
              product={item}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewedSection
