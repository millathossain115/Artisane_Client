import { RotateCcw, Search } from 'lucide-react'

import {
  PAGE_SIZE_OPTIONS,
  type SortFilter,
} from '../categoryTableUtils'

type CategoryTableFiltersProps = {
  hasActiveFilters: boolean
  onPageSizeChange: (pageSize: number) => void
  onResetFilters: () => void
  onSearchTermChange: (searchTerm: string) => void
  onSortFilterChange: (sortFilter: SortFilter) => void
  pageSize: number
  searchTerm: string
  sortFilter: SortFilter
}

function CategoryTableFilters({
  hasActiveFilters,
  onPageSizeChange,
  onResetFilters,
  onSearchTermChange,
  onSortFilterChange,
  pageSize,
  searchTerm,
  sortFilter,
}: CategoryTableFiltersProps) {
  return (
    <div className="grid gap-2 border-b border-black/10 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-[minmax(18rem,1fr)_minmax(9rem,0.34fr)_minmax(7rem,0.24fr)_auto] xl:items-end">
      <label className="grid gap-1.5 text-xs font-bold sm:col-span-2 xl:col-span-1">
        Search categories
        <span className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b5f53]" />
          <input
            className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Name, slug, description, or ID"
            type="search"
            value={searchTerm}
          />
        </span>
      </label>

      <label className="grid gap-1.5 text-xs font-bold">
        Sort
        <select
          className="min-h-9 w-full border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
          onChange={(event) =>
            onSortFilterChange(event.target.value as SortFilter)
          }
          value={sortFilter}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name-asc">A to Z</option>
          <option value="name-desc">Z to A</option>
        </select>
      </label>

      <label className="grid gap-1.5 text-xs font-bold">
        Rows
        <select
          className="min-h-9 w-full border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          value={pageSize}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-1.5">
        <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
        <button
          className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 bg-white px-3 text-xs font-bold text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!hasActiveFilters}
          onClick={onResetFilters}
          type="button"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  )
}

export default CategoryTableFilters
