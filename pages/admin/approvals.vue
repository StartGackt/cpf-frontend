<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalWorkflow, type ApprovalWorkflow, type ApprovalStep } from '~/composables/useApprovalWorkflow'
import { useCompanyDirectory, type ProvisioningRequest } from '~/composables/useCompanyDirectory'

const { workflows } = useApprovalWorkflow()
const { provisioningRequests, approveProvisioningRequest, rejectProvisioningRequest } = useCompanyDirectory()

const activeTab = ref<'workflows' | 'provisioning' | 'audit' | 'email-sim'>('workflows')
const searchQuery = ref('')
const filterType = ref<'ALL' | 'PCR' | 'PFR'>('ALL')
const filterStatus = ref<string>('ALL')

const selectedWorkflow = ref<ApprovalWorkflow | null>(null)
const isWorkflowModalOpen = ref(false)

const selectedSimWorkflow = ref<ApprovalWorkflow | null>(null)
const selectedSimStep = ref<ApprovalStep | null>(null)
const isSimModalOpen = ref(false)

const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

// Filtered Workflows
const filteredWorkflows = computed(() => {
  let list = [...workflows.value]
  if (filterType.value !== 'ALL') {
    list = list.filter(w => w.reportType === filterType.value)
  }
  if (filterStatus.value !== 'ALL') {
    list = list.filter(w => w.status === filterStatus.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(w =>
      w.projectName.toLowerCase().includes(q) ||
      w.location.toLowerCase().includes(q) ||
      w.submittedBy.toLowerCase().includes(q)
    )
  }
  return list
})

// Filtered Account Provisioning Requests
const pendingProvisioningList = computed(() => {
  return provisioningRequests.value
})

const pendingProvisioningCount = computed(() => {
  return provisioningRequests.value.filter(r => r.status === 'Pending Admin Approval').length
})

const openWorkflowModal = (wf: ApprovalWorkflow) => {
  selectedWorkflow.value = wf
  isWorkflowModalOpen.value = true
}

const openSimulatorForWorkflow = (wf: ApprovalWorkflow) => {
  selectedSimWorkflow.value = wf
  selectedSimStep.value = wf.steps.find(s => s.status === 'Pending') || wf.steps[0] || null
  isSimModalOpen.value = true
}

const handleApproveProvisioning = (req: ProvisioningRequest) => {
  const res = approveProvisioningRequest(req.id)
  if (res.success) {
    showToast(res.message)
  }
}

const handleRejectProvisioning = (req: ProvisioningRequest) => {
  const reason = prompt('Reason for rejecting account provisioning:')
  if (reason !== null) {
    rejectProvisioningRequest(req.id, reason)
    showToast('Provisioning request rejected')
  }
}

// Collect all signed E-Signature certificates across all workflows
const allSignedAuditLogs = computed(() => {
  const logs: any[] = []
  workflows.value.forEach(wf => {
    wf.steps.forEach(st => {
      if (st.signature) {
        logs.push({
          projectName: wf.projectName,
          reportType: wf.reportType,
          role: st.role,
          signerName: st.signature.signerName,
          signerEmail: st.signature.signerEmail,
          certificateId: st.signature.certificateId,
          signedAt: st.signature.signedAt,
          ipAddress: st.signature.ipAddress,
          type: st.signature.signatureType
        })
      }
    })
  })
  return logs
})
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Feedback Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toastMsg"
        class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-500 pb-1">
          <NuxtLink to="/admin" class="hover:text-[#008779]">Home</NuxtLink>
          <span>›</span>
          <span class="text-gray-900 font-bold">Enterprise Approval Center</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span>Enterprise Approval & Provisioning Center</span>
          <span class="text-xs bg-teal-50 text-[#008779] border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
            CPF E-Sign & API Integrated
          </span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Multi-level sign-offs for Project Charter (PCR) & Final Report (PFR), E-Signature authorization, and Admin User Provisioning.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/projects"
          class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-folder-kanban" class="size-3.5" />
          <span>Projects Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Navigation Tabs Bar -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-1.5 flex items-center gap-1 flex-wrap text-xs">
      <button
        type="button"
        class="px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'workflows' ? 'bg-[#008779] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        @click="activeTab = 'workflows'"
      >
        <UIcon name="i-lucide-clipboard-check" class="size-4" />
        <span>Project Sign-offs (PCR & PFR)</span>
        <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono" :class="activeTab === 'workflows' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'">
          {{ workflows.length }}
        </span>
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'provisioning' ? 'bg-[#008779] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        @click="activeTab = 'provisioning'"
      >
        <UIcon name="i-lucide-user-plus" class="size-4" />
        <span>Pending Account Provisioning & Auto-Invite</span>
        <span
          v-if="pendingProvisioningCount > 0"
          class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeTab === 'provisioning' ? 'bg-amber-400 text-gray-950' : 'bg-amber-100 text-amber-800'"
        >
          {{ pendingProvisioningCount }}
        </span>
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'audit' ? 'bg-[#008779] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        @click="activeTab = 'audit'"
      >
        <UIcon name="i-lucide-shield-check" class="size-4" />
        <span>E-Signature Registry ({{ allSignedAuditLogs.length }})</span>
      </button>
    </div>

    <!-- TAB 1: Project Sign-offs (PCR & PFR Workflows) -->
    <div v-show="activeTab === 'workflows'" class="space-y-4">
      <!-- Search & Filters -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-1 max-w-md">
          <div class="relative w-full">
            <UIcon name="i-lucide-search" class="size-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:border-[#008779] focus:bg-white"
              placeholder="Search projects, leader, or plant location..."
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Report Type Filter -->
          <div class="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              type="button"
              class="px-2.5 py-1 rounded text-xs font-semibold transition-colors"
              :class="filterType === 'ALL' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'"
              @click="filterType = 'ALL'"
            >
              All Types
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded text-xs font-semibold transition-colors"
              :class="filterType === 'PCR' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'"
              @click="filterType = 'PCR'"
            >
              PCR (Charter)
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded text-xs font-semibold transition-colors"
              :class="filterType === 'PFR' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'"
              @click="filterType = 'PFR'"
            >
              PFR (Final)
            </button>
          </div>

          <!-- Status Filter -->
          <select
            v-model="filterStatus"
            class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Needs Revision">Needs Revision</option>
          </select>
        </div>
      </div>

      <!-- Workflows List Table Card -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4">Project & Location</th>
              <th class="py-3.5 px-4">Document Type</th>
              <th class="py-3.5 px-4">Sequential Progress</th>
              <th class="py-3.5 px-4">Target Savings / Gain</th>
              <th class="py-3.5 px-4 text-center">Status</th>
              <th class="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="wf in filteredWorkflows" :key="wf.id" class="hover:bg-gray-50/60 transition-colors">
              <!-- Project Name & Location -->
              <td class="py-3.5 px-4">
                <span class="font-bold text-gray-900 block text-xs">{{ wf.projectName }}</span>
                <span class="text-[11px] text-gray-500 block">{{ wf.location }}</span>
                <span class="text-[10px] text-gray-400 font-mono mt-0.5 block">Leader: {{ wf.submittedBy }}</span>
              </td>

              <!-- Document Type Badge -->
              <td class="py-3.5 px-4">
                <span
                  class="font-black text-[10px] uppercase px-2 py-0.5 rounded font-mono block w-fit"
                  :class="wf.reportType === 'PCR' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'"
                >
                  {{ wf.reportType === 'PCR' ? 'PCR (Project Charter)' : 'PFR (Project Final)' }}
                </span>
                <span class="text-[10px] text-gray-400 font-mono mt-0.5 block">{{ wf.metricsSummary.pfrDocId }}</span>
              </td>

              <!-- Sequential Progress Steps -->
              <td class="py-3.5 px-4 min-w-[200px]">
                <div class="flex items-center gap-1 mb-1">
                  <div
                    v-for="(st, sIdx) in wf.steps"
                    :key="st.id"
                    class="flex-1 h-2 rounded-full transition-all"
                    :class="[
                      st.status === 'Approved' ? 'bg-emerald-500' :
                      st.status === 'Pending' ? 'bg-amber-400 animate-pulse' :
                      st.status === 'Needs Revision' ? 'bg-rose-500' :
                      'bg-gray-200'
                    ]"
                    :title="`Step ${sIdx + 1}: ${st.role} (${st.status})`"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Step {{ wf.currentStepNumber }} of {{ wf.steps.length }}</span>
                  <span class="font-medium text-gray-700">Next: {{ wf.steps.find(s => s.status === 'Pending')?.role || 'Complete' }}</span>
                </div>
              </td>

              <!-- Financial Metric -->
              <td class="py-3.5 px-4">
                <span class="font-bold text-[#008779] block text-xs">{{ wf.metricsSummary.financialSavings }}</span>
                <span class="text-[10px] text-gray-500">Target: {{ wf.metricsSummary.targetGoal }}</span>
              </td>

              <!-- Status Badge -->
              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                  :class="[
                    wf.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    wf.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  ]"
                >
                  <span class="size-1.5 rounded-full" :class="wf.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'"></span>
                  <span>{{ wf.status }}</span>
                </span>
              </td>

              <!-- Actions: Review, E-Sign, Email Simulate -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3 py-1.5 rounded-md transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                    @click="openWorkflowModal(wf)"
                  >
                    <UIcon name="i-lucide-file-signature" class="size-3.5" />
                    <span>Review & Sign</span>
                  </button>

                  <button
                    type="button"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded-md transition-colors cursor-pointer"
                    title="Simulate Approver Email Link Action"
                    @click="openSimulatorForWorkflow(wf)"
                  >
                    <UIcon name="i-lucide-mail" class="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Pending Account Provisioning & Auto-Invite -->
    <div v-show="activeTab === 'provisioning'" class="space-y-4">
      <div class="bg-amber-50/60 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-xs">
        <UIcon name="i-lucide-info" class="size-4 text-amber-700 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h3 class="font-bold text-amber-950 text-xs">
            Admin Account Creation & Email Auto-Invite Queue
          </h3>
          <p class="text-amber-800 leading-relaxed">
            When Project Leaders assign new team members, external consultants, or stakeholders not found in the CPF Master Directory, a provisioning request is queued here. Click <strong>"Approve & Auto-Invite"</strong> to create their account and dispatch an automated invitation email with an activation link.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4">Candidate & Email</th>
              <th class="py-3 px-4">Project & Requested By</th>
              <th class="py-3 px-4">Requested Role / Belt</th>
              <th class="py-3 px-4">Department / Plant</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-center">Admin Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="req in pendingProvisioningList" :key="req.id" class="hover:bg-gray-50/60 transition-colors">
              <td class="py-3 px-4">
                <span class="font-bold text-gray-900 block text-xs">{{ req.name }}</span>
                <span class="text-[11px] text-gray-600 block font-mono">{{ req.email }}</span>
              </td>
              <td class="py-3 px-4">
                <span class="font-medium text-gray-900 block truncate max-w-xs">{{ req.projectName }}</span>
                <span class="text-[10px] text-gray-400 block">By: {{ req.requestedBy }} • {{ req.requestedAt }}</span>
              </td>
              <td class="py-3 px-4">
                <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded block w-fit">
                  {{ req.requestedRole }}
                </span>
                <span class="text-[10px] text-gray-500 block mt-0.5">{{ req.requestedBelt }}</span>
              </td>
              <td class="py-3 px-4 text-gray-600">
                <span class="block">{{ req.department }}</span>
                <span class="text-[10px] text-gray-400">{{ req.location }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  :class="req.status === 'Approved & Invited' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                >
                  {{ req.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <div v-if="req.status === 'Pending Admin Approval'" class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    @click="handleApproveProvisioning(req)"
                  >
                    <UIcon name="i-lucide-user-check" class="size-3" />
                    <span>Approve & Auto-Invite</span>
                  </button>
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1"
                    @click="handleRejectProvisioning(req)"
                  >
                    Reject
                  </button>
                </div>
                <div v-else class="text-[11px] text-emerald-600 font-mono flex items-center justify-center gap-1">
                  <UIcon name="i-lucide-mail-check" class="size-3.5" />
                  <span>Email Sent (Token: {{ req.inviteToken?.slice(0, 14) }})</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: E-Signature Registry & Audit Trail -->
    <div v-show="activeTab === 'audit'" class="space-y-4">
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div class="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-fingerprint" class="size-4 text-[#008779]" />
            <h3 class="font-bold text-xs text-gray-900">
              Cryptographic E-Signature Audit Log Registry
            </h3>
          </div>
          <span class="text-[10px] text-gray-500 font-mono">Governed under CPF Digital Authentication Standards</span>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4">Certificate ID</th>
              <th class="py-3 px-4">Signer Identity</th>
              <th class="py-3 px-4">Project & Milestone</th>
              <th class="py-3 px-4">Signature Mode</th>
              <th class="py-3 px-4">IP / Verified Location</th>
              <th class="py-3 px-4 text-center">Timestamp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-mono text-[11px]">
            <tr v-for="(cert, cIdx) in allSignedAuditLogs" :key="cIdx" class="hover:bg-gray-50/60">
              <td class="py-3 px-4 font-bold text-teal-700">{{ cert.certificateId }}</td>
              <td class="py-3 px-4 font-sans font-medium text-gray-900">
                <span class="block font-bold">{{ cert.signerName }}</span>
                <span class="text-[10px] text-gray-500 font-mono">{{ cert.signerEmail }} ({{ cert.role }})</span>
              </td>
              <td class="py-3 px-4 font-sans text-gray-800">
                <span class="font-bold block truncate max-w-xs">{{ cert.projectName }}</span>
                <span class="text-[10px] text-[#008779] font-mono">{{ cert.reportType }} Sign-off</span>
              </td>
              <td class="py-3 px-4 font-sans">
                <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                  {{ cert.type }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-500">{{ cert.ipAddress }}</td>
              <td class="py-3 px-4 text-center text-gray-600">{{ cert.signedAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Active Full Workflow Review Modal -->
    <ApprovalWorkflowModal
      v-if="isWorkflowModalOpen && selectedWorkflow"
      :workflow="selectedWorkflow"
      @close="isWorkflowModalOpen = false"
      @updated="showToast('Workflow updated successfully!')"
    />

    <!-- Active Email Simulator Modal -->
    <EmailApprovalSimulatorModal
      v-if="isSimModalOpen && selectedSimWorkflow && selectedSimStep"
      :workflow="selectedSimWorkflow"
      :step="selectedSimStep"
      @close="isSimModalOpen = false"
      @approved="showToast('Approved via email token simulation!')"
      @revised="showToast('Revision sent via email simulation!')"
    />
  </div>
</template>
