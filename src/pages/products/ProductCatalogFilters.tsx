import { SlidersHorizontal, X } from 'lucide-react'

import {
  SORT_LABELS,
  SORT_VALUES,
  type ProductFilterState,
  type SortOption,
  type StockFilter,
} from './productCatalog'

type ProductCatalogFiltersProps = {
  brandOptions: string[]
  filters: ProductFilterState
  hasActiveFilters: boolean
  onClearFilters: () => void
  onFilterChange: (filters: Partial<ProductFilterState>) => void
  onSortChange: (sortOption: SortOption) => void
  sortOption: SortOption
}

function ProductCatalogFilters({
  brandOptions,
  filters,
  hasActiveFilters,
  onClearFilters,
  onFilterChange,
  onSortChange,
  sortOption,
}: ProductCatalogFiltersProps) {
  const stockOptions: { label: string; value: StockFilter }[] = [
    { label: 'All stock', value: 'all' },
    { label: 'In stock', value: 'in-stock' },
    { label: 'Out of stock', value: 'out-of-stock' },
  ]
  const ratingOptions = [
    { label: 'Any rating', value: '' },
    { label: '4+ stars', value: '4' },
    { label: '3+ stars', value: '3' },
    { label: '2+ stars', value: '2' },
  ]

  return (
    <aside className="border border-black/10 bg-white p-4 lg:sticky lg:top-32 lg:self-start">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#181512]">
          <SlidersHorizontal className="h-4 w-4 text-[#7a3f1d]" />
          Filters
        </div>
        {hasActiveFilters ? (
          <button
            aria-label="Clear filters"
            className="grid h-8 w-8 place-items-center border border-black/10 text-[#7a3f1d] transition hover:border-[#181512] hover:text-[#181512]"
            onClick={onClearFilters}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <label className="grid gap-2 text-sm font-bold">
            Min price
            <input
              className="min-h-11 border border-black/10 bg-[#f8f3ea]/45 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512] focus:bg-white"
              min="0"
              onChange={(event) =>
                onFilterChange({ minPrice: event.target.value })
              }
              placeholder="0"
              type="number"
              value={filters.minPrice}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Max price
            <input
              className="min-h-11 border border-black/10 bg-[#f8f3ea]/45 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512] focus:bg-white"
              min="0"
              onChange={(event) =>
                onFilterChange({ maxPrice: event.target.value })
              }
              placeholder="5000"
              type="number"
              value={filters.maxPrice}
            />
          </label>
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold">Stock</legend>
          <div className="grid gap-2">
            {stockOptions.map((option) => (
              <label
                className="flex min-h-8 cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b5f53]"
                key={option.value}
              >
                <input
                  checked={filters.stock === option.value}
                  className="h-4 w-4 accent-[#181512]"
                  name="productStock"
                  onChange={() => onFilterChange({ stock: option.value })}
                  type="radio"
                  value={option.value}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-2 border-t border-black/10 pt-4">
          <legend className="text-sm font-bold">Sort</legend>
          <div className="grid gap-2">
            {SORT_VALUES.map((sortValue) => (
              <label
                className="flex min-h-9 cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b5f53]"
                key={sortValue}
              >
                <input
                  checked={sortOption === sortValue}
                  className="h-4 w-4 accent-[#181512]"
                  name="productSort"
                  onChange={() => onSortChange(sortValue)}
                  type="radio"
                  value={sortValue}
                />
                {SORT_LABELS[sortValue]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold">Rating</legend>
          <div className="grid gap-2">
            {ratingOptions.map((option) => (
              <label
                className="flex min-h-8 cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b5f53]"
                key={option.value || 'any'}
              >
                <input
                  checked={filters.minRating === option.value}
                  className="h-4 w-4 accent-[#181512]"
                  name="productRating"
                  onChange={() => onFilterChange({ minRating: option.value })}
                  type="radio"
                  value={option.value}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold">Brand</legend>
          <div className="grid gap-2">
            <label className="flex min-h-8 cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b5f53]">
              <input
                checked={!filters.brand}
                className="h-4 w-4 accent-[#181512]"
                name="productBrand"
                onChange={() => onFilterChange({ brand: '' })}
                type="radio"
                value=""
              />
              All brands
            </label>
            {brandOptions.map((brand) => (
              <label
                className="flex min-h-8 cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b5f53]"
                key={brand}
              >
                <input
                  checked={filters.brand === brand}
                  className="h-4 w-4 accent-[#181512]"
                  name="productBrand"
                  onChange={() => onFilterChange({ brand })}
                  type="radio"
                  value={brand}
                />
                {brand}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  )
}

export default ProductCatalogFilters
