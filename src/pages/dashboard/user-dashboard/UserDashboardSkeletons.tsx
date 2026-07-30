type SkeletonBlockProps = {
  className?: string
}

function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={`animate-pulse bg-[#e9dfd2] ${className}`} />
}

export function DashboardMetricsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section
      className={`grid gap-4 md:grid-cols-2 ${
        count === 5 ? '2xl:grid-cols-5' : '2xl:grid-cols-4'
      }`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <article className="border border-black/10 bg-white p-4" key={index}>
          <div className="flex items-center justify-between gap-4">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-8 w-8 bg-[#f8f3ea]" />
          </div>
          <SkeletonBlock className="mt-3 h-8 w-16" />
          <SkeletonBlock className="mt-2 h-3 w-32" />
        </article>
      ))}
    </section>
  )
}

export function CurrentOrderSkeleton() {
  return (
    <div className="mt-5 grid gap-5 border-t border-black/10 pt-5 md:grid-cols-[76px_1fr_auto] md:items-center">
      <SkeletonBlock className="h-20 w-20 bg-[#f8f3ea]" />
      <div>
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="mt-3 h-4 w-56" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SkeletonBlock className="h-6 w-24 bg-[#f1dfc8]" />
          <SkeletonBlock className="h-4 w-36" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">
        <SkeletonBlock className="h-10 w-24 bg-[#181512]/20" />
        <SkeletonBlock className="h-10 w-24" />
      </div>
    </div>
  )
}

export function WishlistPreviewSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          className="grid grid-cols-[64px_1fr] gap-3 border border-black/10 p-3"
          key={index}
        >
          <SkeletonBlock className="h-16 w-16 bg-[#f8f3ea]" />
          <div className="min-w-0">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-2/3" />
            <SkeletonBlock className="mt-3 h-5 w-16" />
          </div>
        </div>
      ))}
    </>
  )
}

export function OrderDetailSkeleton() {
  return (
    <div className="grid gap-6">
      <section className="border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-3 h-8 w-40" />
            <SkeletonBlock className="mt-2 h-3 w-36" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SkeletonBlock className="h-8 w-28 bg-[#f1dfc8]" />
            <SkeletonBlock className="h-8 w-28 bg-[#effaf3]" />
            <SkeletonBlock className="h-9 w-28 bg-[#181512]/20" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="flex items-center gap-2" key={index}>
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <SkeletonBlock className="h-2 flex-1" />
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div className="border border-black/10 p-3">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-3 h-4 w-full" />
          </div>
          <div className="border border-black/10 p-3">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-3 h-4 w-40" />
          </div>
        </div>
      </section>

      <section className="border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-4 w-28" />
        </div>
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              className="grid grid-cols-[64px_1fr_auto_auto] items-center gap-4 border border-black/10 p-3"
              key={index}
            >
              <SkeletonBlock className="h-16 w-16 bg-[#f8f3ea]" />
              <div>
                <SkeletonBlock className="h-4 w-52" />
                <SkeletonBlock className="mt-2 h-3 w-24" />
              </div>
              <SkeletonBlock className="h-5 w-16" />
              <SkeletonBlock className="h-8 w-24" />
            </article>
          ))}
        </div>
        <div className="mt-5 flex justify-end border-t border-black/10 pt-4">
          <div className="text-right">
            <SkeletonBlock className="ml-auto h-3 w-24" />
            <SkeletonBlock className="mt-2 h-8 w-28" />
          </div>
        </div>
      </section>
    </div>
  )
}

export function AddressBookSkeleton() {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="border border-black/10 bg-white p-4" key={index}>
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-5 w-20 bg-[#f8f3ea]" />
          </div>
          <SkeletonBlock className="mt-4 h-5 w-40" />
          <SkeletonBlock className="mt-2 h-3 w-32" />
          <SkeletonBlock className="mt-3 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-4/5" />
          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProfilePageSkeleton() {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_0.48fr]">
      <section className="border border-black/10 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-12 w-12 bg-[#f8f3ea]" />
            <div>
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="mt-2 h-3 w-56" />
            </div>
          </div>
          <SkeletonBlock className="h-10 w-28 bg-[#181512]/20" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="grid gap-2" key={index}>
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-12 w-full bg-[#f8f3ea]" />
            </div>
          ))}
        </div>
      </section>
      <aside className="border border-black/10 bg-white p-5 2xl:sticky 2xl:top-[132px] 2xl:max-h-[calc(100dvh-132px)] 2xl:self-start 2xl:overflow-y-auto">
        <SkeletonBlock className="h-16 w-16 bg-[#f8f3ea]" />
        <SkeletonBlock className="mt-4 h-6 w-36" />
        <SkeletonBlock className="mt-2 h-3 w-44" />
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="flex items-center justify-between gap-3"
              key={index}
            >
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-3 w-32" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export function WishlistTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr className="border-t border-black/10" key={index}>
          <td className="px-5 py-4">
            <SkeletonBlock className="h-4 w-4" />
          </td>
          <td className="px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <SkeletonBlock className="h-14 w-14 shrink-0 bg-[#f8f3ea]" />
              <div className="min-w-0">
                <SkeletonBlock className="h-4 w-52" />
                <SkeletonBlock className="mt-2 h-3 w-32" />
              </div>
            </div>
          </td>
          <td className="px-5 py-4">
            <SkeletonBlock className="h-6 w-20 bg-[#effaf3]" />
          </td>
          <td className="px-5 py-4">
            <SkeletonBlock className="mx-auto h-8 w-28" />
          </td>
          <td className="px-5 py-4">
            <SkeletonBlock className="h-5 w-14" />
          </td>
          <td className="px-5 py-4">
            <SkeletonBlock className="mx-auto h-8 w-16 bg-[#181512]/20" />
          </td>
          <td className="px-5 py-4">
            <SkeletonBlock className="ml-auto h-8 w-8 bg-[#fff5ef]" />
          </td>
        </tr>
      ))}
    </>
  )
}

export function ReviewableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <article className="border border-black/10 bg-white p-3.5" key={index}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <SkeletonBlock className="h-14 w-14 shrink-0 bg-[#f8f3ea]" />
              <div>
                <SkeletonBlock className="h-4 w-52" />
                <SkeletonBlock className="mt-2 h-3 w-32" />
                <div className="mt-2 flex gap-1.5">
                  <SkeletonBlock className="h-5 w-16 bg-[#effaf3]" />
                  <SkeletonBlock className="h-5 w-32 bg-[#f8f3ea]" />
                </div>
              </div>
            </div>
            <SkeletonBlock className="h-8 w-28" />
          </div>
          <div className="mt-3 border-t border-black/10 pt-3">
            <SkeletonBlock className="h-7 w-44" />
            <SkeletonBlock className="mt-3 h-16 w-full" />
            <SkeletonBlock className="ml-auto mt-3 h-9 w-28 bg-[#181512]/20" />
          </div>
        </article>
      ))}
    </div>
  )
}

export function ReviewHistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <article className="border border-black/10 bg-white p-3.5" key={index}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-3">
              <SkeletonBlock className="h-14 w-14 shrink-0 bg-[#f8f3ea]" />
              <div>
                <SkeletonBlock className="h-4 w-52" />
                <SkeletonBlock className="mt-2 h-3 w-32" />
                <SkeletonBlock className="mt-2 h-4 w-28" />
              </div>
            </div>
            <SkeletonBlock className="h-8 w-28" />
          </div>
          <div className="mt-3 border-t border-black/10 pt-2.5">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="mt-2 h-3 w-4/5" />
            <div className="mt-3 flex justify-between gap-2">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-8 w-32" />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
