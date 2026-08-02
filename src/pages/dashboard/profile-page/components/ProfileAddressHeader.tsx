import { MapPin, Plus } from 'lucide-react'

type ProfileAddressHeaderProps = {
  onAdd: () => void
}

function ProfileAddressHeader({ onAdd }: ProfileAddressHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Address Book</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Manage multiple saved shipping addresses.
          </p>
        </div>
      </div>
      <button
        className="inline-flex items-center gap-2 bg-[#181512] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
        onClick={onAdd}
        type="button"
      >
        <Plus className="h-4 w-4" />
        Add new address
      </button>
    </div>
  )
}

export default ProfileAddressHeader
