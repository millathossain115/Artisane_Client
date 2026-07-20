import { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type Review,
  useDeleteReviewMutation,
  useGetAdminReviewsQuery,
  useUpdateReviewVisibilityMutation,
} from '../../../features/reviews/reviewApi'
import { adminNavItems } from '../../admin/adminNavItems'
import { formatDate } from '../../dashboard/dashboardFormat'

function getApiErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    data?: {
      errorSources?: { message: string }[]
      message?: string
    }
    message?: string
  }

  return (
    apiError.data?.errorSources?.[0]?.message ??
    apiError.data?.message ??
    apiError.message ??
    fallback
  )
}

function getReviewProductName(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return 'Product'
  }

  return review.product.name ?? 'Product'
}

function getReviewUserName(review: Review) {
  if (!review.user || typeof review.user === 'string') {
    return 'User'
  }

  return review.user.name || review.user.email || 'User'
}

function getReviewUserEmail(review: Review) {
  if (!review.user || typeof review.user === 'string') {
    return ''
  }

  return review.user.email ?? ''
}

function renderStars(value: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      className={`h-4 w-4 ${
        index < value ? 'fill-[#7a3f1d] text-[#7a3f1d]' : 'text-[#d2c5b5]'
      }`}
      key={index}
    />
  ))
}

function matchesSearch(review: Review, term: string) {
  const normalized = term.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [
    review.comment,
    getReviewProductName(review),
    getReviewUserName(review),
    getReviewUserEmail(review),
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalized))
}

function ReviewsPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState<
    'all' | 'hidden' | 'visible'
  >('all')
  const [message, setMessage] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<{
    review: Review
    type: 'delete' | 'visibility'
  } | null>(null)
  const {
    data: reviewList,
    isError,
    isLoading,
    refetch: refetchReviews,
  } = useGetAdminReviewsQuery({ limit: 10, page })
  const [updateReviewVisibility, { isLoading: isTogglingVisibility }] =
    useUpdateReviewVisibilityMutation()
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation()

  const reviews = useMemo(() => reviewList?.data ?? [], [reviewList?.data])
  const meta = reviewList?.meta
  const visibleReviews = reviews.filter(
    (review) =>
      matchesSearch(review, searchTerm) &&
      (visibilityFilter === 'all' ||
        (visibilityFilter === 'hidden' ? review.isHidden : !review.isHidden)),
  )

  async function handleToggleVisibility(review: Review) {
    try {
      await updateReviewVisibility({
        id: review._id,
        isHidden: !review.isHidden,
      }).unwrap()

      await refetchReviews()
      setMessage({
        text: `${getReviewProductName(review)} review ${
          review.isHidden ? 'shown' : 'hidden'
        }.`,
        type: 'success',
      })
      setConfirmTarget(null)
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to update visibility.'),
        type: 'error',
      })
    }
  }

  async function handleDeleteReview(review: Review) {
    try {
      await deleteReview(review._id).unwrap()
      await refetchReviews()
      setMessage({
        text: `${getReviewProductName(review)} review deleted.`,
        type: 'success',
      })
      setConfirmTarget(null)
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to delete review.'),
        type: 'error',
      })
    }
  }

  function resetFilters() {
    setSearchTerm('')
    setVisibilityFilter('all')
    setPage(1)
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Back to dashboard', to: '/dashboard' }]}
      eyebrow="Moderation"
      helperText="Hide or delete reviews after checking product, user, and comment."
      sidebarItems={adminNavItems}
      subtitle="Monitor product feedback, hide abuse, and keep public review pages clean."
      title="Reviews"
      workspaceLabel="Marketplace studio"
    >
      {message ? (
        <div
          className={`mb-5 flex items-start justify-between gap-3 border px-4 py-3 text-sm font-bold ${
            message.type === 'error'
              ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              : 'border-[#1f7a4d]/20 bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          <span className="flex items-center gap-2">
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {message.text}
          </span>
          <button
            aria-label="Close review message"
            className="grid h-7 w-7 shrink-0 place-items-center border border-current/20"
            onClick={() => setMessage(null)}
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

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
                  setVisibilityFilter(event.target.value as
                    | 'all'
                    | 'hidden'
                    | 'visible')
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
              onClick={resetFilters}
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
                            setConfirmTarget({
                              review,
                              type: 'visibility',
                            })
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
                          onClick={() =>
                            setConfirmTarget({ review, type: 'delete' })
                          }
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

      {confirmTarget ? (
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
                disabled={isDeleting || isTogglingVisibility}
                onClick={() => setConfirmTarget(null)}
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
                disabled={isDeleting || isTogglingVisibility}
                onClick={() =>
                  confirmTarget.type === 'delete'
                    ? handleDeleteReview(confirmTarget.review)
                    : handleToggleVisibility(confirmTarget.review)
                }
                type="button"
              >
                {isDeleting || isTogglingVisibility
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
      ) : null}
    </DashboardLayout>
  )
}

export default ReviewsPage
