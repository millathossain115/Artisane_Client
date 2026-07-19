import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.4l.6-3h-3V9c0-.6.4-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M12 3a8.8 8.8 0 0 0-7.6 13.2L3.2 21l4.9-1.2A8.8 8.8 0 1 0 12 3Zm0 15.9a7 7 0 0 1-3.5-.9l-.3-.2-2.8.7.8-2.7-.2-.3A7.1 7.1 0 1 1 12 18.9Zm3.9-5.2c-.2-.1-1.3-.6-1.5-.7s-.3-.1-.5.1-.6.7-.7.9-.3.2-.5.1a5.7 5.7 0 0 1-1.7-1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.3-.1-.5l-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.3-.5 1.5-1.1s.2-1 .2-1.1-.2-.2-.4-.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm4.1-2.9a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

const paymentMethods = [
  { label: 'Visa', src: '/payment-logos/visa.svg' },
  { label: 'American Express', src: '/payment-logos/amex.png' },
  { label: 'bKash', src: '/payment-logos/bkash.svg' },
  { label: 'Nagad', src: '/payment-logos/nagad.svg' },
  { label: 'Rocket', src: '/payment-logos/rocket.svg' },
  { label: 'SSLCommerz', src: '/payment-logos/sslcommerz.png' },
] as const

function Footer() {
  return (
    <footer className="bg-[#f8f3ea] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-black/10 pt-8 md:grid-cols-[1.15fr_0.75fr_0.85fr_1fr_0.95fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-[#181512] text-base font-bold text-white">
              A
            </span>
            <span className="font-display text-2xl font-bold">Artisane</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b5f53]">
            A curated marketplace for useful, beautiful craft made by small
            studios.
          </p>
        </div>

        <div>
          <h2 className="font-bold">Shop</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6b5f53]">
            <li>
              <Link className="hover:text-[#181512]" to="/products">
                Products
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#181512]" to="/categories">
                Categories
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#181512]" to="/about">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold">Support</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#6b5f53]">
            <li>
              <Link className="hover:text-[#181512]" to="/shipping-returns">
                Shipping / Returns
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#181512]" to="/faq">
                FAQ
              </Link>
            </li>
            <li>
              <Link className="hover:text-[#181512]" to="/terms">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold">Contact</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#6b5f53]">
            <a
              className="flex items-center gap-2 hover:text-[#181512]"
              href="tel:+8801700000000"
            >
              <Phone className="h-4 w-4 text-[#7a3f1d]" />
              +880 1700 000 000
            </a>
            <a
              className="flex items-center gap-2 hover:text-[#181512]"
              href="mailto:support@artisane.com"
            >
              <Mail className="h-4 w-4 text-[#7a3f1d]" />
              support@artisane.com
            </a>
            <p className="flex items-start gap-2 leading-6">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7a3f1d]" />
              18 Craft Lane, Dhaka, Bangladesh
            </p>
            <p>Support: Sat-Thu, 10:00 AM-7:00 PM</p>
            <div className="flex flex-wrap gap-2 font-bold">
              <a
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center border border-black/10 bg-white/60 text-[#7a3f1d] transition hover:border-[#181512] hover:bg-white hover:text-[#181512]"
                href="https://facebook.com"
                rel="noreferrer"
                target="_blank"
              >
                <FacebookIcon />
              </a>
              <a
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center border border-black/10 bg-white/60 text-[#7a3f1d] transition hover:border-[#181512] hover:bg-white hover:text-[#181512]"
                href="https://instagram.com"
                rel="noreferrer"
                target="_blank"
              >
                <InstagramIcon />
              </a>
              <a
                aria-label="WhatsApp"
                className="grid h-9 w-9 place-items-center border border-black/10 bg-white/60 text-[#7a3f1d] transition hover:border-[#181512] hover:bg-white hover:text-[#181512]"
                href="https://wa.me/8801700000000"
                rel="noreferrer"
                target="_blank"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold">Payment methods</h2>
          <div className="mt-4 grid grid-cols-2 gap-1.5">
            {paymentMethods.map((method) => (
              <div
                className="grid min-h-10 place-items-center border border-black/10 bg-white/70 px-2 py-1"
                key={method.label}
              >
                {method.label === 'SSLCommerz' ? (
                  <span className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a3f1d]">
                    Powered by
                  </span>
                ) : null}
                <img
                  alt={method.label}
                  className={`max-w-full object-contain ${
                    method.label === 'SSLCommerz'
                      ? 'max-h-6'
                      : 'max-h-8'
                  }`}
                  loading="lazy"
                  src={method.src}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-black/10 pt-5 text-sm text-[#6b5f53] sm:flex-row">
        <p>© 2026 Artisane. All rights reserved.</p>
        <div className="flex gap-5">
          <Link className="hover:text-[#181512]" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-[#181512]" to="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
