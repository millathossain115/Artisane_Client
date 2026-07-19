import { formatCount } from '../dashboardFormat'

type AdminSummaryTilesProps = {
  totalCategories: number
}

function AdminSummaryTiles({ totalCategories }: AdminSummaryTilesProps) {
  return (
    <section className="mt-6 grid gap-6 md:grid-cols-3">
      {[
        [
          'Catalog health',
          `${formatCount(totalCategories, '0')} active categories`,
          'Audit empty or duplicate collections.',
        ],
        [
          'Customers',
          '42 high-value buyers',
          'Segment by spend and recent activity.',
        ],
        [
          'Messages',
          '9 unread messages',
          'Reply to customer and artisan notes.',
        ],
      ].map(([title, value, detail]) => (
        <article
          className="border border-black/10 bg-white p-5"
          id={title.toLowerCase()}
          key={title}
        >
          <p className="text-sm font-bold text-[#7a3f1d]">{title}</p>
          <h2 className="mt-2 text-2xl font-bold">{value}</h2>
          <p className="mt-3 text-sm leading-6 text-[#6b5f53]">{detail}</p>
        </article>
      ))}
    </section>
  )
}

export default AdminSummaryTiles
