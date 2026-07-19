function UserSummaryTiles() {
  return (
    <section className="mt-6 grid gap-6 md:grid-cols-3">
      {[
        ['Addresses', '1 saved address', 'Set a default delivery location.'],
        ['Payments', 'No card stored', 'Add a payment method for faster buys.'],
        ['Messages', '3 active threads', 'Follow artist and support replies.'],
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

export default UserSummaryTiles
