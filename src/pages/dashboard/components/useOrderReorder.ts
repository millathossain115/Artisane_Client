import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  addToCart,
  createCartItem,
  createCartItemFromOrderItem,
} from '../../../features/cart/cartSlice'
import type { Order } from '../../../features/orders/orderApi'
import { useLazyGetProductByIdQuery } from '../../../features/products/productApi'

function useOrderReorder() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [fetchProduct] = useLazyGetProductByIdQuery()
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(
    null,
  )

  async function handleReorder(order: Order) {
    if (!order.items?.length) {
      return
    }

    setReorderingOrderId(order._id)

    try {
      let added = false
      for (const item of order.items) {
        const productId =
          typeof item.product === 'object' && item.product
            ? item.product._id
            : typeof item.product === 'string'
              ? item.product
              : item._id || ''

        try {
          if (productId) {
            const freshProduct = await fetchProduct(productId).unwrap()
            if (
              freshProduct &&
              !freshProduct.isDeleted &&
              freshProduct.stock > 0
            ) {
              dispatch(
                addToCart(createCartItem(freshProduct, item.quantity ?? 1)),
              )
              added = true
              continue
            }
          }
        } catch {
          // fallback to item snapshot
        }

        dispatch(addToCart(createCartItemFromOrderItem(item)))
        added = true
      }

      if (added) {
        navigate('/checkout')
      }
    } finally {
      setReorderingOrderId(null)
    }
  }

  return { handleReorder, reorderingOrderId }
}

export default useOrderReorder
