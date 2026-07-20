import { Eye, EyeOff, Trash2 } from 'lucide-react'

import {
  getReviewProductName,
  type ReviewConfirmTarget,
} from '../reviewAdminUtils'

type ReviewConfirmModalProps = {
  confirmTarget: ReviewConfirmTarget
  isWorking: boolean
  onClose: () => void
  onConfirm: () => void
}

function ReviewConfirmModal({
  confirmTarget,
  isWorking,
  onClose,
  onConfirm,
}: ReviewConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/60 px-4">
      <div className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center ${
              confirmTarget.type === 'delete'
                ? 'bg-[#fff5ef] text-[#8f3f1d]'
                : 'bg-[#f8f3ea] text-[#7a3f1d]'
            }`}
          >
            {confirmTarget.type === 'delete' ? (
              <Trash2 className="h-5 w-5" />
            ) : confirmTarget.review.isHidden ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </span>
          <div>
            <h2 className="text-2xl font-bold">
              {confirmTarget.type === 'delete'
                ? 'Delete review?'
                : confirmTarget.review.isHidden
                  ? 'Show review?'
                  : 'Hide review?'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
              {confirmTarget.type === 'delete'
                ? 'This review will be removed from admin and public review lists.'
                : confirmTarget.review.isHidden
                  ? 'This review will become visible on public product review pages.'
                  : 'This review will stay in admin view but disappear from public product review pages.'}
            </p>
            <div className="mt-3 border border-black/10 bg-[#f8f3ea] p-3">
              <p className="text-sm font-bold">
                {getReviewProductName(confirmTarget.review)}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-[#6b5f53]">
                {confirmTarget.review.comment || 'No comment.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isWorking}
            onClick={onClose}
            type="button"
          >
            Keep review
          </button>
          <button
            className={`min-h-11 px-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              confirmTarget.type === 'delete'
                ? 'bg-[#8f3f1d] hover:bg-[#6f2f15]'
                : 'bg-[#181512] hover:bg-[#7a3f1d]'
            }`}
            disabled={isWorking}
            onClick={onConfirm}
            type="button"
          >
            {isWorking
              ? 'Working...'
              : confirmTarget.type === 'delete'
                ? 'Delete review'
                : confirmTarget.review.isHidden
                  ? 'Show review'
                  : 'Hide review'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewConfirmModal
