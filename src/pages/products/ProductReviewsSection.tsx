import { BadgeCheck } from 'lucide-react'

import type { Product } from '../../features/products/productApi'
import type { Review } from '../../features/reviews/reviewApi'

type RatingCounts = {
  1: number
  2: number
  3: number
  4: number
  5: number
}

type ProductReviewsSectionProps = {
  isReviewLoading: boolean
  product: Product
  productReviews: Review[]
  ratingCounts: RatingCounts
}

function renderStars(
  value: number,
  sizeClass = 'text-lg',
  colorClass = 'text-[#ff9400]',
) {
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      className={`${sizeClass} ${
        index < value ? colorClass : 'text-[#e5dcd0]'
      }`}
      key={index}
    >
      ★
    </span>
  ))
}

function ProductReviewsSection({
  isReviewLoading,
  product,
  productReviews,
  ratingCounts,
}: ProductReviewsSectionProps) {
  return (
    <section className="mt-6 border border-black/10 bg-white lg:col-span-2">
      <div className="border-b border-black/10 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
          Ratings & Reviews
        </p>

        <div className="mt-3 grid gap-4 md:grid-cols-[auto_1fr] md:items-center lg:gap-8">
          <div className="flex flex-col items-start border-b border-black/10 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 lg:pr-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-[#181512]">
                {product.averageRating?.toFixed(1) ?? '0.0'}
              </span>
              <span className="text-xl font-bold text-[#6b5f53]">/ 5</span>
            </div>
            <div className="mt-1 flex gap-0.5 text-lg">
              {renderStars(
                Math.round(product.averageRating ?? 0),
                'text-lg',
                'text-[#d97706]',
              )}
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#6b5f53]">
              Ratings & Reviews (
              {product.reviewCount ?? productReviews.length ?? 0})
            </p>
          </div>

          <div className="grid w-full max-w-md gap-1.5 md:justify-self-end">
            {[5, 4, 3, 2, 1].map((starLevel) => {
              const count =
                ratingCounts[starLevel as keyof typeof ratingCounts] || 0
              const total = productReviews.length || 1
              const percent = Math.min(
                100,
                Math.round((count / total) * 100),
              )

              return (
                <div
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-xs"
                  key={starLevel}
                >
                  <div className="flex gap-0.5">
                    {renderStars(starLevel, 'text-xs', 'text-[#d97706]')}
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3ece2]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7a3f1d] to-[#d97706] transition-all duration-500"
                      style={{
                        width: `${count > 0 ? Math.max(5, percent) : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-5 text-right font-mono text-xs font-bold text-[#6b5f53]">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isReviewLoading ? (
        <div className="grid gap-3 p-4 sm:p-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              className="h-24 animate-pulse border border-black/10 bg-[#f8f3ea]"
              key={index}
            />
          ))}
        </div>
      ) : productReviews.length ? (
        <div className="grid gap-3 p-4 sm:p-5">
          {productReviews.map((review) => {
            const reviewer =
              review.user && typeof review.user !== 'string'
                ? review.user.name || review.user.email || 'Customer'
                : 'Customer'

            return (
              <article
                className="border border-black/10 bg-[#faf7f2]/50 p-3.5 transition hover:border-[#181512] sm:p-4"
                key={review._id}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[#181512]">{reviewer}</p>
                      <span className="inline-flex items-center gap-1 border border-[#1f7a4d]/20 bg-[#effaf3] px-1.5 py-0.5 text-[10px] font-bold text-[#1f6b43]">
                        <BadgeCheck className="h-3 w-3 text-[#1f6b43]" />
                        Verified Buyer
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#6b5f53]">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : 'Recently'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs font-bold text-[#181512]">
                      {Number(review.rating).toFixed(1)} / 5
                    </span>
                    <div className="flex gap-0.5">
                      {renderStars(review.rating, 'text-sm', 'text-[#d97706]')}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#4f463d] sm:text-sm sm:leading-6">
                  {review.comment || 'No comment.'}
                </p>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <p className="text-sm font-bold text-[#181512]">
            No public reviews yet
          </p>
          <p className="mt-0.5 text-xs text-[#6b5f53]">
            First customer review will show here.
          </p>
        </div>
      )}
    </section>
  )
}

export default ProductReviewsSection
