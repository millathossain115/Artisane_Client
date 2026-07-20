import { useMemo, useState } from 'react'

import DashboardLayout from '../../../components/layout/DashboardLayout'
import {
  type Review,
  useDeleteReviewMutation,
  useGetAdminReviewsQuery,
  useUpdateReviewVisibilityMutation,
} from '../../../features/reviews/reviewApi'
import { adminNavItems } from '../../admin/adminNavItems'
import AdminReviewsSection from './components/AdminReviewsSection'
import ReviewConfirmModal from './components/ReviewConfirmModal'
import ReviewMessageBanner from './components/ReviewMessageBanner'
import {
  type AdminReviewMessage,
  getApiErrorMessage,
  getReviewProductName,
  matchesSearch,
  type ReviewConfirmTarget,
  type ReviewVisibilityFilter,
} from './reviewAdminUtils'

function ReviewsPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibilityFilter, setVisibilityFilter] =
    useState<ReviewVisibilityFilter>('all')
  const [message, setMessage] = useState<AdminReviewMessage | null>(null)
  const [confirmTarget, setConfirmTarget] =
    useState<ReviewConfirmTarget | null>(null)
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
        <ReviewMessageBanner
          message={message}
          onClose={() => setMessage(null)}
        />
      ) : null}

      <AdminReviewsSection
        isDeleting={isDeleting}
        isError={isError}
        isLoading={isLoading}
        isTogglingVisibility={isTogglingVisibility}
        meta={meta}
        onResetFilters={resetFilters}
        page={page}
        reviews={reviews}
        searchTerm={searchTerm}
        setConfirmTarget={setConfirmTarget}
        setPage={setPage}
        setSearchTerm={setSearchTerm}
        setVisibilityFilter={setVisibilityFilter}
        visibilityFilter={visibilityFilter}
        visibleReviews={visibleReviews}
      />

      {confirmTarget ? (
        <ReviewConfirmModal
          confirmTarget={confirmTarget}
          isWorking={isDeleting || isTogglingVisibility}
          onClose={() => setConfirmTarget(null)}
          onConfirm={() =>
            confirmTarget.type === 'delete'
              ? handleDeleteReview(confirmTarget.review)
              : handleToggleVisibility(confirmTarget.review)
          }
        />
      ) : null}
    </DashboardLayout>
  )
}

export default ReviewsPage
