import type { FormEvent, Dispatch, SetStateAction } from 'react'

import type { UserAddress } from '../../../../features/address/addressApi'
import type { LocationOption } from '../../../../features/locations/locationApi'
import {
  addressLabelOptions,
  getSelectedLabelOption,
  type AddressFormState,
} from '../profileAddressUtils'

type ProfileAddressModalProps = {
  districts: LocationOption[]
  editingAddress: UserAddress | null
  fieldClass: string
  formState: AddressFormState
  isFormChanged: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  setFormState: Dispatch<SetStateAction<AddressFormState>>
  zones: LocationOption[]
}

function ProfileAddressModal({
  districts,
  editingAddress,
  fieldClass,
  formState,
  isFormChanged,
  onClose,
  onSubmit,
  setFormState,
  zones,
}: ProfileAddressModalProps) {
  const selectedLabelOption = getSelectedLabelOption(formState.label)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg border border-black/10 bg-white p-6 shadow-xl">
        <h3 className="text-xl font-bold text-[#181512]">
          {editingAddress ? 'Edit address' : 'Add new address'}
        </h3>
        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold">
              Label (e.g. Home, Office)
              <select
                className={fieldClass}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    label: e.target.value === 'Other' ? '' : e.target.value,
                  })
                }
                required
                value={selectedLabelOption}
              >
                {addressLabelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {selectedLabelOption === 'Other' ? (
                <input
                  className={fieldClass}
                  onChange={(e) =>
                    setFormState({ ...formState, label: e.target.value })
                  }
                  required
                  type="text"
                  value={formState.label}
                />
              ) : null}
            </label>
            <label className="grid gap-1 text-xs font-bold">
              Recipient Name
              <input
                className={fieldClass}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    recipientName: e.target.value,
                  })
                }
                required
                type="text"
                value={formState.recipientName}
              />
            </label>
          </div>

          <label className="grid gap-1 text-xs font-bold">
            Phone Number
            <input
              className={fieldClass}
              onChange={(e) =>
                setFormState({ ...formState, phone: e.target.value })
              }
              required
              type="text"
              value={formState.phone}
            />
          </label>

          <label className="grid gap-1 text-xs font-bold">
            Street Address
            <input
              className={fieldClass}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  streetAddress: e.target.value,
                })
              }
              required
              type="text"
              value={formState.streetAddress}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold">
              District
              <select
                className={fieldClass}
                onChange={(e) => {
                  const selected = districts.find((d) => d.id === e.target.value)
                  setFormState({
                    ...formState,
                    districtId: e.target.value,
                    districtName: selected?.name || '',
                    zoneId: '',
                    zoneName: '',
                    city: selected?.name || formState.city,
                  })
                }}
                value={formState.districtId}
              >
                <option value="">Select district</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-xs font-bold">
              Zone / Area
              <select
                className={fieldClass}
                disabled={!formState.districtId}
                onChange={(e) => {
                  const selected = zones.find((z) => z.id === e.target.value)
                  setFormState({
                    ...formState,
                    zoneId: e.target.value,
                    zoneName: selected?.name || '',
                  })
                }}
                value={formState.zoneId}
              >
                <option value="">
                  {!formState.districtId ? 'Select district first' : 'Select zone'}
                </option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold">
              City / Location
              <input
                className={fieldClass}
                onChange={(e) =>
                  setFormState({ ...formState, city: e.target.value })
                }
                required
                type="text"
                value={formState.city}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold">
              Postal Code
              <input
                className={fieldClass}
                onChange={(e) =>
                  setFormState({ ...formState, postalCode: e.target.value })
                }
                type="text"
                value={formState.postalCode}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold mt-1">
            <input
              checked={formState.isDefault}
              onChange={(e) =>
                setFormState({ ...formState, isDefault: e.target.checked })
              }
              type="checkbox"
            />
            Set as default address
          </label>

          <div className="mt-4 flex justify-end gap-3 border-t border-black/10 pt-4">
            <button
              className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="bg-[#181512] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={editingAddress ? !isFormChanged : false}
              type="submit"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileAddressModal
