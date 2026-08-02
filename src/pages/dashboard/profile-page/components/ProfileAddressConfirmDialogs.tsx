import type { UserAddress } from '../../../../features/address/addressApi'
import type { AddressConfirmAction } from '../profileAddressUtils'

type ProfileAddressConfirmDialogsProps = {
  editingAddress: UserAddress | null
  onCancelDelete: () => void
  onCancelSave: () => void
  onCancelSetDefault: () => void
  onConfirmDelete: () => void
  onConfirmSave: () => void
  onConfirmSetDefault: () => void
  pendingConfirm: AddressConfirmAction | null
}

function ProfileAddressConfirmDialogs({
  editingAddress,
  onCancelDelete,
  onCancelSave,
  onCancelSetDefault,
  onConfirmDelete,
  onConfirmSave,
  onConfirmSetDefault,
  pendingConfirm,
}: ProfileAddressConfirmDialogsProps) {
  return (
    <>
      {pendingConfirm === 'save' ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-black/10 bg-white p-6 shadow-xl">
            <h4 className="text-lg font-bold text-[#181512]">
              Confirm Save Address
            </h4>
            <p className="mt-2 text-sm text-[#6b5f53]">
              Are you sure you want to {editingAddress ? 'update' : 'add'} this
              address?
            </p>
            <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
                onClick={onCancelSave}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-[#181512] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                onClick={onConfirmSave}
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
            <h4 className="text-lg font-bold text-[#181512]">
              Set Default Address
            </h4>
            <p className="mt-2 text-sm text-[#6b5f53]">
              Are you sure you want to make this your primary delivery address?
            </p>
            <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
                onClick={onCancelSetDefault}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-[#181512] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#7a3f1d]"
                onClick={onConfirmSetDefault}
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
            <h4 className="text-lg font-bold text-red-600">
              Delete Address Warning
            </h4>
            <p className="mt-2 text-sm text-[#6b5f53]">
              Are you sure you want to delete this address? Action cannot be
              undone.
            </p>
            <div className="mt-5 flex justify-end gap-3 border-t border-black/10 pt-4">
              <button
                className="px-4 py-2 text-sm font-bold text-[#6b5f53] hover:text-[#181512]"
                onClick={onCancelDelete}
                type="button"
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-800"
                onClick={onConfirmDelete}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProfileAddressConfirmDialogs
