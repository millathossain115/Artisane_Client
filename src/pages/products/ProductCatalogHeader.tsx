import { X } from 'lucide-react'

import { SORT_LABELS, SORT_VALUES, type SortOption } from './productCatalog'

type ProductCatalogHeaderProps = {
  categoryName?: string
  hasActiveFilters: boolean
  onClearFilters: () => void
  onSortChange: (sortOption: SortOption) => void
  resultEnd: number
  resultStart: number
  searchTerm: string
  sortOption: SortOption
  totalProducts: number
}

function ProductCatalogHeader({
  categoryName,
  hasActiveFilters,
  onClearFilters,
  onSortChange,
  resultEnd,
  resultStart,
  searchTerm,
  sortOption,
  totalProducts,
}: ProductCatalogHeaderProps) {
  const title = searchTerm
    ? `Search: ${searchTerm}`
    : (categoryName ?? 'All products')

  return (
    <section className="border-b border-black/10 pb-6">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
        Products
      </p>
      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
            Showing {resultStart}-{resultEnd} of {totalProducts} products.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid gap-2 text-sm font-bold">
            Sort
            <select
              className="min-h-12 w-full min-w-52 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) =>
                onSortChange(event.target.value as SortOption)
              }
              value={sortOption}
            >
              {SORT_VALUES.map((sortValue) => (
                <option key={sortValue} value={sortValue}>
                  {SORT_LABELS[sortValue]}
                </option>
              ))}
            </select>
          </label>

          {hasActiveFilters ? (
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold text-[#181512] transition hover:border-[#181512]"
              onClick={onClearFilters}
              type="button"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ProductCatalogHeader
