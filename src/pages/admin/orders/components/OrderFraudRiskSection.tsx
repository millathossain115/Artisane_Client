import { ShieldCheck } from 'lucide-react'

type OrderFraudRiskSectionProps = {
  fraudFlags: string[]
  fraudRisk: string
}

function OrderFraudRiskSection({
  fraudFlags,
  fraudRisk,
}: OrderFraudRiskSectionProps) {
  return (
    <section
      className={`mt-5 border p-3 ${
        fraudRisk === 'high'
          ? 'border-[#c85f2f]/30 bg-[#fff5ef]'
          : fraudRisk === 'medium'
            ? 'border-[#8a6d00]/25 bg-[#fff9e6]'
            : 'border-[#1f7a4d]/20 bg-[#effaf3]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`grid h-8 w-8 place-items-center text-white ${
              fraudRisk === 'high'
                ? 'bg-[#8f3f1d]'
                : fraudRisk === 'medium'
                  ? 'bg-[#8a6d00]'
                  : 'bg-[#1f6b43]'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#181512]">
            Fraud Risk & Security Verification
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            fraudRisk === 'high'
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : fraudRisk === 'medium'
                ? 'bg-[#fff9e6] text-[#8a6d00]'
                : 'bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          {fraudRisk}
        </span>
      </div>

      {fraudFlags.length ? (
        <div className="mt-3 grid gap-2">
          <span className="text-xs font-bold text-[#6b5f53]">
            Risk indicators flagged:
          </span>
          <ul className="grid gap-1.5 pl-4 text-xs font-semibold text-[#8f3f1d]">
            {fraudFlags.map((flag, index) => (
              <li className="list-disc" key={index}>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-xs font-semibold text-[#1f6b43]">
          No fraud warnings or anomalies flagged for this order.
        </p>
      )}
    </section>
  )
}

export default OrderFraudRiskSection
