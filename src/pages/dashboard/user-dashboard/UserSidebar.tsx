import { CircleUserRound, MessageSquareText } from 'lucide-react'

import { supportItems } from './userDashboardData'

function UserSidebar() {
  return (
    <aside className="grid gap-6">
      <section
        className="border border-black/10 bg-[#181512] p-5 text-white"
        id="profile"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-white text-[#181512]">
            <CircleUserRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Profile checklist</h2>
            <p className="mt-1 text-sm text-white/65">
              Keep checkout and delivery details ready.
            </p>
          </div>
        </div>
        <div className="mt-5 h-2 bg-white/15">
          <div className="h-full w-[82%] bg-[#f1c9a6]" />
        </div>
        <ul className="mt-5 space-y-3 text-sm">
          {[
            'Primary email verified',
            'Default address missing',
            'Phone backup recommended',
          ].map((item) => (
            <li
              className="flex items-center justify-between gap-3 border-t border-white/10 pt-3"
              key={item}
            >
              <span>{item}</span>
              <button
                className="text-xs font-bold text-[#f1c9a6]"
                type="button"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-black/10 bg-white p-5" id="support">
        <h2 className="text-2xl font-bold">Support</h2>
        <div className="mt-4 grid gap-2">
          {supportItems.map((item) => (
            <button
              className="flex items-center justify-between border border-black/10 px-4 py-3 text-left text-sm font-bold transition hover:border-[#181512] hover:bg-[#f8f3ea]"
              key={item}
              type="button"
            >
              {item}
              <MessageSquareText className="h-4 w-4" />
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default UserSidebar
