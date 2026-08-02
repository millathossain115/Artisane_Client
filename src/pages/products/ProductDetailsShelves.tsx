import type { Product } from '../../features/products/productApi'
import { getProductCategoryName } from '../../utils/productDisplay'
import ProductShelfSection from './ProductShelfSection'
import RecentlyViewedSection from './RecentlyViewedSection'
import type { RecentProduct } from './recentProducts'

type ProductDetailsShelvesProps = {
  categoryProductsLink: string
  latestProducts: Product[]
  mayLikeProducts: Product[]
  product?: Product | null
  recentProducts: RecentProduct[]
  similarProducts: Product[]
  topRatedProducts: Product[]
}

function ProductDetailsShelves({
  categoryProductsLink,
  latestProducts,
  mayLikeProducts,
  product,
  recentProducts,
  similarProducts,
  topRatedProducts,
}: ProductDetailsShelvesProps) {
  return (
    <>
      <ProductShelfSection
        actionLabel="See more"
        actionTo={categoryProductsLink}
        eyebrow="Similar products"
        heading={`More in ${getProductCategoryName(product)}`}
        products={similarProducts}
      />
      <RecentlyViewedSection
        actionLabel="Explore more"
        actionTo="/products"
        products={recentProducts}
      />
      <ProductShelfSection
        actionLabel="View more"
        actionTo="/products"
        eyebrow="You may like"
        heading="Fresh shelf picks"
        products={mayLikeProducts}
      />
      <ProductShelfSection
        actionLabel="View top rated"
        actionTo="/products?sort=rating-desc"
        eyebrow="Top rated"
        heading="Best-rated craft picks"
        products={topRatedProducts}
      />
      <ProductShelfSection
        actionLabel="View latest"
        actionTo="/products?sort=newest"
        eyebrow="Latest arrivals"
        heading="New on the shelf"
        products={latestProducts}
      />
    </>
  )
}

export default ProductDetailsShelves
