import { Eye, EyeOff, MoreVertical, Search, Trash2 } from 'lucide-react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { Link } from 'react-router-dom'

import type {
  Review,
  ReviewListMeta,
} from '../../../../features/reviews/reviewApi'
import { formatDate } from '../../../dashboard/dashboardFormat'
import {
  getReviewProductName,
  getReviewProductCategory,
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
  const [openActionId, setOpenActionId] = useState('')

  return (
    <section className="border border-black/10 bg-white">
      <div className="flex flex-col gap-3 border-b border-black/10 px-4 py-3.5 sm:px-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            Review monitor
          </p>
          <h2 className="mt-1.5 text-xl font-bold">
            {meta?.total ?? reviews.length} reviews
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-[#6b5f53]">
            Visible and hidden reviews stay in admin view unless deleted.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(18rem,1fr)_minmax(9rem,0.34fr)_auto] xl:items-end">
          <label className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
            <span className="text-xs font-bold">Search</span>
            <span className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a3f1d]" />
              <input
                className="min-h-9 w-full border border-black/10 pl-8 pr-2 text-xs font-semibold outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Product, user, comment"
                value={searchTerm}
              />
            </span>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold">Visibility</span>
            <select
              className="min-h-9 border border-black/10 bg-white px-2 text-xs font-bold outline-none transition focus:border-[#181512]"
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

          <div className="grid gap-1.5">
            <span className="hidden text-xs font-bold xl:block">&nbsp;</span>
            <button
              className="inline-flex min-h-9 items-center justify-center border border-black/10 px-3 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
              onClick={onResetFilters}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="border-b border-[#c85f2f]/30 bg-[#fff5ef] px-5 py-3 text-sm font-bold text-[#8f3f1d]">
          Failed to load reviews.
        </div>
      ) : null}

      <div className="lg:hidden">
        {isLoading ? (
          <div className="grid gap-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="h-36 animate-pulse border border-black/10 bg-[#f8f3ea]"
                key={index}
              />
            ))}
          </div>
        ) : visibleReviews.length ? (
          <div className="grid gap-3 p-4">
            {visibleReviews.map((review) => (
              <article
                className="border border-black/10 bg-white p-4"
                key={review._id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      className="line-clamp-2 font-bold transition hover:text-[#7a3f1d]"
                      to={`/products/${
                        review.product && typeof review.product !== 'string'
                          ? review.product._id
                          : '#'
                      }`}
                    >
                      {getReviewProductName(review)}
                    </Link>
                    <p className="mt-1 truncate text-xs text-[#6b5f53]">
                      {getReviewUserName(review)} - {getReviewUserEmail(review)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-1 text-xs font-bold ${
                      review.isHidden
                        ? 'bg-[#fff5ef] text-[#8f3f1d]'
                        : 'bg-[#effaf3] text-[#1f6b43]'
                    }`}
                  >
                    {review.isHidden ? 'Hidden' : 'Visible'}
                  </span>
                </div>

                <div className="mt-3 flex gap-1">
                  {renderStars(review.rating)}
                </div>
                <p className="mt-3 line-clamp-3 text-sm font-semibold text-[#4f463d]">
                  {review.comment || 'No comment.'}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/10 pt-3">
                  <p className="text-xs font-semibold text-[#6b5f53]">
                    {formatDate(review.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      aria-label={
                        review.isHidden ? 'Show review' : 'Hide review'
                      }
                      className="grid h-9 w-9 place-items-center border border-black/10 transition hover:border-[#181512] hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
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
                    </button>
                    <button
                      aria-label="Delete review"
                      className="grid h-9 w-9 place-items-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={isDeleting}
                      onClick={() =>
                        setConfirmTarget({ review, type: 'delete' })
                      }
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center font-semibold text-[#6b5f53]">
            No reviews found.
          </p>
        )}
      </div>

      <div className="hidden overflow-visible lg:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
            <tr>
              <th className="w-[30%] px-3 py-3 2xl:px-5">Review</th>
              <th className="w-[22%] px-3 py-3 2xl:px-5">Product</th>
              <th className="w-[18%] px-3 py-3 2xl:px-5">User</th>
              <th className="w-[10%] px-3 py-3 text-center 2xl:px-5">
                Rating
              </th>
              <th className="w-[10%] px-3 py-3 text-center 2xl:px-5">
                Visibility
              </th>
              <th className="w-[10%] px-3 py-3 text-center 2xl:px-5">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr className="border-t border-black/10" key={index}>
                  <td className="px-5 py-5" colSpan={6}>
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
                  <td className="min-w-0 px-3 py-4 2xl:px-5">
                    <p
                      className="line-clamp-2 font-semibold text-[#4f463d] 2xl:line-clamp-3"
                      title={review.comment || 'No comment.'}
                    >
                      {review.comment || 'No comment.'}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-[#6b5f53]">
                      {formatDate(review.createdAt)}
                    </p>
                  </td>
                  <td className="min-w-0 px-3 py-4 2xl:px-5">
                    <Link
                      className="block truncate font-bold transition hover:text-[#7a3f1d]"
                      title={getReviewProductName(review)}
                      to={`/products/${
                        review.product && typeof review.product !== 'string'
                          ? review.product._id
                          : '#'
                      }`}
                    >
                      {getReviewProductName(review)}
                    </Link>
                    <p
                      className="mt-1 truncate text-xs text-[#6b5f53]"
                      title={getReviewProductCategory(review)}
                    >
                      {getReviewProductCategory(review)}
                    </p>
                  </td>
                  <td className="min-w-0 px-3 py-4 2xl:px-5">
                    <p
                      className="truncate font-bold"
                      title={getReviewUserName(review)}
                    >
                      {getReviewUserName(review)}
                    </p>
                    <p
                      className="mt-1 truncate text-xs text-[#6b5f53]"
                      title={getReviewUserEmail(review)}
                    >
                      {getReviewUserEmail(review)}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-center 2xl:px-5">
                    <div className="flex justify-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center 2xl:px-5">
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
                  <td className="px-3 py-4 text-center 2xl:px-5">
                    <div className="relative inline-flex justify-center">
                      <button
                        aria-expanded={openActionId === review._id}
                        aria-label="Open review actions"
                        className="grid h-9 w-9 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                        onClick={() =>
                          setOpenActionId((currentId) =>
                            currentId === review._id ? '' : review._id,
                          )
                        }
                        type="button"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openActionId === review._id ? (
                        <div className="absolute right-0 top-full z-20 mt-2 w-36 border border-black/10 bg-white py-1 text-left shadow-[0_18px_36px_rgba(24,21,18,0.14)]">
                          <button
                            className="flex min-h-9 w-full items-center gap-2 px-3 text-xs font-bold text-[#181512] transition hover:bg-[#f8f3ea] disabled:cursor-not-allowed disabled:opacity-45"
                            disabled={isTogglingVisibility}
                            onClick={() => {
                              setOpenActionId('')
                              setConfirmTarget({ review, type: 'visibility' })
                            }}
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
                            className="flex min-h-9 w-full items-center gap-2 px-3 text-xs font-bold text-[#8f3f1d] transition hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
                            disabled={isDeleting}
                            onClick={() => {
                              setOpenActionId('')
                              setConfirmTarget({ review, type: 'delete' })
                            }}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-black/10">
                <td
                  className="px-5 py-8 text-center font-semibold text-[#6b5f53]"
                  colSpan={6}
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-semibold text-[#6b5f53]">
          Page {meta?.page ?? page} of {meta?.totalPage ?? 1}
        </p>
        <div className="flex gap-2">
          <button
            className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <span className="text-lg leading-none">‹</span>
          </button>
          <button
            className="inline-flex h-8 w-8 items-center justify-center border border-black/10 transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
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
