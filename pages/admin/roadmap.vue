<script setup lang="ts">
import { ref } from 'vue'

const modules = ref([
  {
    no: 1,
    name: 'Admin',
    features: [
      { name: 'User Management', v1: true, v2: true, isNew: false },
      { name: 'Approvals', v1: true, v2: true, isNew: false },
      { name: 'E-Learning', v1: true, v2: true, isNew: false },
      { name: 'Master Data', v1: true, v2: true, isNew: false }
    ]
  },
  {
    no: 2,
    name: 'Project / Dashboard',
    features: [
      { name: 'Summary Project Visualize Dashboard', v1: true, v2: true, isNew: false },
      { name: 'Project Presentation Mode & Full Report', v1: true, v2: true, isNew: false },
      { name: 'Create Project Run', v1: true, v2: true, isNew: false }
    ]
  },
  {
    no: 3,
    name: 'Define (Insight Data)',
    features: [
      { name: 'Insight Data', v1: true, v2: true, isNew: false },
      { name: 'BEG Chart (Goal Setting)', v1: true, v2: true, isNew: false },
      { name: 'Project Charter Report & Workflow', v1: false, v2: true, isNew: true }
    ]
  },
  {
    no: 4,
    name: 'Measure Suggestion',
    features: [
      { name: 'Overview (Pareto Chart)', v1: false, v2: true, isNew: true },
      { name: 'Capability Analysis (Before)', v1: false, v2: true, isNew: true },
      { name: 'Process Map', v1: true, v2: true, isNew: false },
      { name: 'MSA (Variable/Attribute R&R)', v1: false, v2: true, isNew: true },
      { name: 'Fishbone Diagram', v1: true, v2: true, isNew: false },
      { name: 'FMEA & Pareto Chart', v1: true, v2: true, isNew: false }
    ]
  },
  {
    no: 5,
    name: 'Analyze Analysis',
    features: [
      { name: 'Selected Tools', v1: true, v2: true, isNew: false },
      { name: 'Action', v1: true, v2: true, isNew: false },
      { name: 'Hypothesis Test', v1: true, v2: true, isNew: false },
      { name: 'Regression', v1: false, v2: true, isNew: true },
      { name: 'Summary', v1: true, v2: true, isNew: false }
    ]
  },
  {
    no: 6,
    name: 'Improve (Best Setting)',
    features: [
      { name: 'Action', v1: false, v2: true, isNew: true },
      { name: 'DOE', v1: true, v2: true, isNew: false },
      { name: 'Simulation Model', v1: false, v2: true, isNew: true },
      { name: 'Summary', v1: true, v2: true, isNew: false }
    ]
  },
  {
    no: 7,
    name: 'Control Monitor',
    features: [
      { name: 'Control Plan', v1: false, v2: true, isNew: true },
      { name: 'Control Tracking', v1: false, v2: true, isNew: true },
      { name: 'Project Finish Report & Workflow', v1: false, v2: true, isNew: true },
      { name: 'Realization', v1: false, v2: true, isNew: true }
    ]
  },
  {
    no: 8,
    name: 'GenieChat',
    features: [
      { name: 'AI Chatbot', v1: false, v2: true, isNew: true }
    ]
  },
  {
    no: 9,
    name: 'GenieWisdom',
    features: [
      { name: 'KM Repository', v1: false, v2: true, isNew: true }
    ]
  }
])
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span>แผนการพัฒนาแพลตฟอร์ม InsightGenie V2.0</span>
          <span class="bg-[#008779] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">2026</span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          เปรียบเทียบฟีเจอร์ InsightGenie V1.0 (2025) vs InsightGenie V2.0 (2026)
        </p>
      </div>

      <!-- Quick Summary Stats Badges -->
      <div class="flex items-center gap-3">
        <div class="bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-lg text-center">
          <span class="text-[10px] text-cyan-600 font-bold block uppercase">New Feature</span>
          <span class="text-lg font-black text-cyan-800">13</span>
        </div>
        <div class="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-center">
          <span class="text-[10px] text-amber-600 font-bold block uppercase">ปรับปรุงเพิ่มเติม</span>
          <span class="text-lg font-black text-amber-800">15</span>
        </div>
      </div>
    </div>

    <!-- Modules Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-[#008779] text-white text-[11px] font-bold uppercase tracking-wider">
              <th class="py-3 px-4 w-12 text-center">No</th>
              <th class="py-3 px-4 w-44">Module</th>
              <th class="py-3 px-6">Feature</th>
              <th class="py-3 px-4 w-32 text-center">InsightGenie V1.0</th>
              <th class="py-3 px-4 w-32 text-center bg-[#007366]">InsightGenie V2.0</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-for="mod in modules" :key="mod.no">
              <tr
                v-for="(feat, fIdx) in mod.features"
                :key="feat.name"
                class="hover:bg-gray-50/70 transition-colors"
                :class="feat.isNew ? 'bg-cyan-50/20' : ''"
              >
                <!-- Module No (Rowspan look) -->
                <td
                  v-if="fIdx === 0"
                  :rowspan="mod.features.length"
                  class="py-3 px-4 text-center font-bold text-gray-900 border-r border-gray-200 align-top bg-gray-50/40"
                >
                  {{ mod.no }}
                </td>

                <!-- Module Name -->
                <td
                  v-if="fIdx === 0"
                  :rowspan="mod.features.length"
                  class="py-3 px-4 font-bold text-gray-900 border-r border-gray-200 align-top bg-gray-50/40"
                >
                  {{ mod.name }}
                </td>

                <!-- Feature Name -->
                <td class="py-3 px-6 font-medium text-gray-800 flex items-center justify-between">
                  <span>{{ feat.name }}</span>
                  <span
                    v-if="feat.isNew"
                    class="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded"
                  >
                    New
                  </span>
                </td>

                <!-- V1 Status -->
                <td class="py-3 px-4 text-center border-l border-gray-100">
                  <UIcon
                    v-if="feat.v1"
                    name="i-lucide-check-circle"
                    class="size-4.5 text-emerald-500 mx-auto"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-x-circle"
                    class="size-4.5 text-rose-400 mx-auto"
                  />
                </td>

                <!-- V2 Status -->
                <td class="py-3 px-4 text-center bg-teal-50/30 border-l border-gray-100">
                  <UIcon
                    v-if="feat.v2"
                    name="i-lucide-check-circle"
                    class="size-4.5 text-[#008779] mx-auto"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-x-circle"
                    class="size-4.5 text-rose-400 mx-auto"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
