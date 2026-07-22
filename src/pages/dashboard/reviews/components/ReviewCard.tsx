import { Edit3, ImageOff, Loader2, Save, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getProductUrl } from '../../../../utils/productDisplay'
import type { Review } from '../../../../features/reviews/reviewApi'
import { formatDate } from '../../dashboardFormat'
import {
  getReviewProductCategory,
  getReviewProductImage,
  getReviewProductName,
  renderStars,
} from '../reviewPageUtils'

type ReviewCardProps = {
  editComment: string
  editRating: number
  editing: boolean
  onCancelEdit: () => void
  onChangeEditComment: (value: string) => void
  onChangeEditRating: (value: number) => void
  onDelete: () => void
  onEdit: () => void
  onSave: () => void
  orderId?: string
  review: Review
  saving: boolean
}

function ReviewCard({
  editComment,
  editRating,
  editing,
  onCancelEdit,
  onChangeEditComment,
  onChangeEditRating,
  onDelete,
  onEdit,
  onSave,
  orderId,
  review,
  saving,
}: ReviewCardProps) {
  const imageUrl =
    review.product && typeof review.product !== 'string'
      ? getReviewProductImage(review)
      : ''
  const hidden = review.isHidden
  const productUrl =
    review.product && typeof review.product !== 'string'
      ? getProductUrl(review.product)
      : '#'

  return (
    <article className="border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <Link
            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-[#f8f3ea]"
            to={productUrl}
          >
            {imageUrl ? (
              <img
                alt={getReviewProductName(review)}
                className="h-full w-full object-cover"
                src={imageUrl}
              />
            ) : (
              <ImageOff className="h-5 w-5 text-[#7a3f1d]" />
            )}
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="font-bold transition hover:text-[#7a3f1d]"
                to={productUrl}
              >
                {getReviewProductName(review)}
              </Link>
              {hidden ? (
                <span className="bg-[#fff5ef] px-2 py-1 text-xs font-bold text-[#8f3f1d]">
                  Hidden
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {getReviewProductCategory(review)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1">{renderStars(review.rating)}</div>
              <span className="text-sm font-bold text-[#7a3f1d]">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <Link
            className="inline-flex h-9 shrink-0 items-center justify-center border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            to={orderId ? `/dashboard/orders/${orderId}` : '/dashboard/orders'}
          >
            View order details
          </Link>
          <p className="text-sm text-[#6b5f53]">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {editing ? (
        <div className="mt-4 grid gap-4 border-t border-black/10 pt-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                aria-label={`Set rating ${index + 1}`}
                className="grid h-9 w-9 place-items-center border border-black/10 transition hover:border-[#181512]"
                key={index}
                onClick={() => onChangeEditRating(index + 1)}
                type="button"
              >
                <Star
                  className={`h-4 w-4 ${
                    index < editRating
                      ? 'fill-[#7a3f1d] text-[#7a3f1d]'
                      : 'text-[#d2c5b5]'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            maxLength={1000}
            onChange={(event) => onChangeEditComment(event.target.value)}
            value={editComment}
          />
          <div className="flex justify-end gap-2">
            <button
              className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
              onClick={onCancelEdit}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving}
              onClick={onSave}
              type="button"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save review
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 border-t border-black/10 pt-4">
          <p className="text-sm leading-6 text-[#4f463d]">
            {review.comment || 'No comment.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#6b5f53]">
              {review.user && typeof review.user !== 'string'
                ? review.user.name || review.user.email || 'You'
                : 'You'}
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex min-h-9 items-center justify-center gap-2 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={onEdit}
                type="button"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#c85f2f]/25 px-3 text-xs font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={saving}
                onClick={onDelete}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default ReviewCard
