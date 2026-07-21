import { RotateCcw, Search } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type { Category } from '../../../../features/categories/categoryApi'
import {
  PAGE_SIZE_OPTIONS,
  type SortFilter,
} from '../productTableUtils'

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
    <div className="grid gap-3 border-b border-black/10 p-5 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-end">
      <label className="grid gap-2 text-sm font-bold">
        Search products
        <span className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
          <input
            className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
            placeholder="Name, slug, brand, or description"
            type="search"
            value={searchTerm}
          />
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold">
          Category
          <select
            className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
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

        <label className="grid gap-2 text-sm font-bold">
          Sort
          <select
            className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setSortFilter(event.target.value as SortFilter)
              setCurrentPage(1)
            }}
            value={sortFilter}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">A to Z</option>
            <option value="name-desc">Z to A</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Rows
          <select
            className="min-h-12 w-full border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setCurrentPage(1)
            }}
            value={pageSize}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 bg-white px-4 text-sm font-bold text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!hasActiveFilters}
        onClick={onResetFilters}
        type="button"
      >
        <RotateCcw className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  )
}

export default ProductFilters
