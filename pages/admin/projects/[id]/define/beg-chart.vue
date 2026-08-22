<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'
import { useApprovalWorkflow } from '~/composables/useApprovalWorkflow'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const {
  project,
  validInsightRows,
  baselineYield,
  entitlementYield,
  goalLssYield
} = useProjectData(projectId)

const { submitGoalRevisionWorkflow } = useApprovalWorkflow()

const activeSubTab = ref<'chart' | 'charter' | 'counterbalance' | 'versions'>('chart')
const charterFormat = ref<'form' | 'wysiwyg' | 'table'>('form')

const loadedData = computed(() => project.value.insightRows)
const begData = computed(() => project.value.begGoals)
const counterbalanceTargets = computed(() => project.value.counterbalanceTargets)
const pcrVersions = computed(() => project.value.pcrVersions)

// Toast Feedback Notification
const toastMsg = ref('')
const toastType = ref<'success' | 'error'>('success')
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 4000)
}

const isSaveConfirmed = ref(false)
const saveChanges = () => {
  isSaveConfirmed.value = true
  setTimeout(() => { isSaveConfirmed.value = false }, 3000)
}

const exportCharterPdf = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

// Goal Revision & Validation Logic (Requirement Image 4)
const saveGoalField = (fieldName: 'goalBu' | 'goalStandard' | 'goalIndustry', label: string) => {
  const inputValStr = project.value.begGoals[fieldName] || ''
  const inputNum = parseFloat(inputValStr)

  if (isNaN(inputNum) || inputNum <= 0) {
    showToast(`กรุณากรอกตัวเลข ${label} ที่ถูกต้อง`, 'error')
    return
  }

  const isIncrease = (project.value.target?.type || 'Increase') === 'Increase'
  const minThreshold = baselineYield.value

  // Validation Rule: New Goal MUST be higher/better than current baseline
  if (isIncrease && inputNum < minThreshold) {
    showToast(`⚠️ ค่า ${label} ใหม่ (${inputNum}%) ต้องไม่ต่ำกว่าค่า Baseline เดิม (${minThreshold}%)`, 'error')
    return
  }

  // Auto-apply and dispatch approval request to Admin
  submitGoalRevisionWorkflow(
    projectId,
    project.value.name,
    project.value.plant,
    `${baselineYield.value}%`,
    `${entitlementYield.value}%`,
    `${goalLssYield.value}%`,
    `${inputNum}%`,
    `ปรับปรุงค่าเป้าหมาย ${label} จากการประเมินศักยภาพกระบวนการใหม่`
  )

  project.value.begGoals.goalRevisionStatus = 'Pending Review'
  showToast(`✓ ตั้งค่า ${label} เป็น ${inputNum}% สำเร็จ และส่งคำขออนุมัติไปยัง Admin (/admin/approvals) เรียบร้อยแล้ว`, 'success')
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
  showToast('Updated data point in real-time!')
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
    <!-- Toast Feedback Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toastMsg"
        class="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
        :class="toastType === 'error' ? 'bg-rose-900 border border-rose-500 text-white' : 'bg-gray-900 border border-teal-500 text-white'"
      >
        <UIcon :name="toastType === 'error' ? 'i-lucide-alert-circle' : 'i-lucide-check-circle-2'" class="size-4" :class="toastType === 'error' ? 'text-rose-400' : 'text-teal-400'" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-gray-500 pb-1">
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

    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="BEG Chart"
      />

      <div class="flex-1 min-w-0 w-full space-y-4">
        <!-- Sub Navigation Tabs (Pill Style) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-2 flex items-center gap-1.5 flex-wrap text-xs">
          <button
            type="button"
            class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeSubTab === 'chart' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            @click="activeSubTab = 'chart'"
          >
            <UIcon name="i-lucide-line-chart" class="size-4" />
            <span>BEG Analysis Chart</span>
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeSubTab === 'charter' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            @click="activeSubTab = 'charter'"
          >
            <UIcon name="i-lucide-file-text" class="size-4" />
            <span>Project Charter (PCR Form)</span>
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeSubTab === 'counterbalance' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            @click="activeSubTab = 'counterbalance'"
          >
            <UIcon name="i-lucide-scale" class="size-4" />
            <span>Counterbalance Targets</span>
          </button>

          <button
            type="button"
            class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeSubTab === 'versions' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            @click="activeSubTab = 'versions'"
          >
            <UIcon name="i-lucide-history" class="size-4" />
            <span>PCR Version History</span>
          </button>
        </div>

        <!-- 1. BEG Analysis Chart View (Matching Design 3 & 4) -->
        <div v-if="activeSubTab === 'chart'" class="space-y-4">
          
          <!-- Header Banner: BEG Analysis for Improvement Targets -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 class="text-sm font-bold text-slate-900">BEG Analysis for Improvement Targets</h1>
                <p class="text-xs text-slate-500 mt-0.5">Configure baseline, entitlement, and goal values for your improvement targets</p>
              </div>

              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/admin/projects/${projectId}/define/insight-data`"
                  class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <UIcon name="i-lucide-edit" class="size-3.5 text-[#008779]" />
                  <span>Manage Insight Data</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Target Summary Pill Box (Design 3) -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-4 flex-wrap text-xs">
                <span class="text-sm font-bold text-slate-900 font-mono">{{ project.target?.targetName || '%Yield' }}</span>
                <span class="text-slate-500">Category: <strong class="text-slate-800">{{ project.target?.category || 'Quality' }}</strong></span>
                <span class="text-slate-500">Type: <strong class="text-slate-800">{{ project.target?.type || 'Increase' }}</strong></span>
                <span class="text-slate-500">Unit: <strong class="text-slate-800">{{ project.target?.unit || '%' }}</strong></span>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold font-mono bg-teal-50 text-[#008779] border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {{ loadedData.length }} points
                </span>
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Goals Active
                </span>
              </div>
            </div>
          </div>

          <!-- BEG Analysis Time Series SVG Chart -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {{ project.target?.targetName || '%Yield' }} - BEG Analysis Chart
            </h3>

            <div class="h-68 border border-slate-100 rounded-xl p-4 bg-slate-50/40 flex items-center justify-center relative overflow-hidden">
              <svg class="w-full h-full" viewBox="0 0 740 210">
                <!-- Entitlement Line - Amber -->
                <line
                  x1="45"
                  :y1="getYCoord(entitlementYield)"
                  x2="640"
                  :y2="getYCoord(entitlementYield)"
                  stroke="#f59e0b"
                  stroke-width="1.5"
                  stroke-dasharray="4 4"
                />
                <text x="645" :y="getYCoord(entitlementYield) + 4" font-size="10" fill="#f59e0b" font-weight="bold" font-family="monospace">
                  Entitlement: {{ entitlementYield }}
                </text>

                <!-- Goal LSS Line - Purple -->
                <line
                  x1="45"
                  :y1="getYCoord(goalLssYield)"
                  x2="640"
                  :y2="getYCoord(goalLssYield)"
                  stroke="#9333ea"
                  stroke-width="2"
                />
                <text x="645" :y="getYCoord(goalLssYield) + 4" font-size="10" fill="#9333ea" font-weight="bold" font-family="monospace">
                  Goal LSS: {{ goalLssYield }}
                </text>

                <!-- Baseline Line - Red -->
                <line
                  x1="45"
                  :y1="getYCoord(baselineYield)"
                  x2="640"
                  :y2="getYCoord(baselineYield)"
                  stroke="#dc2626"
                  stroke-width="1.5"
                  stroke-dasharray="4 4"
                />
                <text x="645" :y="getYCoord(baselineYield) + 4" font-size="10" fill="#dc2626" font-weight="bold" font-family="monospace">
                  Baseline: {{ baselineYield }}
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
                  <circle
                    :cx="getXCoord(rIdx)"
                    :cy="getYCoord(row.pct)"
                    :r="row.isOutlier ? 6.5 : 5"
                    :fill="row.isOutlier ? '#f59e0b' : '#008779'"
                    :stroke="row.isOutlier ? '#dc2626' : '#ffffff'"
                    stroke-width="1.5"
                    class="transition-transform group-hover:scale-125"
                  />
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
                  <text
                    :x="getXCoord(rIdx)"
                    :y="getYCoord(row.pct) - 8"
                    font-size="8.5"
                    :fill="row.isOutlier ? '#b45309' : '#0f766e'"
                    text-anchor="middle"
                    font-weight="bold"
                    font-family="monospace"
                  >
                    {{ row.pct }}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- BEG VALUES CONFIGURATION TABLE (Matching Image 3 & 4) -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                BEG Values Configuration
              </h3>
              <span v-if="project.begGoals.goalRevisionStatus === 'Pending Review'" class="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                ⏳ Goal Revision Pending Admin Approval
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead class="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-3">TARGET INDICATORS</th>
                    <th class="py-3 px-3 text-center">UNIT</th>
                    <th class="py-3 px-3 text-center">BASELINE</th>
                    <th class="py-3 px-3 text-center">ENTITLEMENT</th>
                    <th class="py-3 px-3 text-center">GOAL LSS</th>
                    <th class="py-3 px-3 text-center">GOAL BU</th>
                    <th class="py-3 px-3 text-center">GOAL STANDARD</th>
                    <th class="py-3 px-3 text-center">GOAL INDUSTRY</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <!-- Indicator Name -->
                    <td class="py-3 px-3 font-bold font-mono text-slate-900">
                      {{ project.target?.targetName || '%Yield' }}
                    </td>

                    <!-- Unit -->
                    <td class="py-3 px-3 text-center font-mono">
                      {{ project.target?.unit || '%' }}
                    </td>

                    <!-- Baseline -->
                    <td class="py-3 px-3 text-center font-mono font-bold text-rose-600 bg-rose-50/20">
                      {{ baselineYield }}
                    </td>

                    <!-- Entitlement -->
                    <td class="py-3 px-3 text-center font-mono font-bold text-amber-600 bg-amber-50/20">
                      {{ entitlementYield }}
                    </td>

                    <!-- Goal LSS -->
                    <td class="py-3 px-3 text-center font-mono font-bold text-purple-700 bg-purple-50/20">
                      {{ goalLssYield }}
                    </td>

                    <!-- Goal BU (Input + Save) -->
                    <td class="py-2.5 px-3 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <input
                          v-model="project.begGoals.goalBu"
                          type="text"
                          placeholder="Enter val"
                          class="w-18 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-mono focus:border-[#008779] focus:outline-none"
                        />
                        <button
                          type="button"
                          class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                          @click="saveGoalField('goalBu', 'Goal BU')"
                        >
                          Save
                        </button>
                      </div>
                    </td>

                    <!-- Goal Standard (Input + Save) -->
                    <td class="py-2.5 px-3 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <input
                          v-model="project.begGoals.goalStandard"
                          type="text"
                          placeholder="Enter val"
                          class="w-18 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-mono focus:border-[#008779] focus:outline-none"
                        />
                        <button
                          type="button"
                          class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                          @click="saveGoalField('goalStandard', 'Goal Standard')"
                        >
                          Save
                        </button>
                      </div>
                    </td>

                    <!-- Goal Industry (Input + Save) -->
                    <td class="py-2.5 px-3 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <input
                          v-model="project.begGoals.goalIndustry"
                          type="text"
                          placeholder="Enter val"
                          class="w-18 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-mono focus:border-[#008779] focus:outline-none"
                        />
                        <button
                          type="button"
                          class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors shadow-2xs"
                          @click="saveGoalField('goalIndustry', 'Goal Industry')"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Calculation Method Explanations (Matching Image 3 Bottom) -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-[11px] space-y-1 text-slate-600">
              <span class="font-bold text-slate-800 block text-xs mb-1">Calculation Method:</span>
              <p>• <strong>Baseline:</strong> Mean of all valid data points (excluding outliers with cause)</p>
              <p>• <strong>Entitlement:</strong> Maximum value in dataset (Best historical continuous record)</p>
              <p>• <strong>Goal LSS:</strong> Baseline + ((Entitlement - Baseline) * 0.80) [80% Gap Closure Rule]</p>
              <p>• <strong>Goal BU / Standard / Industry:</strong> User input, must be ≥ Baseline (ห้ามตั้งเป้าหมายต่ำลง) และจะส่งบันทึกขออนุมัติไปยังผู้ดูแลระบบอัตโนมัติ</p>
            </div>
          </div>

        </div>

        <!-- 2. Project Charter Multi-Format View -->
        <div v-if="activeSubTab === 'charter'" class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-slate-900">
                  Project Charter (PCR) Documentation Studio
                </h2>
                <span class="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>API Sync Connected</span>
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                รองรับการกรอกข้อมูลหลายรูปแบบ (Form Fields, WYSIWYG Editor, ตาราง Matrix)
              </p>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <div class="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  :class="charterFormat === 'form' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  @click="charterFormat = 'form'"
                >
                  Form Fields
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  :class="charterFormat === 'wysiwyg' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  @click="charterFormat = 'wysiwyg'"
                >
                  WYSIWYG
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  :class="charterFormat === 'table' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                  @click="charterFormat = 'table'"
                >
                  Table
                </button>
              </div>

              <button
                type="button"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                @click="exportCharterPdf"
              >
                <UIcon name="i-lucide-file-text" class="size-3.5 text-rose-500" />
                <span>Export PDF</span>
              </button>

              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                @click="saveChanges"
              >
                <UIcon name="i-lucide-check" class="size-3.5" />
                <span>Save Charter</span>
              </button>
            </div>
          </div>

          <!-- Format A: Form Fields View -->
          <div v-if="charterFormat === 'form'" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="space-y-1.5">
              <label class="font-bold text-slate-700 block">Problem Statement (สภาพปัญหาปัจจุบัน) *</label>
              <textarea
                rows="3"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
                :value="`% Total Yield สินค้าไก่ทอดต่ำกว่าเกณฑ์มาตรฐาน (Baseline ${baselineYield}%) ส่งผลให้เกิดการสูญเสียต้นทุนวัตถุดิบและเกิด Giveaway เกินเป้าหมาย`"
              ></textarea>
            </div>

            <div class="space-y-1.5">
              <label class="font-bold text-slate-700 block">Goal Statement (เป้าหมายโครงการ) *</label>
              <textarea
                rows="3"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
                :value="`เพิ่ม %Total Yield สินค้าไก่ทอด จาก Baseline ${baselineYield}% สู่ Goal LSS ${goalLssYield}% (Entitlement ${entitlementYield}%) ภายในระยะเวลาดำเนินโครงการ`"
              ></textarea>
            </div>

            <div class="space-y-1.5">
              <label class="font-bold text-slate-700 block">Project Scope (ขอบเขตงาน In-Scope / Out-Scope)</label>
              <textarea
                rows="3"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
                value="In-Scope: กระบวนการผสมแป้ง Predust, การชุบ Batter, การทอด Continuous Fryer และการชั่ง Multihead Weigher&#10;Out-Scope: กระบวนการเชือดและตัดแต่งเบื้องต้น (Primary Processing)"
              ></textarea>
            </div>

            <div class="space-y-1.5">
              <label class="font-bold text-slate-700 block">Business Case & Financial Return (ผลประโยชน์ทางการเงิน)</label>
              <textarea
                rows="3"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
                value="คาดการณ์ผลประโยชน์จากการลด Yield Loss และลด Giveaway น้ำหนักเกิน 4,450,000 บาท/ปี โดยใช้วิธี Six Sigma DMAIC"
              ></textarea>
            </div>
          </div>

          <!-- Format B: WYSIWYG View -->
          <div v-else-if="charterFormat === 'wysiwyg'" class="space-y-3">
            <div class="border border-slate-200 rounded-2xl p-6 bg-white space-y-4 text-xs text-slate-800 min-h-[200px]">
              <h1 class="text-base font-black text-slate-900 border-b pb-2">
                PROJECT CHARTER (PCR) — {{ project.name }}
              </h1>
              <div class="space-y-2">
                <h3 class="font-bold text-[#008779]">1. Problem Statement:</h3>
                <p class="leading-relaxed text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  ค่าเฉลี่ย Yield ปัจจุบันอยู่ที่ <strong>{{ baselineYield }}%</strong> ซึ่งต่ำกว่าค่าประวัติศาสตร์สูงสุดที่ทำได้ (<strong>{{ entitlementYield }}%</strong>)
                </p>
                <h3 class="font-bold text-[#008779] pt-2">2. Objective & Financial Goal:</h3>
                <p class="leading-relaxed text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  ปิดช่องว่างผลการดำเนินงาน 80% สู่เป้าหมาย <strong>{{ goalLssYield }}%</strong> คาดว่าจะสร้างผลประหยัดต้นทุนรวม <strong>4.45 ล้านบาท/ปี</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- Format C: Table View -->
          <div v-else class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th class="p-3">Section</th>
                  <th class="p-3">Specification Content</th>
                  <th class="p-3">Target KPI</th>
                  <th class="p-3">Accountable Lead</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td class="p-3 font-bold text-slate-900">Problem Statement</td>
                  <td class="p-3">%Total Yield สินค้าไก่ทอดต่ำกว่าเป้าหมายที่คาดหวัง</td>
                  <td class="p-3 font-mono text-rose-600 font-bold">Baseline {{ baselineYield }}%</td>
                  <td class="p-3">{{ project.leader }}</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900">Goal Statement</td>
                  <td class="p-3">เพิ่มผลผลิตและลดน้ำหนักส่วนเกิน Giveaway</td>
                  <td class="p-3 font-mono text-purple-700 font-bold">Goal LSS {{ goalLssYield }}%</td>
                  <td class="p-3">Dr. Prasert Chareon (MBB)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. Counterbalance Targets View -->
        <div v-if="activeSubTab === 'counterbalance'" class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900">
              Counterbalance Targets (Quality & Safety Boundaries)
            </h2>
          </div>
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <th class="p-3">Counterbalance Metric</th>
                <th class="p-3">Current Performance</th>
                <th class="p-3">Allowable Boundary Limit</th>
                <th class="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="t in counterbalanceTargets" :key="t.id">
                <td class="p-3 font-semibold text-slate-900">{{ t.name }}</td>
                <td class="p-3 font-mono text-slate-700">{{ t.current }}</td>
                <td class="p-3 font-mono text-slate-500">{{ t.limit }}</td>
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
        <div v-if="activeSubTab === 'versions'" class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                PCR Sign-off Version History & Audit Trail
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                บันทึกเวอร์ชัน PCR ทุกฉบับและสถานะการเชื่อมต่อ API ขององค์กร
              </p>
            </div>
            <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Current Active: v1.0
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(v, vIdx) in pcrVersions"
              :key="v.version"
              class="border rounded-2xl p-4 space-y-2 text-xs transition-colors"
              :class="vIdx === 0 ? 'border-teal-300 bg-teal-50/20' : 'border-slate-200 bg-slate-50/40'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">{{ v.version }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-[9px] font-bold"
                    :class="vIdx === 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'"
                  >
                    {{ vIdx === 0 ? 'Active (ฉบับใช้งาน)' : 'Inactive (ประวัติย้อนหลัง)' }}
                  </span>
                </div>
                <span class="text-slate-500 font-mono text-[10px]">Approved by {{ v.approvedBy }} on {{ v.approvedAt }}</span>
              </div>
              <p class="text-slate-600">{{ v.comment }}</p>
              <div class="flex gap-4 font-mono text-[11px] pt-1">
                <span>Baseline: <strong class="text-rose-600">{{ v.baseline }}</strong></span>
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
