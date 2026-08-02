import { RotateCcw } from 'lucide-react'

import type { AdminAnalyticsFilters } from '../../../../features/analytics/analyticsApi'
import type { Category } from '../../../../features/categories/categoryApi'
import {
  courierProviderOptions,
  formatLabel,
  orderStatusOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  type FilterKey,
} from '../adminAnalyticsUtils'

type AnalyticsFiltersProps = {
  categories: Category[]
  filters: AdminAnalyticsFilters
  onChange: (key: FilterKey, value: string) => void
  onReset: () => void
}

const selectFilters: Array<{
  key: FilterKey
  label: string
  options: string[]
}> = [
  { key: 'orderStatus', label: 'Order state', options: orderStatusOptions },
  { key: 'paymentStatus', label: 'Payment result', options: paymentStatusOptions },
  { key: 'paymentMethod', label: 'Payment method', options: paymentMethodOptions },
  { key: 'courierProvider', label: 'Courier', options: courierProviderOptions },
]

function AnalyticsFilters({
  categories,
  filters,
  onChange,
  onReset,
}: AnalyticsFiltersProps) {
  return (
    <section className="border border-black/10 bg-white p-3 sm:p-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[repeat(7,minmax(0,1fr))_auto] xl:items-end">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold">From</span>
          <input
            className="min-h-9 border border-black/10 px-2 text-xs font-bold outline-none focus:border-[#181512]"
            onChange={(event) => onChange('dateFrom', event.target.value)}
            type="date"
            value={filters.dateFrom ?? ''}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold">To</span>
          <input
            className="min-h-9 border border-black/10 px-2 text-xs font-bold outline-none focus:border-[#181512]"
            onChange={(event) => onChange('dateTo', event.target.value)}
            type="date"
            value={filters.dateTo ?? ''}
          />
        </label>
        {selectFilters.map(({ key, label, options }) => (
          <label className="grid gap-1.5" key={key}>
            <span className="text-xs font-bold">{label}</span>
            <select
              className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none focus:border-[#181512]"
              onChange={(event) => onChange(key, event.target.value)}
              value={filters[key] ?? ''}
            >
              <option value="">All</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold">Category</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none focus:border-[#181512]"
            onChange={(event) => onChange('category', event.target.value)}
            value={filters.category ?? ''}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-1.5">
          <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
          <button
            className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold hover:border-[#181512] hover:bg-[#f8f3ea]"
            onClick={onReset}
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsFilters
