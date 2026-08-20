<script setup lang="ts">
import { ref } from 'vue'

// Multi-dimensional Filters
const selectedBusiness = ref('all')
const selectedBu = ref('all')
const selectedPlant = ref('all')
const selectedYear = ref('2025-2026')
const selectedBelt = ref('all')
const selectedPhase = ref('all')
const selectedStatus = ref('all')

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
  <div class="space-y-6">
    <!-- Page Header & Export Actions Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Executive Project Visualize Dashboard
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Multi-dimensional portfolio analytics across CPF Business Units, Six Sigma Belt Levels, and DMAIC stages
        </p>
      </div>

      <!-- Export Toolbar (Excel, PDF, Image) -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="exportToExcel"
        >
          <UIcon name="i-lucide-file-spreadsheet" class="size-3.5 text-emerald-600" />
          <span>Export Excel (.xlsx)</span>
        </button>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="exportToPdf"
        >
          <UIcon name="i-lucide-file-text" class="size-3.5 text-red-600" />
          <span>Export PDF Report</span>
        </button>

        <NuxtLink
          to="/admin/projects"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-folder" class="size-3.5" />
          <span>View All Projects</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Multi-Dimensional Dynamic Filter Bar -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <UIcon name="i-lucide-filter" class="size-3.5 text-[#008779]" />
          <span>Portfolio Filters & Criteria</span>
        </span>
        <button
          type="button"
          class="text-[11px] text-teal-700 hover:text-teal-900 font-semibold"
          @click="selectedBusiness = 'all'; selectedBu = 'all'; selectedPlant = 'all'; selectedBelt = 'all'; selectedPhase = 'all'"
        >
          Reset All Filters
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        <!-- Business -->
        <div class="space-y-1">
          <label class="text-[10px] text-gray-500 font-bold block uppercase">Business</label>
          <select
            v-model="selectedBusiness"
            class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#008779]"
          >
            <option value="all">All Businesses</option>
            <option value="food">Food Business</option>
            <option value="feed">Feed Business</option>
            <option value="farm">Farm Business</option>
          </select>
        </div>

        <!-- Business Unit -->
        <div class="space-y-1">
          <label class="text-[10px] text-gray-500 font-bold block uppercase">Business Unit</label>
          <select
            v-model="selectedBu"
            class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#008779]"
          >
            <option value="all">All Business Units</option>
            <option value="chicken">Chicken Processing</option>
            <option value="swine">Swine Processing</option>
            <option value="rte">Ready-to-Eat Food</option>
          </select>
        </div>

        <!-- Plant / Location -->
        <div class="space-y-1">
          <label class="text-[10px] text-gray-500 font-bold block uppercase">Plant / Plant</label>
          <select
            v-model="selectedPlant"
            class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#008779]"
          >
            <option value="all">All Plants (12)</option>
            <option value="chokchai">โรงงานแปรรูปโชคชัย</option>
            <option value="korat2">โรงงานแปรรูปอาหาร 2 โคราช</option>
            <option value="saraburi">โรงงานแปรรูปสระบุรี</option>
          </select>
        </div>

        <!-- Belt Level -->
        <div class="space-y-1">
          <label class="text-[10px] text-gray-500 font-bold block uppercase">Belt Type</label>
          <select
            v-model="selectedBelt"
            class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#008779]"
          >
            <option value="all">All Belt Levels</option>
            <option value="bb">Black Belt (BB)</option>
            <option value="gb">Green Belt (GB)</option>
            <option value="yb">Yellow Belt (YB)</option>
            <option value="sme">SME / Innovation</option>
          </select>
        </div>

        <!-- Phase -->
        <div class="space-y-1">
          <label class="text-[10px] text-gray-500 font-bold block uppercase">DMAIC Phase</label>
          <select
            v-model="selectedPhase"
            class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#008779]"
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
          <label class="text-[10px] text-gray-500 font-bold block uppercase">Fiscal Year</label>
          <select
            v-model="selectedYear"
            class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#008779]"
          >
            <option value="2025-2026">2025 - 2026 (Current)</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="all">All Historical Archive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 6 Executive KPI Stat Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-gray-500 font-medium">Total Projects</span>
        <p class="text-xl font-bold text-gray-900 font-mono">{{ statSummary.totalProjects }}</p>
        <span class="text-[10px] text-gray-400">All CPF Units</span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-blue-700 font-medium">Active Pipeline</span>
        <p class="text-xl font-bold text-blue-700 font-mono">{{ statSummary.activeProjects }}</p>
        <span class="text-[10px] text-blue-500">In Progress</span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-emerald-700 font-medium">Completed Projects</span>
        <p class="text-xl font-bold text-emerald-700 font-mono">{{ statSummary.completedProjects }}</p>
        <span class="text-[10px] text-emerald-600">Phase 1 & Historical</span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-[#008779] font-medium">Financial Cost Savings</span>
        <p class="text-xl font-bold text-[#008779] font-mono">{{ statSummary.totalSavings }}</p>
        <span class="text-[10px] text-emerald-600 font-semibold">Audited ROI</span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-purple-700 font-medium">Avg Yield Gain</span>
        <p class="text-xl font-bold text-purple-700 font-mono">{{ statSummary.avgYieldGain }}</p>
        <span class="text-[10px] text-purple-500">Above Baseline</span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-3.5 space-y-1">
        <span class="text-[11px] text-amber-700 font-medium">Process Capability (Cpk)</span>
        <p class="text-xl font-bold text-amber-700 font-mono">{{ statSummary.avgCpk }}</p>
        <span class="text-[10px] text-amber-600">Stable & Sustained</span>
      </div>
    </div>

    <!-- 4 Visual Analytics Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- 1. Pipeline by DMAIC Phase (8 Cols) -->
      <div class="lg:col-span-8 bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 class="text-sm font-bold text-gray-900">
              DMAIC Phase Progression & Active Funnel
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Active projects distributed across Define, Measure, Analyze, Improve, and Control
            </p>
          </div>
          <span class="text-xs text-gray-500 font-mono font-semibold">42 Active</span>
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
            <rect x="80" y="80" width="50" height="60" rx="4" fill="#60a5fa" />
            <text x="105" y="74" font-size="10" fill="#1e40af" font-weight="bold" text-anchor="middle">8</text>
            <text x="105" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Define</text>

            <!-- Measure -->
            <rect x="180" y="32" width="50" height="108" rx="4" fill="#38bdf8" />
            <text x="205" y="26" font-size="10" fill="#0369a1" font-weight="bold" text-anchor="middle">14</text>
            <text x="205" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Measure</text>

            <!-- Analyze -->
            <rect x="280" y="72" width="50" height="68" rx="4" fill="#a78bfa" />
            <text x="305" y="66" font-size="10" fill="#6d28d9" font-weight="bold" text-anchor="middle">9</text>
            <text x="305" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Analyze</text>

            <!-- Improve -->
            <rect x="380" y="88" width="50" height="52" rx="4" fill="#008779" />
            <text x="405" y="82" font-size="10" fill="#007366" font-weight="bold" text-anchor="middle">7</text>
            <text x="405" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Improve</text>

            <!-- Control -->
            <rect x="480" y="112" width="50" height="28" rx="4" fill="#34d399" />
            <text x="505" y="106" font-size="10" fill="#065f46" font-weight="bold" text-anchor="middle">4</text>
            <text x="505" y="158" font-size="10" fill="#475569" font-weight="bold" text-anchor="middle">Control</text>
          </svg>
        </div>
      </div>

      <!-- 2. Six Sigma Belt Distribution (4 Cols) -->
      <div class="lg:col-span-4 bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-gray-100">
          <h2 class="text-sm font-bold text-gray-900">
            Belt Level Certification
          </h2>
          <span class="text-xs text-gray-500 font-mono">100%</span>
        </div>

        <div class="h-44 flex items-center justify-center">
          <svg class="size-40" viewBox="0 0 100 100">
            <!-- Donut Segments (BB 35%, GB 45%, YB 15%, SME 5%) -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#e2e8f0" stroke-width="16" />
            <!-- BB (35%) - Black / Dark Slate -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#1e293b" stroke-width="16" stroke-dasharray="77 220" stroke-dashoffset="0" />
            <!-- GB (45%) - Green / Emerald -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#059669" stroke-width="16" stroke-dasharray="99 220" stroke-dashoffset="-77" />
            <!-- YB (15%) - Amber / Yellow -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" stroke-width="16" stroke-dasharray="33 220" stroke-dashoffset="-176" />
            <!-- SME (5%) - Purple -->
            <circle cx="50" cy="50" r="35" fill="none" stroke="#8b5cf6" stroke-width="16" stroke-dasharray="11 220" stroke-dashoffset="-209" />
          </svg>
        </div>

        <!-- Legend -->
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-slate-900"></span><span>Black Belt (35%)</span></div>
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-emerald-600"></span><span>Green Belt (45%)</span></div>
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-amber-500"></span><span>Yellow Belt (15%)</span></div>
          <div class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-purple-500"></span><span>SME (5%)</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
