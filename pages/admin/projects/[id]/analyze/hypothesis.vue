<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const hypothesisList = ref([
  {
    id: 'weight-multihead',
    process: 'Packing',
    factor: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    levelPlus: '10',
    levelMinus: '20',
    unit: 'กรัม',
    response: '%Giveaway',
    test: '2-Sample T',
    result: 'Significant',
    version: 'Version 1'
  },
  {
    id: 'drop-multihead',
    process: 'Packing',
    factor: 'จำนวนDropของเครื่องMultihead',
    levelPlus: '1',
    levelMinus: '2',
    unit: 'drop',
    response: '%Giveaway',
    test: '2-Sample T',
    result: 'Significant',
    version: 'Version 1'
  },
  {
    id: 'av-oil',
    process: 'Frying',
    factor: 'ค่า Av น้ำมัน',
    levelPlus: '20',
    levelMinus: '30',
    unit: 'mg KOH/g',
    response: '%Yield',
    test: '2-Sample T',
    result: 'NonSignificant',
    version: 'Version 1'
  },
  {
    id: 'vibration-df',
    process: 'Packing',
    factor: 'ความแรงการสั่นDFของเครื่องMultihead',
    levelPlus: '1',
    levelMinus: '-',
    unit: 'Hz',
    response: '%การใช้แป้ง',
    test: '1-Sample T',
    result: 'NonSignificant',
    version: 'Version 1'
  },
  {
    id: 'predust-speed',
    process: 'Predusting',
    factor: 'ความเร็วเครื่องเติมแป้งPredust',
    levelPlus: '2',
    levelMinus: '3',
    unit: 'Hz',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    version: 'Version 1'
  },
  {
    id: 'speed-db4',
    process: 'Predusting',
    factor: 'ความเร็วรอบเครื่อง DB4',
    levelPlus: '40',
    levelMinus: '50',
    unit: 'Hz',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    version: 'Version 1'
  },
  {
    id: 'height-predust',
    process: 'Predusting',
    factor: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    levelPlus: '1',
    levelMinus: '2',
    unit: 'cm',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    version: 'Version 1'
  }
])
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
      <span class="text-gray-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Hypothesis Testing</span>
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
        <!-- Collapsible Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Hypothesis Testing
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Perform statistical hypothesis tests on selected factors to validate root causes
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div>
            <h2 class="text-base font-bold text-gray-900">
              Hypothesis Testing
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Perform statistical hypothesis tests on selected factors to validate root causes
            </p>
          </div>

          <!-- Product Tab -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border-b-2 border-[#008779] text-[#008779] font-bold text-xs">
              <span>% Total Yield สินค้าไก่ทอด</span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-3 font-semibold">PROCESS</th>
                  <th class="py-3 px-3 font-semibold">FACTOR</th>
                  <th class="py-3 px-3 font-semibold text-center">LEVEL (+ / -)</th>
                  <th class="py-3 px-3 font-semibold">UNIT</th>
                  <th class="py-3 px-3 font-semibold">RESPONSE</th>
                  <th class="py-3 px-3 font-semibold">HYPOTHESIS TEST</th>
                  <th class="py-3 px-3 font-semibold text-center">RESULT</th>
                  <th class="py-3 px-3 font-semibold text-center">VERSION</th>
                  <th class="py-3 px-3 font-semibold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in hypothesisList" :key="item.id" class="hover:bg-gray-50/50">
                  <!-- Process -->
                  <td class="py-3.5 px-3">
                    <span class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded">
                      {{ item.process }}
                    </span>
                  </td>

                  <!-- Factor -->
                  <td class="py-3.5 px-3 font-medium text-gray-900">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                      class="hover:text-[#008779] hover:underline"
                    >
                      {{ item.factor }}
                    </NuxtLink>
                  </td>

                  <!-- Level + / - -->
                  <td class="py-3.5 px-3 text-center">
                    <div class="inline-flex items-center gap-1.5 text-xs font-mono">
                      <span class="text-gray-700">{{ item.levelPlus }}</span>
                      <span class="text-gray-300">/</span>
                      <span class="text-gray-500">{{ item.levelMinus }}</span>
                    </div>
                  </td>

                  <!-- Unit -->
                  <td class="py-3.5 px-3 text-gray-600">
                    {{ item.unit }}
                  </td>

                  <!-- Response -->
                  <td class="py-3.5 px-3">
                    <span class="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium px-2 py-0.5 rounded">
                      {{ item.response }}
                    </span>
                  </td>

                  <!-- Hypothesis Test -->
                  <td class="py-3.5 px-3">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                      class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
                    >
                      {{ item.test }}
                    </NuxtLink>
                  </td>

                  <!-- Result Badge -->
                  <td class="py-3.5 px-3 text-center">
                    <span
                      v-if="item.result === 'Significant'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      {{ item.result }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600"
                    >
                      {{ item.result }}
                    </span>
                  </td>

                  <!-- Version Badge -->
                  <td class="py-3.5 px-3 text-center">
                    <span class="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <UIcon name="i-lucide-check-circle-2" class="size-3.5 text-emerald-500" />
                      <span>{{ item.version }}</span>
                    </span>
                  </td>

                  <!-- Action (Eye Icon) -->
                  <td class="py-3.5 px-3 text-center">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                      class="p-1 text-gray-400 hover:text-[#008779] transition-colors"
                      title="View Statistical Analysis"
                    >
                      <UIcon name="i-lucide-eye" class="size-4" />
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
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
