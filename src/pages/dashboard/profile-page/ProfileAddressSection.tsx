import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import {
  createAddress,
  deleteAddress,
  fetchMyAddresses,
  setDefaultAddress,
  updateAddress,
  type UserAddress,
} from '../../../features/address/addressApi'
import {
  useGetDistrictsQuery,
  useGetZonesQuery,
} from '../../../features/locations/locationApi'
import ProfileAddressConfirmDialogs from './components/ProfileAddressConfirmDialogs'
import ProfileAddressHeader from './components/ProfileAddressHeader'
import ProfileAddressList from './components/ProfileAddressList'
import ProfileAddressModal from './components/ProfileAddressModal'
import {
  createAddressFormStateFromAddress,
  createEmptyAddressFormState,
  hasAddressFormChanged,
  type AddressConfirmAction,
} from './profileAddressUtils'

type ProfileAddressSectionProps = {
  fieldClass: string
  isAdminProfile: boolean
}

function ProfileAddressSection({
  fieldClass,
  isAdminProfile,
}: ProfileAddressSectionProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null)
  const [formState, setFormState] = useState(() =>
    createEmptyAddressFormState(),
  )
  const [pendingConfirm, setPendingConfirm] =
    useState<AddressConfirmAction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [defaultingId, setDefaultingId] = useState<string | null>(null)

  const { data: districts = [] } = useGetDistrictsQuery()
  const { data: zones = [] } = useGetZonesQuery(formState.districtId, {
    skip: !formState.districtId,
  })

  const isFormChanged = hasAddressFormChanged(formState, editingAddress)

  useEffect(() => {
    if (isAdminProfile) return
    loadAddresses()
  }, [isAdminProfile])

  async function loadAddresses() {
    try {
      setLoading(true)
      const data = await fetchMyAddresses()
      setAddresses(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  function openAddModal() {
    setEditingAddress(null)
    setFormState(createEmptyAddressFormState(addresses.length === 0))
    setIsModalOpen(true)
  }

  function openEditModal(addr: UserAddress) {
    setEditingAddress(addr)
    setFormState(createAddressFormStateFromAddress(addr))
    setIsModalOpen(true)
  }

  function handleSaveClick(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isFormChanged) return
    setPendingConfirm('save')
  }

  async function executeSave() {
    setPendingConfirm(null)
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formState)
        toast.success('Address updated successfully.')
      } else {
        await createAddress(formState)
        toast.success('Address saved successfully.')
      }
      setIsModalOpen(false)
      await loadAddresses()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save address'
      setError(msg)
      toast.error(msg)
    }
  }

  function requestDelete(id: string) {
    setDeletingId(id)
    setPendingConfirm('delete')
  }

  async function executeDelete() {
    if (!deletingId) return
    const id = deletingId
    setPendingConfirm(null)
    setDeletingId(null)
    try {
      await deleteAddress(id)
      toast.success('Address deleted successfully.')
      await loadAddresses()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete address'
      setError(msg)
      toast.error(msg)
    }
  }

  function requestSetDefault(id: string) {
    setDefaultingId(id)
    setPendingConfirm('setDefault')
  }

  async function executeSetDefault() {
    if (!defaultingId) return
    const id = defaultingId
    setPendingConfirm(null)
    setDefaultingId(null)
    try {
      await setDefaultAddress(id)
      toast.success('Default address updated.')
      await loadAddresses()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to set default address'
      setError(msg)
      toast.error(msg)
    }
  }

  if (isAdminProfile) {
    return null
  }

  return (
    <section className="border border-black/10 bg-white p-5 transition">
      <ProfileAddressHeader onAdd={openAddModal} />

      {error ? (
        <p className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <ProfileAddressList
        addresses={addresses}
        loading={loading}
        onDelete={requestDelete}
        onEdit={openEditModal}
        onSetDefault={requestSetDefault}
      />

      {isModalOpen ? (
        <ProfileAddressModal
          districts={districts}
          editingAddress={editingAddress}
          fieldClass={fieldClass}
          formState={formState}
          isFormChanged={isFormChanged}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveClick}
          setFormState={setFormState}
          zones={zones}
        />
      ) : null}

      <ProfileAddressConfirmDialogs
        editingAddress={editingAddress}
        onCancelDelete={() => {
          setPendingConfirm(null)
          setDeletingId(null)
        }}
        onCancelSave={() => setPendingConfirm(null)}
        onCancelSetDefault={() => {
          setPendingConfirm(null)
          setDefaultingId(null)
        }}
        onConfirmDelete={executeDelete}
        onConfirmSave={executeSave}
        onConfirmSetDefault={executeSetDefault}
        pendingConfirm={pendingConfirm}
      />
    </section>
  )
}

export default ProfileAddressSection
