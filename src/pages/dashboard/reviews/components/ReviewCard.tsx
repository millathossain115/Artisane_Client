import { Edit3, ImageOff, Loader2, Save, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getProductUrl } from '../../../../utils/productDisplay'
import { getOrderUrl } from '../../../../utils/orderDisplay'
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
    <article className="border border-black/10 bg-white p-3.5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <Link
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-[#f8f3ea]"
            to={productUrl}
          >
            {imageUrl ? (
              <img
                alt={getReviewProductName(review)}
                className="h-full w-full object-cover"
                src={imageUrl}
              />
            ) : (
              <ImageOff className="h-4 w-4 text-[#7a3f1d]" />
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
                <span className="bg-[#fff5ef] px-1.5 py-0.5 text-xs font-bold text-[#8f3f1d]">
                  Hidden
                </span>
              ) : null}
            </div>
            <p className="text-xs text-[#6b5f53]">
              {getReviewProductCategory(review)}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex gap-1">{renderStars(review.rating)}</div>
              <span className="text-xs font-bold text-[#7a3f1d]">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center">
          <Link
            className="inline-flex h-8 shrink-0 items-center justify-center border border-black/10 px-2.5 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            to={getOrderUrl(orderId)}
          >
            View order details
          </Link>
          <p className="text-xs text-[#6b5f53]">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {editing ? (
        <div className="mt-3 grid gap-2.5 border-t border-black/10 pt-3">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                aria-label={`Set rating ${index + 1}`}
                className="grid h-7 w-7 place-items-center border border-black/10 transition hover:border-[#181512]"
                key={index}
                onClick={() => onChangeEditRating(index + 1)}
                type="button"
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    index < editRating
                      ? 'fill-[#7a3f1d] text-[#7a3f1d]'
                      : 'text-[#d2c5b5]'
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            className="min-h-16 resize-y border border-black/10 px-2.5 py-2 text-xs font-medium leading-5 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            maxLength={1000}
            onChange={(event) => onChangeEditComment(event.target.value)}
            rows={2}
            value={editComment}
          />
          <div className="flex justify-end gap-2">
            <button
              className="min-h-9 border border-black/10 bg-white px-3 text-xs font-bold transition hover:border-[#181512]"
              onClick={onCancelEdit}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex min-h-9 items-center justify-center gap-2 bg-[#181512] px-3 text-xs font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving}
              onClick={onSave}
              type="button"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save review
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 border-t border-black/10 pt-2.5">
          <p className="text-xs leading-5 text-[#4f463d]">
            {review.comment || 'No comment.'}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-[#6b5f53]">
              {review.user && typeof review.user !== 'string'
                ? review.user.name || review.user.email || 'You'
                : 'You'}
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex min-h-8 items-center justify-center gap-1.5 border border-black/10 px-2.5 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                onClick={onEdit}
                type="button"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                className="inline-flex min-h-8 items-center justify-center gap-1.5 border border-[#c85f2f]/25 px-2.5 text-xs font-bold text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={saving}
                onClick={onDelete}
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
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
