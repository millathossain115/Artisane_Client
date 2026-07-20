import { ArrowUpRight, EyeOff, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { AdminDashboardStats, DashboardReview } from '../../../features/dashboard/dashboardApi'
import { formatDate } from '../dashboardFormat'
import { activity } from './adminDashboardData'

type AdminReviewActivitySectionProps = {
  stats: AdminDashboardStats | null
}

function renderStars(value: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      className={`h-3.5 w-3.5 ${
        index < value ? 'fill-[#7a3f1d] text-[#7a3f1d]' : 'text-[#d2c5b5]'
      }`}
      key={index}
    />
  ))
}

function getReviewLabel(review: DashboardReview) {
  if (!review.product) {
    return 'Product review'
  }

  return review.product.name ?? 'Product review'
}

function getReviewerLabel(review: DashboardReview) {
  if (!review.user) {
    return 'User'
  }

  return review.user.name || review.user.email || 'User'
}

function AdminReviewActivitySection({ stats }: AdminReviewActivitySectionProps) {
  const recentReviews = stats?.recentReviews ?? []

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="border border-black/10 bg-white p-5" id="reviews">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Review queue</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              Product feedback needing moderation.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
            to="/dashboard/admin/reviews"
          >
            Open reviews
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 space-y-3">
          {recentReviews.length ? (
            recentReviews.map((review) => (
              <div
                className="flex items-start justify-between gap-4 border-t border-black/10 pt-3 text-sm"
                key={review._id}
              >
                <div className="min-w-0">
                  <p className="font-bold">{getReviewLabel(review)}</p>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    {getReviewerLabel(review)}
                    {review.comment ? ` - ${review.comment}` : ''}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">{renderStars(review.rating ?? 0)}</div>
                    {review.isHidden ? (
                      <span className="inline-flex items-center gap-1 bg-[#fff5ef] px-2 py-1 text-xs font-bold text-[#8f3f1d]">
                        <EyeOff className="h-3.5 w-3.5" />
                        Hidden
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#6b5f53]">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <div className="border-t border-black/10 pt-3 text-sm text-[#6b5f53]">
              No recent reviews.
            </div>
          )}
        </div>
      </div>

      <div className="border border-black/10 bg-white p-5" id="analytics">
        <h2 className="text-2xl font-bold">Activity timeline</h2>
        <p className="mt-1 text-sm text-[#6b5f53]">
          Recent marketplace changes and signals.
        </p>
        <div className="mt-5 space-y-4">
          {activity.map((item) => {
            const Icon = item.icon

            return (
              <div className="flex gap-4" key={item.title}>
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6b5f53]">{item.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AdminReviewActivitySection
