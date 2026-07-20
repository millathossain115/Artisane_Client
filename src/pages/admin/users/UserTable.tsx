import { useState, type FormEvent } from 'react'
import { CircleSlash, ShieldCheck, UserRound, UsersRound } from 'lucide-react'

import {
  type AdminUser,
  type UserRole,
  type UserStatus,
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
} from '../../../features/users/userApi'
import DeleteUserModal from './components/DeleteUserModal'
import EditUserModal from './components/EditUserModal'
import ToggleUserStatusModal from './components/ToggleUserStatusModal'
import UserFilters from './components/UserFilters'
import UserRowsTable from './components/UserRowsTable'
import UserStatsCards from './components/UserStatsCards'
import {
  getEmptyEditForm,
  getErrorMessage,
  PAGE_SIZE_OPTIONS,
  type UserEditForm,
} from './userTableUtils'

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
  const [editForm, setEditForm] = useState<UserEditForm>(getEmptyEditForm())
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

  function clearMessages() {
    setStatusMessage('')
    setErrorMessage('')
  }

  function resetFilters() {
    setSearchTerm('')
    setRoleFilter('')
    setStatusFilter('')
    setPageSize(PAGE_SIZE_OPTIONS[1])
    setCurrentPage(1)
  }

  function openEditModal(user: AdminUser) {
    clearMessages()
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
    clearMessages()
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function openDeleteModal(user: AdminUser) {
    clearMessages()
    setUserToDelete(user)
  }

  function openToggleStatusModal(user: AdminUser) {
    clearMessages()
    setUserToToggleStatus(user)
  }

  async function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!userToEdit) {
      return
    }

    clearMessages()

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

    clearMessages()

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

    clearMessages()

    try {
      await deleteUser(userToDelete._id).unwrap()
      setStatusMessage('User deleted successfully.')
      setUserToDelete(null)
      setCurrentPage((page) =>
        users.length === 1 ? Math.max(1, page - 1) : page,
      )
    } catch (caughtError) {
      setErrorMessage(getErrorMessage(caughtError, 'Failed to delete user.'))
    }
  }

  return (
    <section className="mt-6">
      <UserStatsCards isLoading={isStatsLoading} kpis={kpis} />

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

        <UserFilters
          pageSize={pageSize}
          roleFilter={roleFilter}
          searchTerm={searchTerm}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setRoleFilter={setRoleFilter}
          setSearchTerm={setSearchTerm}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />

        <UserRowsTable
          onDelete={openDeleteModal}
          onEdit={openEditModal}
          onToggleStatus={openToggleStatusModal}
          resultEnd={resultEnd}
          resultStart={resultStart}
          safeCurrentPage={safeCurrentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalUsers={totalUsers}
          users={users}
        />

        {userToDelete ? (
          <DeleteUserModal
            isDeleting={isDeleting}
            onClose={() => setUserToDelete(null)}
            onConfirm={handleConfirmDelete}
            user={userToDelete}
          />
        ) : null}

        {userToToggleStatus ? (
          <ToggleUserStatusModal
            isUpdating={isUpdating}
            onClose={() => setUserToToggleStatus(null)}
            onConfirm={handleConfirmToggleStatus}
            user={userToToggleStatus}
          />
        ) : null}

        {userToEdit ? (
          <EditUserModal
            editForm={editForm}
            isUpdating={isUpdating}
            onClose={() => setUserToEdit(null)}
            onSubmit={handleUpdateSubmit}
            onUpdateField={updateEditField}
            user={userToEdit}
          />
        ) : null}
      </section>
    </section>
  )
}

export default UserTable
