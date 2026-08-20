<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const actionItems = ref([
  {
    process: 'Prepare RM&Ingredients',
    factor: 'เศษชิ้นเล็ก',
    currentProblem: 'Current Problem for: เศษชิ้นเล็ก'
  },
  {
    process: 'Prepare RM&Ingredients',
    factor: 'วางแผนการผลิตไม่ต่อเนื่อง',
    currentProblem: 'Current Problem for: วางแผนการผลิตไม่ต่อเนื่อง'
  },
  {
    process: 'Frying',
    factor: 'อุณหภูมิสินค้าหลังสุก',
    currentProblem: 'Current Problem for: อุณหภูมิสินค้าหลังสุก'
  }
])

const hypothesisGroups = ref([
  {
    responseName: 'Response: %Giveaway',
    items: [
      {
        id: 'weight-multihead',
        process: 'Packing',
        factor: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
        levelPlus: '10',
        levelMinus: '20',
        unit: 'กรัม',
        response: '%Giveaway',
        test: '-',
        result: 'NotTested',
        improve: 'DOE.1'
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
        improve: 'DOE.1'
      }
    ]
  },
  {
    responseName: 'Response: %Yield',
    items: [
      {
        id: 'av-oil',
        process: 'Frying',
        factor: 'ค่า Av น้ำมัน',
        levelPlus: '20',
        levelMinus: '30',
        unit: 'mg KOH/g',
        response: '%Yield',
        test: '2-Sample T',
        result: 'Non-Significant',
        improve: '-'
      }
    ]
  },
  {
    responseName: 'Response: %การใช้แป้ง',
    items: [
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
        improve: 'DOE.2'
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
        result: 'Non-Significant',
        improve: '-'
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
        improve: 'DOE.2'
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
        improve: 'DOE.2'
      }
    ]
  }
])
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Breadcrumbs & Header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">
          Analyze Summary
        </h1>
        <p class="text-xs text-gray-500 mt-0.5">
          Define control measures for single significant hypotheses and review DOE assignments for multiple significant factors.
        </p>
      </div>

      <button
        type="button"
        class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
      >
        <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
        <span>Export</span>
      </button>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Summary"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Product Pill Tab -->
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border-b-2 border-[#008779] text-[#008779] font-bold text-xs">
            <span>% Total Yield สินค้าไก่ทอด</span>
            <span class="size-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
              11
            </span>
          </div>
        </div>

        <!-- 1. Action Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <h2 class="text-base font-bold text-gray-900">
            Action
          </h2>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th class="py-2.5 px-4 font-semibold">PROCESS</th>
                  <th class="py-2.5 px-4 font-semibold">FACTOR</th>
                  <th class="py-2.5 px-4 font-semibold">CURRENT PROBLEM DESCRIPTION</th>
                  <th class="py-2.5 px-4 font-semibold">HOW TO FIX/CONTROL</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in actionItems" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3 px-4">
                    <span class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded">
                      {{ item.process }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-800 font-medium">
                    {{ item.factor }}
                  </td>
                  <td class="py-3 px-4 text-gray-600">
                    {{ item.currentProblem }}
                  </td>
                  <td class="py-3 px-4">
                    <button
                      type="button"
                      class="border border-teal-300 text-[#008779] hover:bg-teal-50 text-xs px-3 py-1.5 rounded-md flex items-center gap-1 font-medium transition-colors cursor-pointer"
                    >
                      <UIcon name="i-lucide-plus-circle" class="size-3.5" />
                      <span>Click to add control measures</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Hypothesis Testing Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 class="text-base font-bold text-gray-900">
              Hypothesis testing
            </h2>
            <button
              type="button"
              class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <UIcon name="i-lucide-refresh-cw" class="size-3 text-gray-500" />
              <span>Recalculate DOE Groups</span>
            </button>
          </div>

          <!-- Grouped Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th class="py-2.5 px-3 font-semibold">PROCESS</th>
                  <th class="py-2.5 px-3 font-semibold">FACTOR</th>
                  <th class="py-2.5 px-3 font-semibold text-center">LEVEL (+ / -)</th>
                  <th class="py-2.5 px-3 font-semibold">UNIT</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE</th>
                  <th class="py-2.5 px-3 font-semibold">HYPOTHESIS TEST</th>
                  <th class="py-2.5 px-3 font-semibold text-center">RESULT</th>
                  <th class="py-2.5 px-3 font-semibold text-center">IMPROVE</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <template v-for="group in hypothesisGroups" :key="group.responseName">
                  <!-- Group Header -->
                  <tr class="bg-gray-50/40">
                    <td colspan="8" class="py-2 px-3 text-xs font-bold text-gray-700">
                      {{ group.responseName }}
                    </td>
                  </tr>

                  <!-- Items -->
                  <tr v-for="item in group.items" :key="item.id" class="hover:bg-gray-50/50">
                    <td class="py-2.5 px-3">
                      <span class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded">
                        {{ item.process }}
                      </span>
                    </td>

                    <!-- Factor link to detail -->
                    <td class="py-2.5 px-3 text-gray-800 font-medium">
                      <NuxtLink
                        :to="item.result === 'NotTested'
                          ? `/admin/projects/${projectId}/analyze/tests/${item.id}/data-entry`
                          : `/admin/projects/${projectId}/analyze/tests/${item.id}`"
                        class="hover:text-[#008779] hover:underline"
                      >
                        {{ item.factor }}
                      </NuxtLink>
                    </td>

                    <td class="py-2.5 px-3 text-center">
                      <div class="inline-flex items-center gap-1.5 text-xs font-mono">
                        <span class="text-gray-700">{{ item.levelPlus }}</span>
                        <span class="text-gray-300">/</span>
                        <span class="text-gray-500">{{ item.levelMinus }}</span>
                      </div>
                    </td>

                    <td class="py-2.5 px-3 text-gray-600">
                      {{ item.unit }}
                    </td>

                    <td class="py-2.5 px-3">
                      <span class="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium px-2 py-0.5 rounded">
                        {{ item.response }}
                      </span>
                    </td>

                    <!-- Test Button / Link -->
                    <td class="py-2.5 px-3">
                      <NuxtLink
                        v-if="item.test !== '-'"
                        :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                        class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
                      >
                        {{ item.test }}
                      </NuxtLink>
                      <span v-else class="text-gray-400">-</span>
                    </td>

                    <td class="py-2.5 px-3 text-center">
                      <span
                        v-if="item.result === 'Significant'"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        {{ item.result }}
                      </span>
                      <span
                        v-else-if="item.result === 'NotTested'"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600"
                      >
                        {{ item.result }}
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-500"
                      >
                        {{ item.result }}
                      </span>
                    </td>

                    <td class="py-2.5 px-3 text-center">
                      <span
                        v-if="item.improve !== '-'"
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                      >
                        {{ item.improve }}
                      </span>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-6 right-24 flex items-center gap-3 z-30">
      <button class="bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-105 cursor-pointer">
        <UIcon name="i-lucide-edit" class="size-4" />
        <span>Edit</span>
      </button>
    </div>
  </div>
</template>
