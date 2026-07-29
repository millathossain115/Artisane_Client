import { useMemo, useState } from 'react'
import brushLineImage from '../assets/home-banners/brush-line-optimized.jpg'
import homeWallArtBanner from '../assets/home-banners/home-wall-art-banner.jpg'
import paintTableImage from '../assets/home-banners/paint-table-optimized.jpg'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useGetCategoriesQuery } from '../features/categories/categoryApi'
import {
  type Product,
  useGetProductsQuery,
} from '../features/products/productApi'
import { useGetHomeHeroQuery } from '../features/homeContent/homeContentApi'
import FeaturedProducts from './home/FeaturedProducts'
import FlashDealBanner from './home/FlashDealBanner'
import VoucherBanner from './home/VoucherBanner'
import FlashDealModal from './home/FlashDealModal'
import HomeCategories from './home/HomeCategories'
import HomeHero from './home/HomeHero'
import HomeNewsletter from './home/HomeNewsletter'
import HomePromoBanners from './home/HomePromoBanners'
import HomeStats from './home/HomeStats'
import HomeTrustStrip from './home/HomeTrustStrip'
import HomeUseCases from './home/HomeUseCases'
import KitProducts from './home/KitProducts'
import LatestProducts from './home/LatestProducts'
import TopRatedProducts from './home/TopRatedProducts'
import WhyChooseUs from './home/WhyChooseUs'
import RecentlyViewedSection from './products/RecentlyViewedSection'
import {
  loadRecentProducts,
  type RecentProduct,
} from './products/recentProducts'
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

function sortTopRatedProducts(products: Product[]) {
  return [...products].sort((firstProduct, secondProduct) => {
    const firstRating = firstProduct.averageRating ?? 0
    const secondRating = secondProduct.averageRating ?? 0
    const firstReviewCount = firstProduct.reviewCount ?? 0
    const secondReviewCount = secondProduct.reviewCount ?? 0
    const firstHasRating = firstRating > 0 && firstReviewCount > 0
    const secondHasRating = secondRating > 0 && secondReviewCount > 0

    if (firstHasRating !== secondHasRating) {
      return firstHasRating ? -1 : 1
    }

    if (firstRating !== secondRating) {
      return secondRating - firstRating
    }

    if (firstReviewCount !== secondReviewCount) {
      return secondReviewCount - firstReviewCount
    }

    return firstProduct.name.localeCompare(secondProduct.name)
  })
}

function Home() {
  const [recentProducts] = useState<RecentProduct[]>(() => loadRecentProducts())
  const { data: heroContent, isLoading: isHeroLoading } = useGetHomeHeroQuery()
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
  const featuredProducts = shuffledProducts.slice(0, 10)
  const topRatedProducts = useMemo(
    () => sortTopRatedProducts(products).slice(0, 5),
    [products],
  )
  const latestProducts = shuffledProducts.slice(10, 20)
  const moreProducts = shuffledProducts.slice(20, 29)
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
        <HomeHero
          fallbackImage={homeWallArtBanner}
          heroContent={heroContent}
          isLoading={isHeroLoading}
        />
        <FlashDealBanner />
        <VoucherBanner />
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
        <HomeTrustStrip />
        <FeaturedProducts
          hasError={hasProductsError}
          isLoading={isProductsLoading}
          products={featuredProducts}
        />
        <RecentlyViewedSection products={recentProducts} />
        <TopRatedProducts
          isLoading={isProductsLoading}
          products={topRatedProducts}
        />
        <LatestProducts
          isLoading={isProductsLoading}
          products={latestProducts}
        />
        <KitProducts
          fallbackProducts={featuredProducts}
          isLoading={isProductsLoading}
          kitCategory={kitCategory}
          products={moreProducts}
        />
        <HomeUseCases />
        <WhyChooseUs />
        <HomeNewsletter />
      </main>

      <Footer />
    </div>
  )
}

export default Home
