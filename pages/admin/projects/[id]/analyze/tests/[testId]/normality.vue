<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const testId = (route.params.testId as string) || 'weight-multihead'

const isWeightTest = computed(() => testId.includes('weight'))

const factorName = computed(() =>
  isWeightTest.value ? 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead' : 'จำนวนDropของเครื่องMultihead'
)

const level1Header = computed(() =>
  isWeightTest.value
    ? 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead 10 กรัม'
    : 'จำนวนDropของเครื่องMultihead 1 drop'
)

const level2Header = computed(() =>
  isWeightTest.value
    ? 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead 20 กรัม'
    : 'จำนวนDropของเครื่องMultihead 2 drop'
)

const level1Summary = computed(() =>
  isWeightTest.value ? 'Summary Report for 10 กรัม' : 'Summary Report for 1 drop'
)

const level2Summary = computed(() =>
  isWeightTest.value ? 'Summary Report for 20 กรัม' : 'Summary Report for 2 drop'
)
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Top Stepper Bar (3 Steps) -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-3 flex items-center justify-center gap-6 shadow-xs text-xs">
      <NuxtLink
        :to="`/admin/projects/${projectId}/analyze/tests/${testId}/data-entry`"
        class="flex items-center gap-2 text-emerald-700 font-semibold hover:underline"
      >
        <span class="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">✓</span>
        <span>Configure Test</span>
      </NuxtLink>

      <div class="w-16 h-0.5 bg-emerald-400"></div>

      <NuxtLink
        :to="`/admin/projects/${projectId}/analyze/tests/${testId}/data-entry`"
        class="flex items-center gap-2 text-emerald-700 font-semibold hover:underline"
      >
        <span class="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">✓</span>
        <span>Enter Data</span>
      </NuxtLink>

      <div class="w-16 h-0.5 bg-emerald-400"></div>

      <div class="flex items-center gap-2 text-[#008779] font-bold">
        <span class="size-5 rounded-full bg-[#008779] text-white flex items-center justify-center text-[11px]">3</span>
        <span>Test Results</span>
      </div>
    </div>

    <!-- Version Management Card -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h3 class="text-xs font-bold text-gray-900">Version Management</h3>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Version 1
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Significant
          </span>
        </div>
        <div class="w-full sm:w-80">
          <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#008779]">
            <option>Version 1 (Active) - Significant</option>
            <option>Version 2 - Draft</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        class="border border-[#008779] text-[#008779] hover:bg-teal-50 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
      >
        <UIcon name="i-lucide-plus" class="size-3.5" />
        <span>New Version</span>
      </button>
    </div>

    <!-- Factor Header Bar -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/hypothesis`"
          class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#008779] font-medium transition-colors mb-1.5"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to Hypothesis Testing</span>
        </NuxtLink>

        <h1 class="text-xl font-bold text-gray-900 tracking-tight">
          Factor: {{ factorName }}
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Response: %Giveaway
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/tests/${testId}/data-entry`"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-eye" class="size-3.5 text-gray-500" />
          <span>View Data</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Export</span>
        </button>

        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/hypothesis`"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-check" class="size-3.5" />
          <span>Done</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Hypothesis Testing"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Test Tabs -->
        <div class="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#008779] text-white shadow-xs"
          >
            Normality Test
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Variance Test
          </button>
          <NuxtLink
            :to="`/admin/projects/${projectId}/analyze/tests/${testId}`"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            2-Sample T Test
          </NuxtLink>
        </div>

        <!-- 2-Column Comparison Layout (Matching Image 1) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 1. Left Column (10 กรัม / 1 drop) -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            <!-- Top Yellow Banner -->
            <div class="bg-amber-100/80 px-4 py-2 border-b border-amber-200">
              <h2 class="text-xs font-bold text-gray-900 truncate">
                {{ level1Header }}
              </h2>
            </div>

            <div class="p-5 space-y-6">
              <h3 class="text-xs font-bold text-gray-800">
                {{ level1Summary }}
              </h3>

              <!-- Data Distribution Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <!-- Histogram SVG (7 cols) -->
                <div class="sm:col-span-7 space-y-2">
                  <span class="text-xs font-bold text-gray-800 block">Data Distribution</span>
                  <div class="h-44 border border-gray-100 rounded p-2 flex items-center justify-center">
                    <svg class="w-full h-full" viewBox="0 0 200 130">
                      <line x1="25" y1="10" x2="25" y2="105" stroke="#cbd5e1" stroke-width="1" />
                      <line x1="25" y1="105" x2="190" y2="105" stroke="#cbd5e1" stroke-width="1" />

                      <text x="20" y="15" font-size="7" fill="#64748b" text-anchor="end">7.0</text>
                      <text x="20" y="45" font-size="7" fill="#64748b" text-anchor="end">4.0</text>
                      <text x="20" y="75" font-size="7" fill="#64748b" text-anchor="end">2.0</text>
                      <text x="20" y="105" font-size="7" fill="#64748b" text-anchor="end">0.0</text>

                      <rect x="35" y="85" width="18" height="20" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="55" y="70" width="18" height="35" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="75" y="45" width="18" height="60" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="95" y="30" width="18" height="75" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="115" y="55" width="18" height="50" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="135" y="20" width="18" height="85" fill="#60a5fa" stroke="#3b82f6" />

                      <path d="M 30,100 Q 95,25 155,95" fill="none" stroke="#ef4444" stroke-width="1.5" />
                      <text x="110" y="120" font-size="7" fill="#64748b" text-anchor="middle">Value</text>
                    </svg>
                  </div>

                  <div class="grid grid-cols-2 text-[10px] text-gray-500 pt-1 font-mono">
                    <div>Mean: <span class="font-bold text-gray-800">2.5953</span></div>
                    <div>Std Dev: <span class="font-bold text-gray-800">0.1439</span></div>
                    <div>Median: <span class="font-bold text-gray-800">2.5950</span></div>
                    <div>Count: <span class="font-bold text-gray-800">32</span></div>
                  </div>
                </div>

                <!-- Anderson-Darling Metrics (5 cols) -->
                <div class="sm:col-span-5 bg-teal-50/40 border border-teal-200/80 rounded-md p-3 text-[10px] space-y-1">
                  <div class="font-bold text-gray-900 border-b border-teal-200 pb-1 text-[11px]">
                    Anderson-Darling Normality Test
                  </div>
                  <div class="flex justify-between pt-1">
                    <span class="text-gray-600">P-Value:</span>
                    <span class="font-bold text-emerald-700 bg-emerald-100 px-1 rounded">0.168</span>
                  </div>
                  <div class="flex justify-between"><span class="text-gray-500">A-Squared:</span><span class="font-mono text-gray-800">0.52</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Mean:</span><span class="font-mono text-gray-800">2.595</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">StdDev:</span><span class="font-mono text-gray-800">0.144</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Variance:</span><span class="font-mono text-gray-800">0.021</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Median:</span><span class="font-mono text-gray-800">2.595</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">N:</span><span class="font-mono text-gray-800">32</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Minimum:</span><span class="font-mono text-gray-800">2.250</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">1st Quartile:</span><span class="font-mono text-gray-800">2.520</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">3rd Quartile:</span><span class="font-mono text-gray-800">2.738</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Maximum:</span><span class="font-mono text-gray-800">2.800</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Skewness:</span><span class="font-mono text-gray-800">-0.58672</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Kurtosis:</span><span class="font-mono text-gray-800">-0.19794</span></div>

                  <div class="pt-2 border-t border-teal-200 font-bold text-gray-800 text-[10px]">
                    95% Confidence Intervals
                  </div>
                  <div class="flex justify-between"><span class="text-gray-500">Mean:</span><span class="font-mono text-gray-800">2.543 - 2.647</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Median:</span><span class="font-mono text-gray-800">2.560 - 2.700</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">StdDev:</span><span class="font-mono text-gray-800">0.115 - 0.191</span></div>
                </div>
              </div>

              <!-- Box Plot Analysis Bottom -->
              <div class="space-y-2 pt-4 border-t border-gray-100">
                <span class="text-xs font-bold text-gray-800 block">Box Plot Analysis</span>
                <div class="h-28 border border-gray-100 rounded p-2 flex items-center justify-center">
                  <svg class="w-full h-full" viewBox="0 0 260 80">
                    <line x1="30" y1="60" x2="240" y2="60" stroke="#cbd5e1" stroke-width="1" />
                    <text x="40" y="72" font-size="7" fill="#64748b">2.2</text>
                    <text x="85" y="72" font-size="7" fill="#64748b">2.4</text>
                    <text x="130" y="72" font-size="7" fill="#64748b">2.6</text>
                    <text x="175" y="72" font-size="7" fill="#64748b">2.8</text>
                    <text x="220" y="72" font-size="7" fill="#64748b">2.9</text>

                    <line x1="45" y1="35" x2="110" y2="35" stroke="#64748b" stroke-width="1.2" />
                    <line x1="45" y1="28" x2="45" y2="42" stroke="#64748b" stroke-width="1.2" />
                    <line x1="165" y1="35" x2="200" y2="35" stroke="#64748b" stroke-width="1.2" />
                    <line x1="200" y1="28" x2="200" y2="42" stroke="#64748b" stroke-width="1.2" />
                    <rect x="110" y="22" width="55" height="26" fill="#93c5fd" stroke="#3b82f6" />
                    <line x1="130" y1="22" x2="130" y2="48" stroke="#1d4ed8" stroke-width="1.8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Right Column (20 กรัม / 2 drop) -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            <!-- Top Yellow Banner -->
            <div class="bg-amber-100/80 px-4 py-2 border-b border-amber-200">
              <h2 class="text-xs font-bold text-gray-900 truncate">
                {{ level2Header }}
              </h2>
            </div>

            <div class="p-5 space-y-6">
              <h3 class="text-xs font-bold text-gray-800">
                {{ level2Summary }}
              </h3>

              <!-- Data Distribution Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div class="sm:col-span-7 space-y-2">
                  <span class="text-xs font-bold text-gray-800 block">Data Distribution</span>
                  <div class="h-44 border border-gray-100 rounded p-2 flex items-center justify-center">
                    <svg class="w-full h-full" viewBox="0 0 200 130">
                      <line x1="25" y1="10" x2="25" y2="105" stroke="#cbd5e1" stroke-width="1" />
                      <line x1="25" y1="105" x2="190" y2="105" stroke="#cbd5e1" stroke-width="1" />

                      <text x="20" y="15" font-size="7" fill="#64748b" text-anchor="end">12</text>
                      <text x="20" y="45" font-size="7" fill="#64748b" text-anchor="end">8</text>
                      <text x="20" y="75" font-size="7" fill="#64748b" text-anchor="end">4</text>
                      <text x="20" y="105" font-size="7" fill="#64748b" text-anchor="end">0</text>

                      <rect x="35" y="95" width="16" height="10" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="53" y="85" width="16" height="20" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="71" y="75" width="16" height="30" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="89" y="15" width="16" height="90" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="107" y="65" width="16" height="40" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="125" y="95" width="16" height="10" fill="#60a5fa" stroke="#3b82f6" />
                      <rect x="143" y="65" width="16" height="40" fill="#60a5fa" stroke="#3b82f6" />

                      <path d="M 30,100 Q 98,35 160,95" fill="none" stroke="#ef4444" stroke-width="1.5" />
                      <text x="110" y="120" font-size="7" fill="#64748b" text-anchor="middle">Value</text>
                    </svg>
                  </div>

                  <div class="grid grid-cols-2 text-[10px] text-gray-500 pt-1 font-mono">
                    <div>Mean: <span class="font-bold text-gray-800">2.3303</span></div>
                    <div>Std Dev: <span class="font-bold text-gray-800">0.2909</span></div>
                    <div>Median: <span class="font-bold text-gray-800">2.3250</span></div>
                    <div>Count: <span class="font-bold text-gray-800">32</span></div>
                  </div>
                </div>

                <!-- Anderson-Darling Metrics -->
                <div class="sm:col-span-5 bg-teal-50/40 border border-teal-200/80 rounded-md p-3 text-[10px] space-y-1">
                  <div class="font-bold text-gray-900 border-b border-teal-200 pb-1 text-[11px]">
                    Anderson-Darling Normality Test
                  </div>
                  <div class="flex justify-between pt-1">
                    <span class="text-gray-600">P-Value:</span>
                    <span class="font-bold text-emerald-700 bg-emerald-100 px-1 rounded">0.212</span>
                  </div>
                  <div class="flex justify-between"><span class="text-gray-500">A-Squared:</span><span class="font-mono text-gray-800">0.49</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Mean:</span><span class="font-mono text-gray-800">2.330</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">StdDev:</span><span class="font-mono text-gray-800">0.291</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Variance:</span><span class="font-mono text-gray-800">0.085</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Median:</span><span class="font-mono text-gray-800">2.325</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">N:</span><span class="font-mono text-gray-800">32</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Minimum:</span><span class="font-mono text-gray-800">1.600</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">1st Quartile:</span><span class="font-mono text-gray-800">2.220</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">3rd Quartile:</span><span class="font-mono text-gray-800">2.518</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Maximum:</span><span class="font-mono text-gray-800">2.840</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Skewness:</span><span class="font-mono text-gray-800">-0.36894</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Kurtosis:</span><span class="font-mono text-gray-800">0.46342</span></div>

                  <div class="pt-2 border-t border-teal-200 font-bold text-gray-800 text-[10px]">
                    95% Confidence Intervals
                  </div>
                  <div class="flex justify-between"><span class="text-gray-500">Mean:</span><span class="font-mono text-gray-800">2.225 - 2.435</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">Median:</span><span class="font-mono text-gray-800">2.220 - 2.450</span></div>
                  <div class="flex justify-between"><span class="text-gray-500">StdDev:</span><span class="font-mono text-gray-800">0.233 - 0.387</span></div>
                </div>
              </div>

              <!-- Box Plot Analysis Bottom -->
              <div class="space-y-2 pt-4 border-t border-gray-100">
                <span class="text-xs font-bold text-gray-800 block">Box Plot Analysis</span>
                <div class="h-28 border border-gray-100 rounded p-2 flex items-center justify-center">
                  <svg class="w-full h-full" viewBox="0 0 260 80">
                    <line x1="30" y1="60" x2="240" y2="60" stroke="#cbd5e1" stroke-width="1" />
                    <text x="35" y="72" font-size="7" fill="#64748b">1.6</text>
                    <text x="80" y="72" font-size="7" fill="#64748b">2.0</text>
                    <text x="130" y="72" font-size="7" fill="#64748b">2.3</text>
                    <text x="180" y="72" font-size="7" fill="#64748b">2.6</text>
                    <text x="230" y="72" font-size="7" fill="#64748b">2.9</text>

                    <circle cx="35" cy="35" r="2.5" fill="#ef4444" />
                    <line x1="75" y1="35" x2="115" y2="35" stroke="#64748b" stroke-width="1.2" />
                    <line x1="75" y1="28" x2="75" y2="42" stroke="#64748b" stroke-width="1.2" />
                    <line x1="160" y1="35" x2="210" y2="35" stroke="#64748b" stroke-width="1.2" />
                    <line x1="210" y1="28" x2="210" y2="42" stroke="#64748b" stroke-width="1.2" />
                    <rect x="115" y="22" width="45" height="26" fill="#93c5fd" stroke="#3b82f6" />
                    <line x1="135" y1="22" x2="135" y2="48" stroke="#1d4ed8" stroke-width="1.8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-6 right-24 flex items-center gap-3 z-30">
      <button class="bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-105 cursor-pointer">
        <UIcon name="i-lucide-eye" class="size-4" />
        <span>View</span>
      </button>
    </div>
  </div>
</template>
