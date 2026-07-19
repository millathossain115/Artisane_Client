import {
  CircleUserRound,
  Heart,
  MessageSquareText,
  PencilLine,
  ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { getStoredUser } from '../../../features/auth/authApi'
import { useGetMyProfileQuery } from '../../../features/auth/profileApi'
import { supportItems } from './userDashboardData'

function isFilled(value?: string | null) {
  return Boolean(value?.trim())
}

function UserSidebar() {
  const user = getStoredUser()
  const { data: profile } = useGetMyProfileQuery()
  const savedAddress =
    profile?.address ||
    [profile?.city, profile?.postalCode].filter(Boolean).join(', ')
  const readinessItems = [
    {
      label: 'Name',
      ready: isFilled(user?.name),
    },
    {
      label: 'Email',
      ready: isFilled(user?.email),
    },
    {
      label: 'Phone',
      ready: isFilled(user?.phone),
    },
    {
      label: 'Saved address',
      ready: isFilled(savedAddress),
    },
  ]
  const readyCount = readinessItems.filter((item) => item.ready).length
  const completion = Math.round((readyCount / readinessItems.length) * 100)

  return (
    <aside className="grid gap-6">
      <section
        className="border border-black/10 bg-[#181512] p-5 text-white"
        id="profile"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center bg-white text-[#181512]">
              <CircleUserRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-bold">Account readiness</h2>
              <p className="mt-1 text-sm text-white/65">
                {readyCount}/{readinessItems.length} details ready
              </p>
            </div>
          </div>

          <Link
            className="inline-flex shrink-0 items-center gap-1 bg-white px-3 py-2 text-xs font-bold text-[#181512] transition hover:bg-[#f1c9a6]"
            to="/dashboard/profile"
          >
            <PencilLine className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>

        <div className="mt-4 h-1.5 bg-white/15">
          <div
            className="h-full bg-[#f1c9a6]"
            style={{ width: `${completion}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {readinessItems.map((item) => (
            <span
              className={`inline-flex items-center gap-1 border px-2.5 py-1 text-[11px] font-bold ${
                item.ready
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/55'
              }`}
              key={item.label}
            >
              <span
                className={`h-1.5 w-1.5 ${
                  item.ready ? 'bg-[#f1c9a6]' : 'bg-white/35'
                }`}
              />
              {item.label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            to="/dashboard/orders"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>
          <Link
            className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            to="/dashboard/wishlist"
          >
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
        </div>
      </section>

      <section className="border border-black/10 bg-white p-5" id="support">
        <h2 className="text-2xl font-bold">Support</h2>
        <div className="mt-4 grid gap-2">
          {supportItems.map((item) =>
            item.to.startsWith('mailto:') ? (
              <a
                className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                href={item.to}
                key={item.label}
              >
                {item.label}
                <MessageSquareText className="h-4 w-4" />
              </a>
            ) : (
              <Link
                className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                key={item.label}
                to={item.to}
              >
                {item.label}
                <MessageSquareText className="h-4 w-4" />
              </Link>
            ),
          )}
        </div>
      </section>
    </aside>
  )
}

export default UserSidebar
