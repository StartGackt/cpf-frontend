<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const STORAGE_KEY = `cpf_insight_data_${projectId}`

const periodFormat = ref<'sequence' | 'month' | 'week' | 'day' | 'custom'>('sequence')
const pcrStatus = ref<'draft' | 'pending' | 'approved'>('approved')

export interface InsightRow {
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

const monthlyData = ref<InsightRow[]>([...defaultRows])

// Paste from Excel Modal
const isPasteModalOpen = ref(false)
const rawPasteText = ref('')
const pasteMode = ref<'replace' | 'append'>('replace')

// Toast Notification
const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        monthlyData.value = JSON.parse(saved)
      }
    } catch (e) {}
  }
})

// Auto-save to localStorage
watch(monthlyData, (newVal) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
    } catch (e) {}
  }
}, { deep: true })

// Real-time Valid Data & Metrics Computation (No minimum requirement)
const validRows = computed(() => {
  return monthlyData.value.filter(r => !r.isOutlier)
})

const outlierCount = computed(() => monthlyData.value.filter(d => d.isOutlier).length)
const outlierWithCauseCount = computed(() => monthlyData.value.filter(d => d.isOutlier && d.outlierCause.trim() !== '').length)
const outlierWithoutCauseCount = computed(() => monthlyData.value.filter(d => d.isOutlier && d.outlierCause.trim() === '').length)

// Dynamic Live Statistical Metrics
const computedBaseline = computed(() => {
  if (validRows.value.length === 0) return 0
  const sum = validRows.value.reduce((acc, r) => acc + (r.pct || 0), 0)
  return Number((sum / validRows.value.length).toFixed(2))
})

const computedEntitlement = computed(() => {
  if (validRows.value.length === 0) return 0
  const maxVal = Math.max(...validRows.value.map(r => r.pct || 0))
  return Number(maxVal.toFixed(2))
})

const computedGoalLss = computed(() => {
  if (validRows.value.length === 0) return 0
  const base = computedBaseline.value
  const ent = computedEntitlement.value
  // 80% Entitlement gap closure standard
  const goal = base + (ent - base) * 0.8
  return Number(goal.toFixed(2))
})

const getPeriodLabel = (index: number) => {
  const n = index + 1
  if (periodFormat.value === 'sequence') return `${n}`
  if (periodFormat.value === 'month') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[(n - 1) % 12] + (n > 12 ? ` (Y${Math.floor((n - 1) / 12) + 1})` : '')
  }
  if (periodFormat.value === 'week') return `W${n < 10 ? '0' + n : n}`
  if (periodFormat.value === 'day') return `Day ${n}`
  return `P-${n < 10 ? '0' + n : n}`
}

const applyPeriodFormatToAll = () => {
  monthlyData.value.forEach((r, idx) => {
    r.period = getPeriodLabel(idx)
  })
  showToast(`Updated period labels to ${periodFormat.value} format`)
}

// Row Operations (Unconstrained)
const addSingleRow = () => {
  const nextIdx = monthlyData.value.length
  const nextId = (monthlyData.value[nextIdx - 1]?.id || 0) + 1
  monthlyData.value.push({
    id: nextId,
    period: getPeriodLabel(nextIdx),
    actual: 84,
    total: 100,
    pct: 84.0,
    isOutlier: false,
    outlierCause: '',
    notes: ''
  })
  showToast(`Added row #${nextIdx + 1}`)
}

const addMultipleRows = (count: number) => {
  const startIdx = monthlyData.value.length
  for (let i = 0; i < count; i++) {
    const idx = startIdx + i
    const nextId = (monthlyData.value[monthlyData.value.length - 1]?.id || 0) + 1
    monthlyData.value.push({
      id: nextId,
      period: getPeriodLabel(idx),
      actual: 84,
      total: 100,
      pct: 84.0,
      isOutlier: false,
      outlierCause: '',
      notes: ''
    })
  }
  showToast(`Added ${count} data rows!`)
}

const removeRow = (index: number) => {
  monthlyData.value.splice(index, 1)
  showToast('Row removed')
}

const clearAllRows = () => {
  if (confirm('Clear all data rows? You can enter as few or as many rows as needed.')) {
    monthlyData.value = []
    showToast('All rows cleared')
  }
}

const resetToDefaults = () => {
  monthlyData.value = JSON.parse(JSON.stringify(defaultRows))
  showToast('Reset to default dataset')
}

// Paste Excel Parser
const handlePasteImport = () => {
  if (!rawPasteText.value.trim()) {
    alert('Please paste data text.')
    return
  }

  const lines = rawPasteText.value.trim().split(/\r?\n/)
  const parsedRows: InsightRow[] = []

  lines.forEach((line, idx) => {
    const cols = line.split(/[\t,;]+/).map(c => c.trim())
    if (cols.length >= 2) {
      const periodVal = cols[0] || `${idx + 1}`
      const num1 = parseFloat(cols[1]?.replace('%', '') || '0')
      const num2 = cols[2] ? parseFloat(cols[2]?.replace('%', '') || '100') : 100

      let actual = num1
      let total = num2
      let pct = num2 !== 0 ? Number(((num1 / num2) * 100).toFixed(2)) : num1

      // If single percentage column provided
      if (cols.length === 2 && num1 <= 100 && num1 >= 0) {
        actual = num1
        total = 100
        pct = num1
      }

      parsedRows.push({
        id: Date.now() + idx,
        period: periodVal,
        actual,
        total,
        pct,
        isOutlier: false,
        outlierCause: '',
        notes: ''
      })
    }
  })

  if (parsedRows.length === 0) {
    alert('Could not parse valid data rows. Please ensure columns are tab or comma separated.')
    return
  }

  if (pasteMode.value === 'replace') {
    monthlyData.value = parsedRows
  } else {
    monthlyData.value.push(...parsedRows)
  }

  isPasteModalOpen.value = false
  rawPasteText.value = ''
  showToast(`Successfully imported ${parsedRows.length} data rows from clipboard!`)
}
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
        class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

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
      <span class="text-gray-900 font-bold">Insight Data Entry</span>
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
        <!-- PCR Approval Status Banner -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="size-9 rounded-full bg-teal-50 text-[#008779] flex items-center justify-center font-bold text-xs shrink-0">
              PCR
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-gray-900">
                  Project Charter Report (PCR) Status
                </h2>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  Active Approved
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

        <!-- Freedom of Row Count Guarantee Banner (Thai User Requirement) -->
        <div class="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50/50 border border-teal-200/80 rounded-xl p-4 flex items-center justify-between text-xs shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-lg bg-[#008779] text-white flex items-center justify-center font-bold shrink-0">
              <UIcon name="i-lucide-sliders-horizontal" class="size-4" />
            </div>
            <div>
              <span class="font-bold text-teal-950 block text-xs">
                รองรับจำนวนข้อมูลยืดหยุ่น (No Minimum Data Requirement)
              </span>
              <p class="text-teal-800 text-[11px] mt-0.5">
                ระบบไม่จำกัดจำนวนข้อมูลขั้นต่ำ สามารถกรอกข้อมูลตามจริงได้ตั้งแต่ 1 แถวขึ้นไป ระบบจะคำนวณ Baseline, Entitlement และ Goal LSS ให้แบบอัตโนมัติ
              </p>
            </div>
          </div>

          <span class="bg-white/80 text-teal-900 border border-teal-300 font-mono font-bold text-[11px] px-3 py-1 rounded-lg shrink-0">
            บันทึกแล้ว: {{ monthlyData.length }} แถว
          </span>
        </div>

        <!-- Live Computed BEG Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white rounded-lg border border-gray-200 p-3.5 text-center shadow-xs space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase block">TOTAL ENTERED POINTS</span>
            <p class="text-xl font-bold font-mono text-gray-900">{{ monthlyData.length }} <span class="text-xs font-normal text-gray-500">Rows</span></p>
            <span class="text-[10px] text-emerald-600 font-medium font-mono">{{ validRows.length }} Valid (Excl. Outliers)</span>
          </div>

          <div class="bg-white rounded-lg border border-red-200 p-3.5 text-center shadow-xs space-y-1 bg-red-50/20">
            <span class="text-[10px] text-red-600 font-bold uppercase block">LIVE BASELINE (X̄)</span>
            <p class="text-xl font-bold font-mono text-red-600">{{ computedBaseline }}%</p>
            <span class="text-[10px] text-gray-500">Mean of Valid Rows</span>
          </div>

          <div class="bg-white rounded-lg border border-amber-200 p-3.5 text-center shadow-xs space-y-1 bg-amber-50/20">
            <span class="text-[10px] text-amber-600 font-bold uppercase block">LIVE ENTITLEMENT (MAX)</span>
            <p class="text-xl font-bold font-mono text-amber-600">{{ computedEntitlement }}%</p>
            <span class="text-[10px] text-gray-500">Best Historical Performance</span>
          </div>

          <div class="bg-white rounded-lg border border-purple-200 p-3.5 text-center shadow-xs space-y-1 bg-purple-50/20">
            <span class="text-[10px] text-purple-700 font-bold uppercase block">LIVE GOAL LSS (80% GAP)</span>
            <p class="text-xl font-bold font-mono text-purple-700">{{ computedGoalLss }}%</p>
            <span class="text-[10px] text-purple-600 font-medium">80% Entitlement Closure</span>
          </div>
        </div>

        <!-- Section Title & Outlier Indicator Alert -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <!-- Toolbar Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Insight Data Entry & Outlier Management</span>
                <span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-normal">
                  {{ monthlyData.length }} rows
                </span>
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                No minimum row limits. Flag and document special causes for outlier data points.
              </p>
            </div>

            <!-- Toolbar Action Buttons -->
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Period Format Selector -->
              <div class="flex items-center gap-1 text-xs">
                <span class="text-gray-500 text-[11px]">Period Format:</span>
                <select
                  v-model="periodFormat"
                  class="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-hidden focus:border-[#008779]"
                  @change="applyPeriodFormatToAll"
                >
                  <option value="sequence">1, 2, 3, 4...</option>
                  <option value="month">Jan, Feb, Mar...</option>
                  <option value="week">W01, W02, W03...</option>
                  <option value="day">Day 1, Day 2...</option>
                  <option value="custom">P-01, P-02...</option>
                </select>
              </div>

              <!-- Add Single Row Button -->
              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                @click="addSingleRow"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
                <span>Add Data Row</span>
              </button>

              <!-- Add +5 Rows Button -->
              <button
                type="button"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                @click="addMultipleRows(5)"
              >
                <span>+5 Rows</span>
              </button>

              <!-- Paste from Excel Button -->
              <button
                type="button"
                class="border border-teal-300 bg-teal-50 hover:bg-teal-100 text-[#008779] text-xs font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                @click="isPasteModalOpen = true"
              >
                <UIcon name="i-lucide-clipboard-paste" class="size-3.5" />
                <span>Paste from Excel</span>
              </button>

              <!-- Reset / Clear Dropdown or Action -->
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 text-xs p-1.5 rounded"
                title="Reset to default dataset"
                @click="resetToDefaults"
              >
                <UIcon name="i-lucide-rotate-ccw" class="size-3.5" />
              </button>

              <button
                v-if="monthlyData.length > 0"
                type="button"
                class="text-gray-400 hover:text-red-600 text-xs p-1.5 rounded"
                title="Clear all rows"
                @click="clearAllRows"
              >
                <UIcon name="i-lucide-trash-2" class="size-3.5" />
              </button>
            </div>
          </div>

          <!-- Outlier Cause Warning Box -->
          <div v-if="outlierWithoutCauseCount > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center gap-2">
            <UIcon name="i-lucide-alert-triangle" class="size-4 text-amber-600 shrink-0" />
            <span>Found <strong>{{ outlierWithoutCauseCount }}</strong> outlier data point(s) missing root cause explanation. Please provide cause to document why it is excluded from baseline computation.</span>
          </div>

          <!-- Empty State if All Rows Cleared -->
          <div
            v-if="monthlyData.length === 0"
            class="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center space-y-3 bg-gray-50/50"
          >
            <UIcon name="i-lucide-table" class="size-10 text-gray-300 mx-auto" />
            <div class="space-y-1">
              <h3 class="font-bold text-gray-800 text-xs">No Data Rows Entered</h3>
              <p class="text-[11px] text-gray-500">
                You can start with as few as 1 data row. Click below to add rows or paste from Excel.
              </p>
            </div>
            <div class="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                @click="addSingleRow"
              >
                <UIcon name="i-lucide-plus" class="size-4" />
                <span>Add First Row</span>
              </button>
              <button
                type="button"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                @click="isPasteModalOpen = true"
              >
                <UIcon name="i-lucide-clipboard-paste" class="size-4" />
                <span>Paste from Excel</span>
              </button>
            </div>
          </div>

          <!-- Data Grid Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/80 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-2.5 px-3 w-10">#</th>
                  <th class="py-2.5 px-3 font-semibold w-28">PERIOD / ROW</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-28">ACTUAL (NUM)</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-28">TOTAL (DENOM)</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-24">% VALUE</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-24">OUTLIER?</th>
                  <th class="py-2.5 px-4 font-semibold">OUTLIER CAUSE EXPLANATION</th>
                  <th class="py-2.5 px-3 text-center w-12">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="(row, index) in monthlyData"
                  :key="row.id || index"
                  class="hover:bg-gray-50/50 transition-colors"
                  :class="row.isOutlier ? 'bg-amber-50/30' : ''"
                >
                  <!-- Row Index -->
                  <td class="py-2.5 px-3 font-mono text-gray-400 text-[11px]">{{ index + 1 }}</td>

                  <!-- Period Label (Clean, no /25 hardcoded) -->
                  <td class="py-2.5 px-3 font-semibold text-gray-900 font-mono">
                    <input
                      v-model="row.period"
                      type="text"
                      class="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-center font-mono focus:border-[#008779] focus:outline-hidden"
                      placeholder="e.g. 1"
                    />
                  </td>

                  <!-- Actual Numerator -->
                  <td class="py-2.5 px-3 text-center">
                    <input
                      v-model.number="row.actual"
                      type="number"
                      class="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-center font-mono focus:border-[#008779] focus:outline-hidden"
                      @input="row.pct = Number(((row.actual / (row.total || 100)) * 100).toFixed(2))"
                    />
                  </td>

                  <!-- Total Denominator -->
                  <td class="py-2.5 px-3 text-center">
                    <input
                      v-model.number="row.total"
                      type="number"
                      class="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-center font-mono focus:border-[#008779] focus:outline-hidden"
                      @input="row.pct = Number(((row.actual / (row.total || 100)) * 100).toFixed(2))"
                    />
                  </td>

                  <!-- % Value -->
                  <td class="py-2.5 px-3 text-center font-bold font-mono text-[#008779]">
                    {{ row.pct }}%
                  </td>

                  <!-- Outlier Checkbox -->
                  <td class="py-2.5 px-3 text-center">
                    <input
                      v-model="row.isOutlier"
                      type="checkbox"
                      class="accent-amber-600 size-4 cursor-pointer"
                      title="Flag as Outlier (exclude from baseline)"
                    />
                  </td>

                  <!-- Outlier Cause Explanation -->
                  <td class="py-2.5 px-4">
                    <input
                      v-if="row.isOutlier"
                      v-model="row.outlierCause"
                      type="text"
                      placeholder="Enter documented cause (Excluded from baseline)"
                      class="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-hidden focus:border-amber-500"
                    />
                    <span v-else class="text-gray-400 text-[11px] italic">-</span>
                  </td>

                  <!-- Action: Remove Row -->
                  <td class="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      class="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove row"
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

    <!-- Paste from Excel Modal -->
    <div
      v-if="isPasteModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden text-xs animate-in zoom-in-95 duration-150">
        <div class="p-4 bg-gradient-to-r from-teal-900 to-[#008779] text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clipboard-paste" class="size-4 text-teal-300" />
            <h3 class="font-bold text-sm text-white">Paste Data from Excel / CSV</h3>
          </div>
          <button
            type="button"
            class="text-white/80 hover:text-white"
            @click="isPasteModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-5 space-y-4">
          <p class="text-gray-600 text-[11px] leading-relaxed">
            Copy cells from Excel or Google Sheets and paste below. Supports any number of rows without minimum restrictions.
          </p>

          <div class="flex items-center gap-4 text-xs font-semibold">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input v-model="pasteMode" type="radio" value="replace" class="accent-[#008779]" />
              <span>Replace existing data</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input v-model="pasteMode" type="radio" value="append" class="accent-[#008779]" />
              <span>Append to current data</span>
            </label>
          </div>

          <textarea
            v-model="rawPasteText"
            rows="6"
            class="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs font-mono focus:outline-hidden focus:border-[#008779] focus:bg-white"
            placeholder="Period	Actual	Total
1	82	100
2	85	100
3	84	100..."
          ></textarea>

          <div class="flex justify-end gap-2 pt-1">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              @click="isPasteModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              @click="handlePasteImport"
            >
              <UIcon name="i-lucide-check" class="size-3.5" />
              <span>Import Rows</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
