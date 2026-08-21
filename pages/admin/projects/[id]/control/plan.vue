<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData, type ControlPlanItem } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const controlPlanItems = computed(() => project.value.controlPlanItems)

const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentEditIdx = ref(-1)

const formItem = ref<ControlPlanItem>({
  id: '',
  process: 'Packing',
  factor: '',
  standard: '',
  frequency: 'ทุกกะ (Shift)',
  responsible: 'Operator / QA',
  controlMethod: 'Checklist & Scale Verification',
  reactionPlan: 'ปรับตั้งค่าหัวชั่งใหม่ทันที'
})

const openAddModal = () => {
  isEditMode.value = false
  currentEditIdx.value = -1
  formItem.value = {
    id: `CP-0${project.value.controlPlanItems.length + 1}`,
    process: 'Packing',
    factor: '',
    standard: '',
    frequency: 'ทุกกะ (Shift)',
    responsible: 'Operator / QA',
    controlMethod: 'Checklist Verification',
    reactionPlan: 'แจ้งหัวหน้างานและปรับตั้งค่าทันที'
  }
  isModalOpen.value = true
}

const openEditModal = (idx: number) => {
  const item = project.value.controlPlanItems[idx]
  if (!item) return
  isEditMode.value = true
  currentEditIdx.value = idx
  formItem.value = { ...item }
  isModalOpen.value = true
}

const saveItem = () => {
  if (!formItem.value.factor || !formItem.value.standard) {
    alert('Please enter factor name and standard requirement')
    return
  }
  if (isEditMode.value && currentEditIdx.value >= 0) {
    project.value.controlPlanItems[currentEditIdx.value] = { ...formItem.value }
  } else {
    project.value.controlPlanItems.push({ ...formItem.value })
  }
  isModalOpen.value = false
}

const removeItem = (idx: number) => {
  project.value.controlPlanItems.splice(idx, 1)
}
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-gray-500 pb-2">
      <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
        <UIcon name="i-lucide-home" class="size-3.5" />
        <span>Home</span>
      </NuxtLink>
      <span>›</span>
      <NuxtLink to="/admin/projects" class="hover:text-[#008779]">
        Projects
      </NuxtLink>
      <span>›</span>
      <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[200px]">
        {{ project.name }}
      </NuxtLink>
      <span>›</span>
      <span class="text-gray-700 font-medium">Control</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Control Plan</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Control Plan"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Standard Operating Control Plan (SOP Standardized)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Establish standard operating procedures and monitoring controls for optimal settings
              </p>
            </div>
          </div>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            @click="openAddModal"
          >
            <UIcon name="i-lucide-plus" class="size-3.5" />
            <span>+ Add Control Item</span>
          </button>
        </div>

        <!-- Control Plan Table -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <th class="py-3 px-4">PROCESS</th>
                  <th class="py-3 px-4">CRITICAL FACTOR (X)</th>
                  <th class="py-3 px-3 font-bold text-[#008779]">STANDARD SPEC</th>
                  <th class="py-3 px-3">FREQUENCY</th>
                  <th class="py-3 px-3">RESPONSIBLE</th>
                  <th class="py-3 px-4">CONTROL METHOD</th>
                  <th class="py-3 px-4 text-red-700">REACTION PLAN</th>
                  <th class="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in controlPlanItems" :key="item.id || idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-semibold text-gray-900">{{ item.process }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">{{ item.factor }}</td>
                  <td class="py-3.5 px-3 font-bold text-[#008779] font-mono">{{ item.standard }}</td>
                  <td class="py-3.5 px-3 text-gray-700">{{ item.frequency }}</td>
                  <td class="py-3.5 px-3 text-gray-700">{{ item.responsible }}</td>
                  <td class="py-3.5 px-4 text-gray-700">{{ item.controlMethod }}</td>
                  <td class="py-3.5 px-4 text-red-700 bg-red-50/20 text-[11px] font-medium">{{ item.reactionPlan }}</td>
                  <td class="py-3.5 px-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button type="button" class="text-gray-400 hover:text-[#008779] p-1 cursor-pointer" @click="openEditModal(idx)">
                        <UIcon name="i-lucide-edit" class="size-3.5" />
                      </button>
                      <button type="button" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer" @click="removeItem(idx)">
                        <UIcon name="i-lucide-trash-2" class="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">{{ isEditMode ? 'Edit Control Plan Item' : 'Add SOP Control Plan Item' }}</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Process Step</label>
              <input v-model="formItem.process" type="text" placeholder="e.g. Packing" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Standard Spec *</label>
              <input v-model="formItem.standard" type="text" placeholder="e.g. 10 กรัม / 1 drop" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div>
            <label class="font-bold text-gray-700 block mb-1">Critical Factor (X) *</label>
            <input v-model="formItem.factor" type="text" placeholder="e.g. การตั้งค่าน้ำหนักเผื่อของเครื่อง Multihead" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Frequency</label>
              <input v-model="formItem.frequency" type="text" placeholder="e.g. ทุกกะ (Shift)" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Responsible Person</label>
              <input v-model="formItem.responsible" type="text" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div>
            <label class="font-bold text-gray-700 block mb-1">Control Method</label>
            <input v-model="formItem.controlMethod" type="text" placeholder="e.g. Checklist & Scale Verification" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div>
            <label class="font-bold text-red-700 block mb-1">Reaction Plan (When Out of Spec)</label>
            <input v-model="formItem.reactionPlan" type="text" placeholder="e.g. ปรับตั้งค่าหัวชั่งใหม่ทันทีเมื่อคลาดเคลื่อน" class="w-full bg-red-50/20 border border-red-200 rounded px-2.5 py-1.5 text-xs focus:border-red-400 focus:outline-hidden" />
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isModalOpen = false">Cancel</button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveItem">
              {{ isEditMode ? 'Update Item' : 'Add Item' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
