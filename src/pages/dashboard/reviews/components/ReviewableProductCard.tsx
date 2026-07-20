import { ImageOff, Loader2, Save, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { ReviewableProduct } from '../../../../features/reviews/reviewApi'
import {
  formatPrice,
  getAssetUrl,
  getProductCategoryName,
  getProductImage,
} from '../../../../utils/productDisplay'

type ReviewableProductCardProps = {
  draftComment: string
  draftRating: number
  onChangeComment: (value: string) => void
  onChangeRating: (value: number) => void
  onSubmit: () => void
  product: ReviewableProduct
  saving: boolean
}

function ReviewableProductCard({
  draftComment,
  draftRating,
  onChangeComment,
  onChangeRating,
  onSubmit,
  product,
  saving,
}: ReviewableProductCardProps) {
  const imageUrl = getAssetUrl(getProductImage(product))

  return (
    <article className="border border-black/10 bg-white">
      <div className="grid gap-4 p-4 sm:grid-cols-[132px_1fr]">
        <Link
          className="flex h-32 items-center justify-center overflow-hidden bg-[#f8f3ea]"
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

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                className="line-clamp-1 text-lg font-bold transition hover:text-[#7a3f1d]"
                to={`/products/${product._id}`}
              >
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-[#6b5f53]">
                {getProductCategoryName(product)}
              </p>
            </div>
            <span className="shrink-0 bg-[#effaf3] px-2 py-1 text-xs font-bold text-[#1f6b43]">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="mt-4">
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
              onClick={onSubmit}
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
      </div>
    </article>
  )
}

export default ReviewableProductCard
