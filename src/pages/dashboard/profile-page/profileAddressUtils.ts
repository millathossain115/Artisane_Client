import type { UserAddress } from '../../../features/address/addressApi'

export const addressLabelOptions = ['Home', 'Office'] as const

export type AddressFormState = {
  city: string
  districtId: string
  districtName: string
  isDefault: boolean
  label: string
  phone: string
  postalCode: string
  recipientName: string
  streetAddress: string
  zoneId: string
  zoneName: string
}

export type AddressConfirmAction = 'save' | 'delete' | 'setDefault'

export function createEmptyAddressFormState(
  isDefault = false,
): AddressFormState {
  return {
    label: 'Home',
    recipientName: '',
    phone: '',
    streetAddress: '',
    city: '',
    districtId: '',
    districtName: '',
    zoneId: '',
    zoneName: '',
    postalCode: '',
    isDefault,
  }
}

export function createAddressFormStateFromAddress(
  addr: UserAddress,
): AddressFormState {
  return {
    label: addr.label,
    recipientName: addr.recipientName,
    phone: addr.phone,
    streetAddress: addr.streetAddress,
    city: addr.city,
    districtId: addr.districtId || '',
    districtName: addr.districtName || '',
    zoneId: addr.zoneId || '',
    zoneName: addr.zoneName || '',
    postalCode: addr.postalCode || '',
    isDefault: addr.isDefault,
  }
}

export function hasAddressFormChanged(
  formState: AddressFormState,
  editingAddress: UserAddress | null,
) {
  return editingAddress
    ? formState.label !== editingAddress.label ||
        formState.recipientName !== editingAddress.recipientName ||
        formState.phone !== editingAddress.phone ||
        formState.streetAddress !== editingAddress.streetAddress ||
        formState.city !== editingAddress.city ||
        formState.districtId !== (editingAddress.districtId || '') ||
        formState.zoneId !== (editingAddress.zoneId || '') ||
        formState.postalCode !== (editingAddress.postalCode || '') ||
        formState.isDefault !== editingAddress.isDefault
    : true
}

export function getSelectedLabelOption(label: string) {
  return addressLabelOptions.includes(
    label as (typeof addressLabelOptions)[number],
  )
    ? label
    : 'Other'
}
