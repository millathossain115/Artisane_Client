import { RotateCcw, Search } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type { UserRole, UserStatus } from '../../../../features/users/userApi'
import { PAGE_SIZE_OPTIONS } from '../userTableUtils'

type UserFiltersProps = {
  onResetFilters: () => void
  pageSize: number
  roleFilter: UserRole | ''
  searchTerm: string
  setCurrentPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  setRoleFilter: Dispatch<SetStateAction<UserRole | ''>>
  setSearchTerm: Dispatch<SetStateAction<string>>
  setStatusFilter: Dispatch<SetStateAction<UserStatus | ''>>
  statusFilter: UserStatus | ''
}

function UserFilters({
  onResetFilters,
  pageSize,
  roleFilter,
  searchTerm,
  setCurrentPage,
  setPageSize,
  setRoleFilter,
  setSearchTerm,
  setStatusFilter,
  statusFilter,
}: UserFiltersProps) {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    roleFilter !== '' ||
    statusFilter !== '' ||
    pageSize !== PAGE_SIZE_OPTIONS[1]
  return (
    <div className="grid gap-2 border-b border-black/10 p-3 sm:p-4 2xl:grid-cols-[minmax(0,1fr)_auto_auto] 2xl:items-end">
      <label className="grid gap-1.5 text-xs font-bold">
        Search users
        <span className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b5f53]" />
          <input
            className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setCurrentPage(1)
            }}
            placeholder="Name, email, phone, or city"
            type="search"
            value={searchTerm}
          />
        </span>
      </label>

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="grid gap-1.5 text-xs font-bold">
          Role
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setRoleFilter(event.target.value as UserRole | '')
              setCurrentPage(1)
            }}
            value={roleFilter}
          >
            <option value="">All roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-bold">
          Status
          <select
            className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setStatusFilter(event.target.value as UserStatus | '')
              setCurrentPage(1)
            }}
            value={statusFilter}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-bold">
          Rows
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
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

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
  )
}

export default UserFilters
