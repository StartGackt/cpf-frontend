<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData, type TrackingLog } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project, trackingStats, baselineYield } = useProjectData(projectId)

const trackingData = computed(() => project.value.trackingLogs)

const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentEditIdx = ref(-1)

const formLog = ref<TrackingLog>({
  id: '',
  date: '2026-02-23',
  shift: 'Shift A',
  yieldVal: 87.9,
  giveaway: 2.18,
  flourPct: 18.2,
  status: 'In Control'
})

const openAddModal = () => {
  isEditMode.value = false
  currentEditIdx.value = -1
  formLog.value = {
    id: `TRK-${project.value.trackingLogs.length + 1}`,
    date: new Date().toISOString().split('T')[0] || '2026-02-24',
    shift: 'Shift A',
    yieldVal: 87.8,
    giveaway: 2.19,
    flourPct: 18.3,
    status: 'In Control'
  }
  isModalOpen.value = true
}

const openEditModal = (idx: number) => {
  const item = project.value.trackingLogs[idx]
  if (!item) return
  isEditMode.value = true
  currentEditIdx.value = idx
  formLog.value = { ...item }
  isModalOpen.value = true
}

const saveLog = () => {
  if (isEditMode.value && currentEditIdx.value >= 0) {
    project.value.trackingLogs[currentEditIdx.value] = { ...formLog.value }
  } else {
    project.value.trackingLogs.push({ ...formLog.value })
  }
  isModalOpen.value = false
}

const removeLog = (idx: number) => {
  project.value.trackingLogs.splice(idx, 1)
}

// Dynamic SVG Control Chart Coordinates
const yMin = computed(() => Math.min(85.0, trackingStats.value.lcl - 0.5))
const yMax = computed(() => Math.max(90.0, trackingStats.value.ucl + 0.5))

const getChartY = (val: number) => {
  const range = (yMax.value - yMin.value) || 5
  return 170 - ((val - yMin.value) / range) * 140
}

const getChartX = (index: number) => {
  const count = trackingData.value.length
  if (count <= 1) return 340
  const spacing = 540 / (count - 1)
  return 70 + index * spacing
}

const polylinePoints = computed(() => {
  return trackingData.value.map((r, idx) => `${getChartX(idx)},${getChartY(r.yieldVal)}`).join(' ')
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
      <span class="text-gray-900 font-bold">Control Tracking</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Control Tracking"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Statistical Process Control (SPC) Tracking Log
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Track long-term process stability and monitor sustaining project yield gains
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              In Control
            </span>
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              @click="openAddModal"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>Add Weekly Log</span>
            </button>
          </div>
        </div>

        <!-- 3 Stat Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
            <span class="text-xs text-gray-500 font-medium">Avg Post-Improvement %Yield</span>
            <p class="text-2xl font-bold text-[#008779] font-mono">{{ trackingStats.avgYield }}%</p>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-trending-up" class="size-3" />
              <span>+{{ (trackingStats.avgYield - baselineYield).toFixed(2) }}% vs Baseline ({{ baselineYield }}%)</span>
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
            <span class="text-xs text-gray-500 font-medium">Avg %Giveaway</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">{{ trackingStats.avgGiveaway }}%</p>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-check-circle" class="size-3" />
              <span>Within Target (&lt; 2.20%)</span>
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
            <span class="text-xs text-gray-500 font-medium">Control Limits (UCL / LCL)</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">{{ trackingStats.ucl }}% / {{ trackingStats.lcl }}%</p>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-shield-check" class="size-3" />
              <span>CL = {{ trackingStats.cl }}% (Stable)</span>
            </span>
          </div>
        </div>

        <!-- Dynamic SPC Control Chart -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 class="text-base font-bold text-gray-900">
                X̄ Control Chart (Weekly Yield Stability)
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">
                Upper Control Limit (UCL) = {{ trackingStats.ucl }}%, Centerline (CL) = {{ trackingStats.cl }}%, Lower Control Limit (LCL) = {{ trackingStats.lcl }}%
              </p>
            </div>
            <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
              {{ trackingData.length }} Tracking Points
            </span>
          </div>

          <div class="h-64 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 700 200">
              <!-- UCL Line (Red Dash) -->
              <line x1="50" :y1="getChartY(trackingStats.ucl)" x2="630" :y2="getChartY(trackingStats.ucl)" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="635" :y="getChartY(trackingStats.ucl) + 4" font-size="9" fill="#dc2626" font-weight="bold">UCL: {{ trackingStats.ucl }}%</text>

              <!-- Centerline (Green Solid) -->
              <line x1="50" :y1="getChartY(trackingStats.cl)" x2="630" :y2="getChartY(trackingStats.cl)" stroke="#008779" stroke-width="2" />
              <text x="635" :y="getChartY(trackingStats.cl) + 4" font-size="9" fill="#008779" font-weight="bold">CL: {{ trackingStats.cl }}%</text>

              <!-- LCL Line (Red Dash) -->
              <line x1="50" :y1="getChartY(trackingStats.lcl)" x2="630" :y2="getChartY(trackingStats.lcl)" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="635" :y="getChartY(trackingStats.lcl) + 4" font-size="9" fill="#dc2626" font-weight="bold">LCL: {{ trackingStats.lcl }}%</text>

              <!-- Connected Polyline -->
              <polyline
                v-if="trackingData.length > 1"
                :points="polylinePoints"
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
              />

              <!-- Data Dots -->
              <g v-for="(row, idx) in trackingData" :key="row.id || idx" class="cursor-pointer" @click="openEditModal(idx)">
                <circle
                  :cx="getChartX(idx)"
                  :cy="getChartY(row.yieldVal)"
                  r="5"
                  fill="#2563eb"
                  stroke="#ffffff"
                  stroke-width="1.5"
                />
                <!-- Label -->
                <text :x="getChartX(idx)" :y="getChartY(row.yieldVal) - 8" font-size="8.5" fill="#1e40af" font-weight="bold" text-anchor="middle" font-family="monospace">
                  {{ row.yieldVal }}%
                </text>
                <!-- Date Label -->
                <text :x="getChartX(idx)" y="190" font-size="8" fill="#64748b" text-anchor="middle" font-family="monospace">
                  {{ row.date.slice(5) }}
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Tracking Table -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 class="text-base font-bold text-gray-900">
              Weekly Post-Implementation Tracking Log
            </h3>
            <button
              type="button"
              class="bg-[#008779] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs cursor-pointer"
              @click="openAddModal"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>New Entry</span>
            </button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold">DATE</th>
                  <th class="py-3 px-4 font-semibold">SHIFT</th>
                  <th class="py-3 px-4 font-semibold text-center">% TOTAL YIELD</th>
                  <th class="py-3 px-4 font-semibold text-center">% GIVEAWAY</th>
                  <th class="py-3 px-4 font-semibold text-center">% FLOUR USAGE</th>
                  <th class="py-3 px-4 font-semibold text-center">STATUS</th>
                  <th class="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(row, idx) in trackingData" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-medium text-gray-900">{{ row.date }}</td>
                  <td class="py-3.5 px-4 text-gray-600">{{ row.shift }}</td>
                  <td class="py-3.5 px-4 text-center font-bold text-emerald-700 font-mono">{{ row.yieldVal }}%</td>
                  <td class="py-3.5 px-4 text-center font-semibold text-gray-800 font-mono">{{ row.giveaway }}%</td>
                  <td class="py-3.5 px-4 text-center text-gray-700 font-mono">{{ row.flourPct }}%</td>
                  <td class="py-3.5 px-4 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
                      <span>{{ row.status }}</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button type="button" class="text-gray-400 hover:text-[#008779] p-1 cursor-pointer" @click="openEditModal(idx)">
                        <UIcon name="i-lucide-edit" class="size-3.5" />
                      </button>
                      <button type="button" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer" @click="removeLog(idx)">
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
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">{{ isEditMode ? 'Edit Weekly Tracking Log' : 'Add Weekly Tracking Log' }}</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Date</label>
              <input v-model="formLog.date" type="date" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Shift</label>
              <select v-model="formLog.shift" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden">
                <option>Shift A</option>
                <option>Shift B</option>
                <option>Shift C</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="font-bold text-gray-700 block mb-1">%Yield</label>
              <input v-model.number="formLog.yieldVal" type="number" step="0.1" class="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5 text-xs font-mono font-bold text-emerald-700 focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">%Giveaway</label>
              <input v-model.number="formLog.giveaway" type="number" step="0.01" class="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5 text-xs font-mono text-center focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">%Flour</label>
              <input v-model.number="formLog.flourPct" type="number" step="0.1" class="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5 text-xs font-mono text-center focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isModalOpen = false">Cancel</button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveLog">
              {{ isEditMode ? 'Update Log' : 'Save Log' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
