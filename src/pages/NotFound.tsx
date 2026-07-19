import { ArrowLeft, Home, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import brushLineImage from '../assets/brush-line-optimized.jpg'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main className="mx-auto grid min-h-[calc(100svh-12rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.75fr)] lg:px-8">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a3f1d]">
            404
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
            This page wandered off the shelf.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#5f564d]">
            The link may be old, moved, or mistyped. Head back to the shop and
            keep browsing handmade finds.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
              to="/products"
            >
              <Search className="h-4 w-4" />
              Browse products
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-black/10 bg-white px-5 text-sm font-bold transition hover:border-[#181512]"
              to="/"
            >
              <Home className="h-4 w-4" />
              Back home
            </Link>
          </div>

          <Link
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#7a3f1d] transition hover:text-[#181512]"
            to="/categories"
          >
            <ArrowLeft className="h-4 w-4" />
            View all categories
          </Link>
        </section>

        <div className="relative hidden min-h-[28rem] overflow-hidden bg-[#181512] lg:block">
          <img
            alt="Paint brushes and handmade studio materials"
            className="h-full w-full object-cover opacity-80"
            src={brushLineImage}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#181512]/85 to-transparent p-6 text-white">
            <p className="text-sm font-bold">Still shopping?</p>
            <p className="mt-1 text-sm text-white/80">
              Fresh products and categories are just one click away.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFound
