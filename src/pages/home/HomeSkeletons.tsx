type ProductGridSkeletonProps = {
  count?: number
  tone?: 'dark' | 'light'
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#e9dfd2] ${className}`} />
}

export function HomeProductGridSkeleton({
  count = 10,
  tone = 'light',
}: ProductGridSkeletonProps) {
  const isDark = tone === 'dark'

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <article
          className={`overflow-hidden border ${
            isDark ? 'border-white/10 bg-white' : 'border-black/10 bg-white'
          }`}
          key={index}
        >
          <div className="relative aspect-square bg-[#f8f3ea] sm:aspect-[4/5]">
            <SkeletonBlock className="h-full w-full" />
            <div className="absolute left-3 top-3 hidden flex-col gap-1 sm:flex">
              <SkeletonBlock className="h-5 w-16 bg-white/70" />
              <SkeletonBlock className="h-5 w-12 bg-white/70" />
            </div>
            <SkeletonBlock className="absolute right-1 top-1 h-7 w-7 bg-white/80 sm:right-3 sm:top-3 sm:h-9 sm:w-9" />
          </div>

          <div className="p-2 sm:p-3">
            <div className="hidden items-center justify-between gap-3 sm:flex">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-3 w-12" />
            </div>
            <SkeletonBlock className="mt-2 h-3 w-full sm:mt-3 sm:h-4" />
            <SkeletonBlock className="mt-1 h-3 w-3/4 sm:h-4" />
            <SkeletonBlock className="mt-2 hidden h-3 w-2/3 sm:block" />
            <SkeletonBlock className="mt-2 h-4 w-12 sm:mt-4 sm:h-6 sm:w-20" />
            <SkeletonBlock className="mt-1.5 h-8 w-full sm:mt-4 sm:h-10" />
          </div>
        </article>
      ))}
    </div>
  )
}

export function HomeCategoryRailSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          className="relative h-72 w-72 shrink-0 overflow-hidden bg-[#181512]"
          key={index}
        >
          <SkeletonBlock className="absolute inset-0 h-full w-full bg-[#d8cbbb]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,18,0.04),rgba(24,21,18,0.84))]" />
          <div className="relative flex h-full flex-col justify-end p-5">
            <SkeletonBlock className="h-3 w-20 bg-white/35" />
            <SkeletonBlock className="mt-3 h-8 w-44 bg-white/55" />
            <SkeletonBlock className="mt-4 h-3 w-full bg-white/30" />
            <SkeletonBlock className="mt-2 h-3 w-4/5 bg-white/25" />
          </div>
        </div>
      ))}
    </>
  )
}

export function HomeStatSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-y border-black/10 py-5">
      <div className="min-w-0 flex-1">
        <SkeletonBlock className="h-9 w-24" />
        <SkeletonBlock className="mt-3 h-3 w-40" />
      </div>
      <SkeletonBlock className="h-11 w-11 shrink-0 bg-white" />
    </div>
  )
}
