<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompanyDirectory, type CompanyUser } from '~/composables/useCompanyDirectory'

const { users, provisioningRequests, pendingRequestsCount, approveProvisioningRequest } = useCompanyDirectory()

const searchQuery = ref('')
const selectedRole = ref('all')
const selectedStatus = ref('all')

const isAddUserModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const selectedUser = ref<any>(null)

// Form State
const formName = ref('')
const formEmail = ref('')
const formRole = ref('Project Owner')
const formBelt = ref('Black Belt')
const formBusiness = ref('Food')
const formBu = ref('Chicken Processing')
const formLocation = ref('โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)')

const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.location.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchRole = selectedRole.value === 'all' || u.role === selectedRole.value
    const matchStatus = selectedStatus.value === 'all' || u.status === selectedStatus.value

    return matchSearch && matchRole && matchStatus
  })
})

const getRoleColor = (role: string) => {
  switch (role) {
    case 'System Admin':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'Master Black Belt (MBB)':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'Champion / Sponsor':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Project Owner':
      return 'bg-teal-50 text-[#008779] border-teal-200'
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200'
  }
}

const openAddUser = () => {
  modalMode.value = 'add'
  formName.value = ''
  formEmail.value = ''
  formRole.value = 'Project Owner'
  formBelt.value = 'Black Belt'
  isAddUserModalOpen.value = true
}

const openEditUser = (user: any) => {
  modalMode.value = 'edit'
  selectedUser.value = user
  formName.value = user.name
  formEmail.value = user.email
  formRole.value = user.role
  formBelt.value = user.belt
  formBusiness.value = user.business
  formBu.value = user.bu
  formLocation.value = user.location
  isAddUserModalOpen.value = true
}

const saveUser = () => {
  if (!formName.value.trim() || !formEmail.value.trim()) {
    alert('Please fill in name and email.')
    return
  }

  if (modalMode.value === 'add') {
    const initials = formName.value.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP'
    const newUser: CompanyUser = {
      id: `u-${Date.now()}`,
      employeeId: `CPF-${Math.floor(10000 + Math.random() * 90000)}`,
      name: formName.value.trim(),
      initials,
      email: formEmail.value.trim().toLowerCase(),
      department: formBu.value,
      business: formBusiness.value,
      bu: formBu.value,
      location: formLocation.value,
      role: formRole.value,
      belt: formBelt.value,
      status: 'Active'
    }
    users.value.push(newUser)
    showToast(`Added ${newUser.name} to user directory!`)
  } else if (selectedUser.value) {
    selectedUser.value.name = formName.value
    selectedUser.value.email = formEmail.value
    selectedUser.value.role = formRole.value
    selectedUser.value.belt = formBelt.value
    selectedUser.value.business = formBusiness.value
    selectedUser.value.bu = formBu.value
    selectedUser.value.location = formLocation.value
    showToast(`Updated ${selectedUser.value.name}`)
  }
  isAddUserModalOpen.value = false
}

const toggleStatus = (user: any) => {
  user.status = user.status === 'Active' ? 'Inactive' : 'Active'
  showToast(`User status set to ${user.status}`)
}

const handleQuickApproveProvisioning = (reqId: string) => {
  const res = approveProvisioningRequest(reqId)
  if (res.success) {
    showToast(res.message)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Notification -->
    <div
      v-if="toastMsg"
      class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in"
    >
      <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
      <span>{{ toastMsg }}</span>
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          User Management
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Manage system users, define Role-Based Access Control (RBAC), and approve account provisioning requests
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/approvals"
          class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-clipboard-check" class="size-4 text-[#008779]" />
          <span>Approval Center</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="openAddUser"
        >
          <UIcon name="i-lucide-user-plus" class="size-4" />
          <span>Add New User</span>
        </button>
      </div>
    </div>

    <!-- Alert for Pending Auto-Provisioning Requests -->
    <div
      v-if="pendingRequestsCount > 0"
      class="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between text-xs animate-in slide-in-from-top duration-150"
    >
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <UIcon name="i-lucide-user-plus" class="size-4" />
        </div>
        <div>
          <span class="font-bold text-amber-950 block text-xs">
            {{ pendingRequestsCount }} Pending Account Auto-Provisioning Requests
          </span>
          <span class="text-amber-800 text-[11px]">
            New team members and approvers requested by project leaders requiring Admin approval and automated email invites.
          </span>
        </div>
      </div>

      <NuxtLink
        to="/admin/approvals"
        class="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1 transition-colors"
      >
        <span>Review in Approval Center</span>
        <UIcon name="i-lucide-arrow-right" class="size-3.5" />
      </NuxtLink>
    </div>

    <!-- 4 Stats Cards Bar -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-gray-500 font-medium">Total Directory Users</span>
        <p class="text-xl font-bold text-gray-900 font-mono">{{ users.length }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-purple-700 font-medium">System Admins</span>
        <p class="text-xl font-bold text-purple-700 font-mono">
          {{ users.filter(u => u.role === 'System Admin').length }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-red-700 font-medium">Master Black Belts (MBB)</span>
        <p class="text-xl font-bold text-red-700 font-mono">
          {{ users.filter(u => u.belt === 'Master Black Belt' || u.role.includes('MBB')).length }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-[#008779] font-medium">Project Owners (BB/GB)</span>
        <p class="text-xl font-bold text-[#008779] font-mono">
          {{ users.filter(u => u.role === 'Project Owner' || u.belt === 'Black Belt' || u.belt === 'Green Belt').length }}
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-amber-700 font-medium">Champions / Sponsors</span>
        <p class="text-xl font-bold text-amber-700 font-mono">
          {{ users.filter(u => u.role.includes('Champion')).length }}
        </p>
      </div>
    </div>

    <!-- Table Card with Search & Filters -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="relative flex-1 max-w-sm">
          <UIcon name="i-lucide-search" class="size-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, plant..."
            class="w-full bg-gray-50/70 border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:outline-hidden focus:bg-white focus:border-[#008779]"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Role Filter -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-gray-500">Role:</span>
            <select
              v-model="selectedRole"
              class="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
            >
              <option value="all">All Roles</option>
              <option value="System Admin">System Admin</option>
              <option value="Master Black Belt (MBB)">Master Black Belt (MBB)</option>
              <option value="Champion / Sponsor">Champion / Sponsor</option>
              <option value="Project Owner">Project Owner</option>
              <option value="Member / Viewer">Member / Viewer</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-gray-500">Status:</span>
            <select
              v-model="selectedStatus"
              class="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">USER</th>
              <th class="py-3 px-4 font-semibold">ROLE & BELT</th>
              <th class="py-3 px-4 font-semibold">ORGANIZATION / LOCATION</th>
              <th class="py-3 px-3 font-semibold text-center">EMP ID</th>
              <th class="py-3 px-3 font-semibold text-center">STATUS</th>
              <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50/50">
              <!-- User Name & Email -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-full bg-[#008779] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {{ user.initials }}
                  </div>
                  <div>
                    <span class="font-bold text-gray-900 block text-xs">{{ user.name }}</span>
                    <span class="text-[10px] text-gray-400 font-mono">{{ user.email }}</span>
                  </div>
                </div>
              </td>

              <!-- Role & Belt -->
              <td class="py-3.5 px-4">
                <span
                  class="text-[11px] font-medium px-2 py-0.5 rounded border inline-block"
                  :class="getRoleColor(user.role)"
                >
                  {{ user.role }}
                </span>
                <span class="text-[10px] text-gray-500 block mt-0.5 font-medium">{{ user.belt }}</span>
              </td>

              <!-- Location -->
              <td class="py-3.5 px-4">
                <span class="font-medium text-gray-800 block truncate max-w-xs">{{ user.location }}</span>
                <span class="text-[10px] text-gray-400 block">{{ user.business }} &rsaquo; {{ user.bu || user.department }}</span>
              </td>

              <!-- Emp ID -->
              <td class="py-3.5 px-3 text-center font-mono text-gray-600">
                {{ user.employeeId }}
              </td>

              <!-- Status -->
              <td class="py-3.5 px-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer"
                  :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'"
                  @click="toggleStatus(user)"
                >
                  <span class="size-1.5 rounded-full" :class="user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                  <span>{{ user.status }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-[#008779] p-1 rounded hover:bg-gray-100 transition-colors"
                    title="Edit user"
                    @click="openEditUser(user)"
                  >
                    <UIcon name="i-lucide-edit-3" class="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit User Modal -->
    <div
      v-if="isAddUserModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden text-xs animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="p-4 bg-gradient-to-r from-teal-900 to-[#008779] text-white flex items-center justify-between">
          <h2 class="text-sm font-bold text-white">
            {{ modalMode === 'add' ? 'Add New User to Directory' : 'Edit User Profile' }}
          </h2>
          <button
            type="button"
            class="text-white/80 hover:text-white"
            @click="isAddUserModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Full Name *</label>
            <input
              v-model="formName"
              type="text"
              placeholder="e.g. Somsak Prasert"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-[#008779]"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Email Address (CPF Domain) *</label>
            <input
              v-model="formEmail"
              type="email"
              placeholder="e.g. name@cpf.co.th"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-[#008779]"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Assigned Role *</label>
            <select
              v-model="formRole"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
            >
              <option value="System Admin">System Admin (Full Access)</option>
              <option value="Master Black Belt (MBB)">Master Black Belt (Reviewer / Methodology)</option>
              <option value="Champion / Sponsor">Champion / Sponsor (Project Approver)</option>
              <option value="Project Owner">Project Owner (Project Leader / Six Sigma)</option>
              <option value="Member / Viewer">Member / Viewer (Read-only)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Six Sigma Belt Level</label>
            <select
              v-model="formBelt"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
            >
              <option value="None">None</option>
              <option value="Yellow Belt">Yellow Belt (YB)</option>
              <option value="Green Belt">Green Belt (GB)</option>
              <option value="Black Belt">Black Belt (BB)</option>
              <option value="Master Black Belt">Master Black Belt (MBB)</option>
              <option value="Champion">Champion</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-semibold text-gray-700 block">Business</label>
              <select
                v-model="formBusiness"
                class="w-full bg-white border border-gray-200 rounded-md px-2.5 py-2 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
              >
                <option value="Food">Food Business</option>
                <option value="Farm">Farm Business</option>
                <option value="Feed">Feed Business</option>
                <option value="Corporate">Corporate HQ</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="font-semibold text-gray-700 block">Business Unit</label>
              <select
                v-model="formBu"
                class="w-full bg-white border border-gray-200 rounded-md px-2.5 py-2 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
              >
                <option value="Chicken Processing">Chicken Processing</option>
                <option value="Swine Processing">Swine Processing</option>
                <option value="Food Processing Division">Food Processing</option>
                <option value="Quality Excellence & CI">Quality Excellence</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Plant / Factory Location</label>
            <select
              v-model="formLocation"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
            >
              <option value="โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)">โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)</option>
              <option value="โรงงานแปรรูปอาหาร 2 (นครราชสีมา)">โรงงานแปรรูปอาหาร 2 (นครราชสีมา)</option>
              <option value="โรงงานแปรรูปสระบุรี">โรงงานแปรรูปสระบุรี</option>
              <option value="Corporate HQ (Bangkok)">Corporate HQ (Bangkok)</option>
            </select>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isAddUserModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="saveUser"
          >
            {{ modalMode === 'add' ? 'Add User' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
