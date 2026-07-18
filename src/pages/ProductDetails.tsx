import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { addToCart, createCartItem } from '../features/cart/cartSlice'
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from '../features/products/productApi'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  getAssetUrl,
  getProductCategoryId,
  getProductCategoryName,
} from '../utils/productDisplay'
import ProductGallery from './products/ProductGallery'
import ProductPurchasePanel from './products/ProductPurchasePanel'
import ProductShelfSection from './products/ProductShelfSection'
import RecentlyViewedSection from './products/RecentlyViewedSection'
import {
  loadRecentProducts,
  saveRecentProduct,
} from './products/recentProducts'

function ProductDetails() {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const { id } = useParams<{ id: string }>()
  const {
    data: product,
    isError,
    isLoading,
  } = useGetProductByIdQuery(id ?? '', {
    skip: !id,
  })
  const categoryId = getProductCategoryId(product)
  const { data: similarProductList } = useGetProductsQuery(
    {
      category: categoryId,
      limit: 5,
      page: 1,
    },
    { skip: !categoryId },
  )
  const { data: mayLikeProductList } = useGetProductsQuery({
    limit: 24,
    page: 1,
  })
  const [selectedImage, setSelectedImage] = useState({
    productId: '',
    value: '',
  })
  const [quantitySelection, setQuantitySelection] = useState({
    productId: '',
    value: 1,
  })
  const [status, setStatus] = useState({
    message: '',
    productId: '',
  })

  const productImages = useMemo(
    () => product?.images?.map((image) => getAssetUrl(image) ?? image) ?? [],
    [product?.images],
  )
  const mainImage =
    selectedImage.productId === product?._id && selectedImage.value
      ? selectedImage.value
      : productImages[0]
  const similarProducts =
    similarProductList?.data.filter((item) => item._id !== product?._id) ?? []
  const similarProductIds = new Set(similarProducts.map((item) => item._id))
  const mayLikeProducts =
    mayLikeProductList?.data.filter(
      (item) =>
        item._id !== product?._id &&
        getProductCategoryId(item) !== categoryId &&
        !similarProductIds.has(item._id),
    ) ?? []
  const isOutOfStock = !product || product.stock <= 0
  const quantity =
    quantitySelection.productId === product?._id ? quantitySelection.value : 1
  const safeQuantity = product ? Math.min(quantity, product.stock) : quantity
  const recentProducts = loadRecentProducts(product?._id ?? id)
  const visibleStatus =
    status.productId === product?._id ? status.message : ''

  useEffect(() => {
    if (!product) {
      return
    }

    saveRecentProduct(product)
  }, [product])

  function updateQuantity(nextQuantity: number) {
    if (!product) {
      return
    }

    setQuantitySelection({
      productId: product._id,
      value: Math.min(Math.max(1, nextQuantity), product.stock),
    })
  }

  function selectImage(image: string) {
    if (!product) {
      return
    }

    setSelectedImage({
      productId: product._id,
      value: image,
    })
  }

  function handleAddToCart() {
    if (!product || isOutOfStock) {
      return
    }

    const isAlreadyInCart = cartItems.some((item) => item.id === product._id)

    dispatch(addToCart(createCartItem(product, safeQuantity)))
    setStatus({
      message: isAlreadyInCart
        ? `${product.name} is already in your cart.`
        : `${product.name} added to cart.`,
      productId: product._id,
    })
  }

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#181512]">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4f463d] transition hover:text-[#181512]"
            to="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          {isLoading ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="aspect-[4/3] animate-pulse bg-white" />
              <div className="min-h-96 animate-pulse bg-white" />
            </div>
          ) : null}

          {isError || (!isLoading && !product) ? (
            <div className="mt-8 border border-[#7a3f1d]/20 bg-white px-5 py-8 text-center">
              <p className="text-lg font-bold">Product not found.</p>
              <p className="mt-2 text-sm text-[#6b5f53]">
                This product may be unavailable or removed.
              </p>
            </div>
          ) : null}

          {product ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <ProductGallery
                images={productImages}
                mainImage={mainImage}
                onSelectImage={selectImage}
                productId={product._id}
                productName={product.name}
              />

              <ProductPurchasePanel
                isOutOfStock={isOutOfStock}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={updateQuantity}
                product={product}
                quantity={safeQuantity}
                statusMessage={visibleStatus}
              />
            </div>
          ) : null}
        </section>

        <ProductShelfSection
          eyebrow="Similar products"
          heading={`More in ${getProductCategoryName(product)}`}
          products={similarProducts}
        />
        <RecentlyViewedSection products={recentProducts} />
        <ProductShelfSection
          eyebrow="You may like"
          heading="Fresh shelf picks"
          products={mayLikeProducts}
        />
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetails
