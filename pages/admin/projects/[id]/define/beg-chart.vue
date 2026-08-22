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
  showToast('✓ บันทึกข้อมูล Charter & BEG เรียบร้อยแล้ว')
  setTimeout(() => { isSaveConfirmed.value = false }, 3000)
}

const exportCharterPdf = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

// Target Visibility Toggles
const visibleLines = ref({
  dataLine: true,
  baseline: true,
  entitlement: true,
  goalLss: true,
  goalBu: true,
  goalStandard: true,
  goalIndustry: true
})

// Numeric Parsed Goals for Dynamic Rendering on Chart
const goalBuNum = computed(() => {
  const val = parseFloat(project.value.begGoals.goalBu)
  return !isNaN(val) && val > 0 ? val : null
})

const goalStandardNum = computed(() => {
  const val = parseFloat(project.value.begGoals.goalStandard)
  return !isNaN(val) && val > 0 ? val : null
})

const goalIndustryNum = computed(() => {
  const val = parseFloat(project.value.begGoals.goalIndustry)
  return !isNaN(val) && val > 0 ? val : null
})

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

// Real-Time Data Points Editor & Manipulation Functions
const updatePointPct = (index: number, newPct: number) => {
  if (index >= 0 && index < project.value.insightRows.length) {
    const row = project.value.insightRows[index]
    if (row) {
      const clamped = Math.max(0, Math.min(100, Number(newPct)))
      row.pct = Number(clamped.toFixed(2))
      row.actual = row.pct
      row.total = 100
    }
  }
}

const addDataPoint = () => {
  const nextIdx = project.value.insightRows.length + 1
  const lastPct = project.value.insightRows[project.value.insightRows.length - 1]?.pct || 85.0
  project.value.insightRows.push({
    id: Date.now(),
    period: `M${nextIdx}`,
    actual: lastPct,
    total: 100,
    pct: lastPct,
    isOutlier: false,
    outlierCause: ''
  })
  showToast(`✓ เพิ่มจุดข้อมูล Period ${nextIdx} สำเร็จ`)
}

const removeDataPoint = (idx: number) => {
  if (project.value.insightRows.length <= 2) {
    showToast('ต้องมีข้อมูลอย่างน้อย 2 จุดสำหรับพล็อต BEG Chart', 'error')
    return
  }
  project.value.insightRows.splice(idx, 1)
  showToast('ลบจุดข้อมูลแล้ว')
}

// Quick Simulator Presets to show dynamic reactive chart motion
const simulateImprovement = () => {
  project.value.insightRows.forEach((row, i) => {
    if (i >= Math.floor(project.value.insightRows.length / 2)) {
      row.pct = Number(Math.min(99.9, row.pct + 2.5).toFixed(2))
      row.actual = row.pct
    }
  })
  showToast('✨ จำลองผลการปรับปรุง Yield +2.5% ในช่วงหลังสำเร็จ! กราฟขยับขึ้นทันที')
}

const simulateOutlier = () => {
  if (project.value.insightRows.length > 2) {
    const target = project.value.insightRows[2]
    if (target) {
      target.pct = Number(Math.max(60, target.pct - 6.5).toFixed(2))
      target.actual = target.pct
      target.isOutlier = true
      target.outlierCause = 'กะดึกฮีตเตอร์ขัดข้อง 45 นาที'
      showToast('⚠️ จำลองจุด Outlier ลดลง -6.5% พร้อมระบุสาเหตุเรียบร้อย!')
    }
  }
}

const resetData = () => {
  project.value.insightRows = [
    { id: 1, period: 'Jan 25', actual: 82.5, total: 100, pct: 82.5, isOutlier: false, outlierCause: '' },
    { id: 2, period: 'Feb 25', actual: 83.2, total: 100, pct: 83.2, isOutlier: false, outlierCause: '' },
    { id: 3, period: 'Mar 25', actual: 78.0, total: 100, pct: 78.0, isOutlier: true, outlierCause: 'เปลี่ยนสายพานทอดฉุกเฉิน' },
    { id: 4, period: 'Apr 25', actual: 84.1, total: 100, pct: 84.1, isOutlier: false, outlierCause: '' },
    { id: 5, period: 'May 25', actual: 83.8, total: 100, pct: 83.8, isOutlier: false, outlierCause: '' },
    { id: 6, period: 'Jun 25', actual: 85.0, total: 100, pct: 85.0, isOutlier: false, outlierCause: '' },
    { id: 7, period: 'Jul 25', actual: 84.6, total: 100, pct: 84.6, isOutlier: false, outlierCause: '' },
    { id: 8, period: 'Aug 25', actual: 86.2, total: 100, pct: 86.2, isOutlier: false, outlierCause: '' },
    { id: 9, period: 'Sep 25', actual: 85.5, total: 100, pct: 85.5, isOutlier: false, outlierCause: '' },
    { id: 10, period: 'Oct 25', actual: 87.0, total: 100, pct: 87.0, isOutlier: false, outlierCause: '' },
    { id: 11, period: 'Nov 25', actual: 86.8, total: 100, pct: 86.8, isOutlier: false, outlierCause: '' },
    { id: 12, period: 'Dec 25', actual: 88.0, total: 100, pct: 88.0, isOutlier: false, outlierCause: '' }
  ]
  showToast('🔄 รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้นของโรงงานเรียบร้อยแล้ว')
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
  showToast('✓ ปรับปรุงข้อมูลสำเร็จ กราฟขยับตามข้อมูลใหม่ทันที!')
}

// Dynamic SVG Coordinate Mapping (Autoscaling Y Axis according to live numbers)
const minVal = computed(() => {
  const values = loadedData.value.map(r => r.pct || 0)
  const allVals = [...values, baselineYield.value]
  if (goalBuNum.value) allVals.push(goalBuNum.value)
  if (goalStandardNum.value) allVals.push(goalStandardNum.value)
  if (goalIndustryNum.value) allVals.push(goalIndustryNum.value)
  const validVals = allVals.filter(v => v > 0)
  if (validVals.length === 0) return 70
  return Math.max(0, Math.floor(Math.min(...validVals) - 3))
})

const maxVal = computed(() => {
  const values = loadedData.value.map(r => r.pct || 0)
  const allVals = [...values, entitlementYield.value, goalLssYield.value]
  if (goalBuNum.value) allVals.push(goalBuNum.value)
  if (goalStandardNum.value) allVals.push(goalStandardNum.value)
  if (goalIndustryNum.value) allVals.push(goalIndustryNum.value)
  const validVals = allVals.filter(v => v > 0)
  if (validVals.length === 0) return 95
  return Math.min(100, Math.ceil(Math.max(...validVals) + 3))
})

const getYCoord = (val: number) => {
  const range = (maxVal.value - minVal.value) || 10
  const norm = (val - minVal.value) / range
  return 205 - (norm * 165)
}

const getXCoord = (index: number) => {
  const count = loadedData.value.length
  if (count <= 1) return 380
  const spacing = 580 / (count - 1)
  return 75 + (index * spacing)
}

const polylinePoints = computed(() => {
  return loadedData.value.map((r, idx) => `${getXCoord(idx)},${getYCoord(r.pct)}`).join(' ')
})

const areaPolygonPoints = computed(() => {
  if (loadedData.value.length === 0) return ''
  const firstX = getXCoord(0)
  const lastX = getXCoord(loadedData.value.length - 1)
  const bottomY = 205
  return `${firstX},${bottomY} ${polylinePoints.value} ${lastX},${bottomY}`
})

// Dynamic Y-Grid steps (5 lines across the chart)
const yGridSteps = computed(() => {
  const min = minVal.value
  const max = maxVal.value
  const step = (max - min) / 4
  return [
    min,
    Number((min + step).toFixed(1)),
    Number((min + step * 2).toFixed(1)),
    Number((min + step * 3).toFixed(1)),
    max
  ]
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
            <span>BEG Analysis Chart (Interactive)</span>
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

        <!-- 1. BEG Analysis Chart View (Dynamic Real-Time Reactive) -->
        <div v-if="activeSubTab === 'chart'" class="space-y-4">
          
          <!-- Header Banner: BEG Analysis for Improvement Targets -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-sm font-bold text-slate-900">BEG Analysis for Improvement Targets</h1>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#008779]">
                    ⚡ Real-Time Interactive Chart
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">กราฟจะเคลื่อนไหวและคำนวณ Baseline, Entitlement, และ Goal LSS ทันทีตามตัวเลขที่กรอกในแต่ละเดือน</p>
              </div>

              <!-- Quick Simulation Presets -->
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  class="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  title="จำลองผล Yield ดีขึ้น +2.5%"
                  @click="simulateImprovement"
                >
                  <UIcon name="i-lucide-trending-up" class="size-3.5 text-emerald-600" />
                  <span>+2.5% Improve</span>
                </button>

                <button
                  type="button"
                  class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  title="จำลองจุด Outlier"
                  @click="simulateOutlier"
                >
                  <UIcon name="i-lucide-alert-triangle" class="size-3.5 text-amber-600" />
                  <span>Simulate Outlier</span>
                </button>

                <button
                  type="button"
                  class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  @click="resetData"
                >
                  <UIcon name="i-lucide-rotate-ccw" class="size-3.5 text-slate-500" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <!-- Target Summary Pill Box -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-4 flex-wrap text-xs">
                <span class="text-sm font-bold text-slate-900 font-mono">{{ project.target?.targetName || '%Yield' }}</span>
                <span class="text-slate-500">Category: <strong class="text-slate-800">{{ project.target?.category || 'Quality' }}</strong></span>
                <span class="text-slate-500">Type: <strong class="text-slate-800">{{ project.target?.type || 'Increase' }}</strong></span>
                <span class="text-slate-500">Unit: <strong class="text-slate-800">{{ project.target?.unit || '%' }}</strong></span>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold font-mono bg-teal-50 text-[#008779] border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {{ loadedData.length }} Data Points
                </span>
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Synced
                </span>
              </div>
            </div>
          </div>

          <!-- BEG Analysis Time Series SVG Chart with Dynamic Responsive Scaling -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span class="size-2 rounded-full bg-[#008779] animate-pulse"></span>
                <span>{{ project.target?.targetName || '%Yield' }} — BEG Dynamic Chart</span>
              </h3>

              <!-- Interactive Line Toggles / Legend -->
              <div class="flex items-center gap-3 flex-wrap text-[11px]">
                <label class="flex items-center gap-1 cursor-pointer select-none text-slate-700 font-semibold">
                  <input v-model="visibleLines.dataLine" type="checkbox" class="accent-[#008779]" />
                  <span class="inline-block size-2 rounded-full bg-[#008779]"></span>
                  <span>Actual %</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer select-none text-rose-700 font-semibold">
                  <input v-model="visibleLines.baseline" type="checkbox" class="accent-rose-600" />
                  <span class="inline-block size-2 rounded-full bg-rose-600"></span>
                  <span>Baseline ({{ baselineYield }}%)</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer select-none text-amber-700 font-semibold">
                  <input v-model="visibleLines.entitlement" type="checkbox" class="accent-amber-500" />
                  <span class="inline-block size-2 rounded-full bg-amber-500"></span>
                  <span>Entitlement ({{ entitlementYield }}%)</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer select-none text-purple-700 font-semibold">
                  <input v-model="visibleLines.goalLss" type="checkbox" class="accent-purple-600" />
                  <span class="inline-block size-2 rounded-full bg-purple-600"></span>
                  <span>Goal LSS ({{ goalLssYield }}%)</span>
                </label>
                <label v-if="goalBuNum" class="flex items-center gap-1 cursor-pointer select-none text-blue-700 font-semibold">
                  <input v-model="visibleLines.goalBu" type="checkbox" class="accent-blue-600" />
                  <span class="inline-block size-2 rounded-full bg-blue-600"></span>
                  <span>Goal BU ({{ goalBuNum }}%)</span>
                </label>
                <label v-if="goalStandardNum" class="flex items-center gap-1 cursor-pointer select-none text-emerald-700 font-semibold">
                  <input v-model="visibleLines.goalStandard" type="checkbox" class="accent-emerald-600" />
                  <span class="inline-block size-2 rounded-full bg-emerald-600"></span>
                  <span>Goal Standard ({{ goalStandardNum }}%)</span>
                </label>
                <label v-if="goalIndustryNum" class="flex items-center gap-1 cursor-pointer select-none text-indigo-700 font-semibold">
                  <input v-model="visibleLines.goalIndustry" type="checkbox" class="accent-indigo-600" />
                  <span class="inline-block size-2 rounded-full bg-indigo-600"></span>
                  <span>Goal Industry ({{ goalIndustryNum }}%)</span>
                </label>
              </div>
            </div>

            <!-- SVG Chart Canvas -->
            <div class="h-72 border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex items-center justify-center relative overflow-hidden shadow-inner">
              <svg class="w-full h-full select-none" viewBox="0 0 760 230">
                <defs>
                  <!-- Gradient Area Fill beneath Actual Yield line -->
                  <linearGradient id="yieldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#008779" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#008779" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <!-- Horizontal Y Grid Lines & Labels -->
                <g v-for="(gridVal, gIdx) in yGridSteps" :key="gIdx">
                  <line
                    x1="65"
                    :y1="getYCoord(gridVal)"
                    x2="650"
                    :y2="getYCoord(gridVal)"
                    stroke="#E2E8F0"
                    stroke-width="1"
                    stroke-dasharray="2 2"
                  />
                  <text
                    x="58"
                    :y="getYCoord(gridVal) + 3.5"
                    font-size="9"
                    fill="#94A3B8"
                    text-anchor="end"
                    font-family="monospace"
                  >
                    {{ gridVal }}%
                  </text>
                </g>

                <!-- Area Fill Under Curve -->
                <polygon
                  v-if="visibleLines.dataLine && loadedData.length > 1"
                  :points="areaPolygonPoints"
                  fill="url(#yieldAreaGradient)"
                />

                <!-- 1. Entitlement Line - Amber -->
                <g v-if="visibleLines.entitlement">
                  <line
                    x1="65"
                    :y1="getYCoord(entitlementYield)"
                    x2="650"
                    :y2="getYCoord(entitlementYield)"
                    stroke="#f59e0b"
                    stroke-width="1.8"
                    stroke-dasharray="4 4"
                    class="transition-all duration-300"
                  />
                  <rect
                    x="655"
                    :y="getYCoord(entitlementYield) - 9"
                    width="95"
                    height="18"
                    rx="4"
                    fill="#FEF3C7"
                    stroke="#F59E0B"
                    stroke-width="0.5"
                    class="transition-all duration-300"
                  />
                  <text x="702" :y="getYCoord(entitlementYield) + 3.5" font-size="8.5" fill="#B45309" font-weight="bold" font-family="monospace" text-anchor="middle">
                    Entitlement: {{ entitlementYield }}%
                  </text>
                </g>

                <!-- 2. Goal LSS Line - Purple -->
                <g v-if="visibleLines.goalLss">
                  <line
                    x1="65"
                    :y1="getYCoord(goalLssYield)"
                    x2="650"
                    :y2="getYCoord(goalLssYield)"
                    stroke="#9333ea"
                    stroke-width="2.2"
                    class="transition-all duration-300"
                  />
                  <rect
                    x="655"
                    :y="getYCoord(goalLssYield) - 9"
                    width="95"
                    height="18"
                    rx="4"
                    fill="#F3E8FF"
                    stroke="#9333EA"
                    stroke-width="0.5"
                    class="transition-all duration-300"
                  />
                  <text x="702" :y="getYCoord(goalLssYield) + 3.5" font-size="8.5" fill="#7E22CE" font-weight="bold" font-family="monospace" text-anchor="middle">
                    Goal LSS: {{ goalLssYield }}%
                  </text>
                </g>

                <!-- 3. Goal BU Line - Blue (Dynamic) -->
                <g v-if="visibleLines.goalBu && goalBuNum">
                  <line
                    x1="65"
                    :y1="getYCoord(goalBuNum)"
                    x2="650"
                    :y2="getYCoord(goalBuNum)"
                    stroke="#2563eb"
                    stroke-width="1.8"
                    stroke-dasharray="3 3"
                    class="transition-all duration-300"
                  />
                  <rect
                    x="655"
                    :y="getYCoord(goalBuNum) - 9"
                    width="95"
                    height="18"
                    rx="4"
                    fill="#DBEAFE"
                    stroke="#2563EB"
                    stroke-width="0.5"
                    class="transition-all duration-300"
                  />
                  <text x="702" :y="getYCoord(goalBuNum) + 3.5" font-size="8.5" fill="#1E40AF" font-weight="bold" font-family="monospace" text-anchor="middle">
                    Goal BU: {{ goalBuNum }}%
                  </text>
                </g>

                <!-- 4. Goal Standard Line - Emerald (Dynamic) -->
                <g v-if="visibleLines.goalStandard && goalStandardNum">
                  <line
                    x1="65"
                    :y1="getYCoord(goalStandardNum)"
                    x2="650"
                    :y2="getYCoord(goalStandardNum)"
                    stroke="#059669"
                    stroke-width="1.8"
                    stroke-dasharray="3 3"
                    class="transition-all duration-300"
                  />
                  <rect
                    x="655"
                    :y="getYCoord(goalStandardNum) - 9"
                    width="95"
                    height="18"
                    rx="4"
                    fill="#D1FAE5"
                    stroke="#059669"
                    stroke-width="0.5"
                    class="transition-all duration-300"
                  />
                  <text x="702" :y="getYCoord(goalStandardNum) + 3.5" font-size="8.5" fill="#065F46" font-weight="bold" font-family="monospace" text-anchor="middle">
                    Goal Std: {{ goalStandardNum }}%
                  </text>
                </g>

                <!-- 5. Goal Industry Line - Indigo (Dynamic) -->
                <g v-if="visibleLines.goalIndustry && goalIndustryNum">
                  <line
                    x1="65"
                    :y1="getYCoord(goalIndustryNum)"
                    x2="650"
                    :y2="getYCoord(goalIndustryNum)"
                    stroke="#4f46e5"
                    stroke-width="1.8"
                    stroke-dasharray="3 3"
                    class="transition-all duration-300"
                  />
                  <rect
                    x="655"
                    :y="getYCoord(goalIndustryNum) - 9"
                    width="95"
                    height="18"
                    rx="4"
                    fill="#E0E7FF"
                    stroke="#4F46E5"
                    stroke-width="0.5"
                    class="transition-all duration-300"
                  />
                  <text x="702" :y="getYCoord(goalIndustryNum) + 3.5" font-size="8.5" fill="#3730A3" font-weight="bold" font-family="monospace" text-anchor="middle">
                    Goal Ind: {{ goalIndustryNum }}%
                  </text>
                </g>

                <!-- 6. Baseline Line - Red -->
                <g v-if="visibleLines.baseline">
                  <line
                    x1="65"
                    :y1="getYCoord(baselineYield)"
                    x2="650"
                    :y2="getYCoord(baselineYield)"
                    stroke="#dc2626"
                    stroke-width="1.8"
                    stroke-dasharray="4 4"
                    class="transition-all duration-300"
                  />
                  <rect
                    x="655"
                    :y="getYCoord(baselineYield) - 9"
                    width="95"
                    height="18"
                    rx="4"
                    fill="#FEE2E2"
                    stroke="#DC2626"
                    stroke-width="0.5"
                    class="transition-all duration-300"
                  />
                  <text x="702" :y="getYCoord(baselineYield) + 3.5" font-size="8.5" fill="#991B1B" font-weight="bold" font-family="monospace" text-anchor="middle">
                    Baseline: {{ baselineYield }}%
                  </text>
                </g>

                <!-- Actual Data Points Connected Polyline (Animated) -->
                <polyline
                  v-if="visibleLines.dataLine && loadedData.length > 1"
                  :points="polylinePoints"
                  fill="none"
                  stroke="#008779"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-all duration-300"
                />

                <!-- Data Dots & Tooltip labels (Interactive & Clickable) -->
                <g
                  v-for="(row, rIdx) in loadedData"
                  :key="row.id || rIdx"
                  class="cursor-pointer group"
                  @click="openQuickEdit(rIdx)"
                >
                  <circle
                    :cx="getXCoord(rIdx)"
                    :cy="getYCoord(row.pct)"
                    :r="row.isOutlier ? 6.5 : 5.5"
                    :fill="row.isOutlier ? '#f59e0b' : '#008779'"
                    :stroke="row.isOutlier ? '#dc2626' : '#ffffff'"
                    stroke-width="2"
                    class="transition-all duration-300 group-hover:scale-130 shadow-md"
                  />
                  <text
                    :x="getXCoord(rIdx)"
                    y="222"
                    font-size="9.5"
                    fill="#64748b"
                    text-anchor="middle"
                    font-family="monospace"
                    font-weight="600"
                  >
                    {{ row.period || `M${rIdx + 1}` }}
                  </text>
                  <text
                    :x="getXCoord(rIdx)"
                    :y="getYCoord(row.pct) - 9"
                    font-size="9"
                    :fill="row.isOutlier ? '#b45309' : '#0f766e'"
                    text-anchor="middle"
                    font-weight="bold"
                    font-family="monospace"
                    class="transition-all duration-300"
                  >
                    {{ row.pct }}%
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- REAL-TIME INLINE DATA POINTS EDITOR (Adjust Numbers & Watch Graph Move Live) -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UIcon name="i-lucide-sliders-horizontal" class="size-4 text-[#008779]" />
                  <span>Real-Time Data Points Editor (ปรับตัวเลขรายเดือน กราฟขยับตามสดๆ)</span>
                </h3>
                <p class="text-[11px] text-slate-500 mt-0.5">กรอกตัวเลข % Yield ในแต่ละ Period หรือกดปุ่ม +/- เพื่อดูกราฟวิ่งตามแบบเรียลไทม์</p>
              </div>

              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                @click="addDataPoint"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
                <span>+ Add Month/Period</span>
              </button>
            </div>

            <!-- Grid of Interactive Monthly Inputs -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div
                v-for="(row, idx) in loadedData"
                :key="row.id || idx"
                class="bg-slate-50/80 border rounded-xl p-2.5 space-y-2 transition-all hover:border-[#008779]"
                :class="row.isOutlier ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'"
              >
                <div class="flex items-center justify-between">
                  <input
                    v-model="row.period"
                    type="text"
                    class="font-bold text-[11px] text-slate-800 bg-transparent w-16 focus:outline-none focus:bg-white rounded px-1"
                  />
                  <button
                    type="button"
                    class="text-slate-300 hover:text-rose-500 p-0.5 cursor-pointer"
                    title="Delete period"
                    @click="removeDataPoint(idx)"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-3" />
                  </button>
                </div>

                <!-- Number Input with Steppers -->
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="size-6 rounded bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold cursor-pointer text-xs"
                    @click="updatePointPct(idx, row.pct - 0.5)"
                  >
                    -
                  </button>
                  <input
                    v-model.number="row.pct"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    class="w-full bg-white border border-slate-300 rounded px-1.5 py-1 text-center font-mono font-bold text-xs text-[#008779] focus:outline-none focus:border-[#008779]"
                    @input="updatePointPct(idx, row.pct)"
                  />
                  <button
                    type="button"
                    class="size-6 rounded bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold cursor-pointer text-xs"
                    @click="updatePointPct(idx, row.pct + 0.5)"
                  >
                    +
                  </button>
                </div>

                <!-- Outlier Toggle -->
                <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                  <label class="flex items-center gap-1 cursor-pointer text-slate-600">
                    <input
                      v-model="row.isOutlier"
                      type="checkbox"
                      class="accent-amber-600 size-3 cursor-pointer"
                    />
                    <span>Outlier</span>
                  </label>
                  <span v-if="row.isOutlier" class="text-amber-700 font-semibold truncate max-w-[70px]" :title="row.outlierCause || 'Excluded from Baseline'">
                    ⚠️ Excluded
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- BEG VALUES CONFIGURATION TABLE (Live Synced with Target Lines) -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
                BEG Values Configuration (เป้าหมายและเกณฑ์มาตรฐาน)
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
                    <th class="py-3 px-3 text-center">BASELINE (เฉลี่ย)</th>
                    <th class="py-3 px-3 text-center">ENTITLEMENT (สูงสุด)</th>
                    <th class="py-3 px-3 text-center">GOAL LSS (80% GAP)</th>
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

                    <!-- Baseline (Auto Calculated) -->
                    <td class="py-3 px-3 text-center font-mono font-bold text-rose-600 bg-rose-50/30">
                      {{ baselineYield }}%
                    </td>

                    <!-- Entitlement (Auto Calculated) -->
                    <td class="py-3 px-3 text-center font-mono font-bold text-amber-600 bg-amber-50/30">
                      {{ entitlementYield }}%
                    </td>

                    <!-- Goal LSS (Auto Calculated) -->
                    <td class="py-3 px-3 text-center font-mono font-bold text-purple-700 bg-purple-50/30">
                      {{ goalLssYield }}%
                    </td>

                    <!-- Goal BU (Input + Save) -->
                    <td class="py-2.5 px-3 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <input
                          v-model="project.begGoals.goalBu"
                          type="text"
                          placeholder="86.0"
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
                          placeholder="85.5"
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
                          placeholder="87.5"
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

            <!-- Calculation Method Explanations -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-[11px] space-y-1 text-slate-600">
              <span class="font-bold text-slate-800 block text-xs mb-1">สูตรคำนวณ BEG อัตโนมัติ (Dynamic Automation):</span>
              <p>• <strong>Baseline:</strong> ค่าเฉลี่ยของข้อมูลทั้งหมดที่ไม่ถูกตัดเป็น Outlier (ปัจจุบัน = <span class="font-mono font-bold text-rose-600">{{ baselineYield }}%</span>)</p>
              <p>• <strong>Entitlement:</strong> ค่าสูงสุดที่เป็นไปได้ในชุดข้อมูลจริง (ปัจจุบัน = <span class="font-mono font-bold text-amber-600">{{ entitlementYield }}%</span>)</p>
              <p>• <strong>Goal LSS:</strong> Baseline + ((Entitlement - Baseline) × 0.80) กฎปิดช่องว่าง 80% (ปัจจุบัน = <span class="font-mono font-bold text-purple-700">{{ goalLssYield }}%</span>)</p>
              <p>• <strong>Goal BU / Standard / Industry:</strong> ปรับตั้งค่าได้อิสระ โดยเส้นประบนกราฟจะเลื่อนตามตัวเลขทันที และระบบจะส่งขออนุมัติ PCR ไปยัง Admin อัตโนมัติ</p>
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
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-bold"
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
