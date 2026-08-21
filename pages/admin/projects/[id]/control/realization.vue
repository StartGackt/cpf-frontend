<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData, type RealizationLog } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project, realizationStats, goalLssYield } = useProjectData(projectId)

const monthlyTracking = computed(() => project.value.realizationLogs)

const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentEditIdx = ref(-1)

const formMonth = ref<RealizationLog>({
  id: '',
  month: 'M1 (Mar 25)',
  targetYield: 87.15,
  actualYield: 87.50,
  giveaway: 2.25,
  savingsThb: 354000,
  status: 'Audited'
})

const openAddModal = () => {
  isEditMode.value = false
  currentEditIdx.value = -1
  const nextNum = project.value.realizationLogs.length + 1
  formMonth.value = {
    id: `M${nextNum}`,
    month: `M${nextNum} (2026)`,
    targetYield: goalLssYield.value || 87.15,
    actualYield: 87.75,
    giveaway: 2.15,
    savingsThb: 365000,
    status: 'Audited'
  }
  isModalOpen.value = true
}

const openEditModal = (idx: number) => {
  const item = project.value.realizationLogs[idx]
  if (!item) return
  isEditMode.value = true
  currentEditIdx.value = idx
  formMonth.value = { ...item }
  isModalOpen.value = true
}

const saveMonth = () => {
  if (isEditMode.value && currentEditIdx.value >= 0) {
    project.value.realizationLogs[currentEditIdx.value] = { ...formMonth.value }
  } else {
    project.value.realizationLogs.push({ ...formMonth.value })
  }
  isModalOpen.value = false
}

const removeMonth = (idx: number) => {
  project.value.realizationLogs.splice(idx, 1)
}

// Dynamic SVG Chart Coordinates for 12-Month Realization
const maxSavings = computed(() => {
  const vals = monthlyTracking.value.map(m => m.savingsThb)
  return Math.max(400000, ...vals)
})

const getBarHeight = (savings: number) => {
  return (savings / maxSavings.value) * 110
}

const getYieldY = (yieldVal: number) => {
  // Map 85.0 to 90.0 into 150 to 30
  return 150 - ((yieldVal - 85.0) / 5.0) * 120
}

const getBarX = (idx: number) => {
  const count = monthlyTracking.value.length
  if (count <= 1) return 330
  const spacing = 580 / count
  return 55 + idx * spacing
}

const yieldLinePoints = computed(() => {
  const spacing = 580 / Math.max(1, monthlyTracking.value.length)
  return monthlyTracking.value
    .map((m, idx) => `${getBarX(idx) + spacing * 0.35},${getYieldY(m.actualYield)}`)
    .join(' ')
})
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
      <span class="text-gray-900 font-bold">12-Month Realization Tracking</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Realization"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Monthly Update Reminder Alert Banner -->
        <div class="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center font-bold">
              <UIcon name="i-lucide-bell" class="size-4" />
            </div>
            <div>
              <h3 class="font-bold text-teal-950">
                12-Month Financial Realization Tracking (Interactive)
              </h3>
              <p class="text-teal-700 mt-0.5">
                Monthly email triggers sent to verify sustained yield and audited financial savings.
              </p>
            </div>
          </div>
          <span class="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {{ monthlyTracking.length }}/12 Months Completed
          </span>
        </div>

        <!-- Summary KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">12-MONTH CUMULATIVE SAVINGS</span>
            <p class="text-2xl font-bold text-emerald-700 font-mono">{{ realizationStats.totalSavingsFormatted }}</p>
            <span class="text-[10px] text-emerald-600 font-semibold">100% Finance Audited</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">AVERAGE SUSTAINED YIELD</span>
            <p class="text-2xl font-bold text-[#008779] font-mono">{{ realizationStats.avgSustainedYield }}%</p>
            <span class="text-[10px] text-teal-600 font-semibold font-mono">&gt; Goal LSS ({{ goalLssYield }}%)</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">YIELD RETENTION RATE</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">100%</p>
            <span class="text-[10px] text-gray-500">Zero Process Regression</span>
          </div>
        </div>

        <!-- Dynamic 12-Month Bar & Line Chart -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                12-Month Financial Realization & Sustained Yield Performance
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Bars represent monthly audited savings (THB) & line represents actual %Total Yield
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                Cumulative: {{ realizationStats.totalSavingsFormatted }}
              </span>
            </div>
          </div>

          <div class="h-64 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 700 200">
              <!-- Target Line (Red Dash) -->
              <line x1="45" :y1="getYieldY(goalLssYield)" x2="650" :y2="getYieldY(goalLssYield)" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="655" :y="getYieldY(goalLssYield) + 4" font-size="9" fill="#dc2626" font-weight="bold">Target: {{ goalLssYield }}%</text>

              <!-- Monthly Savings Bars (Teal) -->
              <g v-for="(m, idx) in monthlyTracking" :key="m.id || idx" class="cursor-pointer" @click="openEditModal(idx)">
                <!-- Bar -->
                <rect
                  :x="getBarX(idx)"
                  :y="160 - getBarHeight(m.savingsThb)"
                  :width="Math.max(16, (580 / monthlyTracking.length) * 0.7)"
                  :height="getBarHeight(m.savingsThb)"
                  fill="#008779"
                  opacity="0.75"
                  rx="3"
                />

                <!-- Month Label -->
                <text
                  :x="getBarX(idx) + ((580 / monthlyTracking.length) * 0.35)"
                  y="180"
                  font-size="8"
                  fill="#64748b"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  M{{ idx + 1 }}
                </text>
              </g>

              <!-- Actual Yield Line (Blue) -->
              <polyline
                v-if="monthlyTracking.length > 1"
                :points="yieldLinePoints"
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
              />

              <!-- Actual Yield Dots -->
              <g v-for="(m, idx) in monthlyTracking" :key="'dot-' + (m.id || idx)" class="cursor-pointer" @click="openEditModal(idx)">
                <circle
                  :cx="getBarX(idx) + ((580 / monthlyTracking.length) * 0.35)"
                  :cy="getYieldY(m.actualYield)"
                  r="4.5"
                  fill="#2563eb"
                  stroke="#ffffff"
                  stroke-width="1.5"
                />
                <!-- Value on Top -->
                <text
                  :x="getBarX(idx) + ((580 / monthlyTracking.length) * 0.35)"
                  :y="getYieldY(m.actualYield) - 6"
                  font-size="8"
                  fill="#1e40af"
                  font-weight="bold"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  {{ m.actualYield }}%
                </text>
              </g>

              <!-- Bottom Line -->
              <line x1="45" y1="160" x2="650" y2="160" stroke="#94a3b8" stroke-width="1" />
            </svg>
          </div>
        </div>

        <!-- 12-Month Data Table Grid -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Monthly Breakdown (Month 1 to Month 12)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Tracks sustained operational performance and bottom-line profit impact
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
              @click="openAddModal"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>+ Add / Update Month</span>
            </button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th class="py-3 px-4">TRACKING PERIOD</th>
                  <th class="py-3 px-3 text-center font-mono">TARGET YIELD</th>
                  <th class="py-3 px-3 text-center font-mono">ACTUAL YIELD</th>
                  <th class="py-3 px-3 text-center font-mono text-teal-700">%GIVEAWAY</th>
                  <th class="py-3 px-4 text-center font-mono font-bold text-emerald-700">AUDITED SAVINGS (THB)</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                  <th class="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-mono">
                <tr v-for="(row, idx) in monthlyTracking" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-sans font-bold text-gray-900">{{ row.month }}</td>
                  <td class="py-3.5 px-3 text-center text-gray-500">{{ row.targetYield }}%</td>
                  <td class="py-3.5 px-3 text-center font-bold text-[#008779]">{{ row.actualYield }}%</td>
                  <td class="py-3.5 px-3 text-center font-semibold text-gray-700">{{ row.giveaway }}%</td>
                  <td class="py-3.5 px-4 text-center font-bold text-emerald-700">{{ row.savingsThb.toLocaleString() }} THB</td>
                  <td class="py-3.5 px-3 text-center font-sans">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-center font-sans">
                    <div class="flex items-center justify-center gap-1">
                      <button type="button" class="text-gray-400 hover:text-[#008779] p-1 cursor-pointer" @click="openEditModal(idx)">
                        <UIcon name="i-lucide-edit" class="size-3.5" />
                      </button>
                      <button type="button" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer" @click="removeMonth(idx)">
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

    <!-- Add/Edit Month Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">{{ isEditMode ? 'Edit Monthly Realization Log' : 'Add Monthly Realization Log' }}</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <label class="font-bold text-gray-700 block mb-1">Month Period</label>
            <input v-model="formMonth.month" type="text" placeholder="e.g. M1 (Mar 25)" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Target Yield (%)</label>
              <input v-model.number="formMonth.targetYield" type="number" step="0.05" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Actual Yield (%)</label>
              <input v-model.number="formMonth.actualYield" type="number" step="0.05" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-700 focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">%Giveaway</label>
              <input v-model.number="formMonth.giveaway" type="number" step="0.01" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Audited Savings (THB)</label>
              <input v-model.number="formMonth.savingsThb" type="number" step="1000" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-[#008779] focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isModalOpen = false">Cancel</button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveMonth">
              {{ isEditMode ? 'Update Month' : 'Save Month' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
