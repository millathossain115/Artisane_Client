import { LoaderCircle, Trash2 } from 'lucide-react'

import type { Product } from '../../../../features/products/productApi'

type ProductDeleteModalProps = {
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
  product: Product
}

function ProductDeleteModal({
  isDeleting,
  onClose,
  onConfirm,
  product,
}: ProductDeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
        role="dialog"
      >
        <p className="text-sm font-bold text-[#8f3f1d]">Delete product</p>
        <h2 className="mt-2 text-2xl font-bold">Delete {product.name}?</h2>
        <p className="mt-3 text-sm leading-6 text-[#6b5f53]">
          This will remove the product from the marketplace database.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="btn-secondary"
            disabled={isDeleting}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn-danger disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isDeleting ? 'Deleting...' : 'Confirm delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDeleteModal
