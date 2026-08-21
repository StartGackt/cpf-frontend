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
      { name: 'AI Chatbot (Google Gemini)', v1: false, v2: true, isNew: true }
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
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- HERO HEADER -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-map" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              แผนการพัฒนาแพลตฟอร์ม InsightGenie V2.0
            </h1>
            <span class="text-xs text-teal-200">เปรียบเทียบฟีเจอร์ InsightGenie V1.0 (2025) vs InsightGenie V2.0 (2026)</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          การยกระดับแพลตฟอร์ม Six Sigma สู่ระบบ AI-Driven Statistical Quality Assurance ครบวงจร
        </p>
      </div>

      <!-- Quick Summary Stats Badges -->
      <div class="flex items-center gap-3 relative z-10 shrink-0">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl text-center shadow-xs">
          <span class="text-[10px] text-teal-200 font-bold block uppercase">NEW FEATURES</span>
          <span class="text-xl font-black text-white font-mono">13</span>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl text-center shadow-xs">
          <span class="text-[10px] text-amber-200 font-bold block uppercase">ENHANCEMENTS</span>
          <span class="text-xl font-black text-white font-mono">15</span>
        </div>
      </div>
    </div>

    <!-- Modules Table -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gradient-to-r from-teal-900 via-[#008779] to-teal-800 text-white text-[11px] font-bold uppercase tracking-wider">
              <th class="py-3.5 px-4 w-14 text-center">No</th>
              <th class="py-3.5 px-4 w-48">Module</th>
              <th class="py-3.5 px-6">Feature</th>
              <th class="py-3.5 px-4 w-36 text-center">InsightGenie V1.0</th>
              <th class="py-3.5 px-4 w-36 text-center bg-teal-950/40">InsightGenie V2.0</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="mod in modules" :key="mod.no">
              <tr
                v-for="(feat, fIdx) in mod.features"
                :key="feat.name"
                class="hover:bg-slate-50/70 transition-colors"
                :class="feat.isNew ? 'bg-teal-50/30' : ''"
              >
                <!-- Module No -->
                <td
                  v-if="fIdx === 0"
                  :rowspan="mod.features.length"
                  class="py-3.5 px-4 text-center font-bold text-slate-900 border-r border-slate-200 align-top bg-slate-50/50"
                >
                  {{ mod.no }}
                </td>

                <!-- Module Name -->
                <td
                  v-if="fIdx === 0"
                  :rowspan="mod.features.length"
                  class="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-200 align-top bg-slate-50/50"
                >
                  {{ mod.name }}
                </td>

                <!-- Feature Name -->
                <td class="py-3.5 px-6 font-medium text-slate-800 flex items-center justify-between">
                  <span>{{ feat.name }}</span>
                  <span
                    v-if="feat.isNew"
                    class="bg-teal-100 text-[#008779] text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200 shadow-2xs"
                  >
                    New in V2.0
                  </span>
                </td>

                <!-- V1 Status -->
                <td class="py-3.5 px-4 text-center border-l border-slate-100">
                  <UIcon
                    v-if="feat.v1"
                    name="i-lucide-check-circle-2"
                    class="size-4 text-emerald-500 mx-auto"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-x-circle"
                    class="size-4 text-slate-300 mx-auto"
                  />
                </td>

                <!-- V2 Status -->
                <td class="py-3.5 px-4 text-center bg-teal-50/40 border-l border-slate-100">
                  <UIcon
                    v-if="feat.v2"
                    name="i-lucide-check-circle-2"
                    class="size-4 text-[#008779] mx-auto font-bold"
                  />
                  <UIcon
                    v-else
                    name="i-lucide-x-circle"
                    class="size-4 text-slate-300 mx-auto"
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
