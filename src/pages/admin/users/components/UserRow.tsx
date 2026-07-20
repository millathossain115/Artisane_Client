import {
  CircleSlash,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { AdminUser } from '../../../../features/users/userApi'
import {
  formatDate,
  formatRole,
  formatStatus,
  getInitials,
} from '../userTableUtils'

type UserRowProps = {
  onDelete: () => void
  onEdit: () => void
  onToggleStatus: () => void
  user: AdminUser
}

function UserRow({
  onDelete,
  onEdit,
  onToggleStatus,
  user,
}: UserRowProps) {
  const isAdmin = user.role === 'admin'
  const isBlocked = user.status === 'blocked'

  return (
    <tr className="border-t border-black/10 transition hover:bg-[#f8f3ea]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-sm font-bold text-[#7a3f1d]">
            {user.avatar ? (
              <img alt="" className="h-full w-full object-cover" src={user.avatar} />
            ) : (
              getInitials(user.name)
            )}
          </span>
          <span>
            <span className="block font-bold">{user.name}</span>
            <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#6b5f53]">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </span>
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex min-h-8 items-center px-3 text-xs font-bold ${
            isAdmin
              ? 'bg-[#181512] text-white'
              : 'bg-[#f8f3ea] text-[#7a3f1d]'
          }`}
        >
          {formatRole(user.role)}
        </span>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex min-h-8 items-center px-3 text-xs font-bold ${
            isBlocked
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          {formatStatus(user.status)}
        </span>
      </td>
      <td className="px-5 py-4 text-[#6b5f53]">{user.phone || 'No phone'}</td>
      <td className="px-5 py-4 text-[#6b5f53]">
        {user.city ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#7a3f1d]" />
            {user.city}
          </span>
        ) : (
          'No city'
        )}
      </td>
      <td className="max-w-xs px-5 py-4 text-[#6b5f53]">
        <span className="line-clamp-2">{user.address || 'No address'}</span>
      </td>
      <td className="px-5 py-4 text-[#6b5f53]">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            aria-label={`Edit ${user.name}`}
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
            onClick={onEdit}
            type="button"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            aria-label={`${isBlocked ? 'Unblock' : 'Block'} ${user.name}`}
            className={`inline-flex h-9 w-9 items-center justify-center border transition ${
              isBlocked
                ? 'border-[#1f7a4d]/20 text-[#1f6b43] hover:border-[#1f6b43] hover:bg-[#effaf3]'
                : 'border-[#c85f2f]/25 text-[#8f3f1d] hover:border-[#8f3f1d] hover:bg-[#fff5ef]'
            }`}
            onClick={onToggleStatus}
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
            className="inline-flex h-9 w-9 items-center justify-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default UserRow
