import { RotateCcw, Search } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type { Category } from '../../../../features/categories/categoryApi'
import { PAGE_SIZE_OPTIONS, type SortFilter } from '../productTableUtils'

type ProductFiltersProps = {
  categories: Category[]
  categoryFilter: string
  isCategoriesLoading: boolean
  onResetFilters: () => void
  pageSize: number
  searchTerm: string
  setCategoryFilter: Dispatch<SetStateAction<string>>
  setCurrentPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  setSearchTerm: Dispatch<SetStateAction<string>>
  setSortFilter: Dispatch<SetStateAction<SortFilter>>
  sortFilter: SortFilter
}

function ProductFilters({
  categories,
  categoryFilter,
  isCategoriesLoading,
  onResetFilters,
  pageSize,
  searchTerm,
  setCategoryFilter,
  setCurrentPage,
  setPageSize,
  setSearchTerm,
  setSortFilter,
  sortFilter,
}: ProductFiltersProps) {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    categoryFilter !== '' ||
    sortFilter !== 'newest' ||
    pageSize !== PAGE_SIZE_OPTIONS[0]

  return (
    <div className="border-b border-black/10 p-3 sm:p-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(18rem,1fr)_minmax(10rem,0.45fr)_minmax(9rem,0.34fr)_minmax(7rem,0.24fr)_auto] xl:items-end">
        <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold">Search products</span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a3f1d]" />
            <input
              className="min-h-9 w-full border border-black/10 bg-white pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Name, slug, brand"
              type="search"
              value={searchTerm}
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Category</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            disabled={isCategoriesLoading}
            onChange={(event) => {
              setCategoryFilter(event.target.value)
              setCurrentPage(1)
            }}
            value={categoryFilter}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Sort</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setSortFilter(event.target.value as SortFilter)
              setCurrentPage(1)
            }}
            value={sortFilter}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-bold">Rows</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setCurrentPage(1)
            }}
            value={pageSize}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-1.5">
          <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
          <button
            className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!hasActiveFilters}
            onClick={onResetFilters}
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters
