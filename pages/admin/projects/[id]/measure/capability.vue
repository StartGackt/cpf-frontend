<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const {
  project,
  baselineYield,
  capabilityMetrics,
  syncBaselineToCapability
} = useProjectData(projectId)

const cap = computed(() => project.value.capability)

const isExportedToFishbone = ref(false)
const exportToFishbone = () => {
  isExportedToFishbone.value = true
}

// SVG Dynamic Bell Curve & Histogram Coordinates
// Map yield domain (e.g. 78% to 92%) into SVG X (50 to 650)
const domainMin = computed(() => Math.min(cap.value.lsl - 2, cap.value.sampleMean - 3 * cap.value.sampleStdDev - 1))
const domainMax = computed(() => Math.max(cap.value.usl + 2, cap.value.sampleMean + 3 * cap.value.sampleStdDev + 1))

const getX = (val: number) => {
  const range = (domainMax.value - domainMin.value) || 10
  const norm = (val - domainMin.value) / range
  return 60 + norm * 580
}

// Normal probability density function
const normalPdf = (x: number, mean: number, sd: number) => {
  const factor = 1 / (sd * Math.sqrt(2 * Math.PI))
  const exponent = -0.5 * Math.pow((x - mean) / sd, 2)
  return factor * Math.exp(exponent)
}

// Compute SVG path for Gaussian Bell Curve
const bellCurvePath = computed(() => {
  const mean = cap.value.sampleMean
  const sd = Math.max(0.1, cap.value.sampleStdDev)
  const maxPdf = normalPdf(mean, mean, sd) || 1

  const points: string[] = []
  const stepCount = 50
  const step = (domainMax.value - domainMin.value) / stepCount

  for (let i = 0; i <= stepCount; i++) {
    const xVal = domainMin.value + i * step
    const svgX = getX(xVal)
    const pdf = normalPdf(xVal, mean, sd)
    // Map peak height to SVG Y (170 down to 25)
    const svgY = 170 - (pdf / maxPdf) * 140
    points.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`)
  }

  return `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ')
})

// Histogram bar intervals based on sample mean and stdev
const histBars = computed(() => {
  const mean = cap.value.sampleMean
  const sd = Math.max(0.1, cap.value.sampleStdDev)
  const bars = []
  const barCount = 7
  const barWidthVal = sd * 0.8
  const startXVal = mean - 2.8 * sd

  for (let i = 0; i < barCount; i++) {
    const centerVal = startXVal + i * barWidthVal
    const svgX = getX(centerVal - barWidthVal * 0.45)
    const barWidthSvg = getX(centerVal + barWidthVal * 0.45) - svgX
    const pdf = normalPdf(centerVal, mean, sd)
    const maxPdf = normalPdf(mean, mean, sd) || 1
    const barHeight = Math.max(8, (pdf / maxPdf) * 135)
    const svgY = 170 - barHeight
    bars.push({
      x: svgX,
      y: svgY,
      width: Math.max(10, barWidthSvg),
      height: barHeight
    })
  }
  return bars
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
      <span class="text-gray-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Process Capability Analysis</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Capability Analysis"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Warning Banner for Cpk < 1 -->
        <div v-if="capabilityMetrics.isWarning" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <h3 class="font-bold text-red-900">
                Process Capability Below Standard (Cpk = {{ capabilityMetrics.cpk }} &lt; 1.0)
              </h3>
              <p class="text-red-700 mt-0.5">
                The current process produces excessive variation and fails specification limits. Requires root cause investigation.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            :disabled="isExportedToFishbone"
            @click="exportToFishbone"
          >
            <UIcon name="i-lucide-git-branch" class="size-3.5" />
            <span>{{ isExportedToFishbone ? '✓ Added to Fishbone Inbox' : 'Auto-Feed to Fishbone' }}</span>
          </button>
        </div>

        <div v-else class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 class="font-bold text-emerald-900">
                Process Capability Meets Six Sigma Target (Cpk = {{ capabilityMetrics.cpk }} &ge; 1.33)
              </h3>
              <p class="text-emerald-700 mt-0.5">
                Process variation is well contained within specification limits.
              </p>
            </div>
          </div>
        </div>

        <!-- Interactive Parameter Tuning Bar -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <UIcon name="i-lucide-sliders" class="size-4 text-[#008779]" />
              <span>Interactive Specification & Parameter Inputs</span>
            </h2>

            <button
              type="button"
              class="border border-teal-300 bg-teal-50 hover:bg-teal-100 text-[#008779] text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
              @click="syncBaselineToCapability"
            >
              <UIcon name="i-lucide-refresh-cw" class="size-3" />
              <span>Sync Mean from Define Baseline ({{ baselineYield }}%)</span>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label class="font-semibold text-gray-700 block text-[11px] mb-1">Lower Spec Limit (LSL %)</label>
              <input
                v-model.number="cap.lsl"
                type="number"
                step="0.1"
                class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center font-bold focus:border-[#008779] focus:outline-hidden"
              />
            </div>

            <div>
              <label class="font-semibold text-gray-700 block text-[11px] mb-1">Target Value (%)</label>
              <input
                v-model.number="cap.targetVal"
                type="number"
                step="0.05"
                class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center font-bold text-[#008779] focus:border-[#008779] focus:outline-hidden"
              />
            </div>

            <div>
              <label class="font-semibold text-gray-700 block text-[11px] mb-1">Upper Spec Limit (USL %)</label>
              <input
                v-model.number="cap.usl"
                type="number"
                step="0.1"
                class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center font-bold focus:border-[#008779] focus:outline-hidden"
              />
            </div>

            <div>
              <label class="font-semibold text-gray-700 block text-[11px] mb-1">Sample Mean (X̄ %)</label>
              <input
                v-model.number="cap.sampleMean"
                type="number"
                step="0.05"
                class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center font-bold text-blue-700 focus:border-[#008779] focus:outline-hidden"
              />
            </div>

            <div>
              <label class="font-semibold text-gray-700 block text-[11px] mb-1">Sample Std Dev (&sigma;)</label>
              <input
                v-model.number="cap.sampleStdDev"
                type="number"
                step="0.05"
                class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center font-bold focus:border-[#008779] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <!-- Capability Stat Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Potential Capability (Cp)</span>
            <p class="text-2xl font-bold font-mono" :class="capabilityMetrics.cp >= 1.33 ? 'text-emerald-600' : 'text-amber-600'">
              {{ capabilityMetrics.cp }}
            </p>
            <span class="text-[10px]" :class="capabilityMetrics.cp >= 1.33 ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'">
              {{ capabilityMetrics.cp >= 1.33 ? '≥ 1.33 (Capable)' : '< 1.33 (Incapable)' }}
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Actual Capability (Cpk)</span>
            <p class="text-2xl font-bold font-mono" :class="capabilityMetrics.cpk >= 1.33 ? 'text-emerald-600' : 'text-red-600'">
              {{ capabilityMetrics.cpk }}
            </p>
            <span class="text-[10px] font-semibold" :class="capabilityMetrics.cpk >= 1.33 ? 'text-emerald-600' : 'text-red-600'">
              {{ capabilityMetrics.cpk >= 1.33 ? 'Six Sigma Stable' : 'Critical Defect Risk' }}
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Overall Capability (Pp)</span>
            <p class="text-2xl font-bold font-mono text-gray-700">{{ capabilityMetrics.pp }}</p>
            <span class="text-[10px] text-gray-400">Total Variation</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Overall Index (Ppk)</span>
            <p class="text-2xl font-bold font-mono text-gray-700">{{ capabilityMetrics.ppk }}</p>
            <span class="text-[10px] text-gray-400">Long-term Performance</span>
          </div>
        </div>

        <!-- Capability Histogram & Normal Distribution Curve -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Dynamic Capability Histogram & Specification Limits
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                LSL = {{ cap.lsl }}%, Target = {{ cap.targetVal }}%, USL = {{ cap.usl }}% | Mean = {{ cap.sampleMean }}%, StDev = {{ cap.sampleStdDev }}
              </p>
            </div>
            <span class="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">
              PPM Total: {{ capabilityMetrics.ppmTotal.toLocaleString() }}
            </span>
          </div>

          <div class="h-64 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center relative overflow-hidden">
            <svg class="w-full h-full" viewBox="0 0 700 200">
              <!-- LSL Line (Red Dash) -->
              <line :x1="getX(cap.lsl)" y1="20" :x2="getX(cap.lsl)" y2="170" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 4" />
              <text :x="getX(cap.lsl)" y="15" font-size="10" fill="#dc2626" font-weight="bold" text-anchor="middle">LSL: {{ cap.lsl }}%</text>

              <!-- Target Line (Teal) -->
              <line :x1="getX(cap.targetVal)" y1="20" :x2="getX(cap.targetVal)" y2="170" stroke="#008779" stroke-width="2" />
              <text :x="getX(cap.targetVal)" y="15" font-size="10" fill="#008779" font-weight="bold" text-anchor="middle">Target: {{ cap.targetVal }}%</text>

              <!-- USL Line (Red Dash) -->
              <line :x1="getX(cap.usl)" y1="20" :x2="getX(cap.usl)" y2="170" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 4" />
              <text :x="getX(cap.usl)" y="15" font-size="10" fill="#dc2626" font-weight="bold" text-anchor="middle">USL: {{ cap.usl }}%</text>

              <!-- Histogram Bars -->
              <rect
                v-for="(bar, bIdx) in histBars"
                :key="bIdx"
                :x="bar.x"
                :y="bar.y"
                :width="bar.width"
                :height="bar.height"
                fill="#93c5fd"
                opacity="0.65"
                rx="2"
              />

              <!-- Dynamic Normal Distribution Bell Curve -->
              <path
                :d="bellCurvePath"
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
              />

              <!-- Bottom X Axis -->
              <line x1="40" y1="170" x2="660" y2="170" stroke="#94a3b8" stroke-width="1.5" />
              <text :x="getX(cap.sampleMean)" y="188" font-size="10" fill="#1e40af" font-weight="bold" text-anchor="middle">
                Mean = {{ cap.sampleMean }}%
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
