import { useEffect, useState } from 'react'
import { Check, Edit, MapPin, Plus, Trash2 } from 'lucide-react'

import {
  createAddress,
  deleteAddress,
  fetchMyAddresses,
  setDefaultAddress,
  updateAddress,
  type UserAddress,
} from '../../../features/address/addressApi'
import { type ProfileForm } from './profilePageUtils'

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
}: ProfileAddressSectionProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null)
  
  const [formState, setFormState] = useState({
    label: 'Home',
    recipientName: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    isDefault: false,
  })

  const [pendingConfirm, setPendingConfirm] = useState<'save' | 'delete' | 'setDefault' | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [defaultingId, setDefaultingId] = useState<string | null>(null)

  const isFormChanged = editingAddress
    ? formState.label !== editingAddress.label ||
      formState.recipientName !== editingAddress.recipientName ||
      formState.phone !== editingAddress.phone ||
      formState.streetAddress !== editingAddress.streetAddress ||
      formState.city !== editingAddress.city ||
      formState.postalCode !== (editingAddress.postalCode || '') ||
      formState.isDefault !== editingAddress.isDefault
    : true

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
    setFormState({
      label: 'Home',
      recipientName: '',
      phone: '',
      streetAddress: '',
      city: '',
      postalCode: '',
      isDefault: addresses.length === 0,
    })
    setIsModalOpen(true)
  }

  function openEditModal(addr: UserAddress) {
    setEditingAddress(addr)
    setFormState({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      streetAddress: addr.streetAddress,
      city: addr.city,
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault,
    })
    setIsModalOpen(true)
  }

  function handleSaveClick(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormChanged) return
    setPendingConfirm('save')
  }

  async function executeSave() {
    setPendingConfirm(null)
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formState)
      } else {
        await createAddress(formState)
      }
      setIsModalOpen(false)
      await loadAddresses()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save address')
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
      await loadAddresses()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete address')
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
      await loadAddresses()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set default address')
    }
  }

  if (isAdminProfile) {
    return null
  }

  return (
    <section className="border border-black/10 bg-white p-5 transition">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Address Book</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              Manage multiple saved shipping addresses.
            </p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 bg-[#181512] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
          onClick={openAddModal}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add new address
        </button>
      </div>

      {error ? (
        <p className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-5 text-sm text-[#6b5f53]">Loading address book...</p>
      ) : addresses.length === 0 ? (
        <p className="mt-5 text-sm text-[#6b5f53]">
          No saved addresses found. Click &quot;Add new address&quot; to save one.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <div
              className={`relative flex flex-col justify-between border p-4 transition ${
                addr.isDefault
                  ? 'border-[#7a3f1d] bg-[#f8f3ea]/40'
                  : 'border-black/10 bg-white'
              }`}
              key={addr._id}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#7a3f1d] uppercase tracking-wider text-xs">
                    {addr.label}
                  </span>
                  {addr.isDefault ? (
                    <span className="inline-flex items-center gap-1 rounded bg-[#7a3f1d] px-2 py-0.5 text-xs font-semibold text-white">
                      <Check className="h-3 w-3" /> Default
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 font-bold text-[#181512]">
                  {addr.recipientName}
                </h3>
                <p className="text-xs text-[#6b5f53]">{addr.phone}</p>
                <p className="mt-2 text-sm text-[#4f463d]">
                  {addr.streetAddress}, {addr.city}{' '}
                  {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-black/10 pt-3 text-xs">
                {!addr.isDefault ? (
                  <button
                    className="font-bold text-[#7a3f1d] underline hover:text-[#181512]"
                    onClick={() => requestSetDefault(addr._id)}
                    type="button"
                  >
                    Set as default
                  </button>
                ) : (
                  <span className="text-xs text-stone-400">Primary delivery</span>
                )}
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-1 text-[#6b5f53] hover:text-[#181512]"
                    onClick={() => openEditModal(addr)}
                    type="button"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    onClick={() => requestDelete(addr._id)}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg border border-black/10 bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#181512]">
              {editingAddress ? 'Edit address' : 'Add new address'}
            </h3>
            <form className="mt-4 grid gap-4" onSubmit={handleSaveClick}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-bold">
                  Label (e.g. Home, Office)
                  <input
                    className={fieldClass}
                    onChange={(e) =>
                      setFormState({ ...formState, label: e.target.value })
                    }
                    required
                    type="text"
                    value={formState.label}
                  />
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
                    setFormState({ ...formState, streetAddress: e.target.value })
                  }
                  required
                  type="text"
                  value={formState.streetAddress}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-bold">
                  City
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
                  onClick={() => setIsModalOpen(false)}
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
      ) : null}

      {pendingConfirm === 'save' ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-black/10 bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-[#181512]">Confirm Save Address</h4>
            <p className="mt-2 text-sm text-[#6b5f53]">
              Are you sure you want to {editingAddress ? 'update' : 'add'} this address?
            </p>
            <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
                onClick={() => setPendingConfirm(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-[#181512] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                onClick={executeSave}
                type="button"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingConfirm === 'setDefault' ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-black/10 bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-[#181512]">Set Default Address</h4>
            <p className="mt-2 text-sm text-[#6b5f53]">
              Are you sure you want to make this your primary delivery address?
            </p>
            <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
                onClick={() => {
                  setPendingConfirm(null)
                  setDefaultingId(null)
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-[#181512] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                onClick={executeSetDefault}
                type="button"
              >
                Confirm Set Default
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingConfirm === 'delete' ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-red-200 bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-red-600">Delete Address Warning</h4>
            <p className="mt-2 text-sm text-[#6b5f53]">
              Are you sure you want to delete this address? Action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
                onClick={() => {
                  setPendingConfirm(null)
                  setDeletingId(null)
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-800"
                onClick={executeDelete}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ProfileAddressSection
