<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalWorkflow, type ApprovalWorkflow } from '~/composables/useApprovalWorkflow'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)
const { getProjectWorkflow } = useApprovalWorkflow()

const pcrWorkflow = computed<ApprovalWorkflow | undefined>(() => getProjectWorkflow(projectId, 'PCR') || getProjectWorkflow('p2', 'PCR'))
const pfrWorkflow = computed<ApprovalWorkflow | undefined>(() => getProjectWorkflow(projectId, 'PFR') || getProjectWorkflow('example-total-yield', 'PFR'))

const isWorkflowModalOpen = ref(false)
const activeWorkflowModal = ref<ApprovalWorkflow | null>(null)
const isVerifierModalOpen = ref(false)

const openWorkflowDrawer = (wf: ApprovalWorkflow) => {
  activeWorkflowModal.value = wf
  isWorkflowModalOpen.value = true
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- ========================================================= -->
    <!-- BREADCRUMBS & TOP NAV -->
    <!-- ========================================================= -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
          <UIcon name="i-lucide-home" class="size-3.5" />
          <span>Home</span>
        </NuxtLink>
        <span>›</span>
        <NuxtLink to="/admin/projects" class="hover:text-[#008779]">
          Projects
        </NuxtLink>
        <span>›</span>
        <span class="text-slate-900 font-bold truncate max-w-[300px]">
          {{ project.name }}
        </span>
      </div>

      <!-- Quick AI Project Assistant Button -->
      <NuxtLink
        to="/admin/chatbot"
        class="bg-gradient-to-r from-teal-50 to-indigo-50 hover:from-teal-100 hover:to-indigo-100 border border-teal-200/80 text-[#008779] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
      >
        <UIcon name="i-lucide-sparkles" class="size-3.5 text-amber-500" />
        <span>Ask AI about this project</span>
      </NuxtLink>
    </div>

    <!-- ========================================================= -->
    <!-- MAIN WORKSPACE LAYOUT WITH DMAIC SIDEBAR -->
    <!-- ========================================================= -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="Insight Data"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-6 min-w-0 w-full">
        
        <!-- HERO BANNER -->
        <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="space-y-2 relative z-10 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                {{ project.status }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-teal-100 border border-white/20">
                Phase: {{ project.phase }}
              </span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight">
              {{ project.name }}
            </h1>
            <p class="text-xs text-teal-100/90 leading-relaxed">
              {{ project.plant }} • Black Belt Lead: {{ project.leader }}
            </p>
          </div>

          <div class="flex items-center gap-2.5 relative z-10 shrink-0">
            <button
              type="button"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              @click="isVerifierModalOpen = true"
            >
              <UIcon name="i-lucide-users" class="size-4 text-amber-300" />
              <span>Team & Approvers</span>
            </button>

            <NuxtLink
              :to="`/admin/projects/${projectId}/presentation`"
              class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <UIcon name="i-lucide-presentation" class="size-4 text-[#008779]" />
              <span>Presentation</span>
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- LEFT CARD: Project Overview (8 Cols) -->
          <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UIcon name="i-lucide-info" class="size-4 text-[#008779]" />
                <span>Project Parameters & Metadata</span>
              </h2>
              <span class="text-xs text-slate-400 font-mono">ID: {{ projectId }}</span>
            </div>

            <!-- 4 Stat Boxes in Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Owner -->
              <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-start gap-3.5">
                <div class="size-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-user" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PROJECT LEADER</span>
                  <p class="text-xs font-bold text-slate-900 truncate">{{ project.leader }}</p>
                </div>
              </div>

              <!-- Location -->
              <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-start gap-3.5">
                <div class="size-9 rounded-xl bg-teal-50 text-[#008779] border border-teal-200/60 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-map-pin" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PLANT LOCATION</span>
                  <p class="text-xs font-bold text-slate-900 truncate">{{ project.plant }}</p>
                </div>
              </div>

              <!-- Year -->
              <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-start gap-3.5">
                <div class="size-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-calendar" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">FISCAL YEAR</span>
                  <p class="text-xs font-bold text-slate-900 font-mono">{{ project.year }}</p>
                </div>
              </div>

              <!-- Last Updated -->
              <div class="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-start gap-3.5">
                <div class="size-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0">
                  <UIcon name="i-lucide-clock" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">LAST TELEMETRY SYNC</span>
                  <p class="text-xs font-bold text-slate-900 font-mono">{{ project.lastUpdated }}</p>
                </div>
              </div>
            </div>

            <!-- Milestone Approval Status Bar (PCR & PFR) -->
            <div class="pt-4 border-t border-slate-100 space-y-3">
              <span class="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <UIcon name="i-lucide-file-check" class="size-4 text-[#008779]" />
                <span>Stage Gate Sign-off Workflows (CPF Corporate E-Sign):</span>
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <!-- PCR Card -->
                <div
                  v-if="pcrWorkflow"
                  class="border border-blue-200/80 bg-blue-50/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50/80 transition-all shadow-2xs group"
                  @click="openWorkflowDrawer(pcrWorkflow)"
                >
                  <div class="space-y-1">
                    <span class="font-bold text-blue-950 block group-hover:text-blue-700">1. Project Charter (PCR)</span>
                    <span class="text-[10px] text-blue-700 font-mono block">Status: {{ pcrWorkflow.status }} • {{ pcrWorkflow.steps.filter(s => s.status === 'Approved').length }}/{{ pcrWorkflow.steps.length }} Signed</span>
                  </div>
                  <UIcon name="i-lucide-chevron-right" class="size-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </div>

                <!-- PFR Card -->
                <div
                  v-if="pfrWorkflow"
                  class="border border-teal-200/80 bg-teal-50/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-teal-50/80 transition-all shadow-2xs group"
                  @click="openWorkflowDrawer(pfrWorkflow)"
                >
                  <div class="space-y-1">
                    <span class="font-bold text-teal-950 block group-hover:text-teal-700">2. Project Final Report (PFR)</span>
                    <span class="text-[10px] text-teal-700 font-mono block">Status: {{ pfrWorkflow.status }} • {{ pfrWorkflow.steps.filter(s => s.status === 'Approved').length }}/{{ pfrWorkflow.steps.length }} Signed</span>
                  </div>
                  <UIcon name="i-lucide-chevron-right" class="size-4 text-[#008779] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT CARD: Overall Progress (4 Cols) -->
          <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-500 font-medium block">Overall DMAIC Progress</span>
                <p class="text-2xl font-bold text-[#008779] font-mono">100%</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#008779] border border-teal-200 shadow-2xs">
                {{ project.phase }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-[#008779] to-teal-500 h-full w-full rounded-full"></div>
            </div>

            <!-- 4 Phase Step Counters -->
            <div class="grid grid-cols-2 gap-3 text-center">
              <NuxtLink
                :to="`/admin/projects/${projectId}/define/insight-data`"
                class="bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-xl p-3 transition-all cursor-pointer shadow-2xs"
              >
                <span class="text-[11px] text-slate-500 font-medium block">Define</span>
                <span class="text-xs font-bold text-slate-900 font-mono">2/2 Steps</span>
              </NuxtLink>

              <NuxtLink
                :to="`/admin/projects/${projectId}/measure/overview`"
                class="bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-xl p-3 transition-all cursor-pointer shadow-2xs"
              >
                <span class="text-[11px] text-slate-500 font-medium block">Measure</span>
                <span class="text-xs font-bold text-slate-900 font-mono">7/7 Steps</span>
              </NuxtLink>

              <NuxtLink
                :to="`/admin/projects/${projectId}/analyze/hypothesis`"
                class="bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-xl p-3 transition-all cursor-pointer shadow-2xs"
              >
                <span class="text-[11px] text-slate-500 font-medium block">Analyze</span>
                <span class="text-xs font-bold text-slate-900 font-mono">5/5 Steps</span>
              </NuxtLink>

              <NuxtLink
                :to="`/admin/projects/${projectId}/improve/simulation`"
                class="bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 rounded-xl p-3 transition-all cursor-pointer shadow-2xs"
              >
                <span class="text-[11px] text-slate-500 font-medium block">Improve</span>
                <span class="text-xs font-bold text-slate-900 font-mono">4/4 Steps</span>
              </NuxtLink>
            </div>

            <!-- Bottom Action Button -->
            <NuxtLink
              :to="`/admin/projects/${projectId}/control/finish`"
              class="w-full bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <UIcon name="i-lucide-award" class="size-4" />
              <span>View Project Finish & PFR</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Embedded Approval Workflow Drawer -->
    <ApprovalWorkflowModal
      v-if="isWorkflowModalOpen && activeWorkflowModal"
      :workflow="activeWorkflowModal"
      @close="isWorkflowModalOpen = false"
    />

    <!-- Embedded Project Member & Approver Verifier Modal -->
    <ProjectMemberVerifierModal
      v-if="isVerifierModalOpen"
      :project-id="projectId"
      :project-name="project.name"
      @close="isVerifierModalOpen = false"
    />
  </div>
</template>
