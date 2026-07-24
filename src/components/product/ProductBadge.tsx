type ProductBadgeProps = {
  children: React.ReactNode
  variant?: 'danger' | 'neutral' | 'success'
}

function ProductBadge({ children, variant = 'neutral' }: ProductBadgeProps) {
  const variantClass =
    variant === 'danger'
      ? 'bg-[#8f3f1d] text-white shadow'
      : variant === 'success'
        ? 'bg-[#effaf3] text-[#1f6b43]'
        : 'bg-white text-[#7a3f1d] border border-black/10'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:px-2.5 sm:py-1 sm:text-xs ${variantClass}`}
    >
      {children}
    </span>
  )
}

export default ProductBadge
