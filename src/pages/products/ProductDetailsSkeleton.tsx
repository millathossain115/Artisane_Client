function ProductDetailsSkeletonBlock({
  className = '',
}: {
  className?: string
}) {
  return <div className={`animate-pulse bg-[#e9dfd2] ${className}`} />
}

function ProductDetailsSkeleton() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div>
        <div className="relative overflow-hidden border border-black/10 bg-white">
          <ProductDetailsSkeletonBlock className="aspect-[4/3] w-full bg-[#efe5d8]" />
        </div>

        <div className="mt-4 border border-black/10 bg-white p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <ProductDetailsSkeletonBlock className="h-3 w-28" />
            <ProductDetailsSkeletonBlock className="h-3 w-8" />
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-hidden pb-1 sm:gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductDetailsSkeletonBlock
                className="h-16 w-16 shrink-0 border-2 border-black/10 bg-[#efe5d8] sm:h-20 sm:w-20"
                key={index}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="border border-black/10 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <ProductDetailsSkeletonBlock className="h-3 w-36" />
            <ProductDetailsSkeletonBlock className="h-10 w-10 shrink-0 bg-[#f8f3ea]" />
          </div>

          <ProductDetailsSkeletonBlock className="mt-4 h-10 w-11/12 sm:h-12" />
          <ProductDetailsSkeletonBlock className="mt-3 h-4 w-40" />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ProductDetailsSkeletonBlock className="h-9 w-28" />
            <ProductDetailsSkeletonBlock className="h-7 w-24 bg-[#f8f3ea]" />
            <ProductDetailsSkeletonBlock className="h-7 w-16 bg-[#f8f3ea]" />
          </div>

          <div className="mt-6 space-y-3">
            <ProductDetailsSkeletonBlock className="h-4 w-full" />
            <ProductDetailsSkeletonBlock className="h-4 w-11/12" />
            <ProductDetailsSkeletonBlock className="h-4 w-2/3" />
          </div>

          <div className="mt-6 grid gap-3 border-y border-black/10 py-5 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <ProductDetailsSkeletonBlock className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <ProductDetailsSkeletonBlock className="h-4 w-28" />
                  <ProductDetailsSkeletonBlock className="mt-2 h-3 w-32" />
                </div>
              </div>
            ))}
          </div>

          <ProductDetailsSkeletonBlock className="mt-6 h-4 w-20" />
          <ProductDetailsSkeletonBlock className="mt-2 h-11 w-40" />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProductDetailsSkeletonBlock className="h-12 w-full bg-[#181512]/20" />
            <ProductDetailsSkeletonBlock className="h-12 w-full bg-[#f8f3ea]" />
          </div>
        </div>
      </aside>

      <section className="mt-6 border border-black/10 bg-white lg:col-span-2">
        <div className="border-b border-black/10 p-4 sm:p-5">
          <ProductDetailsSkeletonBlock className="h-3 w-32" />
          <div className="mt-3 grid gap-4 md:grid-cols-[auto_1fr] md:items-center lg:gap-8">
            <div className="border-b border-black/10 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 lg:pr-8">
              <ProductDetailsSkeletonBlock className="h-10 w-24" />
              <ProductDetailsSkeletonBlock className="mt-2 h-4 w-28" />
              <ProductDetailsSkeletonBlock className="mt-2 h-3 w-36" />
            </div>
            <div className="grid w-full max-w-md gap-1.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="grid grid-cols-[74px_1fr_20px] items-center gap-2.5"
                  key={index}
                >
                  <ProductDetailsSkeletonBlock className="h-3 w-full" />
                  <ProductDetailsSkeletonBlock className="h-2 w-full rounded-full" />
                  <ProductDetailsSkeletonBlock className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default ProductDetailsSkeleton
