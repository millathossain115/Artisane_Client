import { LoaderCircle, Save } from 'lucide-react'

type ConfirmSaveModalProps = {
  isSaving: boolean
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmSaveModal({
  isSaving,
  onCancel,
  onConfirm,
}: ConfirmSaveModalProps) {
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
        <p className="text-sm font-bold text-[#7a3f1d]">Confirm update</p>
        <h2 className="mt-2 text-2xl font-bold">Save profile changes?</h2>
        <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
          This will update your account profile using the saved API.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={onConfirm}
            type="button"
          >
            {isSaving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Confirm save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmSaveModal
