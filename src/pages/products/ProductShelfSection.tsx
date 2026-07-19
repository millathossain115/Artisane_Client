import ProductShelfCard from '../../components/product/ProductShelfCard'
import type { Product } from '../../features/products/productApi'

type ProductShelfSectionProps = {
  eyebrow: string
  heading: string
  products: Product[]
}

function ProductShelfSection({
  eyebrow,
  heading,
  products,
}: ProductShelfSectionProps) {
  if (!products.length) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7a3f1d]">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold">{heading}</h2>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {products.slice(0, 4).map((item) => (
          <ProductShelfCard key={item._id} product={item} />
        ))}
      </div>
    </section>
  )
}

export default ProductShelfSection
