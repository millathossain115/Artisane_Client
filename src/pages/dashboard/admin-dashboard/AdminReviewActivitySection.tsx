import { activity } from './adminDashboardData'

function AdminReviewActivitySection() {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="border border-black/10 bg-white p-5" id="reviews">
        <h2 className="text-2xl font-bold">Review queue</h2>
        <p className="mt-1 text-sm text-[#6b5f53]">
          Product feedback needing moderation.
        </p>
        <div className="mt-5 space-y-3">
          {[
            'Brush Set review has an image',
            'Palette review mentions delivery',
            'Print review pending reply',
          ].map((item) => (
            <div
              className="flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-sm"
              key={item}
            >
              <span>{item}</span>
              <button className="font-bold text-[#7a3f1d]" type="button">
                Open
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-black/10 bg-white p-5" id="analytics">
        <h2 className="text-2xl font-bold">Activity timeline</h2>
        <p className="mt-1 text-sm text-[#6b5f53]">
          Recent marketplace changes and signals.
        </p>
        <div className="mt-5 space-y-4">
          {activity.map((item) => {
            const Icon = item.icon

            return (
              <div className="flex gap-4" key={item.title}>
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6b5f53]">{item.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AdminReviewActivitySection
