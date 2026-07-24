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
import { useGetMyOrdersQuery } from '../../../features/orders/orderApi'
import { userNavItems } from '../user-dashboard/userNavItems'
import ReviewMessageBanner from './components/ReviewMessageBanner'
import UserReviewsPanel from './components/UserReviewsPanel'
import DeleteReviewModal from './components/DeleteReviewModal'
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
    useGetReviewableProductsQuery(undefined, { refetchOnMountOrArgChange: true })
  const {
    data: reviewList,
    isError,
    isLoading,
    refetch: refetchMyReviews,
  } = useGetMyReviewsQuery({ limit: 10, page: 1 }, { refetchOnMountOrArgChange: true })
  const [createReview, { isLoading: isCreatingReview }] =
    useCreateReviewMutation()
  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation()
  const [deleteReview, { isLoading: isDeletingReview }] =
    useDeleteReviewMutation()

  const [deletingReview, setDeletingReview] = useState<Review | null>(null)

  const { data: myOrdersData } = useGetMyOrdersQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: true },
  )

  const productOrderMap = useMemo(() => {
    const map: Record<string, string> = {}
    myOrdersData?.data?.forEach((order) => {
      order.items?.forEach((item) => {
        const pId = typeof item.product === 'object' && item.product ? item.product._id : (item.product as string)
        if (pId && !map[pId]) {
          map[pId] = order._id
        }
      })
    })
    return map
  }, [myOrdersData?.data])

  const reviewableItems = useMemo(
    () => reviewableProducts ?? [],
    [reviewableProducts],
  )
  const myReviews = useMemo(() => reviewList?.data ?? [], [reviewList?.data])

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

  function handleRequestDelete(review: Review) {
    setDeletingReview(review)
  }

  async function handleConfirmDelete() {
    if (!deletingReview) {
      return
    }

    try {
      await deleteReview(deletingReview._id).unwrap()
      await refetchMyReviews()
      setMessage({
        text: `${getReviewProductName(deletingReview)} review deleted.`,
        type: 'success',
      })
    } catch (error) {
      setMessage({
        text: getApiErrorMessage(error, 'Failed to delete review.'),
        type: 'error',
      })
    } finally {
      setDeletingReview(null)
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
        mode={mode}
        myReviews={myReviews}
        onCancelEdit={handleCancelEdit}
        onChangeEditDraft={setEditDraft}
        onCreateReview={handleCreateReview}
        onDeleteReview={handleRequestDelete}
        onSaveEdit={handleSaveEdit}
        onStartEdit={handleStartEdit}
        productOrderMap={productOrderMap}
        reviewableItems={reviewableItems}
        setMode={setMode}
        updateDraft={updateDraft}
      />

      {deletingReview && (
        <DeleteReviewModal
          isDeleting={isDeletingReview}
          onClose={() => setDeletingReview(null)}
          onConfirm={handleConfirmDelete}
          review={deletingReview}
        />
      )}
    </DashboardLayout>
  )
}

export default ReviewsPage
