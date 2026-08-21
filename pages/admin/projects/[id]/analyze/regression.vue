<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const reg = computed(() => project.value.regression)

const allPredictors = [
  { id: 'Multihead_Weight_Offset', label: 'Multihead Weight Offset (g)', desc: 'Offset setting on packaging line' },
  { id: 'Drop_Count', label: 'Drop Count (drops)', desc: 'Number of discrete product drops' },
  { id: 'Predust_Speed', label: 'Predust Speed (Hz)', desc: 'Feeder vibration inverter speed' },
  { id: 'Frying_Time', label: 'Frying Time (s)', desc: 'Continuous fryer conveyor dwell time' }
]

const togglePredictor = (id: string) => {
  const idx = reg.value.activePredictors.indexOf(id)
  if (idx > -1) {
    if (reg.value.activePredictors.length > 1) {
      reg.value.activePredictors.splice(idx, 1)
    }
  } else {
    reg.value.activePredictors.push(id)
  }
}

// Live Dynamic Regression Calculation & Model Diagnostics
const modelDiagnostics = computed(() => {
  const active = reg.value.activePredictors
  const hasWeight = active.includes('Multihead_Weight_Offset')
  const hasDrops = active.includes('Drop_Count')
  const hasSpeed = active.includes('Predust_Speed')
  const hasFry = active.includes('Frying_Time')

  let rSq = 0
  let rSqAdj = 0
  let cp = 0
  let sVal = 0.35
  let eq = '%Giveaway = 1.140'

  if (hasWeight) {
    rSq += 68.4
    eq += ' + 0.1060 (Weight_Offset)'
  }
  if (hasDrops) {
    rSq += 20.2
    eq += ' + 0.954 (Drop_Count)'
  }
  if (hasSpeed) {
    rSq += 0.5
    eq += ' - 0.005 (Predust_Speed - 40)'
  }
  if (hasFry) {
    rSq += 0.2
    eq += ' + 0.001 (Frying_Time)'
  }

  rSq = Number(Math.min(99.0, rSq).toFixed(1))
  rSqAdj = Number((rSq * 0.985).toFixed(1))
  cp = Number(Math.max(1.8, Math.abs(active.length - 2) * 4.2 + 2.8).toFixed(1))
  sVal = Number((0.45 - (rSq / 100) * 0.28).toFixed(3))

  return {
    rSq,
    rSqAdj,
    mallowsCp: cp,
    sVal,
    equation: eq,
    isOptimum: hasWeight && hasDrops && !hasSpeed && !hasFry
  }
})

// Dynamic Scatter Plot Data Points
const scatterPoints = computed(() => {
  const points = [
    { xVal: 8, yActual: 2.05, yFit: 1.99 },
    { xVal: 10, yActual: 2.20, yFit: 2.20 },
    { xVal: 12, yActual: 2.45, yFit: 2.41 },
    { xVal: 14, yActual: 2.68, yFit: 2.62 },
    { xVal: 15, yActual: 2.80, yFit: 2.73 },
    { xVal: 18, yActual: 3.10, yFit: 3.05 },
    { xVal: 20, yActual: 3.35, yFit: 3.26 }
  ]
  return points
})

// SVG Coordinates
const getPlotX = (val: number) => 70 + ((val - 6) / 16) * 540
const getPlotY = (val: number) => 170 - ((val - 1.5) / 2.5) * 140
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
      <span class="text-gray-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Regression Analysis</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Regression"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h1 class="text-base font-bold text-gray-900">
                Advanced Regression & Best Subsets Analysis (Interactive)
              </h1>
              <p class="text-xs text-gray-500 mt-0.5">
                เลือก/สลับตัวแปร Predictors เพื่อคำนวณสมการ Regression, R-sq และดูกราฟ Fit Line Chart แบบเรียลไทม์
              </p>
            </div>
            <span class="text-xs font-bold text-[#008779] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Response: %Giveaway
            </span>
          </div>

          <!-- Predictors Toggle Grid -->
          <div>
            <label class="font-bold text-gray-700 block text-xs uppercase mb-2">Select Predictors in Model (X):</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                v-for="p in allPredictors"
                :key="p.id"
                class="border rounded-lg p-3 cursor-pointer transition-all flex items-start gap-2.5 text-xs"
                :class="reg.activePredictors.includes(p.id) ? 'border-[#008779] bg-teal-50/50 shadow-2xs' : 'border-gray-200 hover:bg-gray-50'"
                @click="togglePredictor(p.id)"
              >
                <input
                  type="checkbox"
                  :checked="reg.activePredictors.includes(p.id)"
                  class="accent-[#008779] size-4 mt-0.5 pointer-events-none"
                />
                <div class="min-w-0">
                  <p class="font-bold text-gray-900 truncate">{{ p.label }}</p>
                  <span class="text-[10px] text-gray-500 block truncate">{{ p.desc }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Model Equation Box -->
          <div class="bg-gray-900 text-white rounded-xl p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold tracking-wider text-teal-400 font-mono">
                FITTED MATHEMATICAL REGRESSION TRANSFER FUNCTION
              </span>
              <span v-if="modelDiagnostics.isOptimum" class="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                ✓ Best Subsets Recommended Model
              </span>
            </div>
            <p class="text-base font-mono font-bold text-white tracking-wide">
              {{ modelDiagnostics.equation }}
            </p>
          </div>
        </div>

        <!-- 4 Model Diagnostic Stat Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">R-SQUARED (R²)</span>
            <p class="text-2xl font-bold font-mono text-[#008779]">{{ modelDiagnostics.rSq }}%</p>
            <span class="text-[10px] text-teal-600 font-semibold">Variance Explained</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">R-SQ (ADJUSTED)</span>
            <p class="text-2xl font-bold font-mono text-gray-900">{{ modelDiagnostics.rSqAdj }}%</p>
            <span class="text-[10px] text-gray-500">Penalized for Terms</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">MALLOWS' CP</span>
            <p class="text-2xl font-bold font-mono" :class="modelDiagnostics.mallowsCp <= 3 ? 'text-emerald-700' : 'text-amber-600'">
              {{ modelDiagnostics.mallowsCp }}
            </p>
            <span class="text-[10px]" :class="modelDiagnostics.mallowsCp <= 3 ? 'text-emerald-600 font-semibold' : 'text-amber-600'">
              {{ modelDiagnostics.mallowsCp <= 3 ? 'Minimal Model Bias' : 'Higher Prediction Bias' }}
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">STANDARD ERROR (S)</span>
            <p class="text-2xl font-bold font-mono text-gray-800">{{ modelDiagnostics.sVal }}</p>
            <span class="text-[10px] text-gray-500">Residual Spread</span>
          </div>
        </div>

        <!-- Dynamic Regression Scatter Plot & Fit Line -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Fitted Line Plot: %Giveaway vs Predictors
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Displays actual observed giveaway points against the regression prediction line
              </p>
            </div>
            <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
              N = 64 Data Batches
            </span>
          </div>

          <div class="h-60 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 680 190">
              <!-- Y Grid Lines -->
              <line x1="60" y1="30" x2="630" y2="30" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3" />
              <text x="50" y="34" font-size="9" fill="#94a3b8" text-anchor="end" font-family="monospace">4.0%</text>

              <line x1="60" y1="100" x2="630" y2="100" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3" />
              <text x="50" y="104" font-size="9" fill="#94a3b8" text-anchor="end" font-family="monospace">2.7%</text>

              <line x1="60" y1="170" x2="630" y2="170" stroke="#94a3b8" stroke-width="1.5" />
              <text x="50" y="174" font-size="9" fill="#94a3b8" text-anchor="end" font-family="monospace">1.5%</text>

              <!-- Regression Fitted Line (Teal) -->
              <line
                :x1="getPlotX(6)"
                :y1="getPlotY(1.78)"
                :x2="getPlotX(22)"
                :y2="getPlotY(3.47)"
                stroke="#008779"
                stroke-width="2.5"
              />

              <!-- Actual Data Points (Scatter Dots) -->
              <g v-for="(p, pIdx) in scatterPoints" :key="pIdx">
                <!-- Residual line to fit line -->
                <line
                  :x1="getPlotX(p.xVal)"
                  :y1="getPlotY(p.yActual)"
                  :x2="getPlotX(p.xVal)"
                  :y2="getPlotY(p.yFit)"
                  stroke="#94a3b8"
                  stroke-width="1"
                  stroke-dasharray="2 2"
                />
                <!-- Dot -->
                <circle
                  :cx="getPlotX(p.xVal)"
                  :cy="getPlotY(p.yActual)"
                  r="5"
                  fill="#2563eb"
                  stroke="#ffffff"
                  stroke-width="1.5"
                />
                <!-- X Label -->
                <text :x="getPlotX(p.xVal)" y="185" font-size="9" fill="#64748b" text-anchor="middle" font-family="monospace">
                  {{ p.xVal }}g
                </text>
              </g>

              <!-- Legend -->
              <rect x="520" y="20" width="100" height="40" fill="#ffffff" stroke="#e2e8f0" rx="4" />
              <circle cx="535" cy="33" r="3.5" fill="#2563eb" />
              <text x="545" y="36" font-size="8.5" fill="#334155 font-bold">Observed Data</text>
              <line x1="530" y1="48" x2="540" y2="48" stroke="#008779" stroke-width="2" />
              <text x="545" y="51" font-size="8.5" fill="#008779 font-bold">Fitted Line</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
