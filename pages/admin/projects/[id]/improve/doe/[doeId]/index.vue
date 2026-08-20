<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const doeId = (route.params.doeId as string) || 'doe-1'

const doeTitle = ref(doeId.toUpperCase().replace('-', '.'))
const responseName = ref('%Giveaway')

const runs = ref([
  { run: 1, rep: 'R1', drop: '2 drop', dropType: 'high', setWeight: '20 กรัม', result: '3.7973' },
  { run: 2, rep: 'R2', drop: '2 drop', dropType: 'high', setWeight: '20 กรัม', result: '3.7153' },
  { run: 3, rep: 'R2', drop: '2 drop', dropType: 'high', setWeight: '10 กรัม', result: '3.1349' },
  { run: 4, rep: 'R2', drop: '1 drop', dropType: 'low', setWeight: '10 กรัม', result: '2.178' },
  { run: 5, rep: 'R2', drop: '1 drop', dropType: 'low', setWeight: '20 กรัม', result: '3.475' },
  { run: 6, rep: 'R1', drop: '1 drop', dropType: 'low', setWeight: '20 กรัม', result: '3.545' },
  { run: 7, rep: 'R1', drop: '2 drop', dropType: 'high', setWeight: '10 กรัม', result: '3.0789' },
  { run: 8, rep: 'R1', drop: '1 drop', dropType: 'low', setWeight: '10 กรัม', result: '2.222' }
])
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Back & Header Bar -->
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe`"
          class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#008779] font-medium transition-colors mb-2"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to DOE List</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
            {{ doeTitle }}
          </h1>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
              <span>Version 1</span>
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Analyzed
            </span>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">
          Response: {{ responseName }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-file-spreadsheet" class="size-3.5 text-gray-500" />
          <span>Export to Excel</span>
        </button>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-upload" class="size-3.5 text-gray-500" />
          <span>Import from Excel</span>
        </button>

        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe/${doeId}/analysis`"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-bar-chart-2" class="size-4" />
          <span>DOE Analyze</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="DOE"
      />

      <!-- Content Column -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- 1. Experimental Runs Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Experimental Runs
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Execute experimental runs and record results
              </p>
            </div>
            <span class="text-xs text-gray-500 font-medium">
              8 of 8 completed
            </span>
          </div>

          <!-- Runs Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold w-16">RUN</th>
                  <th class="py-3 px-4 font-semibold w-16">REP</th>
                  <th class="py-3 px-6 font-semibold">จำนวนDROPของเครื่องMULTIHEAD</th>
                  <th class="py-3 px-6 font-semibold">การSETค่าน้ำหนักเผื่อของเครื่องMULTIHEAD</th>
                  <th class="py-3 px-6 font-semibold w-64">RESULT</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="run in runs"
                  :key="run.run"
                  class="hover:bg-gray-50/50"
                >
                  <!-- Run Number -->
                  <td class="py-3.5 px-4 font-medium text-gray-700">
                    {{ run.run }}
                  </td>

                  <!-- Rep -->
                  <td class="py-3.5 px-4 text-gray-600">
                    {{ run.rep }}
                  </td>

                  <!-- Factor 1: Drop (Pill) -->
                  <td class="py-3.5 px-6">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium"
                      :class="run.dropType === 'low'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'"
                    >
                      {{ run.drop }}
                    </span>
                  </td>

                  <!-- Factor 2: Weight (Pill) -->
                  <td class="py-3.5 px-6">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {{ run.setWeight }}
                    </span>
                  </td>

                  <!-- Result Input -->
                  <td class="py-3.5 px-6">
                    <input
                      v-model="run.result"
                      type="text"
                      class="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#008779]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Version Management Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900">
              Version Management
            </h3>
            <span class="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
              <UIcon name="i-lucide-check-circle-2" class="size-3.5 text-emerald-500" />
              <span>Version 1</span>
            </span>
          </div>

          <div>
            <label class="text-xs text-gray-500 block mb-1">Active Version:</label>
            <div class="border border-gray-200 rounded-md px-3 py-2 text-xs font-medium text-gray-800 bg-gray-50/50">
              Version 1 (Active) - Analyzed
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
