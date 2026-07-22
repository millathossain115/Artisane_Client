import { AlertTriangle, ImageOff, Loader2, Save, Star, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { ReviewableProduct } from '../../../../features/reviews/reviewApi'
import {
  formatPrice,
  getAssetUrl,
  getProductCategoryName,
  getProductImage,
} from '../../../../utils/productDisplay'
import { renderStars } from '../reviewPageUtils'

type ReviewableProductCardProps = {
  draftComment: string
  draftRating: number
  onChangeComment: (value: string) => void
  onChangeRating: (value: number) => void
  onSubmit: () => void
  orderId?: string
  product: ReviewableProduct
  saving: boolean
}

function ReviewableProductCard({
  draftComment,
  draftRating,
  onChangeComment,
  onChangeRating,
  onSubmit,
  orderId,
  product,
  saving,
}: ReviewableProductCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const imageUrl = getAssetUrl(getProductImage(product))

  function handleConfirmSubmit() {
    setShowConfirmModal(false)
    onSubmit()
  }

  return (
    <article className="border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <Link
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-[#f8f3ea]"
            to={`/products/${product._id}`}
          >
            {imageUrl ? (
              <img
                alt={product.name}
                className="h-full w-full object-cover"
                src={imageUrl}
              />
            ) : (
              <ImageOff className="h-6 w-6 text-[#7a3f1d]" />
            )}
          </Link>

          <div>
            <Link
              className="line-clamp-1 font-bold transition hover:text-[#7a3f1d]"
              to={`/products/${product._id}`}
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-[#6b5f53]">
              {getProductCategoryName(product)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="bg-[#effaf3] px-2 py-0.5 text-xs font-bold text-[#1f6b43]">
                {formatPrice(product.price)}
              </span>
              <span className="bg-[#f8f3ea] px-2 py-0.5 text-xs font-semibold text-[#6b5f53]">
                Purchased & Delivered
              </span>
            </div>
          </div>
        </div>

        <Link
          className="inline-flex h-9 shrink-0 items-center justify-center border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
          to={orderId ? `/dashboard/orders/${orderId}` : '/dashboard/orders'}
        >
          View order details
        </Link>
      </div>

      <div className="mt-4 border-t border-black/10 pt-4">
        <div>
          <p className="text-sm font-bold">Rating</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                aria-label={`Rate ${index + 1} star`}
                className="grid h-9 w-9 place-items-center border border-black/10 transition hover:border-[#181512]"
                key={index}
                onClick={() => onChangeRating(index + 1)}
                type="button"
              >
                <Star
                  className={`h-4 w-4 ${
                    index < draftRating
                      ? 'fill-[#7a3f1d] text-[#7a3f1d]'
                      : 'text-[#d2c5b5]'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <label className="mt-4 grid gap-2">
          <span className="text-sm font-bold">Comment</span>
          <textarea
            className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
            maxLength={1000}
            onChange={(event) => onChangeComment(event.target.value)}
            placeholder="Share how the product felt, looked, and shipped."
            value={draftComment}
          />
        </label>

        <div className="mt-4 flex justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={saving}
            onClick={() => setShowConfirmModal(true)}
            type="button"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Submit review
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative w-full max-w-md border border-black/10 bg-[#f6f0e5] p-6 text-[#181512] shadow-2xl">
            <button
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-black/10 bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
              onClick={() => setShowConfirmModal(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#8f3f1d] text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Submit Public Review?</h3>
                <p className="text-xs text-[#6b5f53]">
                  Your review will be publicly visible to all shoppers.
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-black/10 pt-4">
              <p className="font-bold text-sm">{product.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1">{renderStars(draftRating)}</div>
                <span className="text-xs font-bold text-[#8f3f1d]">
                  {draftRating}/5
                </span>
              </div>
              {draftComment.trim() ? (
                <p className="mt-2 border border-black/10 bg-white p-3 text-xs italic leading-relaxed text-[#4f463d]">
                  &ldquo;{draftComment.trim()}&rdquo;
                </p>
              ) : (
                <p className="mt-2 text-xs italic text-[#8a7d71]">
                  (No comment provided)
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                onClick={() => setShowConfirmModal(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512]"
                onClick={handleConfirmSubmit}
                type="button"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default ReviewableProductCard
