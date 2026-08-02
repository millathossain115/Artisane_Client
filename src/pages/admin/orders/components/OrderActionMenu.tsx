import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { EllipsisVertical, Eye, RefreshCw, Trash2 } from 'lucide-react'

import type { Order } from '../../../../features/orders/orderApi'
import { canCancelOrder, formatOrderId } from '../../../../utils/orderDisplay'
import type { ConfirmTarget } from '../orderAdminUtils'

type OrderActionMenuProps = {
  detailUrl: string
  order: Order
  setConfirmTarget: Dispatch<SetStateAction<ConfirmTarget | null>>
}

function OrderActionMenu({
  detailUrl,
  order,
  setConfirmTarget,
}: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const orderLabel = formatOrderId(order._id)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function handleConfirm(type: ConfirmTarget['type']) {
    setIsOpen(false)
    setConfirmTarget({ order, type })
  }

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Open actions for ${orderLabel}`}
        className="grid h-9 w-9 place-items-center border border-black/10 bg-white text-[#181512] transition hover:border-[#181512] hover:bg-[#f8f3ea]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-10 z-30 min-w-40 border border-black/10 bg-white p-1 shadow-[0_18px_38px_rgba(24,21,18,0.16)]"
          role="menu"
        >
          <Link
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#181512] transition hover:bg-[#f8f3ea]"
            onClick={() => setIsOpen(false)}
            role="menuitem"
            to={detailUrl}
          >
            <Eye className="h-3.5 w-3.5" />
            Details
          </Link>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#8f3f1d] transition hover:bg-[#fff5ef] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canCancelOrder(order)}
            onClick={() => handleConfirm('cancel')}
            role="menuitem"
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Cancel order
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-[#8f3f1d] transition hover:bg-[#fff5ef]"
            onClick={() => handleConfirm('delete')}
            role="menuitem"
            type="button"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete order
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default OrderActionMenu
