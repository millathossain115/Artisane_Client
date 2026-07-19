import { Mail, MapPin, Phone } from 'lucide-react'

import type { ProfileForm } from './profilePageUtils'

type AccountSummaryCardProps = {
  isAdminProfile: boolean
  profileForm: ProfileForm
  status: string
  error: string
}

function AccountSummaryCard({
  error,
  isAdminProfile,
  profileForm,
  status,
}: AccountSummaryCardProps) {
  return (
    <aside className="h-fit border border-black/10 bg-[#181512] p-5 text-white">
      <h2 className="text-2xl font-bold">Account summary</h2>
      <dl className="mt-5 space-y-4 text-sm">
        {[
          [Mail, 'Email', profileForm.email || 'Not added'],
          [Phone, 'Phone', profileForm.phone || 'Not added'],
          ...(!isAdminProfile
            ? [[MapPin, 'Address', profileForm.address || 'Not added']]
            : []),
        ].map(([Icon, label, value]) => (
          <div
            className="flex gap-3 border-t border-white/10 pt-3"
            key={label as string}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center bg-white text-[#181512]">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <dt className="font-bold text-[#f1c9a6]">{label as string}</dt>
              <dd className="mt-1 break-words text-white/75">
                {value as string}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {(status || error) && (
        <p
          className={`mt-5 border px-4 py-3 text-sm font-semibold ${
            error
              ? 'border-[#c85f2f]/30 bg-[#fff5ef] text-[#8f3f1d]'
              : 'border-[#f1c9a6]/30 bg-white/10 text-[#f1c9a6]'
          }`}
        >
          {error || status}
        </p>
      )}
    </aside>
  )
}

export default AccountSummaryCard
