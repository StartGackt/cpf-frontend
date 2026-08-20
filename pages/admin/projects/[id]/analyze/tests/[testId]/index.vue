<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const testId = (route.params.testId as string) || 'drop-multihead'

const factorName = ref('จำนวนDropของเครื่องMultihead')
const responseName = ref('%Giveaway')
const selectedVersion = ref('Version 1 (Active) - Significant')
const activeTestTab = ref('2-Sample T Test')
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Version Selector Top Banner -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-500 font-medium">Select Version:</span>
        <select
          v-model="selectedVersion"
          class="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#008779]"
        >
          <option value="Version 1 (Active) - Significant">Version 1 (Active) - Significant</option>
          <option value="Version 2 - Draft">Version 2 - Draft</option>
        </select>
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
          :to="`/admin/projects/${projectId}/analyze/summary`"
          class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#008779] font-medium transition-colors mb-1.5"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to Analyze Summary</span>
        </NuxtLink>

        <h1 class="text-xl font-bold text-gray-900 tracking-tight">
          Factor: {{ factorName }}
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Response: {{ responseName }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/tests/${testId}/data-entry`"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-eye" class="size-3.5 text-gray-500" />
          <span>View Data</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Export</span>
        </button>

        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/summary`"
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

      <!-- Main Analysis Content -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Test Type Tabs Navigation -->
        <div class="flex items-center gap-2 border-b border-gray-200 pb-2">
          <NuxtLink
            :to="`/admin/projects/${projectId}/analyze/tests/${testId}/normality`"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Normality Test
          </NuxtLink>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Variance Test
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#008779] text-white shadow-xs"
          >
            2-Sample T Test
          </button>
        </div>

        <!-- 2-Column Main Analysis: Left Boxplot, Right Stats & Test -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left: Boxplot of 1, 2 -->
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
            <h3 class="text-xs font-bold text-gray-900 text-center">
              Boxplot of 1, 2
            </h3>

            <!-- Interactive Boxplot SVG Graphic -->
            <div class="h-80 relative flex items-center justify-center p-4">
              <svg class="w-full h-full" viewBox="0 0 320 260">
                <!-- Y-Axis -->
                <line x1="50" y1="20" x2="50" y2="210" stroke="#cbd5e1" stroke-width="1.5" />
                <line x1="50" y1="210" x2="280" y2="210" stroke="#cbd5e1" stroke-width="1.5" />

                <!-- Y-Axis Ticks & Labels -->
                <text x="42" y="35" font-size="9" fill="#64748b" text-anchor="end">2.8</text>
                <text x="42" y="70" font-size="9" fill="#64748b" text-anchor="end">2.6</text>
                <text x="42" y="105" font-size="9" fill="#64748b" text-anchor="end">2.4</text>
                <text x="42" y="140" font-size="9" fill="#64748b" text-anchor="end">2.2</text>
                <text x="42" y="175" font-size="9" fill="#64748b" text-anchor="end">2.0</text>
                <text x="42" y="210" font-size="9" fill="#64748b" text-anchor="end">1.8</text>

                <!-- Y-Axis Title -->
                <text x="14" y="115" font-size="9" fill="#475569" text-anchor="middle" transform="rotate(-90 14 115)" font-weight="600">
                  Value (%)
                </text>

                <!-- Sample 1 Boxplot -->
                <!-- Whiskers -->
                <line x1="120" y1="35" x2="120" y2="70" stroke="#64748b" stroke-width="1.5" />
                <line x1="110" y1="35" x2="130" y2="35" stroke="#64748b" stroke-width="1.5" />
                <line x1="120" y1="110" x2="120" y2="135" stroke="#64748b" stroke-width="1.5" />
                <line x1="110" y1="135" x2="130" y2="135" stroke="#64748b" stroke-width="1.5" />
                <!-- Box -->
                <rect x="100" y="70" width="40" height="40" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5" />
                <!-- Median Line -->
                <line x1="100" y1="85" x2="140" y2="85" stroke="#1d4ed8" stroke-width="2" />
                <!-- Labels -->
                <text x="120" y="225" font-size="10" fill="#1e293b" text-anchor="middle" font-weight="700">1</text>
                <text x="120" y="238" font-size="9" fill="#64748b" text-anchor="middle">n = 32</text>
                <!-- Numeric Annotations -->
                <text x="145" y="38" font-size="8" fill="#64748b">2.80</text>
                <text x="145" y="48" font-size="8" fill="#64748b">2.74</text>
                <text x="145" y="80" font-size="8" fill="#64748b">2.59</text>
                <text x="145" y="92" font-size="8" fill="#64748b">2.52</text>
                <text x="145" y="137" font-size="8" fill="#64748b">2.25</text>

                <!-- Sample 2 Boxplot -->
                <!-- Whiskers -->
                <line x1="210" y1="40" x2="210" y2="95" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2" />
                <line x1="200" y1="40" x2="220" y2="40" stroke="#64748b" stroke-width="1.5" />
                <line x1="210" y1="140" x2="210" y2="175" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2" />
                <line x1="200" y1="175" x2="220" y2="175" stroke="#64748b" stroke-width="1.5" />
                <!-- Box -->
                <rect x="190" y="95" width="40" height="45" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5" />
                <!-- Median Line -->
                <line x1="190" y1="120" x2="230" y2="120" stroke="#1d4ed8" stroke-width="2" />
                <!-- Outlier dots (Red) -->
                <circle cx="210" cy="195" r="3" fill="#ef4444" />
                <circle cx="210" cy="208" r="3" fill="#ef4444" />
                <!-- Labels -->
                <text x="210" y="225" font-size="10" fill="#1e293b" text-anchor="middle" font-weight="700">2</text>
                <text x="210" y="238" font-size="9" fill="#64748b" text-anchor="middle">n = 32</text>
                <!-- Numeric Annotations -->
                <text x="235" y="42" font-size="8" fill="#64748b">2.84</text>
                <text x="235" y="98" font-size="8" fill="#64748b">2.52</text>
                <text x="235" y="115" font-size="8" fill="#64748b">2.33</text>
                <text x="235" y="128" font-size="8" fill="#64748b">2.22</text>
                <text x="235" y="205" font-size="8" fill="#ef4444">1.60</text>
              </svg>
            </div>
          </div>

          <!-- Right: Descriptive Statistics & Test Output -->
          <div class="space-y-6">
            <!-- Descriptive Statistics Table -->
            <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 space-y-3">
              <h3 class="text-xs font-bold text-gray-900">
                Descriptive Statistics
              </h3>

              <div class="overflow-x-auto border border-gray-200 rounded-md">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-semibold">
                      <th class="py-2.5 px-3">Sample</th>
                      <th class="py-2.5 px-3">N</th>
                      <th class="py-2.5 px-3">Mean</th>
                      <th class="py-2.5 px-3">StDev</th>
                      <th class="py-2.5 px-3">SE Mean</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr>
                      <td class="py-2.5 px-3 font-semibold text-gray-800">1</td>
                      <td class="py-2.5 px-3 text-gray-600">32</td>
                      <td class="py-2.5 px-3 font-medium text-gray-900">2.5953</td>
                      <td class="py-2.5 px-3 text-gray-600">0.1439</td>
                      <td class="py-2.5 px-3 text-gray-600">0.0254</td>
                    </tr>
                    <tr>
                      <td class="py-2.5 px-3 font-semibold text-gray-800">2</td>
                      <td class="py-2.5 px-3 text-gray-600">32</td>
                      <td class="py-2.5 px-3 font-medium text-gray-900">2.3303</td>
                      <td class="py-2.5 px-3 text-gray-600">0.2909</td>
                      <td class="py-2.5 px-3 text-gray-600">0.0514</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Test Hypothesis Output -->
            <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 space-y-3">
              <h3 class="text-xs font-bold text-gray-900">
                Test
              </h3>

              <div class="text-xs text-gray-700 space-y-1 font-mono">
                <p>Null hypothesis <span class="font-bold">H₀: μ₁ - μ₂ = 0</span></p>
                <p>Alternative hypothesis <span class="font-bold">H₁: μ₁ - μ₂ ≠ 0</span></p>
              </div>

              <!-- Test Result Metrics -->
              <div class="flex items-center gap-6 pt-2 border-t border-gray-100 text-xs">
                <div>
                  <span class="text-gray-500 font-medium block text-[11px]">T-Value</span>
                  <span class="text-gray-900 font-bold text-sm">4.62</span>
                </div>
                <div>
                  <span class="text-gray-500 font-medium block text-[11px]">DF</span>
                  <span class="text-gray-900 font-bold text-sm">45</span>
                </div>
                <div>
                  <span class="text-gray-500 font-medium block text-[11px]">P-Value</span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    0.000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Summary Card (สรุปผล) -->
        <div class="bg-emerald-50/40 border border-emerald-200 rounded-lg p-5 flex items-start gap-3">
          <div class="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <UIcon name="i-lucide-check" class="size-4" />
          </div>

          <div class="space-y-1">
            <h4 class="text-sm font-bold text-gray-900">
              สรุปผล
            </h4>
            <p class="text-xs text-gray-800 leading-relaxed font-sans">
              • <strong class="text-gray-900">%Giveaway</strong> ที่ได้จาก
              <span class="bg-amber-200/80 px-1 py-0.5 rounded font-medium">จำนวนDropของเครื่องMultihead 1 drop</span>
              และ
              <span class="bg-amber-200/80 px-1 py-0.5 rounded font-medium">จำนวนDropของเครื่องMultihead 2 drop</span>
              มีความแตกต่างกันที่ระดับความเชื่อมั่น <strong>95%</strong>
            </p>
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
