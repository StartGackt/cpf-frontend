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
    level1: '1',
    level2: '2',
    response: '%Giveaway',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.1',
    detail: 'Best Setting: 1 drop'
  },
  {
    process: 'Packing',
    factor: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    level1: '10',
    level2: '20',
    response: '%Giveaway',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.1',
    detail: 'Best Setting: 10 กรัม'
  },
  {
    process: 'Predusting',
    factor: 'ความเร็วรอบเครื่อง DB4',
    level1: '40',
    level2: '50',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.2',
    detail: 'Best Setting: 40 Hz'
  },
  {
    process: 'Predusting',
    factor: 'ความเร็วเครื่องเติมแป้งPredust',
    level1: '2',
    level2: '3',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.2',
    detail: 'Best Setting: 2 Hz'
  },
  {
    process: 'Predusting',
    factor: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    level1: '1',
    level2: '2',
    response: '%การใช้แป้ง',
    test: '2-Sample T',
    result: 'Significant',
    improve: 'DOE.2',
    detail: 'Best Setting: 1 cm'
  }
])
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-slate-500 pb-1">
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
        {{ projectName }}
      </NuxtLink>
      <span>›</span>
      <span class="text-slate-700 font-medium">Improve</span>
      <span>›</span>
      <span class="text-slate-900 font-bold">Summary</span>
    </div>

    <!-- Main Workspace (Sidebar + Content) -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="Summary"
      />

      <!-- Right: Main DMAIC Content Body -->
      <div class="flex-1 space-y-5 min-w-0 w-full">
        <!-- Top Banner Header (Matching Image 2.10) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h1 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-chevron-right" class="size-4 text-slate-400" />
              <span>Improve Summary</span>
            </h1>
            <p class="text-xs text-slate-500">
              Review DOE results, action controls, and summary information for the improve phase of the DMAIC process.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              Completed
            </span>
          </div>
        </div>

        <!-- Main Card Section (Matching Image 2.10) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Improve Summary
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Review DOE results, action controls, and summary information for the improve phase of the DMAIC process.
              </p>
            </div>

            <button
              type="button"
              class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <UIcon name="i-lucide-download" class="size-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>

          <!-- Product Tag Tab -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-[#008779] border border-teal-200 rounded-xl font-bold text-xs">
              <span>%Total Yield สินค้าไก่ทอดต่ำ</span>
              <span class="size-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                6
              </span>
            </div>
          </div>

          <!-- 1. Action Table (Matching Image 2.10) -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-900">
              Action
            </h3>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th class="py-3 px-4 w-48">PROCESS</th>
                    <th class="py-3 px-4 w-64">FACTOR</th>
                    <th class="py-3 px-4">CURRENT PROBLEM</th>
                    <th class="py-3 px-4 w-28 text-center">DETAIL</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-800">
                  <tr v-for="(act, idx) in actionItems" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                    <td class="py-3.5 px-4 font-semibold text-slate-700">
                      {{ act.process }}
                    </td>
                    <td class="py-3.5 px-4 font-bold text-slate-900">
                      {{ act.factor }}
                    </td>
                    <td class="py-3.5 px-4 text-slate-600">
                      {{ act.currentProblem }}
                    </td>
                    <td class="py-3.5 px-4 text-center text-slate-400 font-mono">
                      {{ act.detail }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 2. Hypotheses Table (Matching Image 2.10) -->
          <div class="space-y-3 pt-2">
            <h3 class="text-xs font-bold text-slate-900">
              Hypotheses
            </h3>

            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th class="py-3 px-3">PROCESS</th>
                    <th class="py-3 px-4">FACTOR</th>
                    <th class="py-3 px-3 text-center">LEVEL</th>
                    <th class="py-3 px-3">RESPONSE</th>
                    <th class="py-3 px-3 text-center">HYPOTHESIS TEST</th>
                    <th class="py-3 px-3 text-center">RESULT</th>
                    <th class="py-3 px-3 text-center">IMPROVE</th>
                    <th class="py-3 px-4">DETAIL</th>
                  </tr>
                  <!-- Sub-header row matching image -->
                  <tr class="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] font-mono">
                    <th class="py-1 px-3"></th>
                    <th class="py-1 px-4"></th>
                    <th class="py-1 px-3 text-center">- &nbsp; -</th>
                    <th class="py-1 px-3"></th>
                    <th class="py-1 px-3"></th>
                    <th class="py-1 px-3"></th>
                    <th class="py-1 px-3"></th>
                    <th class="py-1 px-4"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-800">
                  <tr v-for="(item, idx) in hypothesesItems" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                    <!-- Process -->
                    <td class="py-3.5 px-3 font-semibold text-slate-700">
                      {{ item.process }}
                    </td>

                    <!-- Factor -->
                    <td class="py-3.5 px-4 font-bold text-slate-900">
                      {{ item.factor }}
                    </td>

                    <!-- Level -->
                    <td class="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                      {{ item.level1 }} &nbsp;|&nbsp; {{ item.level2 }}
                    </td>

                    <!-- Response -->
                    <td class="py-3.5 px-3 font-medium text-teal-700">
                      {{ item.response }}
                    </td>

                    <!-- Hypothesis Test -->
                    <td class="py-3.5 px-3 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {{ item.test }}
                      </span>
                    </td>

                    <!-- Result -->
                    <td class="py-3.5 px-3 text-center">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                        <UIcon name="i-lucide-check-circle-2" class="size-3 text-emerald-500" />
                        <span>{{ item.result }}</span>
                      </span>
                    </td>

                    <!-- Improve DOE Tag -->
                    <td class="py-3.5 px-3 text-center">
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/improve/doe`"
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors font-mono"
                      >
                        <UIcon name="i-lucide-triangle" class="size-2.5 text-amber-500 fill-amber-500" />
                        <span>{{ item.improve }}</span>
                      </NuxtLink>
                    </td>

                    <!-- Detail -->
                    <td class="py-3.5 px-4 font-bold text-slate-900">
                      {{ item.detail }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Bottom Action Bar (Matching Image 2.10) -->
        <div class="flex justify-end gap-2 pt-2">
          <NuxtLink
            :to="`/admin/projects/${projectId}/improve/doe`"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UIcon name="i-lucide-pencil" class="size-3.5" />
            <span>Edit</span>
          </NuxtLink>
          <button
            type="button"
            class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UIcon name="i-lucide-help-circle" class="size-3.5 text-slate-500" />
            <span>Help</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
