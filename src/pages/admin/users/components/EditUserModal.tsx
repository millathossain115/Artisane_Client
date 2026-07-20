import { LoaderCircle, Save } from 'lucide-react'
import type { FormEvent } from 'react'

import type { AdminUser } from '../../../../features/users/userApi'
import type { UserEditForm } from '../userTableUtils'

type EditUserModalProps = {
  editForm: UserEditForm
  isUpdating: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onUpdateField: (field: keyof UserEditForm, value: string) => void
  user: AdminUser
}

function EditUserModal({
  editForm,
  isUpdating,
  onClose,
  onSubmit,
  onUpdateField,
  user,
}: EditUserModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#181512]/55 px-4 py-6"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-2xl border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <p className="text-sm font-bold text-[#7a3f1d]">Edit user</p>
        <h2 className="mt-2 text-2xl font-bold">{user.name}</h2>

        <form className="mt-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Name
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('name', event.target.value)}
                required
                type="text"
                value={editForm.name}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Email
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('email', event.target.value)}
                required
                type="email"
                value={editForm.email}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Phone
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('phone', event.target.value)}
                type="text"
                value={editForm.phone}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              City
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => onUpdateField('city', event.target.value)}
                type="text"
                value={editForm.city}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Postal code
              <input
                className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) =>
                  onUpdateField('postalCode', event.target.value)
                }
                type="text"
                value={editForm.postalCode}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Role
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => onUpdateField('role', event.target.value)}
                value={editForm.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Status
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => onUpdateField('status', event.target.value)}
                value={editForm.status}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>
          </div>

          <label className="mt-5 grid gap-2 text-sm font-bold">
            Address
            <textarea
              className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
              onChange={(event) => onUpdateField('address', event.target.value)}
              value={editForm.address}
            />
          </label>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
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
              type="submit"
            >
              {isUpdating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
