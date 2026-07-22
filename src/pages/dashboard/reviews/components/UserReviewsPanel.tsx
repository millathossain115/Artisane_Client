import { EyeOff, Star } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import type {
  Review,
  ReviewableProduct,
} from '../../../../features/reviews/reviewApi'
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
  mode: ReviewMode
  myReviews: Review[]
  onCancelEdit: () => void
  onChangeEditDraft: Dispatch<SetStateAction<ReviewDraft>>
  onCreateReview: (product: ReviewableProduct) => void
  onDeleteReview: (review: Review) => void
  onSaveEdit: (review: Review) => void
  onStartEdit: (review: Review) => void
  productOrderMap?: Record<string, string>
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
  mode,
  myReviews,
  onCancelEdit,
  onChangeEditDraft,
  onCreateReview,
  onDeleteReview,
  onSaveEdit,
  onStartEdit,
  productOrderMap,
  reviewableItems,
  setMode,
  updateDraft,
}: UserReviewsPanelProps) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="border-b border-black/10 px-5">
        <nav className="flex gap-8" aria-label="Review tabs">
          <button
            className={`relative flex items-center gap-2 py-4 text-sm font-bold transition ${
              mode === 'to-review'
                ? 'text-[#8f3f1d]'
                : 'text-[#181512] hover:text-[#8f3f1d]'
            }`}
            onClick={() => setMode('to-review')}
            type="button"
          >
            <span>To Review</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8f3f1d] px-1.5 text-xs font-bold text-white">
              {reviewableItems.length}
            </span>
            {mode === 'to-review' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8f3f1d]" />
            )}
          </button>

          <button
            className={`relative py-4 text-sm font-bold transition ${
              mode === 'history'
                ? 'text-[#8f3f1d]'
                : 'text-[#181512] hover:text-[#8f3f1d]'
            }`}
            onClick={() => setMode('history')}
            type="button"
          >
            <span>History</span>
            {mode === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8f3f1d]" />
            )}
          </button>
        </nav>
      </div>

      {mode === 'to-review' ? (
        <div className="p-5">
          {isReviewableLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  className="h-72 animate-pulse border border-black/10 bg-[#f8f3ea]"
                  key={index}
                />
              ))}
            </div>
          ) : reviewableItems.length ? (
            <div className="space-y-4">
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
                    orderId={productOrderMap?.[product._id]}
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
                const productId = typeof review.product === 'object' && review.product ? review.product._id : undefined

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
                    orderId={productId ? productOrderMap?.[productId] : undefined}
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
