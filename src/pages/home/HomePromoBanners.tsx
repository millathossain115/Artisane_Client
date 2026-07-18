import { ArrowRight, Gift, Percent } from 'lucide-react'

type HomePromoBannersProps = {
  firstImage: string
  secondImage: string
}

function HomePromoBanners({
  firstImage,
  secondImage,
}: HomePromoBannersProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
      <a
        className="group relative min-h-72 overflow-hidden bg-[#181512] p-6 text-white sm:p-8"
        href="#products"
      >
        <img
          alt="Starter kit promotion"
          className="absolute inset-0 h-full w-full object-cover opacity-58 transition duration-500 group-hover:scale-105 group-hover:opacity-72"
          src={firstImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,21,18,0.9),rgba(24,21,18,0.34))]" />
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            <Gift className="h-3.5 w-3.5" />
            Weekend kits
          </span>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            Build a full craft box.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/76">
            Pick kits, tools, storage, and supplies in one pass.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
            Shop kits
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </a>

      <a
        className="group relative min-h-72 overflow-hidden bg-[#7a3f1d] p-6 text-white sm:p-8"
        href="#latest"
      >
        <img
          alt="Latest craft supplies"
          className="absolute inset-0 h-full w-full object-cover opacity-48 transition duration-500 group-hover:scale-105 group-hover:opacity-64"
          src={secondImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(122,63,29,0.92),rgba(122,63,29,0.34))]" />
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
            <Percent className="h-3.5 w-3.5" />
            Fresh stock
          </span>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
            New arrivals are live.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/80">
            More image-backed products across every category.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
            See latest
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </a>
    </section>
  )
}

export default HomePromoBanners
