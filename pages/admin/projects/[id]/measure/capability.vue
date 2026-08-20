<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const usl = ref(89.0)
const targetVal = ref(87.15)
const lsl = ref(85.0)

const sampleMean = ref(83.75)
const sampleStdDev = ref(1.42)

// Capability Metrics
const cp = ref(0.47)
const cpk = ref(0.29) // Below 1 -> Trigger Alert & Fishbone export
const pp = ref(0.44)
const ppk = ref(0.27)

const isExportedToFishbone = ref(false)

const exportToFishbone = () => {
  isExportedToFishbone.value = true
}
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
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
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
        <!-- Warning Banner for Cpk < 1 (Module 4 Requirement) -->
        <div v-if="cpk < 1.0" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <h3 class="font-bold text-red-900">
                Process Capability Below Standard (Cpk = {{ cpk }} &lt; 1.0)
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

        <!-- Capability Stat Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Potential Capability (Cp)</span>
            <p class="text-2xl font-bold font-mono text-amber-600">{{ cp }}</p>
            <span class="text-[10px] text-red-600 font-semibold">&lt; 1.33 (Incapable)</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Actual Capability (Cpk)</span>
            <p class="text-2xl font-bold font-mono text-red-600">{{ cpk }}</p>
            <span class="text-[10px] text-red-600 font-semibold">Critical Defect Risk</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Overall Capability (Pp)</span>
            <p class="text-2xl font-bold font-mono text-gray-700">{{ pp }}</p>
            <span class="text-[10px] text-gray-400">Total Variation</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1 text-center">
            <span class="text-[10px] text-gray-500 font-bold uppercase">Overall Index (Ppk)</span>
            <p class="text-2xl font-bold font-mono text-gray-700">{{ ppk }}</p>
            <span class="text-[10px] text-gray-400">Long-term Performance</span>
          </div>
        </div>

        <!-- Capability Histogram & Normal Distribution Curve -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Capability Histogram & Specification Limits
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                LSL = {{ lsl }}%, Target = {{ targetVal }}%, USL = {{ usl }}% | Mean = {{ sampleMean }}%, StDev = {{ sampleStdDev }}
              </p>
            </div>
            <span class="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">
              PPM Total: 198,340
            </span>
          </div>

          <div class="h-60 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center">
            <svg class="w-full h-full" viewBox="0 0 700 200">
              <!-- LSL Line (85.0%) - Red -->
              <line x1="200" y1="20" x2="200" y2="160" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 4" />
              <text x="200" y="15" font-size="10" fill="#dc2626" font-weight="bold" text-anchor="middle">LSL: 85.0%</text>

              <!-- Target Line (87.15%) - Teal -->
              <line x1="450" y1="20" x2="450" y2="160" stroke="#008779" stroke-width="2" />
              <text x="450" y="15" font-size="10" fill="#008779" font-weight="bold" text-anchor="middle">Target: 87.15%</text>

              <!-- USL Line (89.0%) - Red -->
              <line x1="600" y1="20" x2="600" y2="160" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 4" />
              <text x="600" y="15" font-size="10" fill="#dc2626" font-weight="bold" text-anchor="middle">USL: 89.0%</text>

              <!-- Histogram Bars -->
              <rect x="70" y="130" width="30" height="30" fill="#93c5fd" opacity="0.7" />
              <rect x="110" y="90" width="30" height="70" fill="#93c5fd" opacity="0.7" />
              <rect x="150" y="60" width="30" height="100" fill="#93c5fd" opacity="0.7" />
              <rect x="190" y="40" width="30" height="120" fill="#93c5fd" opacity="0.7" />
              <rect x="230" y="70" width="30" height="90" fill="#93c5fd" opacity="0.7" />
              <rect x="270" y="110" width="30" height="50" fill="#93c5fd" opacity="0.7" />

              <!-- Normal Distribution Curve Shifted to the Left (Mean 83.75% below LSL) -->
              <path
                d="M 50,158 Q 150,158 170,90 Q 200,30 210,30 Q 220,30 250,90 Q 270,158 370,158"
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
              />

              <!-- Bottom X Axis -->
              <line x1="40" y1="160" x2="660" y2="160" stroke="#94a3b8" stroke-width="1.5" />
              <text x="210" y="175" font-size="10" fill="#1e40af" font-weight="bold" text-anchor="middle">Mean = 83.75%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
