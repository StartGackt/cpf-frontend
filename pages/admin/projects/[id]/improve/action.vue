<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project, totalActionSavings } = useProjectData(projectId)

const actionItems = computed(() => project.value.actionItems)

const isAddModalOpen = ref(false)
const isEditMode = ref(false)
const currentEditIdx = ref(-1)

const formAction = ref<ActionItem>({
  id: '',
  factor: '',
  beforeCondition: '',
  afterCondition: '',
  responsible: 'Romteera Tadderm (BB)',
  targetDate: '15/02/2026',
  status: 'Implemented & Standardized',
  savingsImpact: '1,000,000 THB / Year',
  savingsAmountThb: 1000000
})

const openAddModal = () => {
  isEditMode.value = false
  currentEditIdx.value = -1
  formAction.value = {
    id: `ACT-0${project.value.actionItems.length + 1}`,
    factor: '',
    beforeCondition: '',
    afterCondition: '',
    responsible: 'Romteera Tadderm (BB)',
    targetDate: '28/02/2026',
    status: 'Implemented & Standardized',
    savingsImpact: '1,000,000 THB / Year',
    savingsAmountThb: 1000000
  }
  isAddModalOpen.value = true
}

const openEditModal = (idx: number) => {
  const item = project.value.actionItems[idx]
  if (!item) return
  isEditMode.value = true
  currentEditIdx.value = idx
  formAction.value = { ...item }
  isAddModalOpen.value = true
}

const saveAction = () => {
  if (!formAction.value.factor) {
    alert('Please enter factor name')
    return
  }

  if (isEditMode.value && currentEditIdx.value >= 0) {
    project.value.actionItems[currentEditIdx.value] = { ...formAction.value }
  } else {
    project.value.actionItems.push({ ...formAction.value })
  }
  isAddModalOpen.value = false
}

const removeAction = (idx: number) => {
  project.value.actionItems.splice(idx, 1)
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
      <span class="text-gray-700 font-medium">Improve</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Action (Before vs After)</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="Action"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Main Actions Container -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-base font-bold text-gray-900">
                  Improvement Action Plans (Before vs After Comparison)
                </h1>
                <span class="text-xs bg-teal-50 text-[#008779] border border-teal-200 px-2 py-0.5 rounded font-mono font-bold">
                  Total Financial Impact: {{ totalActionSavings }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Standardizes root cause countermeasures and quantifies financial yield impact
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              @click="openAddModal"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>+ Add Improvement Action</span>
            </button>
          </div>

          <!-- Actions Table with Before/After Columns -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <th class="py-3 px-3 text-center">ID</th>
                  <th class="py-3 px-4">ROOT CAUSE FACTOR</th>
                  <th class="py-3 px-4 text-red-700">สภาพก่อนปรับปรุง (BEFORE)</th>
                  <th class="py-3 px-4 text-emerald-700">สภาพหลังปรับปรุง (AFTER)</th>
                  <th class="py-3 px-3">RESPONSIBLE</th>
                  <th class="py-3 px-3 text-center">SAVINGS IMPACT</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                  <th class="py-3 px-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(act, idx) in actionItems" :key="act.id" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-gray-900">{{ act.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">{{ act.factor }}</td>
                  <td class="py-3.5 px-4 text-gray-700 bg-red-50/20 text-[11px]">{{ act.beforeCondition }}</td>
                  <td class="py-3.5 px-4 font-medium text-emerald-900 bg-emerald-50/20 text-[11px]">{{ act.afterCondition }}</td>
                  <td class="py-3.5 px-3 text-gray-700">{{ act.responsible }}</td>
                  <td class="py-3.5 px-3 text-center font-bold text-[#008779] font-mono">{{ act.savingsImpact }}</td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {{ act.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button type="button" class="text-gray-400 hover:text-[#008779] p-1 cursor-pointer" title="Edit action" @click="openEditModal(idx)">
                        <UIcon name="i-lucide-edit" class="size-3.5" />
                      </button>
                      <button type="button" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer" title="Remove action" @click="removeAction(idx)">
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

    <!-- Add/Edit Action Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">{{ isEditMode ? 'Edit Improvement Action' : 'Add Improvement Action' }}</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isAddModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <label class="font-bold text-gray-700 block mb-1">Root Cause Factor *</label>
            <input v-model="formAction.factor" type="text" placeholder="e.g. การตั้งค่าน้ำหนักเผื่อ" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div>
            <label class="font-bold text-red-700 block mb-1">สภาพก่อนปรับปรุง (Before Condition) *</label>
            <textarea v-model="formAction.beforeCondition" rows="2" placeholder="อธิบายสภาพปัญหาและตัวเลขเดิม..." class="w-full bg-red-50/20 border border-red-200 rounded px-2.5 py-1.5 text-xs focus:border-red-400 focus:outline-hidden"></textarea>
          </div>
          <div>
            <label class="font-bold text-emerald-700 block mb-1">สภาพหลังปรับปรุง (After Condition) *</label>
            <textarea v-model="formAction.afterCondition" rows="2" placeholder="อธิบายการปรับปรุง Countermeasure มาตรฐานใหม่..." class="w-full bg-emerald-50/20 border border-emerald-200 rounded px-2.5 py-1.5 text-xs focus:border-emerald-400 focus:outline-hidden"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Responsible Person</label>
              <input v-model="formAction.responsible" type="text" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Savings Impact Text</label>
              <input v-model="formAction.savingsImpact" type="text" placeholder="e.g. 2,000,000 THB / Year" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isAddModalOpen = false">Cancel</button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveAction">
              {{ isEditMode ? 'Update Action' : 'Create Action' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
