import {
  AlertTriangle,
  CircleSlash,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react'

import type { AdminUser } from '../../../../features/users/userApi'

type ToggleUserStatusModalProps = {
  isUpdating: boolean
  onClose: () => void
  onConfirm: () => void
  user: AdminUser
}

function ToggleUserStatusModal({
  isUpdating,
  onClose,
  onConfirm,
  user,
}: ToggleUserStatusModalProps) {
  const isBlocked = user.status === 'blocked'

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#8f3f1d]">
              Change user status
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {isBlocked ? 'Unblock' : 'Block'} {user.name}?
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#6b5f53]">
          This will change account access status for this user.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            disabled={isUpdating}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isUpdating}
            onClick={onConfirm}
            type="button"
          >
            {isUpdating ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : isBlocked ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <CircleSlash className="h-4 w-4" />
            )}
            {isUpdating
              ? 'Updating...'
              : isBlocked
                ? 'Confirm unblock'
                : 'Confirm block'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToggleUserStatusModal
