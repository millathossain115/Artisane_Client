import { RotateCcw, Search } from 'lucide-react'

import type {
  ActivityActorRole,
  ActivityModule,
  ActivitySource,
  ActivityStatus,
} from '../../../../features/activityLogs/activityLogApi'
import {
  formatLabel,
  moduleOptions,
  roleOptions,
  sourceOptions,
  statusOptions,
} from '../activityLogUtils'

type ActivityLogFiltersProps = {
  moduleFilter: ActivityModule | ''
  onModuleFilterChange: (value: ActivityModule | '') => void
  onResetFilters: () => void
  onRoleFilterChange: (value: ActivityActorRole | '') => void
  onSearchTermChange: (value: string) => void
  onSourceFilterChange: (value: ActivitySource | '') => void
  onStatusFilterChange: (value: ActivityStatus | '') => void
  roleFilter: ActivityActorRole | ''
  searchTerm: string
  sourceFilter: ActivitySource | ''
  statusFilter: ActivityStatus | ''
}

function ActivityLogFilters({
  moduleFilter,
  onModuleFilterChange,
  onResetFilters,
  onRoleFilterChange,
  onSearchTermChange,
  onSourceFilterChange,
  onStatusFilterChange,
  roleFilter,
  searchTerm,
  sourceFilter,
  statusFilter,
}: ActivityLogFiltersProps) {
  return (
    <div className="grid gap-2 border-b border-black/10 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-[minmax(18rem,1fr)_repeat(4,minmax(8rem,0.34fr))_auto] xl:items-end">
      <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
        <span className="text-xs font-bold">Search activity</span>
        <span className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a3f1d]" />
          <input
            className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Person, activity, target, IP"
            value={searchTerm}
          />
        </span>
      </label>

      {[
        {
          label: 'Module',
          onChange: (value: string) =>
            onModuleFilterChange(value as ActivityModule | ''),
          options: moduleOptions,
          value: moduleFilter,
        },
        {
          label: 'Role',
          onChange: (value: string) =>
            onRoleFilterChange(value as ActivityActorRole | ''),
          options: roleOptions,
          value: roleFilter,
        },
        {
          label: 'Source',
          onChange: (value: string) =>
            onSourceFilterChange(value as ActivitySource | ''),
          options: sourceOptions,
          value: sourceFilter,
        },
        {
          label: 'Status',
          onChange: (value: string) =>
            onStatusFilterChange(value as ActivityStatus | ''),
          options: statusOptions,
          value: statusFilter,
        },
      ].map((filterItem) => (
        <label className="grid gap-1.5" key={filterItem.label}>
          <span className="text-xs font-bold">{filterItem.label}</span>
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => filterItem.onChange(event.target.value)}
            value={filterItem.value}
          >
            <option value="">All {filterItem.label.toLowerCase()}</option>
            {filterItem.options.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </label>
      ))}

      <div className="grid gap-1.5">
        <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
        <button
          className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
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

export default ActivityLogFilters
