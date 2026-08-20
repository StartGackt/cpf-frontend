<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const projectName = ref('Example เพิ่ม %Total Yield สินค้าไก่ทอด')

const actionItems = ref([
  {
    process: 'Frying',
    factor: 'อุณหภูมิสินค้าหลังสุก',
    currentProblem: 'Current Problem for: อุณหภูมิสินค้าหลังสุก',
    detail: '-'
  },
  {
    process: 'Prepare RM&Ingredients',
    factor: 'เศษชิ้นเล็ก',
    currentProblem: 'Current Problem for: เศษชิ้นเล็ก',
    detail: '-'
  },
  {
    process: 'Prepare RM&Ingredients',
    factor: 'วางแผนการผลิตไม่ต่อเนื่อง',
    currentProblem: 'Current Problem for: วางแผนการผลิตไม่ต่อเนื่อง',
    detail: '-'
  }
])

const hypothesesItems = ref([
  {
    process: 'Packing',
    factor: 'จำนวนDropของเครื่องMultihead',
    levelPlus: '1',
    levelMinus: '2',
    response: '%Giveaway',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.1',
    detail: 'Best Setting: 1 drop'
  },
  {
    process: 'Packing',
    factor: 'การรอยค่านาหนักเผื่อของเครื่องMultihead',
    levelPlus: '10',
    levelMinus: '20',
    response: '%Giveaway',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.1',
    detail: 'Best Setting: 10 กรัม'
  },
  {
    process: 'Predusting',
    factor: 'ความเร็วรอบเครื่อง DB4',
    levelPlus: '40',
    levelMinus: '50',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.2',
    detail: 'Best Setting: 40 Hz'
  },
  {
    process: 'Predusting',
    factor: 'ความเร็วเครื่องเติมแป้งPredust',
    levelPlus: '2',
    levelMinus: '3',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.2',
    detail: 'Best Setting: 2 Hz'
  },
  {
    process: 'Predusting',
    factor: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    levelPlus: '1',
    levelMinus: '2',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.2',
    detail: 'Best Setting: 1 cm'
  }
])
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Breadcrumb Bar -->
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
      <span class="text-gray-700 font-medium truncate max-w-[200px]">
        {{ projectName }}
      </span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Improve</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Summary</span>
    </div>

    <!-- Main Workspace (Sidebar + Content) -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="Summary"
      />

      <!-- Right: Main DMAIC Content Body -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Collapsible Phase Info Header -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Improve Summary
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Review DOE results, action controls, and summary information for the Improve phase of the DMAIC process.
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Detail Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <!-- Card Header & Export Action -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Improve Summary
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Review DOE results, action controls, and summary information for the Improve phase of the DMAIC process.
              </p>
            </div>

            <button
              type="button"
              class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
              <span>Export</span>
            </button>
          </div>

          <!-- Product / Category Pill Tab -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border-b-2 border-[#008779] text-[#008779] font-bold text-xs">
              <span>% Total Yield สินค้าไก่ทอด</span>
              <span class="size-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                8
              </span>
            </div>
          </div>

          <!-- Section 1: Action Table -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-gray-900">
              Action
            </h3>

            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold tracking-wider">
                    <th class="py-2.5 px-4 font-semibold">PROCESS</th>
                    <th class="py-2.5 px-4 font-semibold">FACTOR</th>
                    <th class="py-2.5 px-4 font-semibold">CURRENT PROBLEM</th>
                    <th class="py-2.5 px-4 font-semibold">DETAIL</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(item, idx) in actionItems" :key="idx" class="hover:bg-gray-50/60">
                    <td class="py-3 px-4 font-medium text-gray-900">
                      {{ item.process }}
                    </td>
                    <td class="py-3 px-4 text-gray-800">
                      {{ item.factor }}
                    </td>
                    <td class="py-3 px-4 text-gray-600">
                      {{ item.currentProblem }}
                    </td>
                    <td class="py-3 px-4 text-gray-400">
                      {{ item.detail }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 2: Hypotheses Table -->
          <div class="space-y-3 pt-4 border-t border-gray-100">
            <h3 class="text-sm font-bold text-gray-900">
              Hypotheses
            </h3>

            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[11px] font-semibold tracking-wider">
                    <th class="py-2.5 px-3 font-semibold">PROCESS</th>
                    <th class="py-2.5 px-3 font-semibold">FACTOR</th>
                    <th class="py-2.5 px-3 font-semibold text-center">LEVEL (+ / -)</th>
                    <th class="py-2.5 px-3 font-semibold">RESPONSE</th>
                    <th class="py-2.5 px-3 font-semibold">HYPOTHESIS TEST</th>
                    <th class="py-2.5 px-3 font-semibold text-center">RESULT</th>
                    <th class="py-2.5 px-3 font-semibold text-center">IMPROVE</th>
                    <th class="py-2.5 px-3 font-semibold">DETAIL</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(item, idx) in hypothesesItems" :key="idx" class="hover:bg-gray-50/60">
                    <!-- Process -->
                    <td class="py-3 px-3 font-medium text-gray-900">
                      {{ item.process }}
                    </td>

                    <!-- Factor -->
                    <td class="py-3 px-3 text-gray-800 font-medium">
                      {{ item.factor }}
                    </td>

                    <!-- Level + / - -->
                    <td class="py-3 px-3 text-center">
                      <div class="inline-flex items-center gap-2 text-xs font-mono">
                        <span class="text-gray-700">+ {{ item.levelPlus }}</span>
                        <span class="text-gray-300">/</span>
                        <span class="text-gray-500">- {{ item.levelMinus }}</span>
                      </div>
                    </td>

                    <!-- Response -->
                    <td class="py-3 px-3 text-gray-700">
                      {{ item.response }}
                    </td>

                    <!-- Hypothesis Test -->
                    <td class="py-3 px-3 text-gray-700">
                      {{ item.test }}
                    </td>

                    <!-- Result Badge -->
                    <td class="py-3 px-3 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {{ item.result }}
                      </span>
                    </td>

                    <!-- Improve DOE Badge -->
                    <td class="py-3 px-3 text-center">
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/improve/doe`"
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-[#008779] border border-teal-200 hover:bg-teal-100 cursor-pointer transition-colors"
                      >
                        <UIcon name="i-lucide-flask-conical" class="size-3" />
                        <span>{{ item.improve }}</span>
                      </NuxtLink>
                    </td>

                    <!-- Detail (Best Setting) -->
                    <td class="py-3 px-3 text-gray-700 font-medium">
                      {{ item.detail }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
