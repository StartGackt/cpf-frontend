<script setup lang="ts">
import { ref } from 'vue'

// Multi-dimensional Filters
const selectedBusiness = ref('all')
const selectedBu = ref('all')
const selectedPlant = ref('all')
const selectedYear = ref('2025-2026')
const selectedBelt = ref('all')
const selectedPhase = ref('all')

const statSummary = ref({
  totalProjects: 200,
  activeProjects: 42,
  completedProjects: 158,
  totalSavings: '145.8M THB',
  avgYieldGain: '+3.95%',
  avgCpk: '1.45'
})

const exportToExcel = () => {
  alert('Exporting full project dashboard dataset to Excel (.xlsx)...')
}

const exportToPdf = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- ========================================================= -->
    <!-- HERO HEADER: Executive Portfolio & AI Analytics Hub -->
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
            <span class="text-xs text-teal-200">Portfolio Performance, Six Sigma Belt Analytics & Stage Gate Telemetry</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          ศูนย์รวมการวิเคราะห์ข้อมูลความคืบหน้าโครงการ DMAIC, ดัชนีความสามารถกระบวนการ (Cpk), และผลตอบแทนทางการเงินที่ได้รับการรับรองทั่วทั้งเครือ CPF
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex items-center gap-2.5 flex-wrap relative z-10 shrink-0">
        <button
          type="button"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          @click="exportToExcel"
        >
          <UIcon name="i-lucide-file-spreadsheet" class="size-4 text-emerald-300" />
          <span>Export Excel</span>
        </button>

        <button
          type="button"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          @click="exportToPdf"
        >
          <UIcon name="i-lucide-file-text" class="size-4 text-rose-300" />
          <span>Export PDF</span>
        </button>

        <NuxtLink
          to="/admin/chatbot"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
        >
          <UIcon name="i-lucide-sparkles" class="size-4 text-amber-500 group-hover:rotate-12 transition-transform" />
          <span>Analyze with AI</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- FILTER BAR CAPSULE -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UIcon name="i-lucide-filter" class="size-3.5 text-[#008779]" />
          <span>Portfolio Filters & Criteria</span>
        </span>
        <button
          type="button"
          class="text-[11px] text-[#008779] hover:underline font-semibold cursor-pointer"
          @click="selectedBusiness = 'all'; selectedBu = 'all'; selectedPlant = 'all'; selectedBelt = 'all'; selectedPhase = 'all'"
        >
          Reset Filters
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        <!-- Business -->
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">Business</label>
          <select
            v-model="selectedBusiness"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="all">All Businesses</option>
            <option value="food">Food Business</option>
            <option value="feed">Feed Business</option>
            <option value="farm">Farm Business</option>
          </select>
        </div>

        <!-- Business Unit -->
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">Business Unit</label>
          <select
            v-model="selectedBu"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="all">All Business Units</option>
            <option value="chicken">Chicken Processing</option>
            <option value="swine">Swine Processing</option>
            <option value="rte">Ready-to-Eat Food</option>
          </select>
        </div>

        <!-- Plant / Location -->
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">Plant Location</label>
          <select
            v-model="selectedPlant"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="all">All Plants (12)</option>
            <option value="chokchai">โรงงานแปรรูปโชคชัย</option>
            <option value="korat2">โรงงานแปรรูปอาหาร 2 โคราช</option>
            <option value="saraburi">โรงงานแปรรูปสระบุรี</option>
          </select>
        </div>

        <!-- Belt Level -->
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">Belt Type</label>
          <select
            v-model="selectedBelt"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="all">All Belt Levels</option>
            <option value="bb">Black Belt (BB)</option>
            <option value="gb">Green Belt (GB)</option>
            <option value="yb">Yellow Belt (YB)</option>
          </select>
        </div>

        <!-- Phase -->
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">DMAIC Phase</label>
          <select
            v-model="selectedPhase"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="all">All Phases</option>
            <option value="define">Define</option>
            <option value="measure">Measure</option>
            <option value="analyze">Analyze</option>
            <option value="improve">Improve</option>
            <option value="control">Control</option>
          </select>
        </div>

        <!-- Fiscal Year -->
        <div class="space-y-1">
          <label class="text-[10px] text-slate-400 font-bold block uppercase">Fiscal Year</label>
          <select
            v-model="selectedYear"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="2025-2026">2025 - 2026 (Current)</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 6 EXECUTIVE KPI STAT CAPSULES -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">TOTAL PROJECTS</span>
        <p class="text-2xl font-bold text-slate-900 font-mono">{{ statSummary.totalProjects }}</p>
        <span class="text-[10px] text-slate-500 font-medium">All CPF Units</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-blue-600 font-bold uppercase block">ACTIVE PIPELINE</span>
        <p class="text-2xl font-bold text-blue-700 font-mono">{{ statSummary.activeProjects }}</p>
        <span class="text-[10px] text-blue-500 font-medium">In Progress</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-emerald-600 font-bold uppercase block">COMPLETED</span>
        <p class="text-2xl font-bold text-emerald-700 font-mono">{{ statSummary.completedProjects }}</p>
        <span class="text-[10px] text-emerald-600 font-medium">Verified PFR</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-[#008779] font-bold uppercase block">TOTAL SAVINGS</span>
        <p class="text-2xl font-bold text-[#008779] font-mono">{{ statSummary.totalSavings }}</p>
        <span class="text-[10px] text-emerald-600 font-semibold">Audited ROI</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-purple-600 font-bold uppercase block">AVG YIELD GAIN</span>
        <p class="text-2xl font-bold text-purple-700 font-mono">{{ statSummary.avgYieldGain }}</p>
        <span class="text-[10px] text-purple-500 font-medium">Above Baseline</span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-amber-600 font-bold uppercase block">PROCESS CPK</span>
        <p class="text-2xl font-bold text-amber-700 font-mono">{{ statSummary.avgCpk }}</p>
        <span class="text-[10px] text-amber-600 font-medium">Stable (&ge;1.33)</span>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- VISUAL ANALYTICS CHARTS GRID -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- 1. Pipeline by DMAIC Phase (8 Cols) -->
      <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-bar-chart-2" class="size-4 text-[#008779]" />
              <span>DMAIC Phase Progression & Active Funnel</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Active projects distributed across Define, Measure, Analyze, Improve, and Control
            </p>
          </div>
          <span class="text-xs text-[#008779] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full font-mono font-bold">
            42 Active
          </span>
        </div>

        <div class="h-56 flex items-center justify-center p-2">
          <svg class="w-full h-full" viewBox="0 0 600 180">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="560" y2="20" stroke="#f1f5f9" stroke-dasharray="3 3" />
            <line x1="50" y1="60" x2="560" y2="60" stroke="#f1f5f9" stroke-dasharray="3 3" />
            <line x1="50" y1="100" x2="560" y2="100" stroke="#f1f5f9" stroke-dasharray="3 3" />
            <line x1="50" y1="140" x2="560" y2="140" stroke="#cbd5e1" stroke-width="1.5" />

            <!-- Y-Axis Labels -->
            <text x="40" y="24" font-size="9" fill="#94a3b8" text-anchor="end">20</text>
            <text x="40" y="64" font-size="9" fill="#94a3b8" text-anchor="end">15</text>
            <text x="40" y="104" font-size="9" fill="#94a3b8" text-anchor="end">10</text>
            <text x="40" y="144" font-size="9" fill="#94a3b8" text-anchor="end">0</text>

            <!-- Bars: Define (8), Measure (14), Analyze (9), Improve (7), Control (4) -->
            <!-- Define -->
            <rect x="80" y="80" width="50" height="60" rx="8" fill="#60a5fa" />
            <text x="105" y="74" font-size="10" fill="#1e40af" font-weight="bold" text-anchor="middle">8</text>
            <text x="105" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Define</text>

            <!-- Measure -->
            <rect x="180" y="32" width="50" height="108" rx="8" fill="#38bdf8" />
            <text x="205" y="26" font-size="10" fill="#0369a1" font-weight="bold" text-anchor="middle">14</text>
            <text x="205" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Measure</text>

            <!-- Analyze -->
            <rect x="280" y="72" width="50" height="68" rx="8" fill="#a78bfa" />
            <text x="305" y="66" font-size="10" fill="#6d28d9" font-weight="bold" text-anchor="middle">9</text>
            <text x="305" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Analyze</text>

            <!-- Improve -->
            <rect x="380" y="88" width="50" height="52" rx="8" fill="#008779" />
            <text x="405" y="82" font-size="10" fill="#007366" font-weight="bold" text-anchor="middle">7</text>
            <text x="405" y="158" font-size="10" fill="#008779" font-weight="bold" text-anchor="middle">Improve</text>

            <!-- Control -->
            <rect x="480" y="112" width="50" height="28" rx="8" fill="#34d399" />
            <text x="505" y="106" font-size="10" fill="#065f46" font-weight="bold" text-anchor="middle">4</text>
            <text x="505" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Control</text>
          </svg>
        </div>
      </div>

      <!-- 2. Six Sigma Belt Distribution (4 Cols) -->
      <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UIcon name="i-lucide-award" class="size-4 text-purple-600" />
            <span>Belt Level Certification</span>
          </h2>
          <span class="text-xs text-slate-500 font-mono font-bold">100% Total</span>
        </div>

        <div class="h-44 flex items-center justify-center">
          <svg class="size-40" viewBox="0 0 100 100">
            <!-- Donut Segments (BB 35%, GB 45%, YB 15%, SME 5%) -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f1f5f9" stroke-width="14" />
            <!-- BB (35%) - Black / Dark Slate -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#1e293b" stroke-width="14" stroke-dasharray="77 220" stroke-dashoffset="0" />
            <!-- GB (45%) - Green / Emerald -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#008779" stroke-width="14" stroke-dasharray="99 220" stroke-dashoffset="-77" />
            <!-- YB (15%) - Amber / Yellow -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" stroke-width="14" stroke-dasharray="33 220" stroke-dashoffset="-176" />
            <!-- SME (5%) - Purple -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#8b5cf6" stroke-width="14" stroke-dasharray="11 220" stroke-dashoffset="-209" />
          </svg>
        </div>

        <!-- Legend -->
        <div class="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-slate-900"></span><span class="font-medium text-slate-700">Black Belt (35%)</span></div>
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-[#008779]"></span><span class="font-medium text-slate-700">Green Belt (45%)</span></div>
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-amber-500"></span><span class="font-medium text-slate-700">Yellow Belt (15%)</span></div>
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-purple-500"></span><span class="font-medium text-slate-700">SME (5%)</span></div>
        </div>
      </div>
    </div>

  </div>
</template>
