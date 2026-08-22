<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

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
const { project } = useProjectData(props.projectId)

const isProcessMapComplete = computed(() => project.value.isProcessMapCompleted !== false)
const isFishboneComplete = computed(() => project.value.isFishboneCompleted !== false)
const isFmeaComplete = computed(() => project.value.isFmeaCompleted !== false)
const isMeasureELearningPassed = computed(() => project.value.eLearningPassed?.Measure === true)

interface DmaicStep {
  name: string
  icon: string
  completed: boolean
  locked: boolean
  path: string
  lockReason?: string
}

interface DmaicPhase {
  name: string
  status: string
  progress?: string
  steps: DmaicStep[]
}

const dmaicPhases = computed<DmaicPhase[]>(() => [
  {
    name: 'Define',
    status: 'Complete',
    steps: [
      { name: 'Insight Data', icon: 'i-lucide-file-text', completed: true, locked: false, path: 'define/insight-data' },
      { name: 'BEG Chart', icon: 'i-lucide-bar-chart', completed: true, locked: false, path: 'define/beg-chart' }
    ]
  },
  {
    name: 'Measure',
    status: (isProcessMapComplete.value && isFishboneComplete.value && isFmeaComplete.value) ? 'Complete' : 'In Progress',
    steps: [
      { name: 'Overview', icon: 'i-lucide-pie-chart', completed: true, locked: false, path: 'measure/overview' },
      { name: 'Capability Analysis', icon: 'i-lucide-gauge', completed: true, locked: false, path: 'measure/capability' },
      { name: 'Process Map', icon: 'i-lucide-git-merge', completed: isProcessMapComplete.value, locked: false, path: 'measure/process-map' },
      { name: 'MSA', icon: 'i-lucide-ruler', completed: true, locked: false, path: 'measure/msa' },
      {
        name: 'Fishbone Diagram',
        icon: 'i-lucide-git-branch',
        completed: isFishboneComplete.value,
        locked: !isProcessMapComplete.value,
        lockReason: 'กรุณาจัดทำ Process Map ให้เสร็จสมบูรณ์ก่อน',
        path: 'measure/fishbone'
      },
      {
        name: 'FMEA',
        icon: 'i-lucide-table',
        completed: isFmeaComplete.value,
        locked: !isFishboneComplete.value,
        lockReason: 'ต้องทำก้างปลาก่อนถึงทำขั้นตอนนี้ได้ (Fishbone Required)',
        path: 'measure/fmea'
      },
      { name: 'Introduction to Hypothesis Testing', icon: 'i-lucide-file-question', completed: true, locked: false, path: 'measure/intro-hypothesis' }
    ]
  },
  {
    name: 'Analyze',
    status: isFmeaComplete.value ? 'In Progress' : 'Pending',
    steps: [
      {
        name: 'Selected Tools',
        icon: 'i-lucide-wrench',
        completed: true,
        locked: !isFmeaComplete.value,
        lockReason: 'เมื่อทำขั้นตอน Measure & FMEA เสร็จแล้ว จะเปิดให้ทำขั้นตอน Analysis ได้',
        path: 'analyze/selected-tools'
      },
      {
        name: 'Action',
        icon: 'i-lucide-check-square',
        completed: true,
        locked: !isFmeaComplete.value,
        lockReason: 'เมื่อทำขั้นตอน Measure & FMEA เสร็จแล้ว จะเปิดให้ทำขั้นตอน Analysis ได้',
        path: 'analyze/action'
      },
      {
        name: 'Hypothesis Testing',
        icon: 'i-lucide-test-tube-2',
        completed: true,
        locked: !isFmeaComplete.value,
        lockReason: 'เมื่อทำขั้นตอน Measure & FMEA เสร็จแล้ว จะเปิดให้ทำขั้นตอน Analysis ได้',
        path: 'analyze/hypothesis'
      },
      { name: 'Regression', icon: 'i-lucide-trending-up', completed: true, locked: false, path: 'analyze/regression' },
      { name: 'Summary', icon: 'i-lucide-file-check', completed: true, locked: false, path: 'analyze/summary' }
    ]
  },
  {
    name: 'Improve',
    status: 'Complete',
    progress: '100% Complete',
    steps: [
      { name: 'Action (Before/After)', icon: 'i-lucide-check-square', completed: true, locked: false, path: 'improve/action' },
      { name: 'DOE', icon: 'i-lucide-flask-conical', completed: true, locked: false, path: 'improve/doe' },
      { name: 'Simulation Model', icon: 'i-lucide-cpu', completed: true, locked: false, path: 'improve/simulation' },
      { name: 'Summary', icon: 'i-lucide-clipboard-check', completed: true, locked: false, path: 'improve/summary' }
    ]
  },
  {
    name: 'Control',
    status: 'Complete',
    steps: [
      { name: 'Control Plan', icon: 'i-lucide-shield-check', completed: true, locked: false, path: 'control/plan' },
      { name: 'Control Tracking', icon: 'i-lucide-activity', completed: true, locked: false, path: 'control/tracking' },
      { name: 'Project Finish', icon: 'i-lucide-award', completed: true, locked: false, path: 'control/finish' },
      { name: 'Realization', icon: 'i-lucide-line-chart', completed: true, locked: false, path: 'control/realization' }
    ]
  }
])
</script>

<template>
  <aside
    class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs shrink-0 transition-all duration-300 overflow-hidden select-none"
    :class="isSidebarCollapsed ? 'w-16' : 'w-68'"
  >
    <!-- Project Title Header -->
    <div class="p-4 bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 text-white flex items-center justify-between">
      <div v-if="!isSidebarCollapsed" class="min-w-0 pr-2">
        <span class="text-[10px] text-teal-200 uppercase font-bold tracking-wider block">DMAIC ROADMAP</span>
        <NuxtLink :to="`/admin/projects/${projectId}`" class="font-bold text-xs truncate block hover:text-amber-300 transition-colors" :title="projectName">
          {{ projectName }}
        </NuxtLink>
      </div>
      <button
        type="button"
        class="text-white hover:bg-white/10 p-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
        @click="isSidebarCollapsed = !isSidebarCollapsed"
      >
        <UIcon :name="isSidebarCollapsed ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'" class="size-4" />
      </button>
    </div>

    <!-- Phases List -->
    <div class="divide-y divide-slate-100 p-2.5 space-y-2">
      <div v-for="phase in dmaicPhases" :key="phase.name" class="pt-2 first:pt-0">
        <!-- Phase Header -->
        <div
          class="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
          :class="activePhase === phase.name ? 'text-[#008779] bg-teal-50/80' : 'text-slate-800'"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="phase.status === 'Complete' ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
              class="size-3.5"
              :class="phase.status === 'Complete' ? 'text-emerald-500' : 'text-slate-400'"
            />
            <span v-if="!isSidebarCollapsed">{{ phase.name }}</span>
          </div>
          <span
            v-if="!isSidebarCollapsed && phase.status"
            class="text-[10px] font-semibold"
            :class="phase.status === 'Complete' ? 'text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full' : 'text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full'"
          >
            {{ phase.status }}
          </span>
        </div>

        <!-- Steps under Phase -->
        <div v-if="!isSidebarCollapsed" class="mt-1 space-y-0.5 pl-3">
          <template v-for="step in phase.steps" :key="step.name">
            <!-- Normal Unlocked Step -->
            <NuxtLink
              v-if="!step.locked"
              :to="`/admin/projects/${projectId}/${step.path}`"
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all"
              :class="activePhase === phase.name && activeStep === step.name
                ? 'text-[#008779] bg-[#E3E8EF] font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'"
            >
              <div class="flex items-center gap-2 truncate">
                <UIcon :name="step.icon" class="size-3.5 text-slate-400" />
                <span class="truncate">{{ step.name }}</span>
              </div>
              <UIcon
                v-if="step.completed"
                name="i-lucide-check"
                class="size-3 text-emerald-600 shrink-0 font-bold"
              />
            </NuxtLink>

            <!-- Locked Step with tooltip -->
            <div
              v-else
              class="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-slate-400 bg-slate-50/60 cursor-not-allowed opacity-75 group relative"
              :title="step.lockReason"
            >
              <div class="flex items-center gap-2 truncate">
                <UIcon :name="step.icon" class="size-3.5 text-slate-300" />
                <span class="truncate">{{ step.name }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-lock" class="size-3 text-amber-500" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </aside>
</template>
