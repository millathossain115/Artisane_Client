import {
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import { isAdminRole } from '../../../../features/auth/authApi'
import type { AdminUser } from '../../../../features/users/userApi'
import UserRow from './UserRow'
import {
  formatDate,
  formatRole,
  formatStatus,
  getInitials,
} from '../userTableUtils'

type UserRowsTableProps = {
  onDelete: (user: AdminUser) => void
  onEdit: (user: AdminUser) => void
  onToggleStatus: (user: AdminUser) => void
  resultEnd: number
  resultStart: number
  safeCurrentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  totalPages: number
  totalUsers: number
  users: AdminUser[]
}

function UserRowsTable({
  onDelete,
  onEdit,
  onToggleStatus,
  resultEnd,
  resultStart,
  safeCurrentPage,
  setCurrentPage,
  totalPages,
  totalUsers,
  users,
}: UserRowsTableProps) {
  return (
    <>
      <div className="grid gap-3 p-4 lg:hidden">
        {users.length ? (
          users.map((user) => {
            const isAdmin = isAdminRole(user.role)
            const isBlocked = user.status === 'blocked'

            return (
              <article
                className="border border-black/10 bg-white p-4"
                key={user._id}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-sm font-bold text-[#7a3f1d]">
                    {user.avatar ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={user.avatar}
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{user.name}</p>
                    <p className="mt-1 flex min-w-0 items-center gap-1 text-xs font-semibold text-[#6b5f53]">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex min-h-7 items-center px-2 text-xs font-bold ${
                          isAdmin
                            ? 'bg-[#181512] text-white'
                            : 'bg-[#f8f3ea] text-[#7a3f1d]'
                        }`}
                      >
                        {formatRole(user.role)}
                      </span>
                      <span
                        className={`inline-flex min-h-7 items-center px-2 text-xs font-bold ${
                          isBlocked
                            ? 'bg-[#fff5ef] text-[#8f3f1d]'
                            : 'bg-[#effaf3] text-[#1f6b43]'
                        }`}
                      >
                        {formatStatus(user.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-1 border-t border-black/10 pt-3 text-xs font-semibold text-[#6b5f53]">
                  <p>{user.phone || 'No phone'}</p>
                  <p className="flex min-w-0 items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7a3f1d]" />
                    <span className="truncate">{user.city || 'No city'}</span>
                  </p>
                  <p className="line-clamp-2">{user.address || 'No address'}</p>
                  <p>Joined {formatDate(user.createdAt)}</p>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    aria-label={`Edit ${user.name}`}
                    className="grid h-9 w-9 place-items-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
                    onClick={() => onEdit(user)}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={
                      isBlocked ? `Unblock ${user.name}` : `Block ${user.name}`
                    }
                    className={`grid h-9 w-9 place-items-center border transition ${
                      isBlocked
                        ? 'border-[#1f6b43]/20 text-[#1f6b43] hover:bg-[#effaf3]'
                        : 'border-[#c85f2f]/25 text-[#8f3f1d] hover:bg-[#fff5ef]'
                    }`}
                    onClick={() => onToggleStatus(user)}
                    type="button"
                  >
                    {isBlocked ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <CircleSlash className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    aria-label={`Delete ${user.name}`}
                    className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
                    onClick={() => onDelete(user)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            )
          })
        ) : (
          <p className="border border-black/10 bg-[#f8f3ea] p-5 text-center text-sm font-semibold text-[#6b5f53]">
            No users found.
          </p>
        )}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">City</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <UserRow
                  key={user._id}
                  onDelete={() => onDelete(user)}
                  onEdit={() => onEdit(user)}
                  onToggleStatus={() => onToggleStatus(user)}
                  user={user}
                />
              ))
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                  colSpan={8}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Showing {resultStart}-{resultEnd} of {totalUsers} users.
        </p>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-24 text-center text-sm font-bold">
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

export default UserRowsTable
