import { Mail } from 'lucide-react'

function HomeNewsletter() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 border-y border-black/10 py-10 md:grid-cols-[1fr_0.9fr] md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            Studio list
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
            Get new drops before they reach the shelf.
          </h2>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className="min-h-12 flex-1 border border-black/10 bg-white px-4 text-sm outline-none placeholder:text-[#8a7d71] focus:border-[#181512]"
            placeholder="Email address"
            type="email"
          />
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#181512] px-5 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
            type="button"
          >
            Join list
            <Mail className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default HomeNewsletter
