import {
  ArrowRight,
  Heart,
  Mail,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'

import artistImage from '../assets/artist-optimized.jpg'
import brushLineImage from '../assets/brush-line-optimized.jpg'
import paintTableImage from '../assets/paint-table-optimized.jpg'
import paletteImage from '../assets/palette-optimized.jpg'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

const categories = [
  {
    name: 'Ceramics',
    count: '42 pieces',
    image: paletteImage,
  },
  {
    name: 'Studio Goods',
    count: '28 pieces',
    image: brushLineImage,
  },
  {
    name: 'Art Prints',
    count: '31 pieces',
    image: artistImage,
  },
]

const products = [
  {
    name: 'Studio Brush Set',
    maker: 'Made by Tara Studio',
    category: 'Tools',
    price: '$48',
    oldPrice: '$62',
    rating: 4.9,
    reviews: 128,
    badge: 'Best seller',
    image: brushLineImage,
  },
  {
    name: 'Oil Color Starter Kit',
    maker: 'North Loom Co.',
    category: 'Paint',
    price: '$36',
    oldPrice: '$45',
    rating: 4.8,
    reviews: 94,
    badge: 'Low stock',
    image: paintTableImage,
  },
  {
    name: 'Handmade Color Palette',
    maker: 'Rafi Woodworks',
    category: 'Studio',
    price: '$29',
    oldPrice: '$39',
    rating: 4.7,
    reviews: 76,
    badge: 'New',
    image: paletteImage,
  },
  {
    name: 'Signed Figure Study Print',
    maker: 'Indigo House',
    category: 'Prints',
    price: '$58',
    oldPrice: '$74',
    rating: 5,
    reviews: 143,
    badge: 'Free ship',
    image: artistImage,
  },
]

const benefits = [
  {
    icon: Truck,
    title: 'Fast delivery',
    detail: 'Dispatch in 24 hours for ready-stock pieces.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    detail: 'Protected payments and verified artisan partners.',
  },
  {
    icon: MapPin,
    title: 'Local makers',
    detail: 'Curated craft from independent studios.',
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#181512]">
      <Navbar />

      <main>
        <section className="hero-enter relative isolate overflow-hidden bg-[#241d17]">
          <img
            alt="Artist holding brushes in a studio"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src={artistImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.92),rgba(24,21,18,0.58),rgba(24,21,18,0.16))]" />
          <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:min-h-[620px] lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="mb-4 text-sm font-semibold uppercase">
                Summer craft edit
              </p>
              <h1 className="max-w-xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Artisane
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/82">
                Handmade art supplies, thoughtful gifts, and studio pieces from
                independent makers.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1dfc8]"
                  href="#products"
                >
                  Shop collection
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  className="inline-flex items-center border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  href="#categories"
                >
                  Browse categories
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8"
          aria-label="Store benefits"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <div
                className="flex items-start gap-4 border-y border-black/10 py-5"
                key={benefit.title}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-white text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold">{benefit.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#6b5f53]">
                    {benefit.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
          id="categories"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#7a3f1d]">
                Shop by craft
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Made for creative days
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-bold text-[#181512]"
              href="#products"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <a
                className="group relative min-h-64 overflow-hidden bg-[#181512]"
                href="#products"
                key={category.name}
              >
                <img
                  alt={`${category.name} collection`}
                  className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-500 group-hover:scale-105 group-hover:opacity-88"
                  src={category.image}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.05),rgba(24,21,18,0.78))]" />
                <div className="relative flex h-full min-h-64 flex-col justify-end p-5 text-white">
                  <span className="text-sm font-semibold">
                    {category.count}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold">{category.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
          id="products"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#7a3f1d]">
                Featured products
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Popular this week
              </h2>
            </div>
            <div className="flex gap-2 text-sm">
              <button
                className="bg-[#181512] px-4 py-2 font-semibold text-white"
                type="button"
              >
                Featured
              </button>
              <button
                className="border border-black/10 bg-white px-4 py-2 font-semibold text-[#4f463d] transition hover:border-[#181512]"
                type="button"
              >
                Newest
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                className="group overflow-hidden border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(24,21,18,0.12)]"
                key={product.name}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9ded0]">
                  <img
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={product.image}
                  />
                  <div className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-bold text-[#7a3f1d]">
                    {product.badge}
                  </div>
                  <button
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-white text-[#181512] transition hover:bg-[#181512] hover:text-white"
                    aria-label={`Save ${product.name}`}
                    type="button"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#7a3f1d]">
                    <span>{product.category}</span>
                    <span className="inline-flex items-center gap-1 text-[#4f463d]">
                      <Star className="h-3.5 w-3.5 fill-[#c85f2f] text-[#c85f2f]" />
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#6b5f53]">{product.maker}</p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <span className="text-xl font-bold">{product.price}</span>
                      <span className="ml-2 text-sm text-[#8a7d71] line-through">
                        {product.oldPrice}
                      </span>
                    </div>
                    <button
                      className="grid h-10 w-10 place-items-center bg-[#181512] text-white transition hover:bg-[#7a3f1d]"
                      aria-label={`Add ${product.name} to cart`}
                      type="button"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#181512] px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-semibold text-[#f1c9a6]">
                Members save first
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
                Get early access to limited batches and maker drops.
              </h2>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                className="min-h-12 flex-1 border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-white"
                placeholder="Email address"
                type="email"
              />
              <button
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-5 text-sm font-bold text-[#181512] transition hover:bg-[#f1dfc8]"
                type="button"
              >
                Join list
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
