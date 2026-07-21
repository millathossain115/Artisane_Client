import RecentShelfCard from './RecentShelfCard'
import type { RecentProduct } from './recentProducts'

type RecentlyViewedSectionProps = {
  products: RecentProduct[]
}

function RecentlyViewedSection({ products }: RecentlyViewedSectionProps) {
  if (!products.length) {
    return null
  }

  return (
    <section className="bg-[#181512] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f1c9a6]">
          Recently viewed
        </p>
        <h2 className="mt-3 text-3xl font-bold">Pick up where you left off</h2>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {products.slice(0, 4).map((item, index) => (
            <RecentShelfCard key={item.id ? `${item.id}-${index}` : index} product={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewedSection
