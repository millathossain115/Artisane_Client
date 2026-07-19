import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { inventory, sampleOrders } from './adminDashboardData'

function AdminOperationsSection() {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="border border-black/10 bg-white" id="orders">
        <div className="flex items-center justify-between gap-4 border-b border-black/10 p-5">
          <div>
            <h2 className="text-2xl font-bold">Recent orders</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              Latest paid and fulfillment activity.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-sm font-bold transition hover:border-[#181512]"
            to="/dashboard/admin/orders"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr
                  className="border-t border-black/10 transition hover:bg-[#f8f3ea]"
                  key={order.id}
                >
                  <td className="px-5 py-4 font-bold">{order.id}</td>
                  <td className="px-5 py-4">{order.customer}</td>
                  <td className="px-5 py-4 text-[#6b5f53]">{order.item}</td>
                  <td className="px-5 py-4">
                    <span className="bg-[#f1dfc8] px-2 py-1 text-xs font-bold text-[#7a3f1d]">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold">{order.total}</td>
                  <td className="px-5 py-4 text-[#6b5f53]">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="grid gap-6">
        <section
          className="border border-black/10 bg-[#181512] p-5 text-white"
          id="products"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-white text-[#181512]">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold">Inventory alerts</h2>
              <p className="mt-1 text-sm text-white/65">
                Restock these before the next drop.
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-3 text-sm">
            {inventory.map((item) => (
              <li
                className="flex items-center justify-between gap-3 border-t border-white/10 pt-3"
                key={item}
              >
                <span>{item}</span>
                <button
                  className="text-xs font-bold text-[#f1c9a6]"
                  type="button"
                >
                  Restock
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-black/10 bg-white p-5">
          <h2 className="text-2xl font-bold">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            {[
              { label: 'Create product' },
              { label: 'Review refunds' },
              { label: 'Publish collection' },
            ].map((action) => (
              <button
                className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
                key={action.label}
                type="button"
              >
                {action.label}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </section>
      </aside>
    </section>
  )
}

export default AdminOperationsSection
