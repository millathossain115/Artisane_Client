import { LoaderCircle, Trash2 } from 'lucide-react'

import type { Review } from '../../../../features/reviews/reviewApi'
import { getReviewProductName } from '../reviewPageUtils'

type DeleteReviewModalProps = {
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
  review: Review
}

function DeleteReviewModal({
  isDeleting,
  onClose,
  onConfirm,
  review,
}: DeleteReviewModalProps) {
  const productName = getReviewProductName(review)

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
        <p className="text-sm font-bold text-[#8f3f1d]">Delete review</p>
        <h2 className="mt-2 text-2xl font-bold">Delete review for {productName}?</h2>
        <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
          This action will permanently remove your feedback from this product.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            disabled={isDeleting}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-11 items-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete review'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteReviewModal
