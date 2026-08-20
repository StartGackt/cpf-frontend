<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const activeTab = ref<'scoring' | 'criteria' | 'progress' | 'pareto'>('pareto')
const activeCriteriaTab = ref<'severity' | 'occurrence' | 'detection'>('detection')
const showParetoModal = ref(false)

const rpnRankings = ref([
  {
    selected: true,
    locked: true,
    rank: '#1',
    cause: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    category: 'Method',
    s: 10,
    o: 10,
    d: 10,
    rpn: 1000,
    pctTotal: '14.8%',
    cumulative: '14.8%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#2',
    cause: 'ความเร็วเครื่องเติมแป้งPredust',
    category: 'Method',
    s: 10,
    o: 10,
    d: 7,
    rpn: 700,
    pctTotal: '10.3%',
    cumulative: '25.1%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#3',
    cause: 'ความแรงการสั่นDFของเครื่องMultihead',
    category: 'Method',
    s: 10,
    o: 10,
    d: 7,
    rpn: 700,
    pctTotal: '10.3%',
    cumulative: '35.5%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#4',
    cause: 'จำนวนDropของเครื่องMultihead',
    category: 'Method',
    s: 10,
    o: 10,
    d: 7,
    rpn: 700,
    pctTotal: '10.3%',
    cumulative: '45.8%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#5',
    cause: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    category: 'Method',
    s: 10,
    o: 10,
    d: 7,
    rpn: 700,
    pctTotal: '10.3%',
    cumulative: '56.1%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#6',
    cause: 'ค่า Av น้ำมัน',
    category: 'Material',
    s: 7,
    o: 10,
    d: 7,
    rpn: 490,
    pctTotal: '7.2%',
    cumulative: '63.4%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#7',
    cause: 'ความเร็วรอบเครื่อง DB4',
    category: 'Method',
    s: 7,
    o: 10,
    d: 7,
    rpn: 490,
    pctTotal: '7.2%',
    cumulative: '70.6%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#8',
    cause: 'วางแผนการผลิตไม่ต่อเนื่อง',
    category: 'Method',
    s: 7,
    o: 7,
    d: 10,
    rpn: 490,
    pctTotal: '7.2%',
    cumulative: '77.8%',
    isTop20: true
  },
  {
    selected: true,
    locked: true,
    rank: '#9',
    cause: 'เศษชิ้นเล็ก',
    category: 'Material',
    s: 7,
    o: 10,
    d: 4,
    rpn: 280,
    pctTotal: '4.1%',
    cumulative: '82.0%',
    isTop20: true
  },
  {
    selected: false,
    locked: false,
    rank: '#10',
    cause: 'พนักงานโรยแป้งมากเกินไป',
    category: 'Man',
    s: 4,
    o: 7,
    d: 7,
    rpn: 196,
    pctTotal: '2.9%',
    cumulative: '84.9%',
    isTop20: false
  },
  {
    selected: false,
    locked: false,
    rank: '#11',
    cause: 'น้ำหนักเนื้อ RM ต่อชิ้นสูง',
    category: 'Material',
    s: 4,
    o: 7,
    d: 7,
    rpn: 196,
    pctTotal: '2.9%',
    cumulative: '87.8%',
    isTop20: false
  },
  {
    selected: false,
    locked: false,
    rank: '#12',
    cause: 'พนักงานเติมแป้งร่วงพื้น',
    category: 'Man',
    s: 1,
    o: 10,
    d: 7,
    rpn: 70,
    pctTotal: '1.0%',
    cumulative: '88.8%',
    isTop20: false
  },
  {
    selected: false,
    locked: false,
    rank: '#13',
    cause: 'เครื่อง Multihead เสีย',
    category: 'Machine',
    s: 4,
    o: 4,
    d: 4,
    rpn: 64,
    pctTotal: '0.9%',
    cumulative: '89.7%',
    isTop20: false
  }
])

const severityCriteria = [
  { score: 1, desc: 'มีผลกระทบต่อ Total Yield < 0.5%', example: '-' },
  { score: 4, desc: 'มีผลกระทบต่อ Total Yield 0.6 - 1.0%', example: '-' },
  { score: 7, desc: 'มีผลกระทบต่อ Total Yield 1.1 - 1.5 %', example: '-' },
  { score: 10, desc: 'มีผลกระทบต่อ Total Yield > 1.5 %', example: '-' }
]

const occurrenceCriteria = [
  { score: 1, desc: 'โอกาสเกิดต่ำมาก (< 1 ครั้งต่อเดือน)', example: '-' },
  { score: 4, desc: 'โอกาสเกิดน้อย (1 - 2 ครั้งต่อเดือน)', example: '-' },
  { score: 7, desc: 'โอกาสเกิดปานกลาง (1 - 2 ครั้งต่อสัปดาห์)', example: '-' },
  { score: 10, desc: 'โอกาสเกิดสูงมาก (เกิดทุกวัน/ทุกกะ)', example: '-' }
]

const detectionCriteria = [
  { score: 1, desc: 'มีระบบควบคุม ปฏิบัติตามแผนอย่างสม่ำเสมอ', example: '-' },
  { score: 4, desc: 'มีการควบคุม แต่ไม่ปฏิบัติตามแผนอย่างสม่ำเสมอ', example: '-' },
  { score: 7, desc: 'มีระบบการควบคุม แต่ไม่ปฏิบัติตามแผน', example: '-' },
  { score: 10, desc: 'ไม่มีระบบการควบคุม', example: '-' }
]
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Header Summary Bar -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">
          FMEA Analysis - %Total Yield สินค้าไก่ทอดต่ำ
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Fishbone: <span class="text-[#008779] font-medium">%Total Yield สินค้าไก่ทอดต่ำ</span>
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-gray-700">41/41 causes scored</span>
        <span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          <UIcon name="i-lucide-check-circle" class="size-3.5 text-emerald-500" />
          <span>Complete 100% complete</span>
        </span>
      </div>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="FMEA"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Subtabs Navigation -->
        <div class="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            :class="activeTab === 'scoring' ? 'bg-[#008779] text-white font-semibold' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'"
            @click="activeTab = 'scoring'"
          >
            <UIcon name="i-lucide-clipboard-list" class="size-3.5" />
            <span>Cause Scoring</span>
            <span class="bg-white/20 text-xs px-1.5 rounded-full">41/41</span>
          </button>

          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            :class="activeTab === 'criteria' ? 'bg-[#008779] text-white font-semibold' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'"
            @click="activeTab = 'criteria'"
          >
            <UIcon name="i-lucide-sliders" class="size-3.5" />
            <span>Scoring Criteria</span>
          </button>

          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            :class="activeTab === 'progress' ? 'bg-[#008779] text-white font-semibold' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'"
            @click="activeTab = 'progress'"
          >
            <UIcon name="i-lucide-bar-chart" class="size-3.5" />
            <span>Progress</span>
            <span class="text-xs px-1.5 rounded-full" :class="activeTab === 'progress' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-800'">100%</span>
          </button>

          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            :class="activeTab === 'pareto' ? 'bg-[#008779] text-white font-semibold' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'"
            @click="activeTab = 'pareto'"
          >
            <UIcon name="i-lucide-pie-chart" class="size-3.5" />
            <span>Pareto Analysis</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full" :class="activeTab === 'pareto' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 font-bold'">✓ Ready</span>
          </button>
        </div>

        <!-- TAB 1: PARETO ANALYSIS (Image 3) -->
        <div v-if="activeTab === 'pareto'" class="space-y-6">
          <!-- Stat Summary Cards Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg border border-gray-200/80 p-3.5 shadow-xs flex items-center gap-3">
              <div class="size-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <UIcon name="i-lucide-file-text" class="size-5" />
              </div>
              <div>
                <span class="text-[11px] text-gray-500 font-medium">Scored Causes</span>
                <p class="text-base font-bold text-gray-900">41</p>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200/80 p-3.5 shadow-xs flex items-center gap-3">
              <div class="size-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <UIcon name="i-lucide-target" class="size-5" />
              </div>
              <div>
                <span class="text-[11px] text-gray-500 font-medium">Total RPN</span>
                <p class="text-base font-bold text-gray-900">6,770</p>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200/80 p-3.5 shadow-xs flex items-center gap-3">
              <div class="size-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <UIcon name="i-lucide-alert-triangle" class="size-5" />
              </div>
              <div>
                <span class="text-[11px] text-gray-500 font-medium">High Risk (RPN > 200)</span>
                <p class="text-base font-bold text-gray-900">9</p>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200/80 p-3.5 shadow-xs flex items-center gap-3">
              <div class="size-9 rounded-lg bg-teal-50 text-[#008779] flex items-center justify-center">
                <UIcon name="i-lucide-bar-chart-2" class="size-5" />
              </div>
              <div>
                <span class="text-[11px] text-gray-500 font-medium">Top 20% Impact</span>
                <p class="text-base font-bold text-[#008779]">82%</p>
              </div>
            </div>
          </div>

          <!-- RPN Rankings Table Card -->
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
            <!-- Header & Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
              <div>
                <h2 class="text-base font-bold text-gray-900">
                  RPN Rankings (Pareto Analysis)
                </h2>
                <p class="text-xs text-gray-500 mt-0.5">
                  Causes ranked by Risk Priority Number (RPN) using 80/20 Pareto principle
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  @click="showParetoModal = true"
                >
                  <UIcon name="i-lucide-eye" class="size-3.5" />
                  <span>View Pareto Chart</span>
                </button>

                <button
                  type="button"
                  class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>Export</span>
                  <UIcon name="i-lucide-chevron-down" class="size-3 text-gray-500" />
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                    <th class="py-3 px-3 font-semibold text-center w-20">SELECTED</th>
                    <th class="py-3 px-3 font-semibold w-16">RANK</th>
                    <th class="py-3 px-4 font-semibold">CAUSE</th>
                    <th class="py-3 px-3 font-semibold w-28">CATEGORY</th>
                    <th class="py-3 px-2 font-semibold text-center w-10">S</th>
                    <th class="py-3 px-2 font-semibold text-center w-10">O</th>
                    <th class="py-3 px-2 font-semibold text-center w-10">D</th>
                    <th class="py-3 px-3 font-semibold text-center w-16">RPN</th>
                    <th class="py-3 px-3 font-semibold text-center w-24">% OF TOTAL</th>
                    <th class="py-3 px-3 font-semibold text-center w-28">CUMULATIVE %</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="item in rpnRankings"
                    :key="item.rank"
                    :class="item.isTop20 ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-gray-50/50'"
                  >
                    <!-- Selected / Lock Icon -->
                    <td class="py-3 px-3 text-center">
                      <div v-if="item.selected" class="inline-flex items-center gap-1 text-emerald-600">
                        <UIcon name="i-lucide-check" class="size-3.5" />
                        <UIcon v-if="item.locked" name="i-lucide-lock" class="size-3 text-red-400" />
                      </div>
                    </td>

                    <!-- Rank -->
                    <td class="py-3 px-3 font-bold text-gray-700">
                      {{ item.rank }}
                    </td>

                    <!-- Cause -->
                    <td class="py-3 px-4 font-medium text-gray-900">
                      {{ item.cause }}
                    </td>

                    <!-- Category -->
                    <td class="py-3 px-3 text-gray-600">
                      {{ item.category }}
                    </td>

                    <!-- S, O, D Scores -->
                    <td class="py-3 px-2 text-center text-gray-700 font-mono">{{ item.s }}</td>
                    <td class="py-3 px-2 text-center text-gray-700 font-mono">{{ item.o }}</td>
                    <td class="py-3 px-2 text-center text-gray-700 font-mono">{{ item.d }}</td>

                    <!-- RPN Value with color badge -->
                    <td class="py-3 px-3 text-center font-bold font-mono">
                      <span
                        v-if="item.rpn >= 280"
                        class="text-red-600"
                      >
                        {{ item.rpn }}
                      </span>
                      <span
                        v-else-if="item.rpn >= 100"
                        class="text-amber-600"
                      >
                        {{ item.rpn }}
                      </span>
                      <span
                        v-else
                        class="text-emerald-600"
                      >
                        {{ item.rpn }}
                      </span>
                    </td>

                    <!-- % of Total -->
                    <td class="py-3 px-3 text-center text-gray-600 font-mono">
                      {{ item.pctTotal }}
                    </td>

                    <!-- Cumulative % -->
                    <td class="py-3 px-3 text-center font-semibold font-mono" :class="item.isTop20 ? 'text-red-700' : 'text-gray-700'">
                      {{ item.cumulative }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: SCORING CRITERIA (Images 4 & 5) -->
        <div v-else-if="activeTab === 'criteria'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
            <h2 class="text-base font-bold text-gray-900">
              FMEA Scoring Criteria
            </h2>

            <!-- Analysis Complete Lock Banner -->
            <div class="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <UIcon name="i-lucide-info" class="size-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 class="text-xs font-bold text-blue-900">
                  Analysis Complete
                </h4>
                <p class="text-xs text-blue-700 mt-0.5">
                  This FMEA analysis is complete. Scoring criteria are locked and cannot be modified.
                </p>
              </div>
            </div>

            <!-- Scoring Subtabs: Severity, Occurrence, Detection -->
            <div class="flex items-center gap-6 border-b border-gray-200 text-xs">
              <button
                type="button"
                class="pb-2.5 font-semibold transition-colors border-b-2"
                :class="activeCriteriaTab === 'severity' ? 'border-[#008779] text-[#008779]' : 'border-transparent text-gray-500 hover:text-gray-800'"
                @click="activeCriteriaTab = 'severity'"
              >
                Severity
              </button>

              <button
                type="button"
                class="pb-2.5 font-semibold transition-colors border-b-2"
                :class="activeCriteriaTab === 'occurrence' ? 'border-[#008779] text-[#008779]' : 'border-transparent text-gray-500 hover:text-gray-800'"
                @click="activeCriteriaTab = 'occurrence'"
              >
                Occurrence
              </button>

              <button
                type="button"
                class="pb-2.5 font-semibold transition-colors border-b-2"
                :class="activeCriteriaTab === 'detection' ? 'border-[#008779] text-[#008779]' : 'border-transparent text-gray-500 hover:text-gray-800'"
                @click="activeCriteriaTab = 'detection'"
              >
                Detection
              </button>
            </div>

            <!-- Criteria Tables -->
            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                    <th class="py-3 px-4 font-semibold w-24">SCORE</th>
                    <th class="py-3 px-6 font-semibold">DESCRIPTION</th>
                    <th class="py-3 px-6 font-semibold w-48">EXAMPLE</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <template v-if="activeCriteriaTab === 'severity'">
                    <tr v-for="c in severityCriteria" :key="c.score" class="hover:bg-gray-50/50">
                      <td class="py-3.5 px-4 font-bold text-gray-900 font-mono">{{ c.score }}</td>
                      <td class="py-3.5 px-6 text-gray-800 font-medium">{{ c.desc }}</td>
                      <td class="py-3.5 px-6 text-gray-400">{{ c.example }}</td>
                    </tr>
                  </template>

                  <template v-else-if="activeCriteriaTab === 'occurrence'">
                    <tr v-for="c in occurrenceCriteria" :key="c.score" class="hover:bg-gray-50/50">
                      <td class="py-3.5 px-4 font-bold text-gray-900 font-mono">{{ c.score }}</td>
                      <td class="py-3.5 px-6 text-gray-800 font-medium">{{ c.desc }}</td>
                      <td class="py-3.5 px-6 text-gray-400">{{ c.example }}</td>
                    </tr>
                  </template>

                  <template v-else-if="activeCriteriaTab === 'detection'">
                    <tr v-for="c in detectionCriteria" :key="c.score" class="hover:bg-gray-50/50">
                      <td class="py-3.5 px-4 font-bold text-gray-900 font-mono">{{ c.score }}</td>
                      <td class="py-3.5 px-6 text-gray-800 font-medium">{{ c.desc }}</td>
                      <td class="py-3.5 px-6 text-gray-400">{{ c.example }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 3: CAUSE SCORING (Image 1) -->
        <div v-else-if="activeTab === 'scoring'" class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
            <!-- Top Scoring Progress Bar -->
            <div class="space-y-1.5 pb-2">
              <div class="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Scoring Progress</span>
                <span class="text-emerald-700 font-bold">100%</span>
              </div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div class="bg-[#008779] h-full w-full rounded-full"></div>
              </div>
            </div>

            <!-- Analysis Complete Lock Banner -->
            <div class="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <UIcon name="i-lucide-info" class="size-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 class="text-xs font-bold text-blue-900">
                  Analysis Complete
                </h4>
                <p class="text-xs text-blue-700 mt-0.5">
                  This FMEA analysis is complete. Cause scoring is locked and cannot be modified.
                </p>
              </div>
            </div>

            <!-- Cause Scoring Table (Image 1) -->
            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                    <th class="py-3 px-3 w-12 text-center">#</th>
                    <th class="py-3 px-4 w-32">CATEGORY</th>
                    <th class="py-3 px-6">CAUSE DESCRIPTION</th>
                    <th class="py-3 px-3 text-center w-28">SEVERITY (S)</th>
                    <th class="py-3 px-3 text-center w-28">OCCURRENCE (O)</th>
                    <th class="py-3 px-3 text-center w-28">DETECTION (D)</th>
                    <th class="py-3 px-3 text-center w-20">RPN</th>
                    <th class="py-3 px-4 text-center w-28">STATUS</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="(cause, idx) in [
                      { cat: 'Environment', desc: 'ความชื้น', s: 1, o: 4, d: 4, rpn: 16 },
                      { cat: 'Environment', desc: 'แสงสว่างไม่เหมาะสม', s: 1, o: 1, d: 1, rpn: 1 },
                      { cat: 'Environment', desc: 'อุณหภูมิห้อง Cooking สูง', s: 1, o: 4, d: 10, rpn: 40 },
                      { cat: 'Machine', desc: 'เครื่องแป้งเพลาขาด', s: 1, o: 4, d: 4, rpn: 16 },
                      { cat: 'Machine', desc: 'เครื่องเติมแป้งเสีย', s: 1, o: 4, d: 4, rpn: 16 },
                      { cat: 'Machine', desc: 'เครื่องแป้งเสียดสีพบโลหะ', s: 1, o: 4, d: 4, rpn: 16 },
                      { cat: 'Machine', desc: 'สายพานลำเลียง Cooling ไม่เดิน', s: 4, o: 1, d: 1, rpn: 4 },
                      { cat: 'Machine', desc: 'Fryer หยุดเดิน', s: 1, o: 4, d: 4, rpn: 16 },
                      { cat: 'Machine', desc: 'Hot air หยุดเดิน', s: 1, o: 4, d: 4, rpn: 16 },
                      { cat: 'Machine', desc: 'สายพานIQFเสียดสีเกิดโลหะ', s: 1, o: 4, d: 4, rpn: 16 }
                    ]"
                    :key="idx"
                    class="hover:bg-gray-50/50"
                  >
                    <td class="py-3 px-3 text-center text-gray-500 font-mono">{{ idx + 1 }}</td>
                    <td class="py-3 px-4 font-medium text-gray-600">{{ cause.cat }}</td>
                    <td class="py-3 px-6 font-medium text-gray-900">{{ cause.desc }}</td>
                    <td class="py-2 px-3 text-center">
                      <div class="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-center font-mono text-gray-800 text-xs inline-block w-12">
                        {{ cause.s }}
                      </div>
                    </td>
                    <td class="py-2 px-3 text-center">
                      <div class="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-center font-mono text-gray-800 text-xs inline-block w-12">
                        {{ cause.o }}
                      </div>
                    </td>
                    <td class="py-2 px-3 text-center">
                      <div class="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-center font-mono text-gray-800 text-xs inline-block w-12">
                        {{ cause.d }}
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-700 font-mono">
                      {{ cause.rpn }}
                    </td>
                    <td class="py-3 px-4 text-center">
                      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
                        <span>Complete</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 4: PROGRESS TAB -->
        <div v-else class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-900">
            FMEA Analysis Progress
          </h2>
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-800">Status: All 41 Causes Scored & Ranked</span>
            <span class="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded shadow-xs">100% Complete</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PARETO ANALYSIS MODAL (Image 2) -->
    <div
      v-if="showParetoModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">
            Pareto Analysis
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1 transition-colors"
            @click="showParetoModal = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <!-- 3 Stats Cards Row -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-3">
              <span class="text-[11px] text-gray-500">Total Factors</span>
              <p class="text-xl font-bold text-gray-900 mt-0.5">41</p>
            </div>
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-3">
              <span class="text-[11px] text-gray-500">Cumulative %</span>
              <p class="text-xl font-bold text-gray-900 mt-0.5">82.0%</p>
            </div>
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-3">
              <span class="text-[11px] text-gray-500">Selected Causes</span>
              <p class="text-xl font-bold text-gray-900 mt-0.5">10</p>
            </div>
          </div>

          <!-- Pareto Chart SVG (Image 2) -->
          <div class="h-80 w-full relative p-2 border border-gray-100 rounded-lg">
            <svg class="w-full h-full" viewBox="0 0 760 300">
              <!-- Left Y-Axis (RPN Value) -->
              <line x1="50" y1="20" x2="50" y2="230" stroke="#cbd5e1" stroke-width="1.5" />
              <text x="15" y="125" font-size="10" fill="#475569" text-anchor="middle" transform="rotate(-90 15 125)" font-weight="600">
                RPN Value
              </text>
              <text x="42" y="25" font-size="8" fill="#64748b" text-anchor="end">1,000</text>
              <text x="42" y="65" font-size="8" fill="#64748b" text-anchor="end">800</text>
              <text x="42" y="105" font-size="8" fill="#64748b" text-anchor="end">600</text>
              <text x="42" y="145" font-size="8" fill="#64748b" text-anchor="end">400</text>
              <text x="42" y="185" font-size="8" fill="#64748b" text-anchor="end">200</text>
              <text x="42" y="230" font-size="8" fill="#64748b" text-anchor="end">0</text>

              <!-- Right Y-Axis (Cumulative %) -->
              <line x1="710" y1="20" x2="710" y2="230" stroke="#cbd5e1" stroke-width="1.5" />
              <text x="745" y="125" font-size="10" fill="#475569" text-anchor="middle" transform="rotate(90 745 125)" font-weight="600">
                Cumulative %
              </text>
              <text x="718" y="25" font-size="8" fill="#64748b">100</text>
              <text x="718" y="65" font-size="8" fill="#64748b">80</text>
              <text x="718" y="105" font-size="8" fill="#64748b">60</text>
              <text x="718" y="145" font-size="8" fill="#64748b">40</text>
              <text x="718" y="185" font-size="8" fill="#64748b">20</text>
              <text x="718" y="230" font-size="8" fill="#64748b">0</text>

              <!-- 80% Horizontal Dashed Threshold Line -->
              <line x1="50" y1="65" x2="710" y2="65" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 3" />
              <text x="695" y="60" font-size="9" fill="#06b6d4" font-weight="bold">80%</text>

              <!-- Bottom X-Axis line -->
              <line x1="50" y1="230" x2="710" y2="230" stroke="#cbd5e1" stroke-width="1.5" />

              <!-- BARS (RPN Value) -->
              <!-- Bar 1 (1000) Mandatory Blue -->
              <rect x="58" y="20" width="16" height="210" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 2 (700) -->
              <rect x="78" y="85" width="16" height="145" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 3 (700) -->
              <rect x="98" y="85" width="16" height="145" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 4 (700) -->
              <rect x="118" y="85" width="16" height="145" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 5 (700) -->
              <rect x="138" y="85" width="16" height="145" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 6 (490) -->
              <rect x="158" y="128" width="16" height="102" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 7 (490) -->
              <rect x="178" y="128" width="16" height="102" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 8 (490) -->
              <rect x="198" y="128" width="16" height="102" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />
              <!-- Bar 9 (280) -->
              <rect x="218" y="172" width="16" height="58" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1" />

              <!-- Gray Unselected Bars (>80%) -->
              <rect x="238" y="188" width="16" height="42" fill="#94a3b8" />
              <rect x="258" y="210" width="16" height="20" fill="#94a3b8" />
              <rect x="278" y="210" width="16" height="20" fill="#94a3b8" />
              <rect x="298" y="210" width="16" height="20" fill="#94a3b8" />
              <rect x="318" y="210" width="16" height="20" fill="#94a3b8" />
              <rect x="338" y="210" width="16" height="20" fill="#94a3b8" />
              <rect x="358" y="210" width="16" height="20" fill="#94a3b8" />
              <!-- Optional Purple Bar -->
              <rect x="378" y="205" width="16" height="25" fill="#6366f1" />
              <rect x="398" y="218" width="16" height="12" fill="#94a3b8" />
              <rect x="418" y="222" width="16" height="8" fill="#94a3b8" />
              <rect x="438" y="222" width="16" height="8" fill="#94a3b8" />
              <rect x="458" y="224" width="16" height="6" fill="#94a3b8" />
              <rect x="478" y="224" width="16" height="6" fill="#94a3b8" />
              <rect x="498" y="226" width="16" height="4" fill="#94a3b8" />
              <rect x="518" y="226" width="16" height="4" fill="#94a3b8" />
              <rect x="538" y="226" width="16" height="4" fill="#94a3b8" />
              <rect x="558" y="226" width="16" height="4" fill="#94a3b8" />
              <rect x="578" y="226" width="16" height="4" fill="#94a3b8" />
              <rect x="598" y="228" width="16" height="2" fill="#94a3b8" />
              <rect x="618" y="228" width="16" height="2" fill="#94a3b8" />
              <rect x="638" y="228" width="16" height="2" fill="#94a3b8" />
              <rect x="658" y="228" width="16" height="2" fill="#94a3b8" />
              <rect x="678" y="228" width="16" height="2" fill="#94a3b8" />

              <!-- Cumulative Line (Red with Circles) -->
              <polyline
                points="66,198 86,176 106,155 126,134 146,112 166,97 186,82 206,68 226,60 246,55 266,51 286,47 306,44 326,42 346,40 366,38 386,37 406,36 426,35 446,34 466,33 486,32 506,31 526,30 546,29 566,28 586,28 606,27 626,26 646,26 666,25 686,25 706,25"
                fill="none"
                stroke="#ef4444"
                stroke-width="2"
              />
              <circle cx="66" cy="198" r="2.5" fill="#ef4444" />
              <circle cx="86" cy="176" r="2.5" fill="#ef4444" />
              <circle cx="106" cy="155" r="2.5" fill="#ef4444" />
              <circle cx="126" cy="134" r="2.5" fill="#ef4444" />
              <circle cx="146" cy="112" r="2.5" fill="#ef4444" />
              <circle cx="166" cy="97" r="2.5" fill="#ef4444" />
              <circle cx="186" cy="82" r="2.5" fill="#ef4444" />
              <circle cx="206" cy="68" r="2.5" fill="#ef4444" />
              <circle cx="226" cy="60" r="2.5" fill="#ef4444" />
              <circle cx="246" cy="55" r="2.5" fill="#ef4444" />
              <circle cx="266" cy="51" r="2.5" fill="#ef4444" />
              <circle cx="286" cy="47" r="2.5" fill="#ef4444" />
              <circle cx="306" cy="44" r="2.5" fill="#ef4444" />
              <circle cx="326" cy="42" r="2.5" fill="#ef4444" />
              <circle cx="346" cy="40" r="2.5" fill="#ef4444" />
              <circle cx="366" cy="38" r="2.5" fill="#ef4444" />
              <circle cx="386" cy="37" r="2.5" fill="#ef4444" />
              <circle cx="406" cy="36" r="2.5" fill="#ef4444" />
              <circle cx="426" cy="35" r="2.5" fill="#ef4444" />
              <circle cx="446" cy="34" r="2.5" fill="#ef4444" />
              <circle cx="466" cy="33" r="2.5" fill="#ef4444" />
              <circle cx="486" cy="32" r="2.5" fill="#ef4444" />
              <circle cx="506" cy="31" r="2.5" fill="#ef4444" />
              <circle cx="526" cy="30" r="2.5" fill="#ef4444" />
              <circle cx="546" cy="29" r="2.5" fill="#ef4444" />
              <circle cx="566" cy="28" r="2.5" fill="#ef4444" />
              <circle cx="586" cy="28" r="2.5" fill="#ef4444" />
              <circle cx="606" cy="27" r="2.5" fill="#ef4444" />
              <circle cx="626" cy="26" r="2.5" fill="#ef4444" />
              <circle cx="646" cy="26" r="2.5" fill="#ef4444" />
              <circle cx="666" cy="25" r="2.5" fill="#ef4444" />
              <circle cx="686" cy="25" r="2.5" fill="#ef4444" />
              <circle cx="706" cy="25" r="2.5" fill="#ef4444" />
            </svg>
          </div>

          <!-- Legend (Matching Image 2) -->
          <div class="flex items-center justify-center gap-6 text-xs text-gray-600 pt-2 border-t border-gray-100 flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="size-3 rounded-xs bg-[#3b82f6]"></span>
              <span>Mandatory &lt; 80%</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="size-3 rounded-xs bg-[#6366f1]"></span>
              <span>Selected Optional (&gt;80%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="size-3 rounded-xs bg-[#94a3b8]"></span>
              <span>Unselected (&gt;80%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-0.5 bg-[#ef4444]"></span>
              <span>— Cumulative %</span>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="showParetoModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
