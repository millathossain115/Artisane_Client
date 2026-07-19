import { ArrowRight, Mail, MapPin, PackageCheck, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

import studioImage from '../../assets/paint-table-optimized.jpg'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'

type InfoPageKey = 'about' | 'faq' | 'privacy' | 'shippingReturns' | 'terms'

type InfoPageProps = {
  page: InfoPageKey
}

const infoPages = {
  about: {
    eyebrow: 'About Artisane',
    title: 'Craft, chosen with care.',
    intro:
      'Artisane brings useful, beautiful handmade pieces from small studios into one calm shopping space.',
    sections: [
      {
        heading: 'What we carry',
        body: 'We focus on art, home craft, creative tools, gifts, and studio-made pieces with clear materials and honest product details.',
      },
      {
        heading: 'How we choose',
        body: 'Products are selected for finish, everyday use, visual character, and fit for collectors, gift buyers, and craft lovers.',
      },
      {
        heading: 'What customers can expect',
        body: 'Clear pricing, secure checkout, order tracking, and support before shipping starts.',
      },
    ],
  },
  faq: {
    eyebrow: 'Help',
    title: 'Common questions.',
    intro:
      'Quick answers for account, order, payment, delivery, cancellation, and return questions.',
    sections: [
      {
        heading: 'How do I track my order?',
        body: 'Open My Orders from your dashboard. Orders show confirmed, processing, shipped, and delivered progress. Courier details appear after shipment is created.',
      },
      {
        heading: 'Can I cancel an order?',
        body: 'You can cancel before shipping starts. Once an order is shipped, cancellation is no longer available from your account.',
      },
      {
        heading: 'Which payment methods are supported?',
        body: 'Cash on delivery and supported online payment methods may appear at checkout based on server configuration.',
      },
      {
        heading: 'What if a product arrives damaged?',
        body: 'Contact support with order id, product photo, package photo, and a short note. The support team will review return or replacement eligibility.',
      },
    ],
  },
  shippingReturns: {
    eyebrow: 'Delivery',
    title: 'Shipping and returns.',
    intro:
      'Orders are prepared by Artisane and delivered through trusted courier partners.',
    sections: [
      {
        heading: 'Delivery partners',
        body: 'Artisane can use RedX, Steadfast, or Pathao. Courier name, tracking code, and tracking link appear after shipment is created.',
      },
      {
        heading: 'Delivery timeline',
        body: 'Delivery time depends on destination, courier load, holidays, and product handling needs. Dashboard tracking shows latest available status.',
      },
      {
        heading: 'Returns',
        body: 'Return requests should be made soon after delivery. Items must be unused, complete, and returned with original packaging where possible.',
      },
      {
        heading: 'Refunds',
        body: 'Approved refunds are processed after returned goods are checked. Paid orders may require payment-provider processing time.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Use Artisane fairly.',
    intro:
      'These terms explain basic responsibilities when browsing, buying, and managing an Artisane account.',
    sections: [
      {
        heading: 'Orders',
        body: 'Order acceptance depends on product availability, payment status, shipping coverage, and fraud or abuse checks.',
      },
      {
        heading: 'Product details',
        body: 'Artisane aims to keep product names, prices, images, stock, and descriptions accurate. Minor handmade variation can happen.',
      },
      {
        heading: 'Accounts',
        body: 'Customers are responsible for correct account, phone, address, and order information.',
      },
      {
        heading: 'Liability',
        body: 'Artisane is not responsible for delays caused by courier disruption, incorrect customer details, or events outside normal control.',
      },
    ],
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Data used for orders and support.',
    intro:
      'Artisane collects only the information needed to run accounts, orders, delivery, payment, and customer support.',
    sections: [
      {
        heading: 'Information collected',
        body: 'Name, email, phone, address, cart, order history, payment status, and support messages may be stored.',
      },
      {
        heading: 'How data is used',
        body: 'Data is used for login, checkout, delivery, order tracking, fraud prevention, support, and service improvement.',
      },
      {
        heading: 'Courier sharing',
        body: 'Delivery details may be shared with RedX, Steadfast, Pathao, or another selected courier to deliver orders.',
      },
      {
        heading: 'Local storage',
        body: 'The app may use browser storage for cart and login session behavior. Customers can clear browser data to remove local data.',
      },
    ],
  },
} satisfies Record<
  InfoPageKey,
  {
    eyebrow: string
    intro: string
    sections: { body: string; heading: string }[]
    title: string
  }
>

function InfoPage({ page }: InfoPageProps) {
  const content = infoPages[page]

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[#181512] text-white">
          <div className="absolute inset-0">
            <img
              alt="Artisane studio table with craft materials"
              className="h-full w-full object-cover opacity-42"
              src={studioImage}
            />
          </div>
          <div className="relative mx-auto min-h-[24rem] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
              {content.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
              {content.intro}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
          <div className="grid gap-4">
            {content.sections.map((section) => (
              <article
                className="border border-black/10 bg-white px-5 py-5"
                key={section.heading}
              >
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <aside className="border border-black/10 bg-white p-5 lg:sticky lg:top-28 lg:self-start">
            <div className="grid h-11 w-11 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
              <PackageCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Need help?</h2>
            <div className="mt-4 grid gap-3 text-sm text-[#6b5f53]">
              <a
                className="flex items-center gap-2 font-bold transition hover:text-[#181512]"
                href="tel:+8801700000000"
              >
                <Phone className="h-4 w-4" />
                +880 1700 000 000
              </a>
              <a
                className="flex items-center gap-2 font-bold transition hover:text-[#181512]"
                href="mailto:support@artisane.com"
              >
                <Mail className="h-4 w-4" />
                support@artisane.com
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7a3f1d]" />
                18 Craft Lane, Dhaka, Bangladesh
              </p>
            </div>

            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/products"
            >
              Browse products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default InfoPage
