import { EyeOff, Star } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type {
  Review,
  ReviewListMeta,
  ReviewableProduct,
} from '../../../../features/reviews/reviewApi'
import { formatCount } from '../../dashboardFormat'
import type { ReviewDraft, ReviewMode } from '../reviewPageUtils'
import ReviewableProductCard from './ReviewableProductCard'
import ReviewCard from './ReviewCard'

type UserReviewsPanelProps = {
  drafts: Record<string, ReviewDraft>
  editDraft: ReviewDraft
  editingReviewId: string
  isCreatingReview: boolean
  isDeletingReview: boolean
  isError: boolean
  isLoading: boolean
  isReviewableLoading: boolean
  isUpdatingReview: boolean
  meta?: ReviewListMeta
  mode: ReviewMode
  myReviews: Review[]
  onCancelEdit: () => void
  onChangeEditDraft: Dispatch<SetStateAction<ReviewDraft>>
  onCreateReview: (product: ReviewableProduct) => void
  onDeleteReview: (review: Review) => void
  onSaveEdit: (review: Review) => void
  onStartEdit: (review: Review) => void
  reviewableItems: ReviewableProduct[]
  setMode: Dispatch<SetStateAction<ReviewMode>>
  updateDraft: (productId: string, patch: Partial<ReviewDraft>) => void
}

function UserReviewsPanel({
  drafts,
  editDraft,
  editingReviewId,
  isCreatingReview,
  isDeletingReview,
  isError,
  isLoading,
  isReviewableLoading,
  isUpdatingReview,
  meta,
  mode,
  myReviews,
  onCancelEdit,
  onChangeEditDraft,
  onCreateReview,
  onDeleteReview,
  onSaveEdit,
  onStartEdit,
  reviewableItems,
  setMode,
  updateDraft,
}: UserReviewsPanelProps) {
  return (
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
                    onSubmit={() => onCreateReview(product)}
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
                    onCancelEdit={onCancelEdit}
                    onChangeEditComment={(value) =>
                      onChangeEditDraft((current) => ({
                        ...current,
                        comment: value,
                      }))
                    }
                    onChangeEditRating={(value) =>
                      onChangeEditDraft((current) => ({
                        ...current,
                        rating: value,
                      }))
                    }
                    onDelete={() => onDeleteReview(review)}
                    onEdit={() => onStartEdit(review)}
                    onSave={() => onSaveEdit(review)}
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
  )
}

export default UserReviewsPanel
