import { ShieldAlert } from 'lucide-react'

type ShipmentRestrictedModalProps = {
  onClose: () => void
}

function ShipmentRestrictedModal({ onClose }: ShipmentRestrictedModalProps) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#181512]/70 px-4">
      <div className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.32)]">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Restricted action</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
              Only super admins can create real courier shipments.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            className="min-h-11 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShipmentRestrictedModal
