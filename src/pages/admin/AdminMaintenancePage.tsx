import { Clock3, MessageSquareText, Settings, type LucideIcon } from 'lucide-react'

import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNavItems } from './adminNavItems'

type AdminMaintenancePageProps = {
  feature: 'messages' | 'settings'
}

const featureContent: Record<
  AdminMaintenancePageProps['feature'],
  {
    icon: LucideIcon
    title: string
    subtitle: string
  }
> = {
  messages: {
    icon: MessageSquareText,
    subtitle:
      'Customer messages, contact requests, and support inbox tools are not available yet.',
    title: 'Messages',
  },
  settings: {
    icon: Settings,
    subtitle:
      'Store settings, admin preferences, and configuration tools are not available yet.',
    title: 'Settings',
  },
}

function AdminMaintenancePage({ feature }: AdminMaintenancePageProps) {
  const content = featureContent[feature]
  const Icon = content.icon

  return (
    <DashboardLayout
      eyebrow="Coming soon"
      helperText="This admin feature is planned but not active in the current version."
      sidebarItems={adminNavItems}
      subtitle={content.subtitle}
      title={content.title}
      workspaceLabel="Marketplace studio"
    >
      <section className="border border-black/10 bg-white">
        <div className="flex flex-col gap-5 p-8 sm:flex-row sm:items-center">
          <span className="grid h-16 w-16 shrink-0 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <Icon className="h-8 w-8" />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7a3f1d]">
              Under maintenance
            </p>
            <h2 className="mt-2 text-3xl font-bold">Feature unavailable</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b5f53]">
              This area is being prepared and will come soon.
            </p>
          </div>

          <span className="ml-auto hidden items-center gap-2 border border-black/10 px-4 py-3 text-sm font-bold text-[#6b5f53] md:inline-flex">
            <Clock3 className="h-4 w-4 text-[#7a3f1d]" />
            Not live yet
          </span>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default AdminMaintenancePage
