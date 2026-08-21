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
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    <!-- Toast Notification -->
    <div
      v-if="toastMsg"
      class="fixed top-5 right-5 z-50 bg-slate-900 border border-teal-500 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in"
    >
      <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
      <span>{{ toastMsg }}</span>
    </div>

    <!-- ========================================================= -->
    <!-- HERO HEADER: User Management & RBAC Directory -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-users" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              User Management & Directory
            </h1>
            <span class="text-xs text-teal-200">Role-Based Access Control (RBAC), Belt Certifications, and Provisioning</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          ระบบจัดการผู้ใช้งานและสิทธิ์การเข้าถึง (System Admin, MBB, Project Leader, Champion) ทั่วทั้งองค์กร
        </p>
      </div>

      <div class="flex items-center gap-2.5 relative z-10 shrink-0">
        <NuxtLink
          to="/admin/approvals"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <UIcon name="i-lucide-clipboard-check" class="size-4 text-teal-200" />
          <span>Approval Center</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
          @click="openAddUser"
        >
          <UIcon name="i-lucide-user-plus" class="size-4 text-[#008779]" />
          <span>Add New User</span>
        </button>
      </div>
    </div>

    <!-- Alert for Pending Auto-Provisioning Requests -->
    <div
      v-if="pendingRequestsCount > 0"
      class="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-xs shadow-2xs animate-in slide-in-from-top duration-150"
    >
      <div class="flex items-center gap-3">
        <div class="size-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <UIcon name="i-lucide-user-plus" class="size-4" />
        </div>
        <div>
          <span class="font-bold text-amber-950 block text-xs">
            {{ pendingRequestsCount }} Pending Account Auto-Provisioning Requests
          </span>
          <span class="text-amber-800 text-[11px]">
            New team members and approvers requested by project leaders requiring Admin approval.
          </span>
        </div>
      </div>

      <NuxtLink
        to="/admin/approvals"
        class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors shadow-2xs"
      >
        <span>Review in Approval Center</span>
        <UIcon name="i-lucide-arrow-right" class="size-3.5" />
      </NuxtLink>
    </div>

    <!-- 5 Stats Cards Bar -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3.5">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">TOTAL USERS</span>
        <p class="text-2xl font-bold text-slate-900 font-mono">{{ users.length }}</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-purple-600 font-bold uppercase block">SYSTEM ADMINS</span>
        <p class="text-2xl font-bold text-purple-700 font-mono">
          {{ users.filter(u => u.role === 'System Admin').length }}
        </p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-rose-600 font-bold uppercase block">MASTER BLACK BELTS</span>
        <p class="text-2xl font-bold text-rose-700 font-mono">
          {{ users.filter(u => u.belt === 'Master Black Belt' || u.role.includes('MBB')).length }}
        </p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-[#008779] font-bold uppercase block">PROJECT LEADS (BB/GB)</span>
        <p class="text-2xl font-bold text-[#008779] font-mono">
          {{ users.filter(u => u.role === 'Project Owner' || u.belt === 'Black Belt' || u.belt === 'Green Belt').length }}
        </p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-amber-600 font-bold uppercase block">CHAMPIONS / SPONSORS</span>
        <p class="text-2xl font-bold text-amber-700 font-mono">
          {{ users.filter(u => u.role.includes('Champion')).length }}
        </p>
      </div>
    </div>

    <!-- Table Card with Search & Filters -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="relative flex-1 max-w-sm">
          <UIcon name="i-lucide-search" class="size-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, plant..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#008779] transition-all"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Role Filter -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-500">Role:</span>
            <select
              v-model="selectedRole"
              class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
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
            <span class="text-slate-500">Status:</span>
            <select
              v-model="selectedStatus"
              class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
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
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4 font-semibold">USER</th>
              <th class="py-3.5 px-4 font-semibold">ROLE & BELT</th>
              <th class="py-3.5 px-4 font-semibold">ORGANIZATION / LOCATION</th>
              <th class="py-3.5 px-3 font-semibold text-center">EMP ID</th>
              <th class="py-3.5 px-3 font-semibold text-center">STATUS</th>
              <th class="py-3.5 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/70 transition-colors">
              <!-- User Name & Email -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-full bg-[#008779] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {{ user.initials }}
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block text-xs">{{ user.name }}</span>
                    <span class="text-[10px] text-slate-400 font-mono">{{ user.email }}</span>
                  </div>
                </div>
              </td>

              <!-- Role & Belt -->
              <td class="py-4 px-4">
                <span
                  class="text-[11px] font-medium px-2.5 py-0.5 rounded-full border inline-block shadow-2xs"
                  :class="getRoleColor(user.role)"
                >
                  {{ user.role }}
                </span>
                <span class="text-[10px] text-slate-500 block mt-0.5 font-medium">{{ user.belt }}</span>
              </td>

              <!-- Location -->
              <td class="py-4 px-4">
                <span class="font-medium text-slate-800 block truncate max-w-xs">{{ user.location }}</span>
                <span class="text-[10px] text-slate-400 block">{{ user.business }} &rsaquo; {{ user.bu || user.department }}</span>
              </td>

              <!-- Emp ID -->
              <td class="py-4 px-3 text-center font-mono text-slate-600">
                {{ user.employeeId }}
              </td>

              <!-- Status -->
              <td class="py-4 px-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer shadow-2xs"
                  :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'"
                  @click="toggleStatus(user)"
                >
                  <span class="size-1.5 rounded-full" :class="user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  <span>{{ user.status }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="size-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    title="Edit User"
                    @click="openEditUser(user)"
                  >
                    <UIcon name="i-lucide-edit-2" class="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD/EDIT USER MODAL -->
    <div
      v-if="isAddUserModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">
            {{ modalMode === 'add' ? 'Add New Directory User' : 'Edit User Profile' }}
          </h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg" @click="isAddUserModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-3.5 text-xs">
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Full Name *</label>
            <input
              v-model="formName"
              type="text"
              placeholder="e.g. Romteera Tadderm"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779] focus:bg-white"
            />
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1">Email Address *</label>
            <input
              v-model="formEmail"
              type="email"
              placeholder="e.g. romteera.t@cpf.co.th"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#008779] focus:bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-semibold text-slate-700 block mb-1">System Role *</label>
              <select v-model="formRole" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]">
                <option value="Project Owner">Project Owner</option>
                <option value="Master Black Belt (MBB)">Master Black Belt</option>
                <option value="Champion / Sponsor">Champion / Sponsor</option>
                <option value="System Admin">System Admin</option>
                <option value="Member / Viewer">Member / Viewer</option>
              </select>
            </div>

            <div>
              <label class="font-semibold text-slate-700 block mb-1">Belt Level *</label>
              <select v-model="formBelt" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]">
                <option value="Master Black Belt">Master Black Belt (MBB)</option>
                <option value="Black Belt">Black Belt (BB)</option>
                <option value="Green Belt">Green Belt (GB)</option>
                <option value="Yellow Belt">Yellow Belt (YB)</option>
                <option value="None">None / Management</option>
              </select>
            </div>
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1">Plant Location *</label>
            <select v-model="formLocation" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]">
              <option value="โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)">โรงงานแปรรูปโชคชัย</option>
              <option value="โรงงานแปรรูปอาหาร 2 (นครราชสีมา)">โรงงานแปรรูปอาหาร 2</option>
              <option value="โรงงานแปรรูปสระบุรี">โรงงานแปรรูปสระบุรี</option>
              <option value="โรงงานอาหารสำเร็จรูป หนองจอก">โรงงานอาหารสำเร็จรูป หนองจอก</option>
            </select>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            @click="isAddUserModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
            @click="saveUser"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
