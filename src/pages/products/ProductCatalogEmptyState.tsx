import { SlidersHorizontal, X } from 'lucide-react'

type ProductCatalogEmptyStateProps = {
  hasActiveFilters: boolean
  onClearFilters: () => void
}

function ProductCatalogEmptyState({
  hasActiveFilters,
  onClearFilters,
}: ProductCatalogEmptyStateProps) {
  return (
    <div className="mt-10 grid min-h-72 place-items-center border border-black/10 bg-white text-center">
      <div className="px-5">
        <span className="mx-auto grid h-14 w-14 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <SlidersHorizontal className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-bold">No products found.</p>
        <p className="mt-2 text-sm text-[#6b5f53]">
          Try another search from the navbar or change the sort option.
        </p>
        {hasActiveFilters ? (
          <button
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            onClick={onClearFilters}
            type="button"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ProductCatalogEmptyState
