<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const STORAGE_KEY = `cpf_insight_data_${projectId}`

const activeSubTab = ref<'chart' | 'charter' | 'counterbalance' | 'versions'>('chart')

interface InsightRow {
  id: number
  period: string
  actual: number
  total: number
  pct: number
  isOutlier: boolean
  outlierCause: string
  notes?: string
}

const defaultRows: InsightRow[] = [
  { id: 1, period: '1', actual: 80, total: 100, pct: 80.0, isOutlier: true, outlierCause: 'เครื่องจักรสะดุดช่วงเปลี่ยน Shift', notes: 'Outlier with cause' },
  { id: 2, period: '2', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 3, period: '3', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 4, period: '4', actual: 83, total: 100, pct: 83.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 5, period: '5', actual: 82, total: 100, pct: 82.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 6, period: '6', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 7, period: '7', actual: 88, total: 100, pct: 88.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 8, period: '8', actual: 83, total: 100, pct: 83.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 9, period: '9', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 10, period: '10', actual: 82, total: 100, pct: 82.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 11, period: '11', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
  { id: 12, period: '12', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' }
]

const loadedData = ref<InsightRow[]>([...defaultRows])

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        loadedData.value = JSON.parse(saved)
      }
    } catch (e) {}
  }
})

// Dynamic Calculations from flexible data rows (No minimum row constraints)
const validRows = computed(() => loadedData.value.filter(r => !r.isOutlier))

const computedBaseline = computed(() => {
  if (validRows.value.length === 0) return 83.75
  const sum = validRows.value.reduce((acc, r) => acc + (r.pct || 0), 0)
  return Number((sum / validRows.value.length).toFixed(2))
})

const computedEntitlement = computed(() => {
  if (validRows.value.length === 0) return 88.00
  const maxVal = Math.max(...validRows.value.map(r => r.pct || 0))
  return Number(maxVal.toFixed(2))
})

const computedGoalLss = computed(() => {
  const base = computedBaseline.value
  const ent = computedEntitlement.value
  const goal = base + (ent - base) * 0.8
  return Number(goal.toFixed(2))
})

// Editable Goals State
const begData = ref({
  goalBu: '86.50',
  goalChallenge: '89.00'
})

// Counterbalance Targets
const counterbalanceTargets = ref([
  { id: 1, name: 'Product Quality Defect Rate (%)', current: '0.45%', limit: '< 0.50%', status: 'Within Limit' },
  { id: 2, name: 'Energy Consumption (kWh/ton)', current: '112.4', limit: '< 120.0', status: 'Within Limit' },
  { id: 3, name: 'Customer Complaint PPM', current: '12 ppm', limit: '< 15 ppm', status: 'Within Limit' }
])

// PCR Version History
const pcrVersions = ref([
  {
    version: 'V2.0 (Active)',
    approvedBy: 'Dr. Prasert Chareon (MBB)',
    approvedAt: '24/02/2026',
    status: 'Active',
    baseline: '83.75%',
    goal: '87.15%',
    comment: 'Updated goal calculation with 80% entitlement gap closure.'
  },
  {
    version: 'V1.0',
    approvedBy: 'Somchai Vong (Champion)',
    approvedAt: '15/01/2026',
    status: 'Archived',
    baseline: '82.50%',
    goal: '86.00%',
    comment: 'Initial charter draft.'
  }
])

const isSaveConfirmed = ref(false)
const saveChanges = () => {
  isSaveConfirmed.value = true
  setTimeout(() => { isSaveConfirmed.value = false }, 3000)
}

// SVG Dynamic Coordinate Mapping
// Map pct values (e.g. 75% to 92%) into SVG Y (180 to 30)
const minVal = computed(() => {
  const values = loadedData.value.map(r => r.pct || 0)
  if (values.length === 0) return 75
  return Math.min(...values, computedBaseline.value, 78) - 2
})

const maxVal = computed(() => {
  const values = loadedData.value.map(r => r.pct || 0)
  if (values.length === 0) return 92
  return Math.max(...values, computedEntitlement.value, 90) + 2
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
        Example เพิ่ม %Total Yield สินค้าไก่ทอด
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
                  BEG Statistical Time-Series Chart (Dynamic Sample Size)
                </h2>
                <span class="text-[10px] bg-teal-50 text-[#008779] border border-teal-200 px-2 py-0.5 rounded font-mono font-bold">
                  {{ loadedData.length }} Data Points
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Adapts dynamically to any entered sample size without minimum constraint.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <NuxtLink
                :to="`/admin/projects/${projectId}/define/insight-data`"
                class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
              >
                <UIcon name="i-lucide-edit" class="size-3.5" />
                <span>Edit Insight Data</span>
              </NuxtLink>

              <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
                Entitlement Gap Closure: 80.0%
              </span>
            </div>
          </div>

          <!-- Dynamic SVG Time-Series Chart -->
          <div class="h-68 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 740 210">
              <!-- Y Axis Reference Lines -->
              <!-- Entitlement Line - Amber -->
              <line
                x1="45"
                :y1="getYCoord(computedEntitlement)"
                x2="660"
                :y2="getYCoord(computedEntitlement)"
                stroke="#f59e0b"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              />
              <text x="665" :y="getYCoord(computedEntitlement) + 4" font-size="10" fill="#f59e0b" font-weight="bold">
                Entitlement: {{ computedEntitlement }}%
              </text>

              <!-- Goal Line - Purple -->
              <line
                x1="45"
                :y1="getYCoord(computedGoalLss)"
                x2="660"
                :y2="getYCoord(computedGoalLss)"
                stroke="#9333ea"
                stroke-width="2"
              />
              <text x="665" :y="getYCoord(computedGoalLss) + 4" font-size="10" fill="#9333ea" font-weight="bold">
                Goal LSS: {{ computedGoalLss }}%
              </text>

              <!-- Baseline Line - Red -->
              <line
                x1="45"
                :y1="getYCoord(computedBaseline)"
                x2="660"
                :y2="getYCoord(computedBaseline)"
                stroke="#dc2626"
                stroke-width="1.5"
                stroke-dasharray="4 4"
              />
              <text x="665" :y="getYCoord(computedBaseline) + 4" font-size="10" fill="#dc2626" font-weight="bold">
                Baseline: {{ computedBaseline }}%
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
              <g v-for="(row, rIdx) in loadedData" :key="row.id || rIdx">
                <!-- Dot -->
                <circle
                  :cx="getXCoord(rIdx)"
                  :cy="getYCoord(row.pct)"
                  :r="row.isOutlier ? 6 : 4.5"
                  :fill="row.isOutlier ? '#f59e0b' : '#008779'"
                  :stroke="row.isOutlier ? '#dc2626' : '#ffffff'"
                  stroke-width="1.5"
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
                  font-size="8"
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
              <p class="text-lg font-mono font-bold text-red-700 mt-0.5">{{ computedBaseline }}%</p>
              <span class="text-[10px] text-gray-500">From {{ validRows.length }} valid points</span>
            </div>

            <div class="border border-amber-200 rounded-lg p-3 bg-amber-50/30 text-center">
              <label class="text-[10px] text-amber-700 font-bold block uppercase">Entitlement (E)</label>
              <p class="text-lg font-mono font-bold text-amber-700 mt-0.5">{{ computedEntitlement }}%</p>
              <span class="text-[10px] text-gray-500">Historical Maximum</span>
            </div>

            <div class="border border-purple-200 rounded-lg p-3 bg-purple-50/30 text-center">
              <label class="text-[10px] text-purple-700 font-bold block uppercase">Goal LSS (G)</label>
              <p class="text-lg font-mono font-bold text-purple-700 mt-0.5">{{ computedGoalLss }}%</p>
              <span class="text-[10px] text-purple-600 font-medium">80% Gap Closure</span>
            </div>

            <div class="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <label class="text-[10px] text-gray-600 font-bold block uppercase">Goal BU (Optional)</label>
              <input v-model="begData.goalBu" type="text" placeholder="e.g. 86.50" class="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono mt-1 text-center font-semibold" />
            </div>

            <div class="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <label class="text-[10px] text-gray-600 font-bold block uppercase">Goal Challenge (Opt)</label>
              <input v-model="begData.goalChallenge" type="text" placeholder="e.g. 89.00" class="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono mt-1 text-center font-semibold" />
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
                Structured fields component with rich formatting for PDF/Image 100% boundary export
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
            ✓ Project Charter modifications saved as new pending revision.
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Problem Statement *</label>
              <textarea
                rows="3"
                class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#008779]"
                value="% Total Yield สินค้าไก่ทอดต่ำกว่าเกณฑ์มาตรฐาน (Baseline 83.75%) ส่งผลให้เกิดการสูญเสียต้นทุนวัตถุดิบและเกิด Giveaway เกินเป้าหมาย"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Goal Statement *</label>
              <textarea
                rows="3"
                class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#008779]"
                :value="`เพิ่ม %Total Yield สินค้าไก่ทอด จาก Baseline ${computedBaseline}% สู่ Goal LSS ${computedGoalLss}% (Entitlement ${computedEntitlement}%) ภายในระยะเวลาดำเนินโครงการ`"
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
  </div>
</template>
