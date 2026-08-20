<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  projectId: {
    type: String,
    default: 'example-total-yield'
  },
  projectName: {
    type: String,
    default: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด'
  },
  activePhase: {
    type: String,
    default: 'Improve'
  },
  activeStep: {
    type: String,
    default: 'DOE'
  }
})

const isSidebarCollapsed = ref(false)

const dmaicPhases = [
  {
    name: 'Define',
    status: 'Complete',
    steps: [
      { name: 'Insight Data', icon: 'i-lucide-file-text', completed: true, path: 'define/insight-data' },
      { name: 'BEG Chart', icon: 'i-lucide-bar-chart', completed: true, path: 'define/beg-chart' }
    ]
  },
  {
    name: 'Measure',
    status: 'Complete',
    steps: [
      { name: 'Overview', icon: 'i-lucide-pie-chart', completed: true, path: 'measure/overview' },
      { name: 'Process Map', icon: 'i-lucide-git-merge', completed: true, path: 'measure/process-map' },
      { name: 'Fishbone Diagram', icon: 'i-lucide-git-branch', completed: true, path: 'measure/fishbone' },
      { name: 'FMEA', icon: 'i-lucide-table', completed: true, path: 'measure/fmea' },
      { name: 'Introduction to Hypothesis Testing', icon: 'i-lucide-file-question', completed: true, path: 'measure/intro-hypothesis' }
    ]
  },
  {
    name: 'Analyze',
    status: 'Complete',
    steps: [
      { name: 'Selected Tools', icon: 'i-lucide-wrench', completed: true, path: 'analyze/selected-tools' },
      { name: 'Action', icon: 'i-lucide-check-square', completed: true, path: 'analyze/action' },
      { name: 'Hypothesis Testing', icon: 'i-lucide-test-tube-2', completed: true, path: 'analyze/hypothesis' },
      { name: 'Summary', icon: 'i-lucide-file-check', completed: true, path: 'analyze/summary' }
    ]
  },
  {
    name: 'Improve',
    status: 'Complete',
    progress: '100% Complete',
    steps: [
      { name: 'DOE', icon: 'i-lucide-flask-conical', completed: true, path: 'improve/doe' },
      { name: 'Summary', icon: 'i-lucide-clipboard-check', completed: true, path: 'improve/summary' }
    ]
  },
  {
    name: 'Control',
    status: '',
    steps: [
      { name: 'Control Plan', icon: 'i-lucide-shield-check', completed: false, path: 'control/plan' },
      { name: 'Control Tracking', icon: 'i-lucide-activity', completed: false, path: 'control/tracking' }
    ]
  }
]
</script>

<template>
  <aside
    class="bg-white rounded-lg border border-gray-200/80 shadow-xs shrink-0 transition-all duration-300 overflow-hidden select-none"
    :class="isSidebarCollapsed ? 'w-14' : 'w-64'"
  >
    <!-- Project Title Header -->
    <div class="p-3.5 bg-[#008779] text-white flex items-center justify-between">
      <span v-if="!isSidebarCollapsed" class="font-bold text-xs truncate" :title="projectName">
        {{ projectName }}
      </span>
      <button
        type="button"
        class="text-white hover:opacity-80 transition-opacity p-0.5 cursor-pointer"
        @click="isSidebarCollapsed = !isSidebarCollapsed"
      >
        <UIcon :name="isSidebarCollapsed ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'" class="size-4" />
      </button>
    </div>

    <!-- Phases List -->
    <div class="divide-y divide-gray-100 p-2 space-y-3">
      <div v-for="phase in dmaicPhases" :key="phase.name" class="pt-2 first:pt-0">
        <!-- Phase Header -->
        <div
          class="flex items-center justify-between px-2 py-1.5 rounded text-xs font-bold"
          :class="activePhase === phase.name ? 'text-[#008779] bg-teal-50/70' : 'text-gray-700'"
        >
          <div class="flex items-center gap-1.5">
            <UIcon
              :name="phase.status === 'Complete' ? 'i-lucide-check-circle' : 'i-lucide-circle'"
              class="size-3.5"
              :class="phase.status === 'Complete' ? 'text-emerald-500' : 'text-gray-400'"
            />
            <span v-if="!isSidebarCollapsed">{{ phase.name }}</span>
          </div>
          <span
            v-if="!isSidebarCollapsed && phase.status"
            class="text-[10px] font-normal"
            :class="phase.status === 'Complete' ? 'text-emerald-600' : 'text-gray-400'"
          >
            {{ phase.status }}
          </span>
        </div>

        <!-- Progress bar (for active improve phase) -->
        <div v-if="!isSidebarCollapsed && phase.progress" class="px-2 py-1">
          <div class="h-1 bg-[#008779] rounded-full w-full"></div>
          <span class="text-[10px] text-gray-500 mt-0.5 block">{{ phase.progress }}</span>
        </div>

        <!-- Steps under Phase -->
        <div v-if="!isSidebarCollapsed" class="mt-1 space-y-0.5 pl-4">
          <NuxtLink
            v-for="step in phase.steps"
            :key="step.name"
            :to="`/admin/projects/${projectId}/${step.path}`"
            class="w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-medium transition-colors"
            :class="activePhase === phase.name && activeStep === step.name
              ? 'text-[#008779] bg-teal-50/70 font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-2 truncate">
              <UIcon :name="step.icon" class="size-3 text-gray-400" />
              <span class="truncate">{{ step.name }}</span>
            </div>
            <UIcon
              v-if="step.completed"
              name="i-lucide-check-circle-2"
              class="size-3 text-emerald-500 shrink-0"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>
