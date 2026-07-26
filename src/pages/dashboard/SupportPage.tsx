import {
  ArrowRight,
  CircleHelp,
  Clock,
  CreditCard,
  Mail,
  PackageSearch,
  Phone,
  RefreshCw,
  ShieldQuestion,
  Truck,
  UserRound,
  XCircle,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import DashboardLayout from '../../components/layout/DashboardLayout'
import { getStoredUser } from '../../features/auth/authApi'
import { userNavItems } from './user-dashboard/userNavItems'

const quickHelpItems = [
  {
    description: 'Track status, cancel eligible orders, and view order details.',
    icon: PackageSearch,
    label: 'Order help',
    to: '/dashboard/orders',
  },
  {
    description: 'Read delivery, return, replacement, and refund basics.',
    icon: Truck,
    label: 'Shipping & returns',
    to: '/shipping-returns',
  },
  {
    description: 'Update profile, phone, and saved account details.',
    icon: UserRound,
    label: 'Account help',
    to: '/dashboard/profile',
  },
]

const faqItems = [
  {
    body: 'Open My orders to see order status and shipment updates when courier details are available.',
    icon: Truck,
    title: 'Track order',
  },
  {
    body: 'Orders can be cancelled before shipping starts. After shipment, contact support for the next steps.',
    icon: XCircle,
    title: 'Cancel order',
  },
  {
    body: 'Email order id, product photo, package photo, and a short note so the team can review it.',
    icon: RefreshCw,
    title: 'Damaged product',
  },
  {
    body: 'Share your order id and payment reference if checkout or payment status looks wrong.',
    icon: CreditCard,
    title: 'Payment issue',
  },
]

function SupportPage() {
  const storedUser = getStoredUser()

  if (storedUser?.role === 'admin') {
    return <Navigate replace to="/dashboard" />
  }

  return (
    <DashboardLayout
      actions={[{ label: 'View my orders', to: '/dashboard/orders' }]}
      eyebrow="Customer support"
      helperText="For order-specific issues, include your order id when contacting support."
      layoutVariant="customer"
      sidebarItems={userNavItems}
      subtitle="Get help with orders, delivery, returns, and account questions."
      title="Support"
      workspaceLabel="Collector account"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          <section className="grid gap-4 sm:grid-cols-3">
            {quickHelpItems.map((item) => {
              const ItemIcon = item.icon

              return (
                <Link
                  className="group border border-black/10 bg-white p-5 transition hover:border-[#181512]"
                  key={item.label}
                  to={item.to}
                >
                  <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d] transition group-hover:bg-[#181512] group-hover:text-white">
                    <ItemIcon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold">{item.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#7a3f1d]">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              )
            })}
          </section>

          <section className="border border-black/10 bg-white p-5">
            <div className="flex items-center gap-3 border-b border-black/10 pb-4">
              <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                <ShieldQuestion className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Quick answers</h2>
                <p className="mt-1 text-sm text-[#6b5f53]">
                  Common support topics before you email the team.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {faqItems.map((item) => {
                const ItemIcon = item.icon

                return (
                  <article
                    className="border border-black/10 bg-[#f8f3ea]/45 p-4"
                    key={item.title}
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                        <ItemIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-bold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>

        <aside className="border border-black/10 bg-white p-5 xl:self-start">
          <span className="grid h-11 w-11 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <CircleHelp className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-2xl font-bold">Contact support</h2>
          <p className="mt-2 text-sm leading-6 text-[#6b5f53]">
            We usually reply within 24 hours.
          </p>

          <div className="mt-5 grid gap-3 text-sm font-semibold text-[#4f463d]">
            <a
              className="flex items-center gap-2 transition hover:text-[#181512]"
              href="mailto:support@artisane.com?subject=Artisane%20support%20request"
            >
              <Mail className="h-4 w-4 text-[#7a3f1d]" />
              support@artisane.com
            </a>
            <a
              className="flex items-center gap-2 transition hover:text-[#181512]"
              href="tel:+8801700000000"
            >
              <Phone className="h-4 w-4 text-[#7a3f1d]" />
              +880 1700 000 000
            </a>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#7a3f1d]" />
              Sat-Thu, 10:00 AM-7:00 PM
            </p>
          </div>

          <a
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            href="mailto:support@artisane.com?subject=Artisane%20support%20request"
          >
            <Mail className="h-4 w-4" />
            Email support
          </a>
        </aside>
      </div>
    </DashboardLayout>
  )
}

export default SupportPage
