<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const testId = (route.params.testId as string) || 'weight-multihead'

const factorName = ref('การsetค่าน้ำหนักเผื่อของเครื่องMultihead')
const responseName = ref('%Giveaway')
const level1Label = ref('10 กรัม')
const level2Label = ref('20 กรัม')

const testData = ref([
  { id: 1, level1: '2.64', level2: '2.45' },
  { id: 2, level1: '2.66', level2: '2.44' },
  { id: 3, level1: '2.56', level2: '2.19' },
  { id: 4, level1: '2.58', level2: '2.51' },
  { id: 5, level1: '2.70', level2: '2.32' },
  { id: 6, level1: '2.65', level2: '2.26' },
  { id: 7, level1: '2.73', level2: '2.03' },
  { id: 8, level1: '2.75', level2: '2.84' },
  { id: 9, level1: '2.41', level2: '1.60' },
  { id: 10, level1: '2.75', level2: '2.33' },
  { id: 11, level1: '2.74', level2: '2.22' },
  { id: 12, level1: '2.25', level2: '2.52' },
  { id: 13, level1: '2.35', level2: '1.74' },
  { id: 14, level1: '2.33', level2: '2.57' },
  { id: 15, level1: '2.80', level2: '2.66' },
  { id: 16, level1: '2.65', level2: '2.41' },
  { id: 17, level1: '2.59', level2: '2.38' },
  { id: 18, level1: '2.72', level2: '2.15' },
  { id: 19, level1: '2.68', level2: '2.48' },
  { id: 20, level1: '2.55', level2: '2.29' },
  { id: 21, level1: '2.63', level2: '2.35' },
  { id: 22, level1: '2.71', level2: '2.42' },
  { id: 23, level1: '2.60', level2: '2.18' },
  { id: 24, level1: '2.58', level2: '2.30' },
  { id: 25, level1: '2.69', level2: '2.50' },
  { id: 26, level1: '2.74', level2: '2.25' },
  { id: 27, level1: '2.62', level2: '2.37' },
  { id: 28, level1: '2.57', level2: '2.40' },
  { id: 29, level1: '2.65', level2: '2.33' },
  { id: 30, level1: '2.70', level2: '2.28' },
  { id: 31, level1: '2.61', level2: '2.44' },
  { id: 32, level1: '2.67', level2: '2.39' }
])
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Top Stepper Bar -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-3 flex items-center justify-center gap-6 shadow-xs text-xs">
      <div class="flex items-center gap-2 text-emerald-700 font-semibold">
        <span class="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px]">✓</span>
        <span>Configure Test</span>
      </div>

      <div class="w-16 h-0.5 bg-emerald-400"></div>

      <div class="flex items-center gap-2 text-[#008779] font-bold">
        <span class="size-5 rounded-full bg-[#008779] text-white flex items-center justify-center text-[11px]">2</span>
        <span>Enter Data</span>
      </div>
    </div>

    <!-- Version Management Card -->
    <div class="bg-white rounded-lg border border-gray-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h3 class="text-xs font-bold text-gray-900">Version Management</h3>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Version 2
          </span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            NotTested
          </span>
        </div>
        <p class="text-[11px] text-gray-500">2 versions total</p>
      </div>

      <div class="w-full sm:w-72">
        <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#008779]">
          <option>Version 2 (Active) - NotTested</option>
          <option>Version 1 - Draft</option>
        </select>
      </div>
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

      <!-- Action Button -->
      <div class="flex items-center gap-2">
        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/summary`"
          class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back</span>
        </NuxtLink>

        <NuxtLink
          :to="`/admin/projects/${projectId}/analyze/tests/${testId}`"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <span>View Results</span>
          <UIcon name="i-lucide-arrow-right" class="size-4" />
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
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Main Data Entry Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <!-- Card Header & Factors Box -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Enter Test Data
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Enter at least 32 rows (64 data points), auto-add up to 100 rows on Tab/Enter
              </p>
            </div>

            <!-- Floating Test Factors Box -->
            <div class="bg-teal-50/60 border border-teal-200 rounded-md p-2.5 text-xs text-gray-800 space-y-0.5 self-start sm:self-auto min-w-44">
              <span class="font-bold text-[#008779] text-[11px] block uppercase">Test Factors</span>
              <div class="text-[11px] flex justify-between"><span>Level 1:</span> <span class="font-semibold">10 (กรัม)</span></div>
              <div class="text-[11px] flex justify-between"><span>Level 2:</span> <span class="font-semibold">20 (กรัม)</span></div>
            </div>
          </div>

          <!-- Data Grid Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg max-h-[520px] overflow-y-auto scrollbar-thin">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-gray-50 z-10 shadow-xs">
                <tr class="border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold">
                  <th class="py-2.5 px-4 font-semibold w-24 text-center border-r border-gray-200">Test #</th>
                  <th class="py-2.5 px-6 font-semibold border-r border-gray-200 text-center">{{ level1Label }}</th>
                  <th class="py-2.5 px-6 font-semibold text-center">{{ level2Label }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="row in testData"
                  :key="row.id"
                  class="hover:bg-teal-50/20"
                >
                  <!-- Row Number -->
                  <td class="py-2 px-4 text-center font-medium text-gray-500 border-r border-gray-100 bg-gray-50/40">
                    {{ row.id }}
                  </td>

                  <!-- Level 1 Value Input -->
                  <td class="py-1 px-3 border-r border-gray-100">
                    <input
                      v-model="row.level1"
                      type="text"
                      class="w-full bg-transparent px-3 py-1.5 text-center text-xs font-mono text-gray-900 rounded border border-transparent focus:border-[#008779] focus:bg-white outline-none"
                    />
                  </td>

                  <!-- Level 2 Value Input -->
                  <td class="py-1 px-3">
                    <input
                      v-model="row.level2"
                      type="text"
                      class="w-full bg-transparent px-3 py-1.5 text-center text-xs font-mono text-gray-900 rounded border border-transparent focus:border-[#008779] focus:bg-white outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer Status -->
          <div class="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 gap-2">
            <span class="font-medium">
              Rows filled: <strong class="text-emerald-700">32/32</strong> (min 32 rows / 64 data points)
            </span>
            <span class="text-gray-400 text-[11px]">
              Use Tab or Arrow keys to navigate
            </span>
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
