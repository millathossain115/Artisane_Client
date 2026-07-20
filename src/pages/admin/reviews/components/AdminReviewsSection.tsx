import { Eye, EyeOff, Search, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'

import type {
  Review,
  ReviewListMeta,
} from '../../../../features/reviews/reviewApi'
import { formatDate } from '../../../dashboard/dashboardFormat'
import {
  getReviewProductName,
  getReviewUserEmail,
  getReviewUserName,
  renderStars,
  type ReviewConfirmTarget,
  type ReviewVisibilityFilter,
} from '../reviewAdminUtils'

type AdminReviewsSectionProps = {
  isDeleting: boolean
  isError: boolean
  isLoading: boolean
  isTogglingVisibility: boolean
  meta?: ReviewListMeta
  onResetFilters: () => void
  page: number
  reviews: Review[]
  searchTerm: string
  setConfirmTarget: Dispatch<SetStateAction<ReviewConfirmTarget | null>>
  setPage: Dispatch<SetStateAction<number>>
  setSearchTerm: Dispatch<SetStateAction<string>>
  setVisibilityFilter: Dispatch<SetStateAction<ReviewVisibilityFilter>>
  visibilityFilter: ReviewVisibilityFilter
  visibleReviews: Review[]
}

function AdminReviewsSection({
  isDeleting,
  isError,
  isLoading,
  isTogglingVisibility,
  meta,
  onResetFilters,
  page,
  reviews,
  searchTerm,
  setConfirmTarget,
  setPage,
  setSearchTerm,
  setVisibilityFilter,
  visibilityFilter,
  visibleReviews,
}: AdminReviewsSectionProps) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="flex flex-col gap-3 border-b border-black/10 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            Review monitor
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {meta?.total ?? reviews.length} reviews
          </h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Visible and hidden reviews stay in admin view unless deleted.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Search</span>
            <span className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a3f1d]" />
              <input
                className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Product, user, comment"
                value={searchTerm}
              />
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold">Visibility</span>
            <select
              className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
              onChange={(event) =>
                setVisibilityFilter(
                  event.target.value as ReviewVisibilityFilter,
                )
              }
              value={visibilityFilter}
            >
              <option value="all">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>

          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 px-4 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            onClick={onResetFilters}
            type="button"
          >
            Reset filters
          </button>
        </div>
      </div>

      {isError ? (
        <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
          Failed to load reviews.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="px-5 py-3">Review</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr className="border-t border-black/10" key={index}>
                  <td className="px-5 py-5" colSpan={7}>
                    <div className="h-5 animate-pulse bg-[#f8f3ea]" />
                  </td>
                </tr>
              ))
            ) : visibleReviews.length ? (
              visibleReviews.map((review) => (
                <tr
                  className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                  key={review._id}
                >
                  <td className="px-5 py-4">
                    <p className="line-clamp-2 font-semibold text-[#4f463d]">
                      {review.comment || 'No comment.'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      className="font-bold transition hover:text-[#7a3f1d]"
                      to={`/products/${
                        review.product && typeof review.product !== 'string'
                          ? review.product._id
                          : '#'
                      }`}
                    >
                      {getReviewProductName(review)}
                    </Link>
                    <p className="mt-1 text-xs text-[#6b5f53]">
                      {review.product && typeof review.product !== 'string'
                        ? review.product.slug
                        : ''}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold">{getReviewUserName(review)}</p>
                    <p className="mt-1 text-xs text-[#6b5f53]">
                      {getReviewUserEmail(review)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold ${
                        review.isHidden
                          ? 'bg-[#fff5ef] text-[#8f3f1d]'
                          : 'bg-[#effaf3] text-[#1f6b43]'
                      }`}
                    >
                      {review.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#6b5f53]">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="inline-flex min-h-9 items-center justify-center gap-2 border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={isTogglingVisibility}
                        onClick={() =>
                          setConfirmTarget({ review, type: 'visibility' })
                        }
                        type="button"
                      >
                        {review.isHidden ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        {review.isHidden ? 'Show' : 'Hide'}
                      </button>
                      <button
                        className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={isDeleting}
                        onClick={() => setConfirmTarget({ review, type: 'delete' })}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-8 text-center font-semibold text-[#6b5f53]"
                  colSpan={7}
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-[#6b5f53]">
          Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <span className="text-lg leading-none">‹</span>
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page >= (meta?.totalPage ?? 1)}
            onClick={() => setPage((current) => current + 1)}
            type="button"
          >
            <span className="text-lg leading-none">›</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default AdminReviewsSection
