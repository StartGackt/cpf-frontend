<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const {
  project,
  validInsightRows,
  baselineYield,
  entitlementYield,
  goalLssYield
} = useProjectData(projectId)

const activeSubTab = ref<'chart' | 'charter' | 'counterbalance' | 'versions'>('chart')

const loadedData = computed(() => project.value.insightRows)
const begData = computed(() => project.value.begGoals)
const counterbalanceTargets = computed(() => project.value.counterbalanceTargets)
const pcrVersions = computed(() => project.value.pcrVersions)

const isSaveConfirmed = ref(false)
const saveChanges = () => {
  isSaveConfirmed.value = true
  setTimeout(() => { isSaveConfirmed.value = false }, 3000)
}

// Quick edit point modal
const isQuickEditOpen = ref(false)
const quickEditRow = ref({
  index: -1,
  period: '',
  actual: 84,
  total: 100,
  isOutlier: false,
  outlierCause: ''
})

const openQuickEdit = (idx: number) => {
  const row = project.value.insightRows[idx]
  if (!row) return
  quickEditRow.value = {
    index: idx,
    period: row.period,
    actual: row.actual,
    total: row.total,
    isOutlier: row.isOutlier,
    outlierCause: row.outlierCause || ''
  }
  isQuickEditOpen.value = true
}

const saveQuickEdit = () => {
  const idx = quickEditRow.value.index
  if (idx >= 0 && idx < project.value.insightRows.length) {
    const target = project.value.insightRows[idx]
    if (target) {
      target.period = quickEditRow.value.period
      target.actual = quickEditRow.value.actual
      target.total = quickEditRow.value.total
      target.pct = Number(((quickEditRow.value.actual / (quickEditRow.value.total || 100)) * 100).toFixed(2))
      target.isOutlier = quickEditRow.value.isOutlier
      target.outlierCause = quickEditRow.value.outlierCause
    }
  }
  isQuickEditOpen.value = false
}

// SVG Dynamic Coordinate Mapping
const minVal = computed(() => {
  const values = loadedData.value.map(r => r.pct || 0)
  if (values.length === 0) return 75
  return Math.min(...values, baselineYield.value, 78) - 2
})

const maxVal = computed(() => {
  const values = loadedData.value.map(r => r.pct || 0)
  if (values.length === 0) return 92
  return Math.max(...values, entitlementYield.value, 90) + 2
})

const getYCoord = (val: number) => {
  const range = (maxVal.value - minVal.value) || 10
  const norm = (val - minVal.value) / range
  return 175 - (norm * 140)
}

const getXCoord = (index: number) => {
  const count = loadedData.value.length
  if (count <= 1) return 350
  const spacing = 580 / (count - 1)
  return 60 + (index * spacing)
}

const polylinePoints = computed(() => {
  return loadedData.value.map((r, idx) => `${getXCoord(idx)},${getYCoord(r.pct)}`).join(' ')
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
      <span class="text-gray-700 font-medium">Define</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">BEG & Project Charter</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="BEG Chart"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Sub Navigation Tabs -->
        <div class="flex items-center border-b border-gray-200 space-x-6 text-xs font-semibold">
          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'chart' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'chart'"
          >
            <UIcon name="i-lucide-line-chart" class="size-4" />
            <span>BEG Analysis Chart</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'charter' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'charter'"
          >
            <UIcon name="i-lucide-file-text" class="size-4" />
            <span>Project Charter (PCR Form)</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'counterbalance' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'counterbalance'"
          >
            <UIcon name="i-lucide-scale" class="size-4" />
            <span>Counterbalance Targets</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'versions' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'versions'"
          >
            <UIcon name="i-lucide-history" class="size-4" />
            <span>PCR Version History</span>
          </button>
        </div>

        <!-- 1. BEG Analysis Chart View -->
        <div v-if="activeSubTab === 'chart'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-gray-900">
                  BEG Statistical Time-Series Chart (Interactive Real-Time)
                </h2>
                <span class="text-[10px] bg-teal-50 text-[#008779] border border-teal-200 px-2 py-0.5 rounded font-mono font-bold">
                  {{ loadedData.length }} Data Points
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                คลิกที่จุดในกราฟเพื่อแก้ไขค่าแบบทันที หรือไปที่หน้า Insight Data เพื่อจัดการชุดข้อมูลทั้งหมด
              </p>
            </div>

            <div class="flex items-center gap-3">
              <NuxtLink
                :to="`/admin/projects/${projectId}/define/insight-data`"
                class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
              >
                <UIcon name="i-lucide-edit" class="size-3.5" />
                <span>Manage All Data Rows</span>
              </NuxtLink>

              <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
                Entitlement Gap Closure: 80.0%
              </span>
            </div>
          </div>

          <!-- Dynamic SVG Time-Series Chart -->
          <div class="h-68 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 740 210">
              <!-- Entitlement Line - Amber -->
              <line
                x1="45"
                :y1="getYCoord(entitlementYield)"
                x2="660"
                :y2="getYCoord(entitlementYield)"
                stroke="#f59e0b"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              />
              <text x="665" :y="getYCoord(entitlementYield) + 4" font-size="10" fill="#f59e0b" font-weight="bold">
                Entitlement: {{ entitlementYield }}%
              </text>

              <!-- Goal Line - Purple -->
              <line
                x1="45"
                :y1="getYCoord(goalLssYield)"
                x2="660"
                :y2="getYCoord(goalLssYield)"
                stroke="#9333ea"
                stroke-width="2"
              />
              <text x="665" :y="getYCoord(goalLssYield) + 4" font-size="10" fill="#9333ea" font-weight="bold">
                Goal LSS: {{ goalLssYield }}%
              </text>

              <!-- Baseline Line - Red -->
              <line
                x1="45"
                :y1="getYCoord(baselineYield)"
                x2="660"
                :y2="getYCoord(baselineYield)"
                stroke="#dc2626"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              />
              <text x="665" :y="getYCoord(baselineYield) + 4" font-size="10" fill="#dc2626" font-weight="bold">
                Baseline: {{ baselineYield }}%
              </text>

              <!-- Actual Data Points Connected Line -->
              <polyline
                v-if="loadedData.length > 1"
                :points="polylinePoints"
                fill="none"
                stroke="#008779"
                stroke-width="2.5"
              />

              <!-- Data Dots & Tooltip labels -->
              <g
                v-for="(row, rIdx) in loadedData"
                :key="row.id || rIdx"
                class="cursor-pointer group"
                @click="openQuickEdit(rIdx)"
              >
                <!-- Dot -->
                <circle
                  :cx="getXCoord(rIdx)"
                  :cy="getYCoord(row.pct)"
                  :r="row.isOutlier ? 6.5 : 5"
                  :fill="row.isOutlier ? '#f59e0b' : '#008779'"
                  :stroke="row.isOutlier ? '#dc2626' : '#ffffff'"
                  stroke-width="1.5"
                  class="transition-transform group-hover:scale-125"
                />

                <!-- X Axis Period Label -->
                <text
                  :x="getXCoord(rIdx)"
                  y="200"
                  font-size="9"
                  fill="#64748b"
                  text-anchor="middle"
                  font-family="monospace"
                >
                  {{ row.period || (rIdx + 1) }}
                </text>

                <!-- Value Label on Top of Dot -->
                <text
                  :x="getXCoord(rIdx)"
                  :y="getYCoord(row.pct) - 8"
                  font-size="8.5"
                  :fill="row.isOutlier ? '#b45309' : '#0f766e'"
                  text-anchor="middle"
                  font-weight="bold"
                  font-family="monospace"
                >
                  {{ row.pct }}%
                </text>
              </g>
            </svg>
          </div>

          <!-- BEG Goals Metrics Formulation Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <div class="border border-red-200 rounded-lg p-3 bg-red-50/30 text-center">
              <label class="text-[10px] text-red-700 font-bold block uppercase">Baseline (B)</label>
              <p class="text-lg font-mono font-bold text-red-700 mt-0.5">{{ baselineYield }}%</p>
              <span class="text-[10px] text-gray-500">From {{ validInsightRows.length }} valid points</span>
            </div>

            <div class="border border-amber-200 rounded-lg p-3 bg-amber-50/30 text-center">
              <label class="text-[10px] text-amber-700 font-bold block uppercase">Entitlement (E)</label>
              <p class="text-lg font-mono font-bold text-amber-700 mt-0.5">{{ entitlementYield }}%</p>
              <span class="text-[10px] text-gray-500">Historical Maximum</span>
            </div>

            <div class="border border-purple-200 rounded-lg p-3 bg-purple-50/30 text-center">
              <label class="text-[10px] text-purple-700 font-bold block uppercase">Goal LSS (G)</label>
              <p class="text-lg font-mono font-bold text-purple-700 mt-0.5">{{ goalLssYield }}%</p>
              <span class="text-[10px] text-purple-600 font-medium">80% Gap Closure</span>
            </div>

            <div class="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <label class="text-[10px] text-gray-600 font-bold block uppercase">Goal BU (Optional)</label>
              <input v-model="begData.goalBu" type="text" placeholder="e.g. 86.50" class="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono mt-1 text-center font-semibold focus:border-[#008779] focus:outline-hidden" />
            </div>

            <div class="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <label class="text-[10px] text-gray-600 font-bold block uppercase">Goal Challenge (Opt)</label>
              <input v-model="begData.goalChallenge" type="text" placeholder="e.g. 89.00" class="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono mt-1 text-center font-semibold focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
        </div>

        <!-- 2. Project Charter Form View -->
        <div v-if="activeSubTab === 'charter'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Project Charter (PCR) Documentation Editor
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Structured fields component with rich formatting for PDF/Image export
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
              @click="saveChanges"
            >
              Save Charter Changes
            </button>
          </div>

          <div v-if="isSaveConfirmed" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-md font-semibold">
            ✓ Project Charter modifications saved.
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Problem Statement *</label>
              <textarea
                rows="3"
                class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#008779]"
                :value="`% Total Yield สินค้าไก่ทอดต่ำกว่าเกณฑ์มาตรฐาน (Baseline ${baselineYield}%) ส่งผลให้เกิดการสูญเสียต้นทุนวัตถุดิบและเกิด Giveaway เกินเป้าหมาย`"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Goal Statement *</label>
              <textarea
                rows="3"
                class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#008779]"
                :value="`เพิ่ม %Total Yield สินค้าไก่ทอด จาก Baseline ${baselineYield}% สู่ Goal LSS ${goalLssYield}% (Entitlement ${entitlementYield}%) ภายในระยะเวลาดำเนินโครงการ`"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 3. Counterbalance Targets View -->
        <div v-if="activeSubTab === 'counterbalance'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 class="text-sm font-bold text-gray-900">
              Counterbalance Targets (Quality & Safety Boundaries)
            </h2>
          </div>
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                <th class="p-3">Counterbalance Metric</th>
                <th class="p-3">Current Performance</th>
                <th class="p-3">Allowable Boundary Limit</th>
                <th class="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="t in counterbalanceTargets" :key="t.id">
                <td class="p-3 font-semibold text-gray-900">{{ t.name }}</td>
                <td class="p-3 font-mono text-gray-700">{{ t.current }}</td>
                <td class="p-3 font-mono text-gray-500">{{ t.limit }}</td>
                <td class="p-3 text-center">
                  <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ {{ t.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 4. PCR Version History View -->
        <div v-if="activeSubTab === 'versions'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <h2 class="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
            PCR Sign-off Version History & Audit Trail
          </h2>
          <div class="space-y-3">
            <div v-for="v in pcrVersions" :key="v.version" class="border rounded-lg p-4 space-y-1.5 text-xs bg-gray-50/50">
              <div class="flex items-center justify-between">
                <span class="font-bold text-gray-900">{{ v.version }}</span>
                <span class="text-gray-500 font-mono text-[10px]">Approved by {{ v.approvedBy }} on {{ v.approvedAt }}</span>
              </div>
              <p class="text-gray-600">{{ v.comment }}</p>
              <div class="flex gap-4 font-mono text-[11px] pt-1">
                <span>Baseline: <strong class="text-red-700">{{ v.baseline }}</strong></span>
                <span>Goal: <strong class="text-purple-700">{{ v.goal }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Edit Point Modal -->
    <div
      v-if="isQuickEditOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">Edit Data Point (Period {{ quickEditRow.period }})</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isQuickEditOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <label class="font-bold text-gray-700 block mb-1">Period Label</label>
            <input v-model="quickEditRow.period" type="text" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Actual (Num)</label>
              <input v-model.number="quickEditRow.actual" type="number" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Total (Denom)</label>
              <input v-model.number="quickEditRow.total" type="number" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <input id="quickOutlier" v-model="quickEditRow.isOutlier" type="checkbox" class="accent-amber-600 size-4 cursor-pointer" />
            <label for="quickOutlier" class="text-xs font-semibold text-gray-800 cursor-pointer">Flag as Outlier</label>
          </div>
          <div v-if="quickEditRow.isOutlier">
            <label class="font-bold text-gray-700 block mb-1">Outlier Cause</label>
            <input v-model="quickEditRow.outlierCause" type="text" placeholder="Reason for excluding from baseline" class="w-full bg-gray-50 border border-amber-300 rounded px-2.5 py-1.5 text-xs focus:border-amber-500 focus:outline-hidden" />
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isQuickEditOpen = false">
              Cancel
            </button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveQuickEdit">
              Save Point
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
