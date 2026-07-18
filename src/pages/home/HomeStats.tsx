import { PackageSearch, Palette, Truck } from 'lucide-react'

type HomeStatsProps = {
  isCategoriesLoading: boolean
  isProductsLoading: boolean
  totalCategories: number
  totalProducts: number
}

function HomeStats({
  isCategoriesLoading,
  isProductsLoading,
  totalCategories,
  totalProducts,
}: HomeStatsProps) {
  const stats = [
    {
      icon: PackageSearch,
      label: 'Products in catalog',
      value: isProductsLoading ? '...' : `${totalProducts}+`,
    },
    {
      icon: Palette,
      label: 'Active craft categories',
      value: isCategoriesLoading ? '...' : `${totalCategories}`,
    },
    {
      icon: Truck,
      label: 'Ready to ship',
      value: 'Stocked',
    },
  ]

  return (
    <section
      aria-label="Catalog summary"
      className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8"
    >
      {stats.map((item) => {
        const Icon = item.icon

        return (
          <div
            className="flex items-center justify-between gap-4 border-y border-black/10 py-5"
            key={item.label}
          >
            <div>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-[#6b5f53]">
                {item.label}
              </p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center bg-white text-[#7a3f1d]">
              <Icon className="h-5 w-5" />
            </span>
          </div>
        )
      })}
    </section>
  )
}

export default HomeStats
