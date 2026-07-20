import { useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  EyeOff,
  ImageOff,
  Loader2,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type Review,
  type ReviewableProduct,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetMyReviewsQuery,
  useGetReviewableProductsQuery,
  useUpdateReviewMutation,
} from '../../../features/reviews/reviewApi'
import { formatCount, formatDate } from '../dashboardFormat'
import { userNavItems } from '../user-dashboard/userNavItems'
import {
  formatPrice,
  getAssetUrl,
  getProductCategoryName,
  getProductImage,
} from '../../../utils/productDisplay'

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

function clampRating(value: number) {
  return Math.min(5, Math.max(1, value))
}

function getReviewProductName(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return 'Product'
  }

  return review.product.name ?? 'Product'
}

function getReviewProductCategory(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return 'Product'
  }

  return typeof review.product.category === 'string'
    ? 'Product'
    : review.product.category?.name ?? 'Product'
}

function getReviewProductImage(review: Review) {
  if (!review.product || typeof review.product === 'string') {
    return ''
  }

  return getAssetUrl(review.product.images?.[0])
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

function ReviewableProductCard({
  draftComment,
  draftRating,
  onChangeComment,
  onChangeRating,
  onSubmit,
  product,
  saving,
}: {
  draftComment: string
  draftRating: number
  onChangeComment: (value: string) => void
  onChangeRating: (value: number) => void
  onSubmit: () => void
  product: ReviewableProduct
  saving: boolean
}) {
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

function ReviewCard({
  onDelete,
  onEdit,
  onSave,
  onCancelEdit,
  editing,
  review,
  editComment,
  editRating,
  onChangeEditComment,
  onChangeEditRating,
  saving,
}: {
  editComment: string
  editRating: number
  editing: boolean
  onCancelEdit: () => void
  onChangeEditComment: (value: string) => void
  onChangeEditRating: (value: number) => void
  onDelete: () => void
  onEdit: () => void
  onSave: () => void
  review: Review
  saving: boolean
}) {
  const imageUrl =
    review.product && typeof review.product !== 'string'
      ? getReviewProductImage(review)
      : ''
  const hidden = review.isHidden

  return (
    <article className="border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <Link
            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-[#f8f3ea]"
            to={`/products/${review.product && typeof review.product !== 'string' ? review.product._id : '#'}`}
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
                to={`/products/${review.product && typeof review.product !== 'string' ? review.product._id : '#'}`}
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

        <p className="text-sm text-[#6b5f53]">
          {formatDate(review.createdAt)}
        </p>
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

function ReviewsPage() {
  const [mode, setMode] = useState<'my-reviews' | 'to-review'>('to-review')
  const [message, setMessage] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)
  const [drafts, setDrafts] = useState<
    Record<string, { comment: string; rating: number }>
  >({})
  const [editingReviewId, setEditingReviewId] = useState('')
  const [editDraft, setEditDraft] = useState({ comment: '', rating: 5 })
  const { data: reviewableProducts, isLoading: isReviewableLoading } =
    useGetReviewableProductsQuery()
  const {
    data: reviewList,
    isError,
    isLoading,
    refetch: refetchMyReviews,
  } = useGetMyReviewsQuery({ limit: 10, page: 1 })
  const [createReview, { isLoading: isCreatingReview }] =
    useCreateReviewMutation()
  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation()
  const [deleteReview, { isLoading: isDeletingReview }] =
    useDeleteReviewMutation()

  const reviewableItems = reviewableProducts ?? []
  const myReviews = useMemo(() => reviewList?.data ?? [], [reviewList?.data])
  const meta = reviewList?.meta

  function updateDraft(productId: string, patch: Partial<{ comment: string; rating: number }>) {
    setDrafts((current) => {
      const currentDraft = current[productId] ?? { comment: '', rating: 5 }

      return {
        ...current,
        [productId]: {
          ...currentDraft,
          ...patch,
        },
      }
    })
  }

  async function handleCreateReview(product: ReviewableProduct) {
    const draft = drafts[product._id] ?? { comment: '', rating: 5 }

    try {
      await createReview({
        comment: draft.comment.trim() || undefined,
        product: product._id,
        rating: clampRating(draft.rating),
      }).unwrap()

      setDrafts((current) => {
        const next = { ...current }
        delete next[product._id]
        return next
      })
      await refetchMyReviews()
      setMessage({
        text: `${product.name} sent to review.`,
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to create review.'),
        type: 'error',
      })
    }
  }

  function handleStartEdit(review: Review) {
    setEditingReviewId(review._id)
    setEditDraft({
      comment: review.comment ?? '',
      rating: review.rating,
    })
  }

  function handleCancelEdit() {
    setEditingReviewId('')
    setEditDraft({ comment: '', rating: 5 })
  }

  async function handleSaveEdit(review: Review) {
    try {
      await updateReview({
        comment: editDraft.comment.trim() || undefined,
        id: review._id,
        rating: clampRating(editDraft.rating),
      }).unwrap()

      setEditingReviewId('')
      await refetchMyReviews()
      setMessage({
        text: `${getReviewProductName(review)} review updated.`,
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to update review.'),
        type: 'error',
      })
    }
  }

  async function handleDeleteReview(review: Review) {
    const shouldDelete = window.confirm('Delete this review?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteReview(review._id).unwrap()
      await refetchMyReviews()
      setMessage({
        text: `${getReviewProductName(review)} review deleted.`,
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to delete review.'),
        type: 'error',
      })
    }
  }

  return (
    <DashboardLayout
      actions={[{ label: 'Back to dashboard', to: '/dashboard' }]}
      eyebrow="Reviews"
      helperText="Only delivered, paid products appear here. Hidden or deleted review stays out of public pages."
      sidebarItems={userNavItems}
      subtitle="Review completed purchases and manage every review you already wrote."
      title="Reviews"
      workspaceLabel="Collector account"
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
        <div className="flex flex-col gap-4 border-b border-black/10 p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
              Review center
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {mode === 'to-review' ? 'To review' : 'My reviews'}
            </h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              {mode === 'to-review'
                ? `${formatCount(reviewableItems.length, '0')} eligible products waiting for feedback.`
                : `${formatCount(meta?.total ?? myReviews.length, '0')} reviews in your archive.`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className={`min-h-11 px-4 text-sm font-bold transition ${
                mode === 'to-review'
                  ? 'bg-[#181512] text-white'
                  : 'border border-black/10 bg-white hover:border-[#181512]'
              }`}
              onClick={() => setMode('to-review')}
              type="button"
            >
              To review
            </button>
            <button
              className={`min-h-11 px-4 text-sm font-bold transition ${
                mode === 'my-reviews'
                  ? 'bg-[#181512] text-white'
                  : 'border border-black/10 bg-white hover:border-[#181512]'
              }`}
              onClick={() => setMode('my-reviews')}
              type="button"
            >
              My reviews
            </button>
          </div>
        </div>

        {mode === 'to-review' ? (
          <div className="p-5">
            {isReviewableLoading ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    className="h-72 animate-pulse border border-black/10 bg-[#f8f3ea]"
                    key={index}
                  />
                ))}
              </div>
            ) : reviewableItems.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {reviewableItems.map((product) => {
                  const draft = drafts[product._id] ?? {
                    comment: '',
                    rating: 5,
                  }

                  return (
                    <ReviewableProductCard
                      draftComment={draft.comment}
                      draftRating={draft.rating}
                      key={product._id}
                      onChangeComment={(value) =>
                        updateDraft(product._id, { comment: value })
                      }
                      onChangeRating={(value) =>
                        updateDraft(product._id, { rating: value })
                      }
                      onSubmit={() => handleCreateReview(product)}
                      product={product}
                      saving={isCreatingReview}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="border border-black/10 bg-[#f8f3ea] p-5">
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                    <EyeOff className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">Nothing ready yet</p>
                    <p className="mt-1 text-sm text-[#6b5f53]">
                      Delivered and paid products will appear here after order
                      finish.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    className="h-28 animate-pulse border border-black/10 bg-[#f8f3ea]"
                    key={index}
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="border border-[#c85f2f]/30 bg-[#fff5ef] p-4 text-sm font-bold text-[#8f3f1d]">
                Failed to load your reviews.
              </div>
            ) : myReviews.length ? (
              <div className="space-y-4">
                {myReviews.map((review) => {
                  const editing = editingReviewId === review._id

                  return (
                    <ReviewCard
                      editComment={editDraft.comment}
                      editRating={editDraft.rating}
                      editing={editing}
                      key={review._id}
                      onCancelEdit={handleCancelEdit}
                      onChangeEditComment={(value) =>
                        setEditDraft((current) => ({
                          ...current,
                          comment: value,
                        }))
                      }
                      onChangeEditRating={(value) =>
                        setEditDraft((current) => ({
                          ...current,
                          rating: value,
                        }))
                      }
                      onDelete={() => handleDeleteReview(review)}
                      onEdit={() => handleStartEdit(review)}
                      onSave={() => handleSaveEdit(review)}
                      review={review}
                      saving={isUpdatingReview || isDeletingReview}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="border border-black/10 bg-[#f8f3ea] p-5">
                <div className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                    <Star className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">No reviews yet</p>
                    <p className="mt-1 text-sm text-[#6b5f53]">
                      Your finished review history will appear here.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </DashboardLayout>
  )
}

export default ReviewsPage
