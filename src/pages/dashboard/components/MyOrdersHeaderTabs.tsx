import type { MyOrderTab, MyOrderTabKey } from '../myOrdersUtils'

type MyOrdersHeaderTabsProps = {
  onTabChange: (value: MyOrderTabKey) => void
  orderCount: number
  selectedTabKey: MyOrderTabKey
  tabs: MyOrderTab[]
}

function MyOrdersHeaderTabs({
  onTabChange,
  orderCount,
  selectedTabKey,
  tabs,
}: MyOrdersHeaderTabsProps) {
  return (
    <div className="border-b border-black/10 px-5 pt-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Orders</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">{orderCount} orders found.</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3f1d]">
          Order history
        </p>
      </div>

      <div
        aria-label="Order status filters"
        className="category-craft-scroll -mx-5 mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain border-t border-black/10 px-5 pt-3 pb-1 touch-pan-x sm:mx-0 sm:px-0"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === selectedTabKey

          return (
            <button
              aria-selected={isActive}
              className={`relative min-h-11 shrink-0 snap-start px-4 text-sm font-bold transition ${
                isActive
                  ? 'bg-[#f8f3ea] text-[#7a3f1d]'
                  : 'text-[#6b5f53] hover:bg-[#f8f3ea] hover:text-[#181512]'
              }`}
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              role="tab"
              type="button"
            >
              {tab.label}
              {isActive ? (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#7a3f1d]" />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrdersHeaderTabs
