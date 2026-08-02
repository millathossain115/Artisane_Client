import { Check, Edit, Trash2 } from 'lucide-react'

import type { UserAddress } from '../../../../features/address/addressApi'
import { AddressBookSkeleton } from '../../user-dashboard/UserDashboardSkeletons'

type ProfileAddressListProps = {
  addresses: UserAddress[]
  loading: boolean
  onDelete: (id: string) => void
  onEdit: (addr: UserAddress) => void
  onSetDefault: (id: string) => void
}

function ProfileAddressList({
  addresses,
  loading,
  onDelete,
  onEdit,
  onSetDefault,
}: ProfileAddressListProps) {
  if (loading) {
    return <AddressBookSkeleton />
  }

  if (addresses.length === 0) {
    return (
      <p className="mt-5 text-sm text-[#6b5f53]">
        No saved addresses found. Click &quot;Add new address&quot; to save
        one.
      </p>
    )
  }

  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {addresses.map((addr) => (
        <div
          className={`relative flex flex-col justify-between border p-4 transition ${
            addr.isDefault
              ? 'border-[#7a3f1d] bg-[#f8f3ea]/40'
              : 'border-black/10 bg-white'
          }`}
          key={addr._id}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#7a3f1d] uppercase tracking-wider text-xs">
                {addr.label}
              </span>
              {addr.isDefault ? (
                <span className="inline-flex items-center gap-1 rounded bg-[#7a3f1d] px-2 py-0.5 text-xs font-semibold text-white">
                  <Check className="h-3 w-3" /> Default
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 font-bold text-[#181512]">
              {addr.recipientName}
            </h3>
            <p className="text-xs text-[#6b5f53]">{addr.phone}</p>
            <p className="mt-2 text-sm text-[#4f463d]">
              {addr.streetAddress}
              {addr.zoneName ? `, ${addr.zoneName}` : ''}
              {addr.districtName
                ? `, ${addr.districtName}`
                : addr.city
                  ? `, ${addr.city}`
                  : ''}
              {addr.postalCode ? ` - ${addr.postalCode}` : ''}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-black/10 pt-3 text-xs">
            {!addr.isDefault ? (
              <button
                className="font-bold text-[#7a3f1d] underline hover:text-[#181512]"
                onClick={() => onSetDefault(addr._id)}
                type="button"
              >
                Set as default
              </button>
            ) : (
              <span className="text-xs text-stone-400">Primary delivery</span>
            )}
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1 text-[#6b5f53] hover:text-[#181512]"
                onClick={() => onEdit(addr)}
                type="button"
              >
                <Edit className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                onClick={() => onDelete(addr._id)}
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProfileAddressList
