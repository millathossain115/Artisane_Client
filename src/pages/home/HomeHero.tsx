import { ArrowRight, Sparkles } from 'lucide-react'

type HomeHeroProps = {
  image: string
}

function HomeHero({ image }: HomeHeroProps) {
  return (
    <section className="hero-enter relative isolate overflow-hidden bg-[#181512]">
      <img
        alt="Living room with abstract wall painting"
        className="absolute inset-0 h-full w-full object-cover opacity-72"
        src={image}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.94),rgba(24,21,18,0.64),rgba(24,21,18,0.18))]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,#f6f0e5,rgba(246,240,229,0))]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-132px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-[620px] lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f1c9a6]">
            <Sparkles className="h-4 w-4" />
            New in the atelier
          </p>
          <h1 className="text-5xl font-bold leading-none sm:text-6xl lg:text-7xl">
            Artisane
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/84">
            Shop stocked kits, tools, and craft materials from the latest
            marketplace edit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#181512] transition hover:bg-[#f1dfc8]"
              href="#products"
            >
              Shop products
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
  )
}

export default HomeHero
