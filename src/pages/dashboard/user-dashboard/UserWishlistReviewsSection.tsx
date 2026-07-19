import { ShieldCheck, Star } from 'lucide-react'

import type { UserDashboardStats } from '../../../features/dashboard/dashboardApi'
import { formatCount } from '../dashboardFormat'
import { wishlist } from './userDashboardData'

type UserWishlistReviewsSectionProps = {
  stats: UserDashboardStats | null
}

function UserWishlistReviewsSection({
  stats,
}: UserWishlistReviewsSectionProps) {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="border border-black/10 bg-white p-5" id="wishlist">
        <h2 className="text-2xl font-bold">Wishlist</h2>
        <p className="mt-1 text-sm text-[#6b5f53]">
          Saved artwork and studio pieces.
        </p>
        <div className="mt-5 space-y-3">
          {wishlist.map((item) => (
            <div
              className="flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm"
              key={item.title}
            >
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-[#6b5f53]">{item.artist}</p>
              </div>
              <span className="font-bold text-[#7a3f1d]">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-black/10 bg-white p-5" id="reviews">
        <h2 className="text-2xl font-bold">Recent reviews</h2>
        <p className="mt-1 text-sm text-[#6b5f53]">
          Feedback you shared after recent purchases.
        </p>
        <div className="mt-5 space-y-4">
          {stats?.recentReviews.length ? (
            stats.recentReviews.map((review) => (
              <div className="flex gap-4" key={review._id}>
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">
                    {review.product?.name ?? 'Product review'}
                  </p>
                  <p className="mt-1 text-sm text-[#6b5f53]">
                    {formatCount(review.rating)} stars
                    {review.comment ? ` - ${review.comment}` : ''}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">No reviews yet</p>
                <p className="mt-1 text-sm text-[#6b5f53]">
                  Your product feedback will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserWishlistReviewsSection
