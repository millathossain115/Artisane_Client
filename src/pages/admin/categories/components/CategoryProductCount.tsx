import { useGetProductsQuery } from '../../../../features/products/productApi'

function CategoryProductCount({ categoryId }: { categoryId: string }) {
  const {
    data: productList,
    isError,
    isLoading,
  } = useGetProductsQuery({
    category: categoryId,
    limit: 1,
    page: 1,
  })
  const productCount = productList?.meta.total ?? productList?.data.length ?? 0

  if (isLoading) {
    return (
      <span
        className="inline-flex min-h-8 min-w-10 items-center justify-center bg-[#f8f3ea] px-3 text-xs font-bold text-[#6b5f53]"
        title="Products loading"
      >
        ...
      </span>
    )
  }

  if (isError) {
    return (
      <span
        className="inline-flex min-h-8 min-w-10 items-center justify-center bg-[#fff5ef] px-3 text-xs font-bold text-[#8f3f1d]"
        title="Product count failed"
      >
        -
      </span>
    )
  }

  return (
    <span
      className="inline-flex min-h-8 min-w-10 items-center justify-center border border-[#7a3f1d]/15 bg-[#f8f3ea] px-3 text-xs font-bold text-[#7a3f1d]"
      title={`${productCount} ${productCount === 1 ? 'product' : 'products'}`}
    >
      {productCount}
    </span>
  )
}

export default CategoryProductCount
