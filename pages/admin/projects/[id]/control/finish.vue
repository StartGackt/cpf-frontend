<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalWorkflow, type ApprovalWorkflow } from '~/composables/useApprovalWorkflow'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { getProjectWorkflow } = useApprovalWorkflow()
const { project, projectSummary } = useProjectData(projectId)

const isWorkflowModalOpen = ref(false)

const pfrWorkflow = computed<ApprovalWorkflow | undefined>(() => {
  return getProjectWorkflow(projectId, 'PFR') || getProjectWorkflow('example-total-yield', 'PFR')
})
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
      <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[200px]">
        {{ project.name }}
      </NuxtLink>
      <span>›</span>
      <span class="text-gray-700 font-medium">Control</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Project Finish & PFR Sign-off</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Project Finish"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- 1. Close-out Congratulation Banner -->
        <div class="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="bg-amber-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded tracking-wide">
                PROJECT CLOSED & CERTIFIED
              </span>
              <span class="text-xs text-teal-200 font-mono">Doc: {{ projectSummary.pfrDocId }}</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-white">
              {{ projectSummary.name }}
            </h1>
            <p class="text-xs text-teal-100">
              PFR Workflow Approved. Project documentation has been automatically synced to CPF KM Repository.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <NuxtLink
              :to="`/admin/projects/${projectId}/presentation`"
              class="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <UIcon name="i-lucide-presentation" class="size-3.5" />
              <span>Presentation Mode</span>
            </NuxtLink>

            <button
              type="button"
              class="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
              @click="isWorkflowModalOpen = true"
            >
              <UIcon name="i-lucide-file-signature" class="size-3.5 text-teal-300" />
              <span>View Approval Workflow</span>
            </button>

            <NuxtLink
              :to="`/admin/projects/${projectId}/report`"
              class="bg-white text-[#008779] hover:bg-gray-100 text-xs font-bold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <UIcon name="i-lucide-file-check" class="size-4" />
              <span>Export Signed PFR (PDF)</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Final Verified Metrics Grid (Dynamic from Live Project Data) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">FINAL YIELD GAIN</span>
            <p class="text-2xl font-bold text-emerald-700 font-mono">{{ projectSummary.finalYield }}</p>
            <span class="text-[10px] text-emerald-600 font-semibold font-mono">{{ projectSummary.yieldImprovement }} vs Baseline</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">GIVEAWAY REDUCTION</span>
            <p class="text-2xl font-bold text-[#008779] font-mono">{{ projectSummary.finalGiveaway }}</p>
            <span class="text-[10px] text-teal-600 font-mono">From 4.25% &rarr; {{ projectSummary.finalGiveaway }}</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">FINANCIAL BENEFIT</span>
            <p class="text-xl font-bold text-teal-800 font-mono">{{ projectSummary.verifiedAnnualSavings }}</p>
            <span class="text-[10px] text-emerald-600 font-semibold">Audited Cost Savings</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">CAPABILITY STABILITY</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">{{ projectSummary.cpk }}</p>
            <span class="text-[10px] text-gray-500">Six Sigma Sustained</span>
          </div>
        </div>

        <!-- 3. Four-Step E-Signature Close-out Approval Chain -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>PFR Electronic Sign-off Chain (E-Signature Verified)</span>
                <span class="text-[10px] bg-teal-50 text-[#008779] border border-teal-200 font-bold px-2 py-0.5 rounded">
                  CPF E-Sign Security Standards
                </span>
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Sequential approval workflow linked with CPF Corporate IAM authentication and Cryptographic Audit Trail
              </p>
            </div>
            <button
              type="button"
              class="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              @click="isWorkflowModalOpen = true"
            >
              <UIcon name="i-lucide-external-link" class="size-3.5" />
              <span>Full Audit Trail</span>
            </button>
          </div>

          <div v-if="pfrWorkflow" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div
              v-for="step in pfrWorkflow.steps"
              :key="step.id"
              class="border rounded-lg p-3.5 space-y-2 transition-all"
              :class="[
                step.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/40' :
                step.status === 'Pending' ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-400' :
                'border-gray-200 bg-gray-50/50'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-gray-700 uppercase">Step {{ step.stepNumber }}: {{ step.role }}</span>
                <UIcon
                  :name="step.status === 'Approved' ? 'i-lucide-check-circle-2' : 'i-lucide-clock'"
                  class="size-4"
                  :class="step.status === 'Approved' ? 'text-emerald-600' : 'text-amber-500'"
                />
              </div>
              <p class="font-bold text-gray-900 text-xs">{{ step.approverName }}</p>
              <div class="text-[10px] text-gray-600 space-y-0.5 font-mono pt-1 border-t border-gray-200/60">
                <p>Status: <strong :class="step.status === 'Approved' ? 'text-emerald-700' : 'text-amber-700'">{{ step.status }}</strong></p>
                <p>Date: {{ step.signedAt || 'Pending' }}</p>
                <p v-if="step.signature" class="text-teal-800 font-semibold truncate" :title="step.signature.certificateId">
                  {{ step.signature.certificateId }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. KM Repository Auto-Sync Confirmation Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-9 rounded-lg bg-teal-50 text-[#008779] flex items-center justify-center">
              <UIcon name="i-lucide-database" class="size-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900">
                CPF KM Repository Storage Status: Active & Searchable
              </h3>
              <p class="text-gray-500 text-[11px] mt-0.5">
                Archived under: Food Business › Chicken Processing › Yield & Giveaway Category
              </p>
            </div>
          </div>

          <NuxtLink
            to="/admin/km-repository"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
          >
            <span>Open KM Repository</span>
            <UIcon name="i-lucide-arrow-right" class="size-3" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Embedded Approval Workflow Drawer -->
    <ApprovalWorkflowModal
      v-if="isWorkflowModalOpen && pfrWorkflow"
      :workflow="pfrWorkflow"
      @close="isWorkflowModalOpen = false"
    />
  </div>
</template>
