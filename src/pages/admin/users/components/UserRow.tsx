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
      <td className="min-w-0 px-3 py-4 2xl:px-5">
        <div className="flex min-w-0 items-center gap-3">
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
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold" title={user.name}>
              {user.name}
            </span>
            <span
              className="mt-1 flex min-w-0 items-center gap-1 text-xs font-semibold text-[#6b5f53]"
              title={user.email}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </span>
            <span
              className="mt-1 block truncate text-xs font-semibold text-[#6b5f53]"
              title={user.phone || 'No phone'}
            >
              {user.phone || 'No phone'}
            </span>
          </span>
        </div>
      </td>
      <td className="px-3 py-4 2xl:px-5">
        <div className="grid justify-start gap-1.5">
          <span
            className={`inline-flex max-w-full min-h-6 items-center px-2 text-xs font-bold 2xl:px-3 ${
              isAdmin
                ? 'bg-[#181512] text-white'
                : 'bg-[#f8f3ea] text-[#7a3f1d]'
            }`}
          >
            <span className="truncate">{formatRole(user.role)}</span>
          </span>
          <span
            className={`inline-flex max-w-full min-h-6 items-center px-2 text-xs font-bold 2xl:px-3 ${
              isBlocked
                ? 'bg-[#fff5ef] text-[#8f3f1d]'
                : 'bg-[#effaf3] text-[#1f6b43]'
            }`}
          >
            <span className="truncate">{formatStatus(user.status)}</span>
          </span>
        </div>
      </td>
      <td className="min-w-0 px-3 py-4 text-[#6b5f53] 2xl:px-5">
        <div className="grid min-w-0 gap-1">
          {user.city ? (
            <span className="inline-flex min-w-0 max-w-full items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0 text-[#7a3f1d]" />
              <span className="truncate" title={user.city}>
                {user.city}
              </span>
            </span>
          ) : (
            <span>No city</span>
          )}
          <span className="line-clamp-2" title={user.address || 'No address'}>
            {user.address || 'No address'}
          </span>
        </div>
      </td>
      <td className="truncate px-3 py-4 text-center text-[#6b5f53] 2xl:px-5">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-3 py-4 text-center 2xl:px-5">
        <div className="relative flex justify-center" ref={menuRef}>
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
              className="absolute right-0 top-10 z-30 min-w-40 border border-black/10 bg-white p-1 text-left shadow-[0_18px_38px_rgba(24,21,18,0.16)]"
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
