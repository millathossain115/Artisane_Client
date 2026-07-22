import { useMemo } from 'react'
import brushLineImage from '../assets/brush-line-optimized.jpg'
import homeWallArtBanner from '../assets/home-wall-art-banner.jpg'
import paintTableImage from '../assets/paint-table-optimized.jpg'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useGetCategoriesQuery } from '../features/categories/categoryApi'
import {
  type Product,
  useGetProductsQuery,
} from '../features/products/productApi'
import FeaturedProducts from './home/FeaturedProducts'
import FlashDealBanner from './home/FlashDealBanner'
import FlashDealModal from './home/FlashDealModal'
import HomeCategories from './home/HomeCategories'
import HomeHero from './home/HomeHero'
import HomeNewsletter from './home/HomeNewsletter'
import HomePromoBanners from './home/HomePromoBanners'
import HomeStats from './home/HomeStats'
import KitProducts from './home/KitProducts'
import LatestProducts from './home/LatestProducts'
import WhyChooseUs from './home/WhyChooseUs'
import { getProductImage } from '../utils/productDisplay'

function shuffleProducts(products: Product[]) {
  const shuffledProducts = [...products]

  for (let index = shuffledProducts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentProduct = shuffledProducts[index]
    shuffledProducts[index] = shuffledProducts[randomIndex]
    shuffledProducts[randomIndex] = currentProduct
  }

  return shuffledProducts
}

function Home() {
  const {
    data: categoryList,
    isError: hasCategoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery({
    limit: 16,
    page: 1,
    sortBy: 'name',
    sortOrder: 'asc',
  })
  const {
    data: productList,
    isError: hasProductsError,
    isLoading: isProductsLoading,
  } = useGetProductsQuery({
    limit: 40,
    page: 1,
  })

  const categories = (categoryList?.data ?? []).filter(
    (category) => category.isActive !== false,
  )
  const products = useMemo(() => productList?.data ?? [], [productList?.data])
  const shuffledProducts = useMemo(() => shuffleProducts(products), [products])
  const totalProducts = productList?.meta.total ?? products.length
  const totalCategories = categoryList?.meta.total ?? categories.length
  const kitCategory =
    categories.find((category) => /kit/i.test(category.name)) ?? categories[0]
  const featuredProducts = shuffledProducts.slice(0, 8)
  const latestProducts = shuffledProducts.slice(8, 16)
  const moreProducts = shuffledProducts.slice(16, 20)
  const bannerProducts = shuffledProducts.filter((product) =>
    getProductImage(product),
  )
  const firstBannerImage = getProductImage(bannerProducts[1]) ?? paintTableImage
  const secondBannerImage = getProductImage(bannerProducts[2]) ?? brushLineImage

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />
      <FlashDealModal />

      <main>
        <HomeHero image={homeWallArtBanner} />
        <FlashDealBanner />
        <HomeStats
          isCategoriesLoading={isCategoriesLoading}
          isProductsLoading={isProductsLoading}
          totalCategories={totalCategories}
          totalProducts={totalProducts}
        />
        <HomeCategories
          categories={categories}
          hasError={hasCategoriesError}
          isLoading={isCategoriesLoading}
        />
        <HomePromoBanners
          firstImage={firstBannerImage}
          secondImage={secondBannerImage}
        />
        <FeaturedProducts
          hasError={hasProductsError}
          isLoading={isProductsLoading}
          products={featuredProducts}
        />
        <LatestProducts
          isLoading={isProductsLoading}
          products={latestProducts}
        />
        <KitProducts
          fallbackProducts={featuredProducts}
          kitCategory={kitCategory}
          products={moreProducts}
        />
        <WhyChooseUs />
        <HomeNewsletter />
      </main>

      <Footer />
    </div>
  )
}

export default Home
