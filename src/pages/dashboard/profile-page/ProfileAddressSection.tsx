import { MapPin } from 'lucide-react'

import { getReadableValue, type ProfileForm } from './profilePageUtils'

type ProfileAddressSectionProps = {
  fieldClass: string
  isAdminProfile: boolean
  isEditing: boolean
  profileForm: ProfileForm
  readonlyClass: string
  onFieldChange: <K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) => void
}

function ProfileAddressSection({
  fieldClass,
  isAdminProfile,
  isEditing,
  onFieldChange,
  profileForm,
  readonlyClass,
}: ProfileAddressSectionProps) {
  if (isAdminProfile) {
    return null
  }

  return (
    <section className="border border-black/10 bg-white p-5 transition">
      <div className="flex items-center gap-3 border-b border-black/10 pb-4">
        <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Address details</h2>
          <p className="mt-1 text-sm text-[#6b5f53]">
            Saved address fields supported by the profile API.
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold md:col-span-2">
            Address
            <input
              className={fieldClass}
              onChange={(event) => onFieldChange('address', event.target.value)}
              placeholder="Dhaka, Bangladesh"
              type="text"
              value={profileForm.address}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            City
            <input
              className={fieldClass}
              onChange={(event) => onFieldChange('city', event.target.value)}
              placeholder="Dhaka"
              type="text"
              value={profileForm.city}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Postal code
            <input
              className={fieldClass}
              onChange={(event) =>
                onFieldChange('postalCode', event.target.value)
              }
              placeholder="1207"
              type="text"
              value={profileForm.postalCode}
            />
          </label>
        </div>
      ) : (
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ['Address', profileForm.address],
            ['City', profileForm.city],
            ['Postal code', profileForm.postalCode],
          ].map(([label, value]) => (
            <div
              className={`grid gap-2 text-sm font-bold ${
                label === 'Address' ? 'md:col-span-2' : ''
              }`}
              key={label}
            >
              <dt>{label}</dt>
              <dd className={readonlyClass}>{getReadableValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export default ProfileAddressSection
