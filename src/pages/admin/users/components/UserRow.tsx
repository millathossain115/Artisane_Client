import {
  CircleSlash,
  EllipsisVertical,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { isAdminRole } from '../../../../features/auth/authApi'
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

function UserRow({ onDelete, onEdit, onToggleStatus, user }: UserRowProps) {
  const isAdmin = isAdminRole(user.role)
  const isBlocked = user.status === 'blocked'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  function handleAction(action: () => void) {
    setIsMenuOpen(false)
    action()
  }

  return (
    <tr className="border-t border-black/10 transition hover:bg-[#f8f3ea]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
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
            isAdmin ? 'bg-[#181512] text-white' : 'bg-[#f8f3ea] text-[#7a3f1d]'
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
      <td className="px-5 py-4 text-[#6b5f53]">{formatDate(user.createdAt)}</td>
      <td className="px-5 py-4">
        <div className="relative flex" ref={menuRef}>
          <button
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label={`Open actions for ${user.name}`}
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            <EllipsisVertical className="h-4 w-4" />
          </button>

          {isMenuOpen ? (
            <div
              className="absolute right-0 top-10 z-30 min-w-40 border border-black/10 bg-white p-1 shadow-[0_18px_38px_rgba(24,21,18,0.16)]"
              role="menu"
            >
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#181512] transition hover:bg-[#f8f3ea]"
                onClick={() => handleAction(onEdit)}
                role="menuitem"
                type="button"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit user
              </button>
              <button
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold transition ${
                  isBlocked
                    ? 'text-[#1f6b43] hover:bg-[#effaf3]'
                    : 'text-[#8f3f1d] hover:bg-[#fff5ef]'
                }`}
                onClick={() => handleAction(onToggleStatus)}
                role="menuitem"
                type="button"
              >
                {isBlocked ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <CircleSlash className="h-3.5 w-3.5" />
                )}
                {isBlocked ? 'Unblock user' : 'Block user'}
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#8f3f1d] transition hover:bg-[#fff5ef]"
                onClick={() => handleAction(onDelete)}
                role="menuitem"
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete user
              </button>
            </div>
          ) : null}
        </div>
      </td>
    </tr>
  )
}

export default UserRow
