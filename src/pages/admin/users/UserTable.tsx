import { useState, type FormEvent } from 'react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CircleSlash,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
} from 'lucide-react'

import {
  type AdminUser,
  type UserRole,
  type UserStatus,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
} from '../../../features/users/userApi'

const PAGE_SIZE_OPTIONS = [5, 10, 20]

type UserEditForm = {
  address: string
  city: string
  email: string
  name: string
  phone: string
  postalCode: string
  role: UserRole
  status: UserStatus
}

function formatDate(value?: string) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (!parts.length) {
    return 'U'
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatRole(role?: UserRole) {
  return role === 'admin' ? 'Admin' : 'User'
}

function formatStatus(status?: UserStatus) {
  return status === 'blocked' ? 'Blocked' : 'Active'
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') {
    return fallback
  }

  const errorRecord = error as Record<string, unknown>
  const data = errorRecord.data

  if (data && typeof data === 'object') {
    const dataRecord = data as Record<string, unknown>

    if (typeof dataRecord.message === 'string') {
      return dataRecord.message
    }
  }

  if (typeof errorRecord.message === 'string') {
    return errorRecord.message
  }

  return fallback
}

function UserTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1])
  const [currentPage, setCurrentPage] = useState(1)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null)
  const [userToToggleStatus, setUserToToggleStatus] =
    useState<AdminUser | null>(null)
  const [editForm, setEditForm] = useState<UserEditForm>({
    address: '',
    city: '',
    email: '',
    name: '',
    phone: '',
    postalCode: '',
    role: 'user',
    status: 'active',
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const sharedFilters = {
    role: roleFilter || undefined,
    searchTerm: searchTerm.trim() || undefined,
    status: statusFilter || undefined,
  }
  const {
    data: userList,
    isError: hasUsersError,
    isLoading: isUsersLoading,
  } = useGetUsersQuery({
    limit: pageSize,
    page: currentPage,
    ...sharedFilters,
  })
  const {
    data: userStats,
    isError: hasStatsError,
    isLoading: isStatsLoading,
  } = useGetUserStatsQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const users = userList?.data ?? []
  const userMeta = userList?.meta
  const totalUsers = userMeta?.total ?? users.length
  const totalPages = Math.max(1, userMeta?.totalPage ?? 1)
  const safeCurrentPage = Math.min(userMeta?.page ?? currentPage, totalPages)
  const resultStart = totalUsers
    ? (safeCurrentPage - 1) * (userMeta?.limit ?? pageSize) + 1
    : 0
  const resultEnd = Math.min(
    resultStart + (userMeta?.limit ?? pageSize) - 1,
    totalUsers,
  )
  const customerCount =
    userStats?.roleSummary?.find((role) => role._id === 'user')?.count ??
    userStats?.totalCustomers ??
    0
  const kpis = [
    {
      icon: UsersRound,
      label: 'Total accounts',
      value: userStats?.totalUsers ?? 0,
    },
    {
      icon: ShieldCheck,
      label: 'Admins',
      value: userStats?.totalAdmins ?? 0,
    },
    {
      icon: UserRound,
      label: 'Customers',
      value: customerCount,
    },
    {
      icon: CircleSlash,
      label: 'Blocked',
      value: userStats?.blockedUsers ?? 0,
    },
  ]

  function resetFilters() {
    setSearchTerm('')
    setRoleFilter('')
    setStatusFilter('')
    setPageSize(PAGE_SIZE_OPTIONS[1])
    setCurrentPage(1)
  }

  function openEditModal(user: AdminUser) {
    setStatusMessage('')
    setErrorMessage('')
    setUserToEdit(user)
    setEditForm({
      address: user.address ?? '',
      city: user.city ?? '',
      email: user.email,
      name: user.name,
      phone: user.phone ?? '',
      postalCode: user.postalCode ?? '',
      role: user.role ?? 'user',
      status: user.status ?? 'active',
    })
  }

  function updateEditField(field: keyof UserEditForm, value: string) {
    setStatusMessage('')
    setErrorMessage('')
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!userToEdit) {
      return
    }

    setStatusMessage('')
    setErrorMessage('')

    try {
      await updateUser({
        address: editForm.address.trim(),
        city: editForm.city.trim(),
        email: editForm.email.trim(),
        id: userToEdit._id,
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || undefined,
        postalCode: editForm.postalCode.trim(),
        role: editForm.role,
        status: editForm.status,
      }).unwrap()

      setStatusMessage('User updated successfully.')
      setUserToEdit(null)
    } catch (caughtError) {
      setErrorMessage(getErrorMessage(caughtError, 'Failed to update user.'))
    }
  }

  async function handleConfirmToggleStatus() {
    if (!userToToggleStatus) {
      return
    }

    const nextStatus =
      userToToggleStatus.status === 'blocked' ? 'active' : 'blocked'

    setStatusMessage('')
    setErrorMessage('')

    try {
      await updateUser({
        id: userToToggleStatus._id,
        status: nextStatus,
      }).unwrap()

      setStatusMessage(
        `User ${nextStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully.`,
      )
      setUserToToggleStatus(null)
    } catch (caughtError) {
      setErrorMessage(
        getErrorMessage(caughtError, 'Failed to update user status.'),
      )
    }
  }

  async function handleConfirmDelete() {
    if (!userToDelete) {
      return
    }

    setStatusMessage('')
    setErrorMessage('')

    try {
      await deleteUser(userToDelete._id).unwrap()
      setStatusMessage('User deleted successfully.')
      setUserToDelete(null)
      setCurrentPage((page) =>
        users.length === 1 ? Math.max(1, page - 1) : page,
      )
    } catch (caughtError) {
      setErrorMessage(
        caughtError && typeof caughtError === 'object'
          ? 'Failed to delete user.'
          : 'Failed to delete user.',
      )
    }
  }

  return (
    <section className="mt-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon

          return (
            <div className="border border-black/10 bg-white p-5" key={item.label}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-[#6b5f53]">
                  {item.label}
                </span>
                <span className="grid h-10 w-10 place-items-center bg-[#f8f3ea] text-[#7a3f1d]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-4xl font-bold">
                {isStatsLoading ? '...' : item.value}
              </p>
            </div>
          )
        })}
      </div>

      <section className="mt-6 border border-black/10 bg-white" id="users">
        <div className="flex flex-col gap-4 border-b border-black/10 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Current users</h2>
            <p className="mt-1 text-sm text-[#6b5f53]">
              All customer and admin records currently stored in the database.
            </p>
          </div>

          <button
            className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
            onClick={resetFilters}
            type="button"
          >
            Reset filters
          </button>
        </div>

        {(isUsersLoading || hasUsersError || hasStatsError) && (
          <div
            className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
              hasUsersError || hasStatsError
                ? 'bg-[#fff5ef] text-[#8f3f1d]'
                : 'bg-[#f8f3ea] text-[#6b5f53]'
            }`}
          >
            {hasUsersError || hasStatsError
              ? 'Failed to load user data.'
              : 'Loading users...'}
          </div>
        )}

        {(statusMessage || errorMessage) && (
          <p
            className={`border-b border-black/10 px-5 py-3 text-sm font-semibold ${
              errorMessage
                ? 'bg-[#fff5ef] text-[#8f3f1d]'
                : 'bg-[#effaf3] text-[#1f6b43]'
            }`}
          >
            {errorMessage || statusMessage}
          </p>
        )}

        <div className="grid gap-3 border-b border-black/10 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <label className="grid gap-2 text-sm font-bold">
            Search users
            <span className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b5f53]" />
              <input
                className="min-h-12 w-full border border-black/10 pl-10 pr-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Name, email, phone, or city"
                type="search"
                value={searchTerm}
              />
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-bold">
              Role
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => {
                  setRoleFilter(event.target.value as UserRole | '')
                  setCurrentPage(1)
                }}
                value={roleFilter}
              >
                <option value="">All roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Status
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => {
                  setStatusFilter(event.target.value as UserStatus | '')
                  setCurrentPage(1)
                }}
                value={statusFilter}
              >
                <option value="">All status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-bold">
              Rows
              <select
                className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setCurrentPage(1)
                }}
                value={pageSize}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead className="bg-[#f8f3ea] text-xs uppercase text-[#6b5f53]">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <UserRow
                    key={user._id}
                    onDelete={() => {
                      setStatusMessage('')
                      setErrorMessage('')
                      setUserToDelete(user)
                    }}
                    onEdit={() => openEditModal(user)}
                    onToggleStatus={() => {
                      setStatusMessage('')
                      setErrorMessage('')
                      setUserToToggleStatus(user)
                    }}
                    user={user}
                  />
                ))
              ) : (
                <tr className="border-t border-black/10">
                  <td
                    className="px-5 py-6 text-center font-semibold text-[#6b5f53]"
                    colSpan={8}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold text-[#6b5f53]">
            Showing {resultStart}-{resultEnd} of {totalUsers} users.
          </p>

          <div className="flex items-center gap-2">
            <button
              aria-label="Previous page"
              className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-24 text-center text-sm font-bold">
              Page {safeCurrentPage} of {totalPages}
            </span>
            <button
              aria-label="Next page"
              className="inline-flex h-10 w-10 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {userToDelete && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
            role="presentation"
          >
            <div
              aria-modal="true"
              className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
              role="dialog"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#8f3f1d]">
                    Delete user
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Delete {userToDelete.name}?
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#6b5f53]">
                This will remove the account from the user database.
              </p>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                  disabled={isDeleting}
                  onClick={() => setUserToDelete(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex min-h-11 items-center gap-2 bg-[#8f3f1d] px-4 text-sm font-bold text-white transition hover:bg-[#181512] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  type="button"
                >
                  {isDeleting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isDeleting ? 'Deleting...' : 'Confirm delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {userToToggleStatus && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#181512]/55 px-4"
            role="presentation"
          >
            <div
              aria-modal="true"
              className="w-full max-w-md border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
              role="dialog"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-[#fff5ef] text-[#8f3f1d]">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#8f3f1d]">
                    Change user status
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {userToToggleStatus.status === 'blocked'
                      ? 'Unblock'
                      : 'Block'}{' '}
                    {userToToggleStatus.name}?
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#6b5f53]">
                This will change account access status for this user.
              </p>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                  disabled={isUpdating}
                  onClick={() => setUserToToggleStatus(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUpdating}
                  onClick={handleConfirmToggleStatus}
                  type="button"
                >
                  {isUpdating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : userToToggleStatus.status === 'blocked' ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <CircleSlash className="h-4 w-4" />
                  )}
                  {isUpdating
                    ? 'Updating...'
                    : userToToggleStatus.status === 'blocked'
                      ? 'Confirm unblock'
                      : 'Confirm block'}
                </button>
              </div>
            </div>
          </div>
        )}

        {userToEdit && (
          <div
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#181512]/55 px-4 py-6"
            role="presentation"
          >
            <div
              aria-modal="true"
              className="w-full max-w-2xl border border-black/10 bg-white p-5 shadow-[0_28px_60px_rgba(24,21,18,0.28)]"
              role="dialog"
            >
              <p className="text-sm font-bold text-[#7a3f1d]">Edit user</p>
              <h2 className="mt-2 text-2xl font-bold">{userToEdit.name}</h2>

              <form className="mt-5" onSubmit={handleUpdateSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold">
                    Name
                    <input
                      className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('name', event.target.value)
                      }
                      required
                      type="text"
                      value={editForm.name}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    Email
                    <input
                      className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('email', event.target.value)
                      }
                      required
                      type="email"
                      value={editForm.email}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    Phone
                    <input
                      className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('phone', event.target.value)
                      }
                      type="text"
                      value={editForm.phone}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    City
                    <input
                      className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('city', event.target.value)
                      }
                      type="text"
                      value={editForm.city}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    Postal code
                    <input
                      className="min-h-12 border border-black/10 px-3 text-sm font-medium outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('postalCode', event.target.value)
                      }
                      type="text"
                      value={editForm.postalCode}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    Role
                    <select
                      className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('role', event.target.value)
                      }
                      value={editForm.role}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-bold">
                    Status
                    <select
                      className="min-h-12 border border-black/10 bg-white px-3 text-sm font-bold outline-none transition focus:border-[#181512]"
                      onChange={(event) =>
                        updateEditField('status', event.target.value)
                      }
                      value={editForm.status}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </label>
                </div>

                <label className="mt-5 grid gap-2 text-sm font-bold">
                  Address
                  <textarea
                    className="min-h-24 resize-y border border-black/10 px-3 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-[#8a7d71] focus:border-[#181512]"
                    onChange={(event) =>
                      updateEditField('address', event.target.value)
                    }
                    value={editForm.address}
                  />
                </label>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <button
                    className="min-h-11 border border-black/10 bg-white px-4 text-sm font-bold transition hover:border-[#181512]"
                    disabled={isUpdating}
                    onClick={() => setUserToEdit(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex min-h-11 items-center gap-2 bg-[#181512] px-4 text-sm font-bold text-white transition hover:bg-[#7a3f1d] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isUpdating}
                    type="submit"
                  >
                    {isUpdating ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isUpdating ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </section>
  )
}

function UserRow({
  onDelete,
  onEdit,
  onToggleStatus,
  user,
}: {
  onDelete: () => void
  onEdit: () => void
  onToggleStatus: () => void
  user: AdminUser
}) {
  const isAdmin = user.role === 'admin'
  const isBlocked = user.status === 'blocked'

  return (
    <tr className="border-t border-black/10 transition hover:bg-[#f8f3ea]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden bg-[#f8f3ea] text-sm font-bold text-[#7a3f1d]">
            {user.avatar ? (
              <img alt="" className="h-full w-full object-cover" src={user.avatar} />
            ) : (
              getInitials(user.name)
            )}
          </span>
          <span>
            <span className="block font-bold">{user.name}</span>
            <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#6b5f53]">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </span>
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex min-h-8 items-center px-3 text-xs font-bold ${
            isAdmin
              ? 'bg-[#181512] text-white'
              : 'bg-[#f8f3ea] text-[#7a3f1d]'
          }`}
        >
          {formatRole(user.role)}
        </span>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex min-h-8 items-center px-3 text-xs font-bold ${
            isBlocked
              ? 'bg-[#fff5ef] text-[#8f3f1d]'
              : 'bg-[#effaf3] text-[#1f6b43]'
          }`}
        >
          {formatStatus(user.status)}
        </span>
      </td>
      <td className="px-5 py-4 text-[#6b5f53]">{user.phone || 'No phone'}</td>
      <td className="px-5 py-4 text-[#6b5f53]">
        {user.city ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#7a3f1d]" />
            {user.city}
          </span>
        ) : (
          'No city'
        )}
      </td>
      <td className="max-w-xs px-5 py-4 text-[#6b5f53]">
        <span className="line-clamp-2">{user.address || 'No address'}</span>
      </td>
      <td className="px-5 py-4 text-[#6b5f53]">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            aria-label={`Edit ${user.name}`}
            className="inline-flex h-9 w-9 items-center justify-center border border-black/10 text-[#181512] transition hover:border-[#181512] hover:bg-white"
            onClick={onEdit}
            type="button"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            aria-label={`${isBlocked ? 'Unblock' : 'Block'} ${user.name}`}
            className={`inline-flex h-9 w-9 items-center justify-center border transition ${
              isBlocked
                ? 'border-[#1f7a4d]/20 text-[#1f6b43] hover:border-[#1f6b43] hover:bg-[#effaf3]'
                : 'border-[#c85f2f]/25 text-[#8f3f1d] hover:border-[#8f3f1d] hover:bg-[#fff5ef]'
            }`}
            onClick={onToggleStatus}
            type="button"
          >
            {isBlocked ? (
              <ShieldCheck className="h-4 w-4" />
            ) : (
              <CircleSlash className="h-4 w-4" />
            )}
          </button>
          <button
            aria-label={`Delete ${user.name}`}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#c85f2f]/25 text-[#8f3f1d] transition hover:border-[#8f3f1d] hover:bg-[#fff5ef]"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default UserTable
