import { Search } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type { UserRole, UserStatus } from '../../../../features/users/userApi'
import { PAGE_SIZE_OPTIONS } from '../userTableUtils'

type UserFiltersProps = {
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
  return (
    <div className="grid gap-3 border-b border-black/10 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <label className="grid gap-2 text-sm font-bold">
        Search users
        <span className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
          <input
            className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
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

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold">
          Role
          <select
            className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
            onChange={(event) => {
              setRoleFilter(event.target.value as UserRole | '')
              setCurrentPage(1)
            }}
            value={roleFilter}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Status
          <select
            className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
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

        <label className="grid gap-2 text-sm font-bold">
          Rows
          <select
            className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
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
    </div>
  )
}

export default UserFilters
