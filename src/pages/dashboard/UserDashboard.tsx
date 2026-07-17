import {
  ArrowUpRight,
  CircleUserRound,
  Heart,
  HelpCircle,
  LayoutDashboard,
  MessageSquareText,
  PackageCheck,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'

import DashboardLayout from '../../components/layout/DashboardLayout'
import { getStoredUser } from '../../features/auth/authApi'

const userNavItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My orders', to: '#orders', icon: ReceiptText },
  { label: 'Wishlist', to: '#wishlist', icon: Heart },
  { label: 'Profile', to: '#profile', icon: CircleUserRound },
  { label: 'Reviews', to: '#reviews', icon: Star },
  { label: 'Support', to: '#support', icon: HelpCircle },
  { label: 'Settings', to: '#settings', icon: Settings },
]

const userMetrics = [
  {
    label: 'Active orders',
    value: '3',
    detail: '1 arriving this week',
    icon: ShoppingBag,
  },
  {
    label: 'Saved artworks',
    value: '18',
    detail: '4 pieces on limited stock',
    icon: Heart,
  },
  {
    label: 'Reviews due',
    value: '2',
    detail: 'Share feedback after delivery',
    icon: Star,
  },
  {
    label: 'Profile status',
    value: '82%',
    detail: 'Add address and phone backup',
    icon: ShieldCheck,
  },
]

const userOrders = [
  {
    id: '#AR-1039',
    item: 'Watercolor Monsoon Study',
    status: 'In transit',
    total: '$92',
    eta: 'Jul 22',
  },
  {
    id: '#AR-1032',
    item: 'Studio Brush Set',
    status: 'Packed',
    total: '$48',
    eta: 'Jul 24',
  },
  {
    id: '#AR-1018',
    item: 'Ceramic Ink Bowl',
    status: 'Delivered',
    total: '$36',
    eta: 'Review due',
  },
]

const wishlist = [
  {
    title: 'Ochre Landscape Print',
    artist: 'Mira Studio',
    price: '$64',
  },
  {
    title: 'Hand-thrown Brush Rest',
    artist: 'Clayline Works',
    price: '$28',
  },
  {
    title: 'Indigo Textile Panel',
    artist: 'Thread House',
    price: '$118',
  },
]

const supportItems = [
  'Shipping question answered 2 hours ago',
  'Refund request draft saved',
  'Artist message waiting for reply',
]

function UserDashboard() {
  const user = getStoredUser()

  return (
    <DashboardLayout
      actions={[
        { label: 'Continue shopping' },
        { label: 'Track order', variant: 'primary' },
      ]}
      eyebrow="My account"
      helperText="Track orders, finish profile details, and keep an eye on saved artwork before it sells."
      searchPlaceholder="Search orders, saved pieces, support"
      sidebarItems={userNavItems}
      subtitle="Manage your orders, saved artwork, reviews, messages, and account details."
      title={`Welcome${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
      workspaceLabel="Collector account"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {userMetrics.map((metric) => {
          const Icon = metric.icon

          return (
            <article
              className="border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(24,21,18,0.08)]"
              key={metric.label}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-[#6b5f53]">
                  {metric.label}
                </span>
                <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold">{metric.value}</p>
              <p className="mt-2 text-sm text-[#6b5f53]">{metric.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="border border-black/10 bg-white" id="orders">
          <div className="flex items-center justify-between gap-4 border-b border-black/10 p-5">
            <div>
              <h2 className="text-2xl font-bold">My orders</h2>
              <p className="mt-1 text-sm text-[#6b5f53]">
                Current delivery status and recent purchases.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-sm font-bold transition hover:border-[#181512]"
              type="button"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Artwork</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">ETA</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order) => (
                  <tr
                    className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                    key={order.id}
                  >
                    <td className="px-5 py-4 font-bold">{order.id}</td>
                    <td className="px-5 py-4 text-[#6b5f53]">{order.item}</td>
                    <td className="px-5 py-4">
                      <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold">{order.total}</td>
                    <td className="px-5 py-4 text-[#6b5f53]">{order.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="grid gap-6">
          <section
            className="border border-black/10 bg-[#181512] p-5 text-white"
            id="profile"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center bg-white text-[#181512]">
                <CircleUserRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Profile checklist</h2>
                <p className="mt-1 text-sm text-white/65">
                  Keep checkout and delivery details ready.
                </p>
              </div>
            </div>
            <div className="mt-5 h-2 bg-white/15">
              <div className="h-full w-[82%] bg-[#f1c9a6]" />
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                'Primary email verified',
                'Default address missing',
                'Phone backup recommended',
              ].map((item) => (
                <li
                  className="flex items-center justify-between gap-3 border-t border-white/10 pt-3"
                  key={item}
                >
                  <span>{item}</span>
                  <button
                    className="text-xs font-bold text-[#f1c9a6]"
                    type="button"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-black/10 bg-white p-5" id="support">
            <h2 className="text-2xl font-bold">Support</h2>
            <div className="mt-4 grid gap-2">
              {supportItems.map((item) => (
                <button
                  className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                  key={item}
                  type="button"
                >
                  {item}
                  <MessageSquareText className="h-4 w-4" />
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>

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
          <h2 className="text-2xl font-bold">Reviews and delivery</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Keep purchases updated after they arrive.
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                title: 'Order arriving soon',
                detail: 'Watercolor Monsoon Study is in transit.',
                icon: Truck,
              },
              {
                title: 'Review requested',
                detail: 'Ceramic Ink Bowl is ready for feedback.',
                icon: Star,
              },
              {
                title: 'Purchase protected',
                detail: 'Buyer protection is active on all open orders.',
                icon: PackageCheck,
              },
            ].map((item) => {
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

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          ['Addresses', '1 saved address', 'Set a default delivery location.'],
          [
            'Payments',
            'No card stored',
            'Add a payment method for faster buys.',
          ],
          [
            'Messages',
            '3 active threads',
            'Follow artist and support replies.',
          ],
        ].map(([title, value, detail]) => (
          <article
            className="border border-black/10 bg-white p-5"
            id={title.toLowerCase()}
            key={title}
          >
            <p className="text-sm font-bold text-[#7a3f1d]">{title}</p>
            <h2 className="mt-2 text-2xl font-bold">{value}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b5f53]">{detail}</p>
          </article>
        ))}
      </section>
    </DashboardLayout>
  )
}

export default UserDashboard
