<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const dateEntryMode = ref<'weekly' | 'monthly' | 'free'>('monthly')
const isAddTargetModalOpen = ref(false)
const targetType = ref('quality')
const targetName = ref('% Total Yield สินค้าไก่ทอด')
const targetUnit = ref('%')

// PCR Approval State (Module 3 Requirement)
const pcrStatus = ref<'draft' | 'pending' | 'approved'>('approved')

// Flexible row counts with Outlier tracking
const monthlyData = ref([
  { id: 1, month: '1/25', actual: 80, total: 100, pct: 80.0, isOutlier: true, outlierCause: 'เครื่องจักรสะดุดช่วงเปลี่ยน Shift', notes: 'Outlier with cause' },
  { id: 2, month: '2/25', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 3, month: '3/25', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 4, month: '4/25', actual: 83, total: 100, pct: 83.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 5, month: '5/25', actual: 82, total: 100, pct: 82.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 6, month: '6/25', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 7, month: '7/25', actual: 88, total: 100, pct: 88.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 8, month: '8/25', actual: 83, total: 100, pct: 83.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 9, month: '9/25', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 10, month: '10/25', actual: 82, total: 100, pct: 82.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 11, month: '11/25', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 12, month: '12/25', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' }
])

const validDataPoints = computed(() => monthlyData.value.filter(d => !d.isOutlier || (d.isOutlier && d.outlierCause.trim() !== '')))
const outlierWithCauseCount = computed(() => monthlyData.value.filter(d => d.isOutlier && d.outlierCause.trim() !== '').length)
const outlierWithoutCauseCount = computed(() => monthlyData.value.filter(d => d.isOutlier && d.outlierCause.trim() === '').length)

const addRow = () => {
  const nextId = monthlyData.value.length + 1
  monthlyData.value.push({
    id: nextId,
    month: `${nextId}/25`,
    actual: 84,
    total: 100,
    pct: 84.0,
    isOutlier: false,
    outlierCause: '',
    notes: ''
  })
}

const removeRow = (index: number) => {
  if (monthlyData.value.length > 1) {
    monthlyData.value.splice(index, 1)
  }
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
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Define</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Insight Data</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="Insight Data"
      />

      <!-- Main Content Area -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- PCR Approval Status Banner (Module 3 Requirement) -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-teal-50 text-[#008779] flex items-center justify-center font-bold text-xs">
              PCR
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-gray-900">
                  Project Charter Report (PCR) Status
                </h2>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="pcrStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ pcrStatus === 'approved' ? 'Active Approved' : 'Pending Review' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Baseline and Outlier points will be locked during approval sign-off.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/admin/projects/${projectId}/define/beg-chart`"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Go to BEG Chart</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Section Title & Outlier Indicator Alert -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Insight Data Entry & Outlier Management
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                No minimum row limits. Document causes for all flagged outlier points.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs"
                @click="addRow"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
                <span>Add Data Row</span>
              </button>
            </div>
          </div>

          <!-- Outlier Cause Warning Box (Module 3 Requirement) -->
          <div v-if="outlierWithoutCauseCount > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center gap-2">
            <UIcon name="i-lucide-alert-triangle" class="size-4 text-amber-600 shrink-0" />
            <span>Found <strong>{{ outlierWithoutCauseCount }}</strong> outlier data point(s) missing root cause explanation. Please provide cause to allow valid statistical computation.</span>
          </div>

          <!-- Data Grid -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-2.5 px-3">#</th>
                  <th class="py-2.5 px-3 font-semibold">PERIOD / ROW</th>
                  <th class="py-2.5 px-3 font-semibold text-center">ACTUAL (NUM)</th>
                  <th class="py-2.5 px-3 font-semibold text-center">TOTAL (DENOM)</th>
                  <th class="py-2.5 px-3 font-semibold text-center">% VALUE</th>
                  <th class="py-2.5 px-3 font-semibold text-center">OUTLIER?</th>
                  <th class="py-2.5 px-4 font-semibold">OUTLIER CAUSE EXPLANATION</th>
                  <th class="py-2.5 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="(row, index) in monthlyData"
                  :key="row.id"
                  class="hover:bg-gray-50/50 transition-colors"
                  :class="row.isOutlier ? 'bg-amber-50/30' : ''"
                >
                  <td class="py-2.5 px-3 font-mono text-gray-400">{{ index + 1 }}</td>
                  <td class="py-2.5 px-3 font-semibold text-gray-900 font-mono">
                    <input
                      v-model="row.month"
                      type="text"
                      class="w-16 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs text-center font-mono focus:border-[#008779]"
                    />
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <input
                      v-model.number="row.actual"
                      type="number"
                      class="w-16 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs text-center font-mono focus:border-[#008779]"
                      @input="row.pct = Number(((row.actual / row.total) * 100).toFixed(2))"
                    />
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <input
                      v-model.number="row.total"
                      type="number"
                      class="w-16 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs text-center font-mono focus:border-[#008779]"
                      @input="row.pct = Number(((row.actual / row.total) * 100).toFixed(2))"
                    />
                  </td>
                  <td class="py-2.5 px-3 text-center font-bold font-mono text-[#008779]">
                    {{ row.pct }}%
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <input
                      v-model="row.isOutlier"
                      type="checkbox"
                      class="accent-amber-600 size-4 cursor-pointer"
                    />
                  </td>
                  <td class="py-2.5 px-4">
                    <input
                      v-if="row.isOutlier"
                      v-model="row.outlierCause"
                      type="text"
                      placeholder="Enter documented cause (Mandatory for Outlier)"
                      class="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-amber-500"
                    />
                    <span v-else class="text-gray-400 text-[11px] italic">-</span>
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      class="text-gray-400 hover:text-red-600 p-1"
                      @click="removeRow(index)"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
