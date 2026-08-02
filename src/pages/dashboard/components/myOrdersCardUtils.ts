export function getPaginationItems(currentPage: number, totalPage: number) {
  const safeTotalPage = Math.max(1, totalPage)
  const start = Math.max(1, Math.min(currentPage - 1, safeTotalPage - 2))
  const end = Math.min(safeTotalPage, start + 2)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function getOrderStatusBadgeClass(status?: string) {
  switch (status) {
    case 'cancelled':
      return 'bg-[#fff5ef] text-[#8f3f1d]'
    case 'delivered':
      return 'bg-[#effaf3] text-[#1f6b43]'
    case 'shipped':
      return 'bg-[#eef5ff] text-[#235a8f]'
    case 'processing':
      return 'bg-[#fff9e6] text-[#8a6d00]'
    default:
      return 'bg-[#f1dfc8] text-[#7a3f1d]'
  }
}

export function getPaymentStatusBadgeClass(status?: string) {
  switch (status) {
    case 'paid':
      return 'bg-[#effaf3] text-[#1f6b43]'
    case 'failed':
    case 'unpaid':
      return 'bg-[#fff5ef] text-[#8f3f1d]'
    case 'refunded':
      return 'bg-[#eef5ff] text-[#235a8f]'
    default:
      return 'bg-[#fff9e6] text-[#8a6d00]'
  }
}
