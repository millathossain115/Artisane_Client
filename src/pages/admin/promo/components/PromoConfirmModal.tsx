type PromoConfirmModalProps = {
  isSaving: boolean
  onCancel: () => void
  onConfirm: () => void
}

function PromoConfirmModal({
  isSaving,
  onCancel,
  onConfirm,
}: PromoConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-black/10 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-amber-600">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-xl font-bold">
            ⚠️
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#181512]">
              Confirm Banner Updates
            </h3>
            <p className="text-xs text-[#6b5f53]">
              Action will instantly update public home page deals.
            </p>
          </div>
        </div>

        <div className="border border-amber-200 bg-amber-50/80 p-3 text-xs leading-relaxed text-amber-900">
          <strong>Warning:</strong> Saving will update separate countdown
          expiration dates, coupon codes, and banner links across the live
          website.
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="border border-black/20 bg-white px-4 py-2 text-xs font-bold text-[#181512] hover:bg-gray-100"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="bg-[#8f3f1d] px-4 py-2 text-xs font-bold text-white hover:bg-[#181512] disabled:opacity-50"
            disabled={isSaving}
            onClick={onConfirm}
            type="button"
          >
            {isSaving ? 'Updating...' : 'Yes, Apply Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromoConfirmModal
