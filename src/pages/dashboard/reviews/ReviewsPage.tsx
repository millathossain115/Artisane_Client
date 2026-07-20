import { useMemo, useState } from 'react'

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
import { userNavItems } from '../user-dashboard/userNavItems'
import ReviewMessageBanner from './components/ReviewMessageBanner'
import UserReviewsPanel from './components/UserReviewsPanel'
import {
  clampRating,
  getApiErrorMessage,
  getReviewProductName,
  type ReviewDraft,
  type ReviewMode,
  type UserReviewMessage,
} from './reviewPageUtils'

function ReviewsPage() {
  const [mode, setMode] = useState<ReviewMode>('to-review')
  const [message, setMessage] = useState<UserReviewMessage | null>(null)
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>({})
  const [editingReviewId, setEditingReviewId] = useState('')
  const [editDraft, setEditDraft] = useState<ReviewDraft>({
    comment: '',
    rating: 5,
  })
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

  function updateDraft(productId: string, patch: Partial<ReviewDraft>) {
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
        <ReviewMessageBanner
          message={message}
          onClose={() => setMessage(null)}
        />
      ) : null}

      <UserReviewsPanel
        drafts={drafts}
        editDraft={editDraft}
        editingReviewId={editingReviewId}
        isCreatingReview={isCreatingReview}
        isDeletingReview={isDeletingReview}
        isError={isError}
        isLoading={isLoading}
        isReviewableLoading={isReviewableLoading}
        isUpdatingReview={isUpdatingReview}
        meta={meta}
        mode={mode}
        myReviews={myReviews}
        onCancelEdit={handleCancelEdit}
        onChangeEditDraft={setEditDraft}
        onCreateReview={handleCreateReview}
        onDeleteReview={handleDeleteReview}
        onSaveEdit={handleSaveEdit}
        onStartEdit={handleStartEdit}
        reviewableItems={reviewableItems}
        setMode={setMode}
        updateDraft={updateDraft}
      />
    </DashboardLayout>
  )
}

export default ReviewsPage
