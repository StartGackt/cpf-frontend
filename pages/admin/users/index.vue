<script setup lang="ts">
import { ref, computed } from 'vue'

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

const users = ref([
  {
    id: 1,
    name: 'Romteera Tadderm',
    initials: 'RT',
    email: 'romteera.t@cpf.co.th',
    role: 'Project Owner',
    belt: 'Black Belt',
    business: 'Food',
    bu: 'Chicken Processing',
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    projectCount: 3,
    status: 'Active',
    lastLogin: '2026-02-24 10:15'
  },
  {
    id: 2,
    name: 'Nadtapong Aontawee',
    initials: 'NA',
    email: 'nadtapong.a@cpf.co.th',
    role: 'Project Owner',
    belt: 'Green Belt',
    business: 'Food',
    bu: 'Chicken Processing',
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    projectCount: 2,
    status: 'Active',
    lastLogin: '2026-02-24 09:30'
  },
  {
    id: 3,
    name: 'Dr. Prasert Chareon',
    initials: 'PC',
    email: 'prasert.c@cpf.co.th',
    role: 'Master Black Belt (MBB)',
    belt: 'Master Black Belt',
    business: 'Corporate',
    bu: 'Quality Excellence & CI',
    location: 'Corporate HQ (Bangkok)',
    projectCount: 14,
    status: 'Active',
    lastLogin: '2026-02-23 16:45'
  },
  {
    id: 4,
    name: 'Somchai Vong',
    initials: 'SV',
    email: 'somchai.v@cpf.co.th',
    role: 'Champion / Sponsor',
    belt: 'Champion',
    business: 'Food',
    bu: 'Food Processing Division',
    location: 'Saraburi Plant',
    projectCount: 8,
    status: 'Active',
    lastLogin: '2026-02-22 14:20'
  },
  {
    id: 5,
    name: 'System Admin',
    initials: 'SA',
    email: 'admin.insight@cpf.co.th',
    role: 'System Admin',
    belt: 'None',
    business: 'Corporate',
    bu: 'Digital Transformation',
    location: 'Corporate HQ (Bangkok)',
    projectCount: 42,
    status: 'Active',
    lastLogin: '2026-02-24 11:00'
  },
  {
    id: 6,
    name: 'Kittisak P.',
    initials: 'KP',
    email: 'kittisak.p@cpf.co.th',
    role: 'Member / Viewer',
    belt: 'Yellow Belt',
    business: 'Feed',
    bu: 'Feedmill Division',
    location: 'โรงงานอาหารสัตว์บก บางนา',
    projectCount: 1,
    status: 'Inactive',
    lastLogin: '2026-01-15 08:10'
  }
])

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

const toggleStatus = (user: any) => {
  user.status = user.status === 'Active' ? 'Inactive' : 'Active'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          User Management
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Manage system users, define Role-Based Access Control (RBAC), and assign plant locations
        </p>
      </div>

      <div class="flex items-center gap-2">
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

    <!-- 4 Stats Cards Bar -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-gray-500 font-medium">Total Users</span>
        <p class="text-xl font-bold text-gray-900 font-mono">{{ users.length }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-purple-700 font-medium">System Admins</span>
        <p class="text-xl font-bold text-purple-700 font-mono">1</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-red-700 font-medium">Master Black Belts (MBB)</span>
        <p class="text-xl font-bold text-red-700 font-mono">1</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-[#008779] font-medium">Project Owners (BB/GB)</span>
        <p class="text-xl font-bold text-[#008779] font-mono">2</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-amber-700 font-medium">Champions / Sponsors</span>
        <p class="text-xl font-bold text-amber-700 font-mono">1</p>
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
            class="w-full bg-gray-50/70 border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#008779]"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Role Filter -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-gray-500">Role:</span>
            <select
              v-model="selectedRole"
              class="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
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
              class="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
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
              <th class="py-3 px-3 font-semibold text-center">PROJECTS</th>
              <th class="py-3 px-3 font-semibold text-center">STATUS</th>
              <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50/50">
              <!-- User Name & Email -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-full bg-[#008779] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {{ user.initials }}
                  </div>
                  <div>
                    <span class="font-bold text-gray-900 block">{{ user.name }}</span>
                    <span class="text-gray-500 text-[11px] font-mono">{{ user.email }}</span>
                  </div>
                </div>
              </td>

              <!-- Role & Belt Badge -->
              <td class="py-3.5 px-4">
                <div class="space-y-1">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border"
                    :class="getRoleColor(user.role)"
                  >
                    {{ user.role }}
                  </span>
                  <span v-if="user.belt !== 'None'" class="text-[10px] text-gray-500 block">
                    Belt: <strong>{{ user.belt }}</strong>
                  </span>
                </div>
              </td>

              <!-- Org / Location -->
              <td class="py-3.5 px-4">
                <div class="text-xs">
                  <span class="text-gray-800 font-medium block">{{ user.location }}</span>
                  <span class="text-[11px] text-gray-500">{{ user.business }} › {{ user.bu }}</span>
                </div>
              </td>

              <!-- Project Count -->
              <td class="py-3.5 px-3 text-center font-bold text-gray-900 font-mono">
                {{ user.projectCount }}
              </td>

              <!-- Status Toggle -->
              <td class="py-3.5 px-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors"
                  :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'"
                  @click="toggleStatus(user)"
                >
                  <span class="size-1.5 rounded-full" :class="user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                  <span>{{ user.status }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4">
                <div class="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    class="size-7 rounded hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors"
                    title="Edit User"
                    @click="openEditUser(user)"
                  >
                    <UIcon name="i-lucide-edit-2" class="size-3.5" />
                  </button>
                  <button
                    type="button"
                    class="size-7 rounded hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors"
                    title="Permissions"
                  >
                    <UIcon name="i-lucide-shield" class="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
        <span>Showing {{ filteredUsers.length }} of {{ users.length }} users</span>
        <span>InsightGenie RBAC Framework V2.0</span>
      </div>
    </div>

    <!-- ADD / EDIT USER MODAL -->
    <div
      v-if="isAddUserModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">
            {{ modalMode === 'add' ? 'Add New User' : 'Edit User & Permissions' }}
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1"
            @click="isAddUserModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4 text-xs">
          <!-- Full Name -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Full Name *</label>
            <input
              v-model="formName"
              type="text"
              placeholder="e.g. Romteera Tadderm"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>

          <!-- Email -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Corporate Email *</label>
            <input
              v-model="formEmail"
              type="email"
              placeholder="e.g. name@cpf.co.th"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>

          <!-- Role -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Assigned Role *</label>
            <select
              v-model="formRole"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
            >
              <option value="System Admin">System Admin (Full Access)</option>
              <option value="Master Black Belt (MBB)">Master Black Belt (Reviewer / Methodology)</option>
              <option value="Champion / Sponsor">Champion / Sponsor (Project Approver)</option>
              <option value="Project Owner">Project Owner (Project Leader / Six Sigma)</option>
              <option value="Member / Viewer">Member / Viewer (Read-only)</option>
            </select>
          </div>

          <!-- Belt Level -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Six Sigma Belt Level</label>
            <select
              v-model="formBelt"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
            >
              <option value="None">None</option>
              <option value="Yellow Belt">Yellow Belt (YB)</option>
              <option value="Green Belt">Green Belt (GB)</option>
              <option value="Black Belt">Black Belt (BB)</option>
              <option value="Master Black Belt">Master Black Belt (MBB)</option>
              <option value="Champion">Champion</option>
            </select>
          </div>

          <!-- Business & BU -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-semibold text-gray-700 block">Business</label>
              <select
                v-model="formBusiness"
                class="w-full bg-white border border-gray-200 rounded-md px-2.5 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
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
                class="w-full bg-white border border-gray-200 rounded-md px-2.5 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
              >
                <option value="Chicken Processing">Chicken Processing</option>
                <option value="Swine Processing">Swine Processing</option>
                <option value="Food Processing Division">Food Processing</option>
                <option value="Quality Excellence & CI">Quality Excellence</option>
              </select>
            </div>
          </div>

          <!-- Plant Location -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Plant / Factory Location</label>
            <select
              v-model="formLocation"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
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
            @click="isAddUserModalOpen = false"
          >
            {{ modalMode === 'add' ? 'Add User' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
