import { AlertCircle, CheckCircle2, Home, Package, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'

type PaymentResultStatus = 'cancel' | 'fail' | 'success'

type PaymentResultProps = {
  status: PaymentResultStatus
}

const resultContent = {
  cancel: {
    accentClass: 'bg-[#fff5ef] text-[#8f3f1d]',
    description:
      'Payment was cancelled. Your order may still be pending, so check dashboard before trying again.',
    icon: XCircle,
    label: 'Payment cancelled',
    title: 'Payment cancelled',
  },
  fail: {
    accentClass: 'bg-[#fff5ef] text-[#8f3f1d]',
    description:
      'Payment failed or could not be verified. Check order status from dashboard.',
    icon: AlertCircle,
    label: 'Payment failed',
    title: 'Payment failed',
  },
  success: {
    accentClass: 'bg-[#effaf3] text-[#1f6b43]',
    description:
      'Payment completed successfully. You can now track order status from dashboard.',
    icon: CheckCircle2,
    label: 'Payment success',
    title: 'Payment successful',
  },
} satisfies Record<
  PaymentResultStatus,
  {
    accentClass: string
    description: string
    icon: typeof CheckCircle2
    label: string
    title: string
  }
>

function PaymentResult({ status }: PaymentResultProps) {
  const [searchParams] = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  const content = resultContent[status]
  const Icon = content.icon

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main className="mx-auto grid min-h-[calc(100vh-180px)] max-w-3xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full border border-black/10 bg-white p-6 text-center sm:p-8">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center ${content.accentClass}`}
          >
            <Icon className="h-8 w-8" />
          </span>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            {content.label}
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b5f53]">
            {content.description}
          </p>

          {transactionId ? (
            <div className="mx-auto mt-6 max-w-md border border-black/10 bg-[#f8f3ea] px-4 py-3 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a3f1d]">
                Transaction ID
              </p>
              <p className="mt-1 break-all text-sm font-bold">
                {transactionId}
              </p>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/dashboard/orders"
            >
              <Package className="h-4 w-4" />
              View orders
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-black/10 bg-white px-5 text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
              to="/"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default PaymentResult
