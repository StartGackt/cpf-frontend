<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompanyDirectory, type CompanyUser, type ProvisioningRequest } from '~/composables/useCompanyDirectory'

const props = defineProps<{
  projectId: string
  projectName: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'memberAdded', member: any): void
}>()

const { users, provisioningRequests, searchDirectory, checkUserExists, requestProvisioning } = useCompanyDirectory()

const searchQuery = ref('')
const selectedRole = ref('Team Member')
const selectedBelt = ref('Yellow Belt')
const customNotes = ref('')
const isAddingNewUnlisted = ref(false)

const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

// Current Project Member List (Reactive)
const projectMembers = ref([
  {
    id: 'pm-1',
    name: 'Romteera Tadderm',
    email: 'romteera.t@cpf.co.th',
    role: 'Project Leader',
    belt: 'Black Belt',
    department: 'Processing Plant Line 2',
    status: 'Active'
  },
  {
    id: 'pm-2',
    name: 'Dr. Prasert Chareon',
    email: 'prasert.c@cpf.co.th',
    role: 'MBB Advisor',
    belt: 'Master Black Belt',
    department: 'Corporate Quality Excellence',
    status: 'Active'
  },
  {
    id: 'pm-3',
    name: 'Somchai Vong',
    email: 'somchai.v@cpf.co.th',
    role: 'Project Champion',
    belt: 'Champion',
    department: 'Plant Operations Management',
    status: 'Active'
  },
  {
    id: 'pm-4',
    name: 'Kittipong Somboon',
    email: 'kittipong.s@partner-sensor.com',
    role: 'External IoT Consultant',
    belt: 'None',
    department: 'Smart Factory Partner',
    status: 'Pending Admin Account Creation'
  }
])

// Filter directory suggestions
const directoryMatches = computed(() => {
  if (!searchQuery.value.trim()) return []
  return searchDirectory(searchQuery.value)
})

const isExactMatchFound = computed(() => {
  if (!searchQuery.value.trim()) return false
  return checkUserExists(searchQuery.value.trim()) !== undefined
})

const addExistingUserToProject = (user: CompanyUser) => {
  if (projectMembers.value.some(m => m.email.toLowerCase() === user.email.toLowerCase())) {
    alert(`${user.name} is already assigned to this project.`)
    return
  }

  const newMember = {
    id: `pm-${Date.now()}`,
    name: user.name,
    email: user.email,
    role: selectedRole.value,
    belt: user.belt || selectedBelt.value,
    department: user.department,
    status: 'Active'
  }

  projectMembers.value.push(newMember)
  searchQuery.value = ''
  showToast(`Added ${user.name} to project team!`)
  emit('memberAdded', newMember)
}

const submitUnlistedUserRequest = () => {
  if (!searchQuery.value.trim()) {
    alert('Please enter user name or email address.')
    return
  }

  const isEmail = searchQuery.value.includes('@')
  const email = isEmail ? searchQuery.value.trim() : `${searchQuery.value.toLowerCase().replace(/\s+/g, '.')}@cpf.co.th`
  const name = isEmail ? searchQuery.value.split('@')[0]?.replace(/\./g, ' ') || 'New User' : searchQuery.value.trim()

  const req = requestProvisioning({
    projectId: props.projectId,
    projectName: props.projectName,
    name: name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    email,
    requestedRole: selectedRole.value,
    requestedBelt: selectedBelt.value,
    department: 'Plant Operations / Partner',
    location: 'โรงงานแปรรูปโชคชัย',
    requestedBy: 'Romteera Tadderm (Project Leader)',
    notes: customNotes.value || 'Requested for project execution & sign-off list.'
  })

  // Add as pending member
  projectMembers.value.push({
    id: `pm-${Date.now()}`,
    name: req.name,
    email: req.email,
    role: req.requestedRole,
    belt: req.requestedBelt,
    department: req.department,
    status: 'Pending Admin Account Creation'
  })

  searchQuery.value = ''
  customNotes.value = ''
  isAddingNewUnlisted.value = false
  showToast(`Account creation request sent to Admin! Email invite will be dispatched automatically upon Admin approval.`)
}

const removeMember = (index: number) => {
  const member = projectMembers.value[index]
  if (confirm(`Remove ${member?.name} from project team?`)) {
    projectMembers.value.splice(index, 1)
    showToast('Member removed')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden text-gray-900 text-xs animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-900 to-[#008779] text-white flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="bg-teal-700/80 text-[10px] font-mono px-2 py-0.5 rounded text-teal-100 font-bold">
              CPF DIRECTORY VERIFIER
            </span>
            <span class="text-[10px] text-teal-200">Live Master DB Sync</span>
          </div>
          <h3 class="font-bold text-sm text-white mt-1">
            Project Members & Approval Stakeholders
          </h3>
          <p class="text-[11px] text-teal-100 truncate max-w-md">
            {{ projectName }}
          </p>
        </div>

        <button
          type="button"
          class="text-white/80 hover:text-white p-1 rounded transition-colors cursor-pointer"
          @click="emit('close')"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>

      <!-- Toast Feedback -->
      <div v-if="toastMsg" class="bg-emerald-600 text-white p-2.5 text-center font-bold text-xs flex items-center justify-center gap-2">
        <UIcon name="i-lucide-check-circle" class="size-4" />
        <span>{{ toastMsg }}</span>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto flex-1 bg-gray-50/50">
        <!-- 1. Real-Time Directory Search & Add Input Box -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-xs">
          <div class="flex items-center justify-between">
            <label class="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <UIcon name="i-lucide-user-plus" class="size-4 text-[#008779]" />
              <span>Verify & Add Stakeholder:</span>
            </label>
            <span class="text-[10px] text-gray-400">Search by Name, Email, or Employee ID</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div class="sm:col-span-6 relative">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#008779] focus:bg-white"
                placeholder="Type name e.g. Somchai or email@cpf.co.th..."
              />

              <!-- Auto-complete dropdown list -->
              <div
                v-if="directoryMatches.length > 0 && searchQuery.trim()"
                class="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-gray-100"
              >
                <div
                  v-for="u in directoryMatches"
                  :key="u.id"
                  class="p-2.5 hover:bg-teal-50/60 cursor-pointer flex items-center justify-between transition-colors"
                  @click="addExistingUserToProject(u)"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="size-6 rounded-full bg-[#008779] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                      {{ u.initials }}
                    </div>
                    <div class="min-w-0">
                      <span class="font-bold text-gray-900 block text-xs truncate">{{ u.name }}</span>
                      <span class="text-[10px] text-gray-500 block truncate font-mono">{{ u.email }} • {{ u.department }}</span>
                    </div>
                  </div>
                  <span class="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded shrink-0">
                    {{ u.belt }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Role Selector -->
            <div class="sm:col-span-3">
              <select
                v-model="selectedRole"
                class="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-2 text-xs focus:outline-hidden focus:border-[#008779]"
              >
                <option value="Project Leader">Project Leader</option>
                <option value="Project Champion">Project Champion</option>
                <option value="MBB Advisor">MBB Advisor</option>
                <option value="Team Member">Team Member</option>
                <option value="External Consultant">External Consultant</option>
                <option value="Finance Auditor">Finance Auditor</option>
              </select>
            </div>

            <!-- Add Button -->
            <div class="sm:col-span-3">
              <button
                v-if="isExactMatchFound"
                type="button"
                class="w-full bg-[#008779] hover:bg-[#007366] text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                @click="addExistingUserToProject(checkUserExists(searchQuery)!)"
              >
                <UIcon name="i-lucide-check" class="size-3.5" />
                <span>Add Member</span>
              </button>
              <button
                v-else-if="searchQuery.trim()"
                type="button"
                class="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                @click="isAddingNewUnlisted = true"
              >
                <UIcon name="i-lucide-user-plus" class="size-3.5" />
                <span>Request Admin</span>
              </button>
            </div>
          </div>

          <!-- Alert for Unlisted User with Admin Provisioning Trigger -->
          <div
            v-if="searchQuery.trim() && !isExactMatchFound"
            class="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2 animate-in fade-in duration-150"
          >
            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-alert-triangle" class="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span class="font-bold text-amber-900 block text-xs">
                  User not found in CPF Master Directory: "{{ searchQuery }}"
                </span>
                <p class="text-[11px] text-amber-800 leading-relaxed">
                  This person doesn't have an active account in the system yet. You can submit an <strong>Account Provisioning Request</strong> to notify the System Admin to create their account and send an automated invitation email.
                </p>
              </div>
            </div>

            <!-- Expanded Provisioning Fields -->
            <div v-if="isAddingNewUnlisted" class="pt-2 border-t border-amber-200/80 space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] font-bold text-amber-900 block">Requested Belt / Skill:</label>
                  <select
                    v-model="selectedBelt"
                    class="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="None">None (Partner / Auditor)</option>
                    <option value="Yellow Belt">Yellow Belt</option>
                    <option value="Green Belt">Green Belt</option>
                    <option value="Black Belt">Black Belt</option>
                    <option value="Master Black Belt">Master Black Belt</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-amber-900 block">Reason / Scope Notes:</label>
                  <input
                    v-model="customNotes"
                    type="text"
                    class="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs"
                    placeholder="e.g. IoT Scale Engineer for Line 2..."
                  />
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                  @click="submitUnlistedUserRequest"
                >
                  <UIcon name="i-lucide-send" class="size-3" />
                  <span>Submit Request to Admin & Auto-Invite</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Current Project Team & Approver Table -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
          <div class="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span class="font-bold text-xs text-gray-800">
              Assigned Project Team & Approvers ({{ projectMembers.length }})
            </span>
            <span class="text-[10px] text-gray-500">Auto-saved to project metadata</span>
          </div>

          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50/60 text-gray-500 font-semibold border-b border-gray-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th class="p-3">Stakeholder</th>
                <th class="p-3">Project Role</th>
                <th class="p-3">Belt / Dept</th>
                <th class="p-3 text-center">System Status</th>
                <th class="p-3 text-center w-10"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(member, mIdx) in projectMembers" :key="member.id" class="hover:bg-gray-50/60">
                <td class="p-3">
                  <div class="flex items-center gap-2.5">
                    <div class="size-7 rounded-full bg-[#008779] text-white flex items-center justify-center font-bold text-[10px]">
                      {{ member.name.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                    </div>
                    <div>
                      <span class="font-bold text-gray-900 block text-xs">{{ member.name }}</span>
                      <span class="text-[10px] text-gray-500 block font-mono">{{ member.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-3 font-semibold text-gray-800">
                  {{ member.role }}
                </td>
                <td class="p-3 text-gray-600">
                  <span class="block font-medium">{{ member.belt }}</span>
                  <span class="text-[10px] text-gray-400 block truncate max-w-[140px]">{{ member.department }}</span>
                </td>
                <td class="p-3 text-center">
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                    :class="member.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                  >
                    <span class="size-1.5 rounded-full" :class="member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'"></span>
                    <span>{{ member.status === 'Active' ? 'Active in System' : 'Pending Admin Creation' }}</span>
                  </span>
                </td>
                <td class="p-3 text-center">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-red-600 p-1 rounded"
                    title="Remove from project"
                    @click="removeMember(mIdx)"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors cursor-pointer"
          @click="emit('close')"
        >
          Save & Close
        </button>
      </div>
    </div>
  </div>
</template>
