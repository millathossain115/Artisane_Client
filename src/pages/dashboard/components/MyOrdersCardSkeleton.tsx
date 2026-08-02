function MyOrdersCardSkeleton() {
  return (
    <div className="grid gap-4 p-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="animate-pulse border border-black/10 bg-white p-5"
          key={index}
        >
          <div className="flex flex-col gap-3 border-b border-black/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-16 bg-[#e8ded5]" />
                <div className="h-5 w-36 bg-[#e8ded5]" />
                <div className="h-4 w-20 bg-[#f0e8e0]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                <div className="h-4 w-36 bg-[#f0e8e0]" />
                <div className="h-4 w-32 bg-[#f0e8e0]" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <div className="h-8 w-28 bg-[#effaf3]" />
              <div className="h-8 w-28 bg-[#f1dfc8]" />
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div
                className="grid gap-3 border-t border-black/10 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                key={itemIndex}
              >
                <div className="flex min-w-0 gap-3">
                  <div className="h-16 w-16 shrink-0 bg-[#f8f3ea]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-52 max-w-full bg-[#e8ded5]" />
                    <div className="mt-2 h-3 w-20 bg-[#f0e8e0]" />
                  </div>
                </div>
                <div className="h-3 w-20 bg-[#f0e8e0]" />
                <div className="h-5 w-16 bg-[#e8ded5]" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-8 w-32 bg-[#e8ded5]" />
            <div className="flex flex-wrap gap-2">
              <div className="h-10 w-24 bg-[#f0e8e0]" />
              <div className="h-10 w-24 bg-[#f0e8e0]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyOrdersCardSkeleton
