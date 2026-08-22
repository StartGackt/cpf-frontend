<script setup lang="ts">
import { ref } from 'vue'
import { useDashboardAnalytics, masterOrgData } from '~/composables/useDashboardAnalytics'

const {
  projectRecords,
  filteredProjects,
  availablePlants,
  // Reactive Filter States
  selectedBusiness,
  selectedBu,
  selectedPlant,
  selectedYear,
  selectedBelt,
  selectedPhase,
  selectedBudgetType,
  selectedSourceType,
  // Computed Visual Stores
  kpiSummary,
  buBudgets,
  categoryBudgets,
  projectShareData,
  quarterlyData,
  monthlyTimeline
} = useDashboardAnalytics()

const activeViewTab = ref<'charts' | 'table'>('charts')
const maxBuAmount = 350
const maxCategoryAmount = 260

// =========================================================
// Create Project Run (Phase 2 Feature Modal)
// =========================================================
const isCreateRunModalOpen = ref(false)
const selectedRunSource = ref<any>(null)
const runProjectTitle = ref('')
const runPlantLocation = ref('โรงงานแปรรูปโชคชัย')
const runYear = ref('2026')

// Phase 2 Modular Scope Selector
const runScope = ref({
  define: true,
  processMap: true,
  fishbone: true,
  fmea: true,
  hypothesis: true,
  doe: true,
  controlPlan: true
})

const openCreateRunModal = (project?: any) => {
  if (project) {
    selectedRunSource.value = project
    runProjectTitle.value = `${project.name} (Run 2 - Line B)`
    runPlantLocation.value = project.plant
  } else if (projectRecords.value.length > 0) {
    selectedRunSource.value = projectRecords.value[0]
    runProjectTitle.value = `${projectRecords.value[0]?.name || 'โครงการใหม่'} (Run 2 - Line B)`
    runPlantLocation.value = projectRecords.value[0]?.plant || 'โรงงานแปรรูปเนื้อไก่ นครราชสีมา'
  }
  isCreateRunModalOpen.value = true
}

const confirmCreateProjectRun = () => {
  if (runProjectTitle.value.trim()) {
    projectRecords.value.unshift({
      id: `proj-run-${Date.now()}`,
      sourceType: 'PROJECT',
      name: runProjectTitle.value,
      leader: 'Romteera Tadderm',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
      bu: 'Chicken Processing Business',
      plant: runPlantLocation.value,
      plantCode: 'CK-PLT-01',
      belt: 'Black Belt',
      phase: 'Define',
      year: runYear.value,
      budgetThb: 15000000,
      improvementCategory: 'เพิ่มผลผลิตและลด Yield Loss (%Total Yield)',
      savingsThb: 3800000,
      yieldGain: 3.50,
      cpk: 1.40,
      quarter: 'Q2',
      month: 'ม.ค. 69',
      status: 'Active',
      pcrStatus: 'Draft',
      pfrStatus: 'Pending',
      keyTool: 'DOE 2^3 & Multihead Optimization',
      vitalFactors: ['Multihead Target Weight', 'Predust Belt Speed (40Hz)']
    })
  }
  isCreateRunModalOpen.value = false
}

// =========================================================
// Reactive Floating Tooltip State
// =========================================================
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  title: '',
  seriesName: '',
  value: '',
  subText: '',
  color: '#008779'
})

const handleMouseEnter = (e: MouseEvent, title: string, seriesName: string, value: string, color: string, subText = '') => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltip.value = {
    show: true,
    x: rect.left + rect.width / 2,
    y: rect.top - 10,
    title,
    seriesName,
    value,
    subText,
    color
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (tooltip.value.show) {
    tooltip.value.x = e.clientX
    tooltip.value.y = e.clientY - 15
  }
}

const handleMouseLeave = () => {
  tooltip.value.show = false
}

const exportToExcel = () => {
  alert('Exporting unified central dashboard dataset to Excel (.xlsx)...')
}

const exportToPdf = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12" @mousemove="handleMouseMove">
    
    <!-- ========================================================= -->
    <!-- FLOATING INTERACTIVE HOVER TOOLTIP -->
    <!-- ========================================================= -->
    <Teleport to="body">
      <div
        v-if="tooltip.show"
        class="fixed z-999 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3.5 text-xs animate-in fade-in zoom-in-95 duration-100 min-w-[200px]"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y - 8}px` }"
      >
        <div class="font-bold text-slate-800 pb-1.5 border-b border-slate-100 mb-1.5 text-xs">
          {{ tooltip.title }}
        </div>
        <div class="flex items-center gap-2">
          <span class="size-2.5 rounded-full shrink-0 shadow-2xs" :style="{ backgroundColor: tooltip.color }"></span>
          <span class="text-slate-600 font-medium truncate">{{ tooltip.seriesName }}:</span>
          <span class="font-bold text-slate-900 font-mono ml-auto">{{ tooltip.value }}</span>
        </div>
        <div v-if="tooltip.subText" class="text-[10px] text-slate-400 mt-1 font-medium">
          {{ tooltip.subText }}
        </div>
      </div>
    </Teleport>

    <!-- ========================================================= -->
    <!-- HERO HEADER: Unified Executive Portfolio & Multi-Source Analytics -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <!-- Ambient Glow in Background -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-layout-dashboard" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Executive Project Visualize Dashboard
            </h1>
            <span class="text-xs text-teal-200">Unified Central Hub: Projects • KM Repository • Approvals • Master Data</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          ศูนย์รวมการวิเคราะห์ข้อมูลความคืบหน้าโครงการ DMAIC, คลังความรู้ KM, ระบบขออนุมัติ Stage-Gate (PCR/PFR) และโครงสร้าง Master Data 12 โรงงานทั่วเครือ CPF
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex items-center gap-2.5 flex-wrap relative z-10 shrink-0">
        <!-- Create Project Run (Phase 2 Action) -->
        <button
          type="button"
          class="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          @click="openCreateRunModal()"
        >
          <UIcon name="i-lucide-copy-plus" class="size-4" />
          <span>Create Project Run</span>
        </button>

        <!-- Presentation Mode Link -->
        <NuxtLink
          to="/admin/projects/example-total-yield/presentation"
          class="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <UIcon name="i-lucide-presentation" class="size-4 text-purple-300" />
          <span>Presentation Mode</span>
        </NuxtLink>

        <!-- Tab Switcher (Charts vs Table) -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-2xl flex items-center gap-1 shadow-xs">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="activeViewTab === 'charts' ? 'bg-white text-[#008779] shadow-sm' : 'text-white hover:bg-white/10'"
            @click="activeViewTab = 'charts'"
          >
            <UIcon name="i-lucide-bar-chart-3" class="size-3.5" />
            <span>Charts</span>
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            :class="activeViewTab === 'table' ? 'bg-white text-[#008779] shadow-sm' : 'text-white hover:bg-white/10'"
            @click="activeViewTab = 'table'"
          >
            <UIcon name="i-lucide-table" class="size-3.5" />
            <span>Table</span>
          </button>
        </div>

        <button
          type="button"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          @click="exportToExcel"
        >
          <UIcon name="i-lucide-file-spreadsheet" class="size-4 text-emerald-300" />
          <span>Excel</span>
        </button>

        <NuxtLink
          to="/admin/chatbot"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
        >
          <UIcon name="i-lucide-sparkles" class="size-4 text-amber-500 group-hover:rotate-12 transition-transform" />
          <span>Analyze with AI</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CENTRAL DATA DOMAIN SELECTOR PILLS -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3 flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-xs font-bold text-slate-700 mr-2 flex items-center gap-1">
          <UIcon name="i-lucide-layers" class="size-3.5 text-[#008779]" />
          <span>แหล่งข้อมูลในระบบ:</span>
        </span>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs flex items-center gap-1.5"
          :class="selectedSourceType === 'all' ? 'bg-[#008779] text-white border-[#008779]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
          @click="selectedSourceType = 'all'"
        >
          <span>All Integrated Sources</span>
          <span class="size-2 rounded-full bg-amber-400"></span>
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs flex items-center gap-1.5"
          :class="selectedSourceType === 'PROJECT' ? 'bg-sky-600 text-white border-sky-600' : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'"
          @click="selectedSourceType = 'PROJECT'"
        >
          <UIcon name="i-lucide-folder-git-2" class="size-3" />
          <span>Live Projects</span>
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs flex items-center gap-1.5"
          :class="selectedSourceType === 'KM' ? 'bg-purple-600 text-white border-purple-600' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'"
          @click="selectedSourceType = 'KM'"
        >
          <UIcon name="i-lucide-book-open" class="size-3" />
          <span>KM Repository (PFR)</span>
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs flex items-center gap-1.5"
          :class="selectedSourceType === 'APPROVAL' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'"
          @click="selectedSourceType = 'APPROVAL'"
        >
          <UIcon name="i-lucide-check-check" class="size-3" />
          <span>Stage-Gate Approvals</span>
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs flex items-center gap-1.5"
          :class="selectedSourceType === 'MASTER' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'"
          @click="selectedSourceType = 'MASTER'"
        >
          <UIcon name="i-lucide-database" class="size-3" />
          <span>Master Data Plants</span>
        </button>
      </div>

      <span class="text-xs text-slate-400 font-mono">
        Showing <b>{{ filteredProjects.length }}</b> records
      </span>
    </div>

    <!-- ========================================================= -->
    <!-- CENTRAL FILTER BAR CAPSULE -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UIcon name="i-lucide-filter" class="size-3.5 text-[#008779]" />
          <span>ตัวกรองข้อมูลโครงการ & หน่วยงาน (Master Data Filters)</span>
        </span>
        <button
          type="button"
          class="text-[11px] text-[#008779] hover:underline font-semibold cursor-pointer"
          @click="selectedBusiness = 'all'; selectedBu = 'all'; selectedPlant = 'all'; selectedBelt = 'all'; selectedPhase = 'all'; selectedSourceType = 'all'"
        >
          Reset Filters
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">กลุ่มธุรกิจ (Business)</label>
          <select v-model="selectedBusiness" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer">
            <option value="all">ทุกกลุ่มธุรกิจ (All)</option>
            <option v-for="bg in masterOrgData" :key="bg.code" :value="bg.business">{{ bg.business }}</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">สายงานธุรกิจ (Business Unit)</label>
          <select v-model="selectedBu" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer">
            <option value="all">ทุกสายงานธุรกิจ (All BU)</option>
            <option value="Chicken">แปรรูปเนื้อไก่ (Chicken Processing)</option>
            <option value="Swine">แปรรูปเนื้อสุกร (Swine Processing)</option>
            <option value="Ready-to-Eat">อาหารสำเร็จรูป (Ready-to-Eat)</option>
            <option value="Feed">อาหารสัตว์ (Feed Mill)</option>
            <option value="Farm">ฟาร์มเกษตร (Commercial Farm)</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">โรงงาน / ฟาร์ม (12 Plants)</label>
          <select v-model="selectedPlant" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer">
            <option value="all">ทุกโรงงาน (12 Plants)</option>
            <option v-for="p in availablePlants" :key="p.code" :value="p.name">
              {{ p.name }} ({{ p.code }})
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">ระดับสาย Six Sigma (Belt)</label>
          <select v-model="selectedBelt" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer">
            <option value="all">ทุกระดับสาย (All Belts)</option>
            <option value="Master">Master Black Belt (MBB)</option>
            <option value="Black">Black Belt (BB)</option>
            <option value="Green">Green Belt (GB)</option>
            <option value="Yellow">Yellow Belt (YB)</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">ขั้นตอน DMAIC Phase</label>
          <select v-model="selectedPhase" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer">
            <option value="all">ทุกขั้นตอน (All Phases)</option>
            <option value="Define">Define (กำหนดเป้าหมาย)</option>
            <option value="Measure">Measure (วัดสมรรถนะ)</option>
            <option value="Analyze">Analyze (วิเคราะห์ปัจจัย)</option>
            <option value="Improve">Improve (ปรับปรุงกระบวนการ)</option>
            <option value="Control">Control (ควบคุมมาตรฐาน)</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">ปีงบประมาณ (Fiscal Year)</label>
          <select v-model="selectedYear" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer">
            <option value="2025-2026">2025 - 2026 (ปัจจุบัน)</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 6 EXECUTIVE KPI STAT CAPSULES (DYNAMIC FROM CENTRAL STORE) -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">TOTAL PROJECTS</span>
        <p class="text-2xl font-bold text-slate-900 font-mono">{{ kpiSummary.totalProjects }}</p>
        <span class="text-[10px] text-slate-500 font-medium">ทุกโรงงานทั่วเครือ CPF</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-blue-600 font-bold uppercase block">ACTIVE PIPELINE</span>
        <p class="text-2xl font-bold text-blue-700 font-mono">{{ kpiSummary.activeProjects }}</p>
        <span class="text-[10px] text-blue-500 font-medium">กำลังดำเนินการ</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-emerald-600 font-bold uppercase block">COMPLETED (PFR)</span>
        <p class="text-2xl font-bold text-emerald-700 font-mono">{{ kpiSummary.completedProjects }}</p>
        <span class="text-[10px] text-emerald-600 font-medium">รับรองความสำเร็จใน KM</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-[#008779] font-bold uppercase block">AUDITED SAVINGS</span>
        <p class="text-2xl font-bold text-[#008779] font-mono">{{ kpiSummary.totalSavings }}</p>
        <span class="text-[10px] text-emerald-600 font-semibold">ผลประหยัดต้นทุนรวม</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-purple-600 font-bold uppercase block">AVG YIELD GAIN</span>
        <p class="text-2xl font-bold text-purple-700 font-mono">{{ kpiSummary.avgYieldGain }}</p>
        <span class="text-[10px] text-purple-500 font-medium">เพิ่มขึ้นจาก Baseline</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-amber-600 font-bold uppercase block">PROCESS CPK</span>
        <p class="text-2xl font-bold text-amber-700 font-mono">{{ kpiSummary.avgCpk }}</p>
        <span class="text-[10px] text-amber-600 font-medium">กระบวนการเสถียร (&ge;1.33)</span>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- VIEW 1: INTERACTIVE CHARTS VIEW (WITH CUSTOM HOVER TOOLTIPS) -->
    <!-- ========================================================= -->
    <div v-if="activeViewTab === 'charts'" class="space-y-6">
      
      <!-- ========================================================= -->
      <!-- 1. TOP CHART: ผลประโยชน์ทางการเงินและการประหยัดต้นทุนตามกลุ่มธุรกิจ -->
      <!-- ========================================================= -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>ผลประโยชน์ทางการเงินและการประหยัดต้นทุนตามกลุ่มธุรกิจ (Financial Savings by Business Group)</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              มูลค่าผลประโยชน์ที่ได้รับการรับรองทางการเงิน (Audited Savings) และงบประมาณโครงการรวมแยกตามกลุ่มธุรกิจ (ล้านบาท) - เลื่อนเมาส์ (Hover) เพื่อดูรายละเอียด
            </p>
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model="selectedBudgetType"
              class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#008779] cursor-pointer shadow-2xs"
            >
              <option value="all">ประเภทข้อมูล ทั้งหมด (All)</option>
              <option value="savings">ผลประหยัดต้นทุนที่รับรองแล้ว (Audited Savings)</option>
              <option value="capex">งบลงทุนปรับปรุงเครื่องจักร (CAPEX)</option>
              <option value="opex">งบประมาณดำเนินงาน (OPEX)</option>
            </select>
          </div>
        </div>

        <!-- Vertical Bar Chart Area -->
        <div class="relative pt-6 pb-2">
          <!-- Y-Axis Grid Lines -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-14 pt-2 px-6">
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>350M</span>
            </div>
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>300M</span>
            </div>
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>250M</span>
            </div>
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>200M</span>
            </div>
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>150M</span>
            </div>
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>100M</span>
            </div>
            <div class="border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>50M</span>
            </div>
            <div class="border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>0M</span>
            </div>
          </div>

          <!-- Bar Columns Grid -->
          <div class="grid grid-cols-7 gap-2 sm:gap-4 relative z-10 px-6">
            <div
              v-for="bu in buBudgets"
              :key="bu.id"
              class="flex flex-col items-center group cursor-pointer"
              @mouseenter="handleMouseEnter($event, bu.name, 'มูลค่ารวม (งบประมาณและผลประหยัด)', `${bu.amount.toFixed(1)}M THB`, bu.color, `จำนวน ${bu.projectsCount} โครงการในระบบ`)"
              @mouseleave="handleMouseLeave"
            >
              <!-- Bar Column Container with Fixed Height -->
              <div class="h-64 w-full flex flex-col justify-end items-center">
                <!-- Value on Top of Bar -->
                <span class="text-[11px] font-bold text-slate-800 font-mono mb-1.5 group-hover:scale-110 transition-transform">
                  {{ bu.displayVal }}
                </span>

                <!-- Animated Vertical Bar with rounded top -->
                <div
                  class="w-full max-w-[56px] rounded-t-2xl transition-all duration-300 shadow-2xs group-hover:opacity-90 group-hover:shadow-md"
                  :style="{
                    height: `${Math.max(4, (bu.amount / maxBuAmount) * 100)}%`,
                    backgroundColor: bu.color
                  }"
                ></div>
              </div>

              <!-- X-Axis Label (Placed directly underneath each column) -->
              <div class="pt-3 text-center w-full min-h-[38px] flex items-start justify-center">
                <span
                  class="text-[11px] text-slate-600 font-semibold leading-tight line-clamp-2 px-0.5 group-hover:text-slate-900 transition-colors"
                  :title="bu.name"
                >
                  {{ bu.shortName }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- 2. MIDDLE ROW: Category Breakdown & Project Share Donut -->
      <!-- ========================================================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- 2.1 สัดส่วนผลประโยชน์ตามหมวดหมู่การปรับปรุง (8 Cols) -->
        <div class="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">
              สัดส่วนผลประโยชน์ตามหมวดหมู่การปรับปรุง (Improvement Category)
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              มูลค่าการประหยัดต้นทุน (Cost Savings) และการปรับปรุงกระบวนการผลิต (ล้านบาท)
            </p>
          </div>

          <!-- Horizontal Bar Chart -->
          <div class="space-y-3.5 pt-2">
            <div
              v-for="cat in categoryBudgets"
              :key="cat.name"
              class="flex items-center gap-3 text-xs group cursor-pointer"
              @mouseenter="handleMouseEnter($event, cat.name, 'มูลค่าการประหยัดต้นทุน', `${cat.amount.toFixed(1)}M THB`, cat.color, `${cat.count} โครงการที่เกี่ยวข้อง`)"
              @mouseleave="handleMouseLeave"
            >
              <!-- Label -->
              <div class="w-44 text-right font-medium text-slate-700 text-[11px] truncate" :title="cat.name">
                {{ cat.name }}
              </div>

              <!-- Bar Container -->
              <div class="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5 relative">
                <div
                  class="h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                  :style="{
                    width: `${(cat.amount / maxCategoryAmount) * 100}%`,
                    backgroundColor: cat.color
                  }"
                >
                </div>
              </div>

              <!-- Count Badge -->
              <span class="w-8 text-left font-bold text-slate-900 font-mono text-[11px]">
                {{ cat.count }}
              </span>
            </div>

            <!-- X-Axis Scale -->
            <div class="flex justify-between pl-44 pr-8 text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100">
              <span>0.0M</span>
              <span>50.0M</span>
              <span>100.0M</span>
              <span>150.0M</span>
              <span>200.0M</span>
              <span>250.0M</span>
            </div>
          </div>
        </div>

        <!-- 2.2 สัดส่วนโครงการตามกลุ่มธุรกิจ Donut Chart (4 Cols) -->
        <div class="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div class="pb-3 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">
              สัดส่วนโครงการตามกลุ่มธุรกิจ
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              การกระจายตัวของโครงการ Six Sigma รวม 47 โครงการ
            </p>
          </div>

          <!-- Donut SVG with Segment Hover -->
          <div class="h-48 flex items-center justify-center relative">
            <svg class="size-44" viewBox="0 0 100 100">
              <!-- Donut Background -->
              <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" stroke-width="22" />
              <!-- Seg 1: Cyan (46%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#06B6D4" stroke-width="22"
                stroke-dasharray="101.2 220" stroke-dashoffset="0"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'อาหารสำเร็จรูป (RTE)', 'จำนวนโครงการ', '22 โครงการ (46%)', '#06B6D4')"
                @mouseleave="handleMouseLeave"
              />
              <!-- Seg 2: Purple (31%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" stroke-width="22"
                stroke-dasharray="68.2 220" stroke-dashoffset="-101.2"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'แปรรูปไก่ (Chicken)', 'จำนวนโครงการ', '15 โครงการ (31%)', '#8B5CF6')"
                @mouseleave="handleMouseLeave"
              />
              <!-- Seg 3: Green (6%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#10B981" stroke-width="22"
                stroke-dasharray="13.2 220" stroke-dashoffset="-169.4"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'อาหารสัตว์ (Feed)', 'จำนวนโครงการ', '3 โครงการ (6%)', '#10B981')"
                @mouseleave="handleMouseLeave"
              />
              <!-- Seg 4: Red (6%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#EF4444" stroke-width="22"
                stroke-dasharray="13.2 220" stroke-dashoffset="-182.6"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'แปรรูปสุกร (Swine)', 'จำนวนโครงการ', '3 โครงการ (6%)', '#EF4444')"
                @mouseleave="handleMouseLeave"
              />
              <!-- Seg 5: Amber (4%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#F59E0B" stroke-width="22"
                stroke-dasharray="8.8 220" stroke-dashoffset="-195.8"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'ฟาร์มเกษตร (Farm)', 'จำนวนโครงการ', '2 โครงการ (4%)', '#F59E0B')"
                @mouseleave="handleMouseLeave"
              />
              <!-- Seg 6: Blue (2%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#3B82F6" stroke-width="22"
                stroke-dasharray="4.4 220" stroke-dashoffset="-204.6"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'พัฒนาองค์กร (CI HQ)', 'จำนวนโครงการ', '1 โครงการ (2%)', '#3B82F6')"
                @mouseleave="handleMouseLeave"
              />
              <!-- Seg 7: Pink (2%) -->
              <circle
                cx="50" cy="50" r="35" fill="none" stroke="#EC4899" stroke-width="22"
                stroke-dasharray="4.4 220" stroke-dashoffset="-209"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                @mouseenter="handleMouseEnter($event, 'ยุทธศาสตร์นวัตกรรม', 'จำนวนโครงการ', '1 โครงการ (2%)', '#EC4899')"
                @mouseleave="handleMouseLeave"
              />
            </svg>
            <div class="absolute text-center">
              <span class="text-xl font-black text-slate-900 font-mono block">47</span>
              <span class="text-[10px] text-slate-400 font-bold block">PROJECTS</span>
            </div>
          </div>

          <!-- Color Badges Legend -->
          <div class="flex items-center justify-center gap-2 flex-wrap text-[11px] pt-1">
            <span
              v-for="item in projectShareData"
              :key="item.label"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium cursor-pointer hover:bg-slate-100"
              @mouseenter="handleMouseEnter($event, item.fullName, 'จำนวนโครงการ', `${item.count} โครงการ (${item.pct}%)`, item.color)"
              @mouseleave="handleMouseLeave"
            >
              <span class="size-2 rounded-full" :style="{ backgroundColor: item.color }"></span>
              <span>{{ item.label }}: {{ item.count }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- 3. QUARTERLY SUMMARY (Stage-Gate Closeout Milestones) -->
      <!-- ========================================================= -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 class="text-base font-bold text-slate-900">
              สรุปแผนและผลการปิดเฟส Stage-Gate รายไตรมาส (Define/PCR, Analyze, Control/PFR)
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              การเปรียบเทียบเป้าหมายแผนงาน (Plan) เทียบกับการอนุมัติและรับรองผลจริง (Actual) จากระบบ Approval Workflow ประจำไตรมาส 1 - 4
            </p>
          </div>

          <!-- Legend Bar -->
          <div class="flex items-center gap-2 flex-wrap text-[10px] font-semibold">
            <span class="flex items-center gap-1 text-sky-700"><span class="size-2.5 rounded bg-[#BAE6FD]"></span> PCR เปิดโครงการ (แผน)</span>
            <span class="flex items-center gap-1 text-teal-700"><span class="size-2.5 rounded bg-[#2DD4BF]"></span> PCR เปิดโครงการ (ผ่านอนุมัติจริง)</span>
            <span class="flex items-center gap-1 text-amber-700"><span class="size-2.5 rounded bg-[#FDE68A]"></span> Analyze Gate (แผน)</span>
            <span class="flex items-center gap-1 text-amber-800"><span class="size-2.5 rounded bg-[#D97706]"></span> Analyze Gate (ผ่านจริง)</span>
            <span class="flex items-center gap-1 text-rose-700"><span class="size-2.5 rounded bg-[#FECDD3]"></span> PFR ปิดโครงการ (แผน)</span>
            <span class="flex items-center gap-1 text-rose-800"><span class="size-2.5 rounded bg-[#BE123C]"></span> PFR ปิดโครงการ (รับรองผลจริง)</span>
          </div>
        </div>

        <!-- Quarterly Grouped Bars -->
        <div class="grid grid-cols-4 gap-6 h-64 items-end px-4 pb-6 pt-4 border-b border-slate-200 relative">
          <div
            v-for="q in quarterlyData"
            :key="q.quarter"
            class="flex flex-col items-center h-full justify-end space-y-1"
          >
            <!-- 3 Grouped Bars per Quarter -->
            <div class="flex items-end gap-2 h-full w-full justify-center">
              
              <!-- 1. PCR Group (Plan + Actual Stacked) -->
              <div
                v-if="q.pcrPlan > 0"
                class="w-12 bg-[#BAE6FD] hover:opacity-90 rounded-t-xl relative flex flex-col justify-end overflow-hidden transition-all shadow-2xs cursor-pointer group"
                :style="{ height: `${(q.pcrPlan / 35) * 100}%` }"
                @mouseenter="handleMouseEnter($event, q.quarter, 'แผนเปิดโครงการ PCR', `${q.pcrPlan} โครงการ`, '#BAE6FD', `ผ่านการอนุมัติจริง: ${q.pcrActual} โครงการ`)"
                @mouseleave="handleMouseLeave"
              >
                <span class="absolute top-1 left-0 right-0 text-center font-bold font-mono text-[10px] text-sky-900">{{ q.pcrPlan }}</span>
                <!-- Actual Sub-bar -->
                <div
                  v-if="q.pcrActual > 0"
                  class="w-full bg-[#2DD4BF] flex items-center justify-center transition-all"
                  :style="{ height: `${(q.pcrActual / q.pcrPlan) * 100}%` }"
                >
                  <span class="text-[9px] font-bold text-teal-950 font-mono">{{ q.pcrActual }}</span>
                </div>
              </div>
              <div v-else class="w-12"></div>

              <!-- 2. Analyze Gate Group (Plan + Actual Stacked) -->
              <div
                v-if="q.analyzePlan > 0"
                class="w-12 bg-[#FDE68A] hover:opacity-90 rounded-t-xl relative flex flex-col justify-end overflow-hidden transition-all shadow-2xs cursor-pointer group"
                :style="{ height: `${(q.analyzePlan / 35) * 100}%` }"
                @mouseenter="handleMouseEnter($event, q.quarter, 'แผนด่าน Analyze Gate', `${q.analyzePlan} โครงการ`, '#FDE68A', `ผ่านการวิเคราะห์สำเร็จจริง: ${q.analyzeActual} โครงการ`)"
                @mouseleave="handleMouseLeave"
              >
                <span class="absolute top-1 left-0 right-0 text-center font-bold font-mono text-[10px] text-amber-900">{{ q.analyzePlan }}</span>
                <!-- Actual Sub-bar -->
                <div
                  v-if="q.analyzeActual > 0"
                  class="w-full bg-[#D97706] flex items-center justify-center transition-all"
                  :style="{ height: `${(q.analyzeActual / q.analyzePlan) * 100}%` }"
                >
                  <span class="text-[9px] font-bold text-white font-mono">{{ q.analyzeActual }}</span>
                </div>
              </div>
              <div v-else class="w-12"></div>

              <!-- 3. PFR Close-out Group (Plan + Actual Stacked) -->
              <div
                v-if="q.pfrPlan > 0"
                class="w-12 bg-[#FECDD3] hover:opacity-90 rounded-t-xl relative flex flex-col justify-end overflow-hidden transition-all shadow-2xs cursor-pointer group"
                :style="{ height: `${(q.pfrPlan / 35) * 100}%` }"
                @mouseenter="handleMouseEnter($event, q.quarter, 'แผนปิดโครงการ PFR', `${q.pfrPlan} โครงการ`, '#FECDD3', `รับรองผลสำเร็จจริง: ${q.pfrActual} โครงการ`)"
                @mouseleave="handleMouseLeave"
              >
                <span class="absolute top-1 left-0 right-0 text-center font-bold font-mono text-[10px] text-rose-900">{{ q.pfrPlan }}</span>
                <!-- Actual Sub-bar -->
                <div
                  v-if="q.pfrActual > 0"
                  class="w-full bg-[#BE123C] flex items-center justify-center transition-all"
                  :style="{ height: `${(q.pfrActual / q.pfrPlan) * 100}%` }"
                >
                  <span class="text-[9px] font-bold text-white font-mono">{{ q.pfrActual }}</span>
                </div>
              </div>
              <div v-else class="w-12"></div>
            </div>

            <!-- Quarter Label -->
            <span class="text-xs font-bold text-slate-700 pt-2">{{ q.quarter }}</span>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- 4. MONTHLY TIMELINE FORECAST (คาดการณ์ส่งมอบโครงการ Six Sigma รายเดือน) -->
      <!-- ========================================================= -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 class="text-base font-bold text-slate-900">
              คาดการณ์ไทม์ไลน์การส่งมอบโครงการ Six Sigma รายเดือน (Monthly Project Delivery & Close-out Forecast)
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              ความก้าวหน้าการปิดโครงการตามแผนงาน (Plan) เทียบกับผลรับรองความสำเร็จจริง (Actual) ประจำปีงบประมาณ 2568 - 2569 (เลื่อนเมาส์ชี้เพื่อดู Tooltip สรุปยอด)
            </p>
          </div>

          <div class="flex items-center gap-3 text-xs font-medium">
            <span class="flex items-center gap-1.5 text-slate-700">
              <span class="size-3 rounded bg-[#60A5FA]"></span> แผนส่งมอบโครงการ (โครงการ)
            </span>
            <span class="flex items-center gap-1.5 text-slate-700">
              <span class="size-3 rounded bg-[#2DD4BF]"></span> ส่งมอบและรับรองผลจริง (โครงการ)
            </span>
          </div>
        </div>

        <!-- 12-Month Bar Chart -->
        <div class="grid grid-cols-12 gap-2 sm:gap-3 h-56 items-end px-2 pb-6 pt-2 border-b border-slate-200">
          <div
            v-for="m in monthlyTimeline"
            :key="m.month"
            class="flex flex-col items-center h-full justify-end group cursor-pointer"
            @mouseenter="handleMouseEnter($event, m.month, 'แผนส่งมอบโครงการ', `${m.planDelivery} โครงการ`, '#60A5FA', `ส่งมอบและรับรองผลจริง: ${m.actualDelivery} โครงการ`)"
            @mouseleave="handleMouseLeave"
          >
            <!-- Top Value Label -->
            <span v-if="m.planDelivery > 0" class="text-[10px] font-bold text-slate-800 font-mono mb-1">
              {{ m.planDelivery }}
            </span>

            <!-- Stacked Bar -->
            <div
              v-if="m.planDelivery > 0"
              class="w-full bg-[#60A5FA] hover:opacity-90 rounded-t-xl relative flex flex-col justify-end overflow-hidden transition-all shadow-2xs"
              :style="{ height: `${(m.planDelivery / 16) * 100}%` }"
            >
              <!-- Actual Sub-bar -->
              <div
                v-if="m.actualDelivery > 0"
                class="w-full bg-[#2DD4BF] flex items-center justify-center"
                :style="{ height: `${(m.actualDelivery / m.planDelivery) * 100}%` }"
              >
                <span class="text-[9px] font-bold text-teal-950 font-mono">{{ m.actualDelivery }}</span>
              </div>
            </div>
            <div v-else class="w-full h-1 bg-slate-100 rounded-full"></div>

            <!-- Month Label -->
            <span class="text-[9px] sm:text-[10px] text-slate-500 font-medium pt-2 block truncate">
              {{ m.month }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- ========================================================= -->
    <!-- VIEW 2: STRUCTURED DATA TABLE (ตารางข้อมูลกลางที่ผสาน 4 แหล่ง) -->
    <!-- ========================================================= -->
    <div v-else class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UIcon name="i-lucide-database" class="size-4 text-[#008779]" />
            <span>ตารางข้อมูลโครงการแบบรวมศูนย์ (Project • KM • Approval • Master Data)</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            ข้อมูลจริงทั้งหมดที่ใช้ขับเคลื่อนกราฟิกวิเคราะห์แดชบอร์ด
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            @click="openCreateRunModal()"
          >
            <UIcon name="i-lucide-copy-plus" class="size-3.5" />
            <span>Create Project Run</span>
          </button>
          <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full shadow-2xs">
            {{ filteredProjects.length }} Records Found
          </span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4 font-semibold">SOURCE & PROJECT NAME</th>
              <th class="py-3.5 px-4 font-semibold">BUSINESS & PLANT</th>
              <th class="py-3.5 px-3 font-semibold">LEADER & BELT</th>
              <th class="py-3.5 px-3 font-semibold">DMAIC PHASE</th>
              <th class="py-3.5 px-3 font-semibold text-right">BUDGET</th>
              <th class="py-3.5 px-3 font-semibold text-right">AUDITED SAVINGS</th>
              <th class="py-3.5 px-3 font-semibold text-center">STAGE GATE</th>
              <th class="py-3.5 px-3 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
            <tr v-for="p in filteredProjects" :key="p.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-4 px-4 font-bold text-slate-900">
                <!-- Source Badge -->
                <div class="flex items-center gap-1.5 mb-1">
                  <span
                    class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-tight uppercase"
                    :class="{
                      'bg-sky-100 text-sky-800 border border-sky-200': p.sourceType === 'PROJECT',
                      'bg-purple-100 text-purple-800 border border-purple-200': p.sourceType === 'KM',
                      'bg-amber-100 text-amber-800 border border-amber-200': p.sourceType === 'APPROVAL',
                      'bg-emerald-100 text-emerald-800 border border-emerald-200': p.sourceType === 'MASTER',
                    }"
                  >
                    {{ p.sourceType }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">{{ p.improvementCategory }}</span>
                </div>
                <NuxtLink :to="p.sourceType === 'KM' ? '/admin/km-repository' : `/admin/projects/${p.id}`" class="hover:text-[#008779] hover:underline">
                  {{ p.name }}
                </NuxtLink>
              </td>
              <td class="py-4 px-4 text-slate-600">
                <span class="block font-medium text-slate-800">{{ p.plant }}</span>
                <span class="text-[10px] text-slate-400 truncate block max-w-[160px]">{{ p.business }} &rsaquo; {{ p.bu }}</span>
              </td>
              <td class="py-4 px-3">
                <span class="block text-slate-900 font-semibold">{{ p.leader }}</span>
                <span class="text-[10px] text-[#008779] font-medium">{{ p.belt }}</span>
              </td>
              <td class="py-4 px-3">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
                  :class="{
                    'bg-sky-50 text-sky-700 border-sky-200': p.phase === 'Define',
                    'bg-blue-50 text-blue-700 border-blue-200': p.phase === 'Measure',
                    'bg-purple-50 text-purple-700 border-purple-200': p.phase === 'Analyze',
                    'bg-teal-50 text-teal-700 border-teal-200': p.phase === 'Improve',
                    'bg-emerald-50 text-emerald-700 border-emerald-200': p.phase === 'Control',
                  }"
                >
                  {{ p.phase }}
                </span>
              </td>
              <td class="py-4 px-3 text-right font-mono font-bold text-slate-900">
                {{ (p.budgetThb / 1000000).toFixed(1) }}M
              </td>
              <td class="py-4 px-3 text-right font-mono font-bold text-emerald-600">
                {{ (p.savingsThb / 1000000).toFixed(1) }}M
              </td>
              <td class="py-4 px-3 text-center">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs"
                  :class="p.pcrStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                >
                  PCR: {{ p.pcrStatus }}
                </span>
              </td>
              <td class="py-4 px-3 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="size-7 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    title="Create Run 2 from this project"
                    @click="openCreateRunModal(p)"
                  >
                    <UIcon name="i-lucide-copy" class="size-3.5" />
                  </button>
                  <NuxtLink
                    :to="`/admin/projects/${p.id}/presentation`"
                    class="size-7 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    title="Open Presentation Studio"
                  >
                    <UIcon name="i-lucide-presentation" class="size-3.5" />
                  </NuxtLink>
                  <NuxtLink
                    :to="p.sourceType === 'KM' ? '/admin/km-repository' : `/admin/projects/${p.id}`"
                    class="size-7 bg-slate-100 hover:bg-[#008779] hover:text-white text-slate-700 rounded-lg flex items-center justify-center transition-colors"
                    title="View DMAIC Workspace"
                  >
                    <UIcon name="i-lucide-arrow-right" class="size-3.5" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CREATE PROJECT RUN MODAL (PHASE 2 SCOPE SELECTOR) -->
    <!-- ========================================================= -->
    <Teleport to="body">
      <div
        v-if="isCreateRunModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in"
      >
        <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 p-6 space-y-5 animate-in zoom-in-95">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="size-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <UIcon name="i-lucide-copy-plus" class="size-5" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Create Project Run (คัดลอกโครงการ Run ใหม่)</h3>
                <span class="text-xs text-slate-500">ขยายขีดความสามารถการคัดลอกและเลือกขอบเขตโมดูล Phase 2</span>
              </div>
            </div>
            <button
              type="button"
              class="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              @click="isCreateRunModalOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <!-- Project Title Input -->
            <div class="space-y-1.5">
              <label class="font-bold text-slate-700 block">ชื่อโครงการ Run ใหม่</label>
              <input
                v-model="runProjectTitle"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#008779]"
                placeholder="ระบุชื่อโครงการ..."
              />
            </div>

            <!-- Plant & Location Selection -->
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="font-bold text-slate-700 block">โรงงาน / Plant Location</label>
                <select
                  v-model="runPlantLocation"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008779] cursor-pointer"
                >
                  <option v-for="p in availablePlants" :key="p.code" :value="p.name">
                    {{ p.name }}
                  </option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="font-bold text-slate-700 block">ปีงบประมาณ</label>
                <select
                  v-model="runYear"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#008779] cursor-pointer"
                >
                  <option value="2026">2026 (New Run)</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            <!-- Customizable Modular Scope Checkboxes (Phase 2 Requirement) -->
            <div class="space-y-2 pt-2 border-t border-slate-100">
              <label class="font-bold text-slate-800 block flex items-center gap-1.5">
                <UIcon name="i-lucide-check-square" class="size-3.5 text-[#008779]" />
                <span>เลือกขอบเขตโมดูลและฟีเจอร์ Phase 2 ที่ต้องการคัดลอก:</span>
              </label>
              <div class="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                  <input type="checkbox" v-model="runScope.define" class="rounded accent-[#008779]" />
                  <span>Define & BEG Chart</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                  <input type="checkbox" v-model="runScope.processMap" class="rounded accent-[#008779]" />
                  <span>Process Map (Swimlane)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                  <input type="checkbox" v-model="runScope.fishbone" class="rounded accent-[#008779]" />
                  <span>Fishbone 5M1E Diagram</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                  <input type="checkbox" v-model="runScope.fmea" class="rounded accent-[#008779]" />
                  <span>FMEA Risk Matrix</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                  <input type="checkbox" v-model="runScope.hypothesis" class="rounded accent-[#008779]" />
                  <span>Hypothesis Testing (ANOVA)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900">
                  <input type="checkbox" v-model="runScope.doe" class="rounded accent-[#008779]" />
                  <span>DOE Factorial 2^k</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-medium hover:text-slate-900 col-span-2">
                  <input type="checkbox" v-model="runScope.controlPlan" class="rounded accent-[#008779]" />
                  <span>Control Plan & 12-Month Realization Tracking</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              @click="isCreateRunModalOpen = false"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008779] hover:bg-[#007366] transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
              @click="confirmCreateProjectRun"
            >
              <UIcon name="i-lucide-check" class="size-3.5" />
              <span>ยืนยันสร้าง Project Run</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
