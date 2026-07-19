type ProductCatalogHeaderProps = {
  categoryName?: string
  resultEnd: number
  resultStart: number
  searchTerm: string
  totalProducts: number
}

function ProductCatalogHeader({
  categoryName,
  resultEnd,
  resultStart,
  searchTerm,
  totalProducts,
}: ProductCatalogHeaderProps) {
  const title = searchTerm
    ? `Search: ${searchTerm}`
    : (categoryName ?? 'All products')

  return (
    <section className="border-b border-black/10 pb-6">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
        Products
      </p>
      <div className="mt-3">
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm font-semibold text-[#6b5f53]">
          Showing {resultStart}-{resultEnd} of {totalProducts} products.
        </p>
      </div>
    </section>
  )
}

export default ProductCatalogHeader
