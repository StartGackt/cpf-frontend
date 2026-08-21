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
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
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
        class="fixed top-5 right-5 z-50 bg-slate-900 border border-teal-500 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- ========================================================= -->
    <!-- HERO HEADER: Enterprise Approval & Provisioning Center -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <!-- Ambient Sparkle Glow in Background -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-clipboard-check" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Enterprise Approval & Provisioning Center
            </h1>
            <span class="text-xs text-teal-200">Multi-level Sign-offs for PCR & PFR, E-Signature Audit, and Admin Queue</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          ระบบทบทวนและอนุมัติข้ามเฟส (Stage Gate Tollgate Review) พร้อมลายเซ็นดิจิทัล E-Signature ที่ได้รับการรับรองตามมาตรฐาน Six Sigma
        </p>
      </div>

      <!-- Quick Action Navigation -->
      <div class="flex items-center gap-2.5 relative z-10 shrink-0">
        <NuxtLink
          to="/admin/projects"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <UIcon name="i-lucide-folder-kanban" class="size-4 text-teal-200" />
          <span>Projects Portfolio</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/chatbot"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
        >
          <UIcon name="i-lucide-sparkles" class="size-4 text-amber-500 group-hover:rotate-12 transition-transform" />
          <span>AI Gate Advisor</span>
        </NuxtLink>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- NAVIGATION TABS (Pill Style) -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-2 flex items-center gap-1.5 flex-wrap text-xs">
      <button
        type="button"
        class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'workflows' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="activeTab = 'workflows'"
      >
        <UIcon name="i-lucide-clipboard-check" class="size-4" />
        <span>Project Sign-offs (PCR & PFR)</span>
        <span class="px-2 py-0.2 rounded-full text-[10px] font-mono" :class="activeTab === 'workflows' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'">
          {{ workflows.length }}
        </span>
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'provisioning' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="activeTab = 'provisioning'"
      >
        <UIcon name="i-lucide-user-plus" class="size-4" />
        <span>Account Provisioning Queue</span>
        <span
          v-if="pendingProvisioningCount > 0"
          class="px-2 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeTab === 'provisioning' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'"
        >
          {{ pendingProvisioningCount }}
        </span>
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'audit' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="activeTab = 'audit'"
      >
        <UIcon name="i-lucide-shield-check" class="size-4" />
        <span>E-Signature Registry ({{ allSignedAuditLogs.length }})</span>
      </button>
    </div>

    <!-- TAB 1: Project Sign-offs (PCR & PFR Workflows) -->
    <div v-show="activeTab === 'workflows'" class="space-y-4">
      <!-- Search & Filters -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-1 max-w-md">
          <div class="relative w-full">
            <UIcon name="i-lucide-search" class="size-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              v-model="searchQuery"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-[#008779] focus:bg-white transition-all"
              placeholder="Search projects, leader, or plant location..."
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Report Type Filter -->
          <div class="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              type="button"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
              :class="filterType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
              @click="filterType = 'ALL'"
            >
              All Types
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
              :class="filterType === 'PCR' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
              @click="filterType = 'PCR'"
            >
              PCR
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
              :class="filterType === 'PFR' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
              @click="filterType = 'PFR'"
            >
              PFR
            </button>
          </div>

          <!-- Status Filter -->
          <select
            v-model="filterStatus"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Needs Revision">Needs Revision</option>
          </select>
        </div>
      </div>

      <!-- Workflows List Table Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4 font-semibold">PROJECT & LOCATION</th>
              <th class="py-3.5 px-4 font-semibold">DOCUMENT TYPE</th>
              <th class="py-3.5 px-4 font-semibold">SEQUENTIAL PROGRESS</th>
              <th class="py-3.5 px-4 font-semibold">TARGET SAVINGS / GAIN</th>
              <th class="py-3.5 px-4 text-center font-semibold">STATUS</th>
              <th class="py-3.5 px-4 text-center font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="wf in filteredWorkflows" :key="wf.id" class="hover:bg-slate-50/70 transition-colors group">
              <!-- Project Name & Location -->
              <td class="py-4 px-4">
                <span class="font-bold text-slate-900 block text-xs group-hover:text-[#008779] transition-colors">{{ wf.projectName }}</span>
                <span class="text-[11px] text-slate-500 block">{{ wf.location }}</span>
                <span class="text-[10px] text-slate-400 font-mono mt-0.5 block">Leader: {{ wf.submittedBy }}</span>
              </td>

              <!-- Document Type Badge -->
              <td class="py-4 px-4">
                <span
                  class="font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full font-mono block w-fit border shadow-2xs"
                  :class="wf.reportType === 'PCR' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-amber-50 text-amber-800 border-amber-200'"
                >
                  {{ wf.reportType === 'PCR' ? 'PCR (Charter)' : 'PFR (Final)' }}
                </span>
                <span class="text-[10px] text-slate-400 font-mono mt-0.5 block">{{ wf.metricsSummary.pfrDocId }}</span>
              </td>

              <!-- Sequential Progress Steps -->
              <td class="py-4 px-4 min-w-[200px]">
                <div class="flex items-center gap-1.5 mb-1.5">
                  <div
                    v-for="(st, sIdx) in wf.steps"
                    :key="st.id"
                    class="flex-1 h-2 rounded-full transition-all"
                    :class="[
                      st.status === 'Approved' ? 'bg-emerald-500' :
                      st.status === 'Pending' ? 'bg-amber-400 animate-pulse' :
                      st.status === 'Needs Revision' ? 'bg-rose-500' :
                      'bg-slate-200'
                    ]"
                    :title="`Step ${sIdx + 1}: ${st.role} (${st.status})`"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Step {{ wf.currentStepNumber }} of {{ wf.steps.length }}</span>
                  <span class="font-bold text-slate-800">Next: {{ wf.steps.find(s => s.status === 'Pending')?.role || 'Complete' }}</span>
                </div>
              </td>

              <!-- Financial Metric -->
              <td class="py-4 px-4">
                <span class="font-bold text-[#008779] block text-xs font-mono">{{ wf.metricsSummary.financialSavings }}</span>
                <span class="text-[10px] text-slate-500">Target: {{ wf.metricsSummary.targetGoal }}</span>
              </td>

              <!-- Status Badge -->
              <td class="py-4 px-4 text-center">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs"
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

              <!-- Actions -->
              <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                    @click="openWorkflowModal(wf)"
                  >
                    <UIcon name="i-lucide-file-signature" class="size-3.5" />
                    <span>Review & Sign</span>
                  </button>

                  <button
                    type="button"
                    class="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl transition-colors cursor-pointer"
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
      <div class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <UIcon name="i-lucide-info" class="size-4 text-amber-700 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h3 class="font-bold text-amber-950 text-xs">
            Admin Account Creation & Email Auto-Invite Queue
          </h3>
          <p class="text-amber-800 leading-relaxed">
            เมื่อ Project Leader มีการมอบหมายสมาชิกทีมหรือผู้เชี่ยวชาญภายนอกที่ยังไม่มีใน Master Directory คำขอจะถูกนำมารวมที่นี่ กด <strong>"Approve & Auto-Invite"</strong> เพื่อสร้างบัญชีและส่งอีเมลแจ้งเตือน
          </p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4">CANDIDATE & EMAIL</th>
              <th class="py-3 px-4">PROJECT & REQUESTED BY</th>
              <th class="py-3 px-4">REQUESTED ROLE / BELT</th>
              <th class="py-3 px-4">DEPARTMENT / PLANT</th>
              <th class="py-3 px-4 text-center">STATUS</th>
              <th class="py-3 px-4 text-center">ADMIN ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="req in pendingProvisioningList" :key="req.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3.5 px-4">
                <span class="font-bold text-slate-900 block text-xs">{{ req.name }}</span>
                <span class="text-[11px] text-slate-500 block font-mono">{{ req.email }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="font-medium text-slate-900 block truncate max-w-xs">{{ req.projectName }}</span>
                <span class="text-[10px] text-slate-400 block">By: {{ req.requestedBy }} • {{ req.requestedAt }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full block w-fit">
                  {{ req.requestedRole }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-600">
                <span>{{ req.department }}</span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  :class="req.status === 'Approved & Invited' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
                >
                  {{ req.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <div v-if="req.status === 'Pending Admin Approval'" class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
                    @click="handleApproveProvisioning(req)"
                  >
                    Approve & Invite
                  </button>
                  <button
                    type="button"
                    class="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    @click="handleRejectProvisioning(req)"
                  >
                    Reject
                  </button>
                </div>
                <span v-else class="text-slate-400 text-xs italic">Approved</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: E-Signature Registry Audit Logs -->
    <div v-show="activeTab === 'audit'" class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4">CERTIFICATE ID</th>
              <th class="py-3 px-4">SIGNER NAME & ROLE</th>
              <th class="py-3 px-4">PROJECT & DOC TYPE</th>
              <th class="py-3 px-4">TIMESTAMP & IP ADDRESS</th>
              <th class="py-3 px-4 text-center">SIGNATURE TYPE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono text-[11px]">
            <tr v-for="(log, lIdx) in allSignedAuditLogs" :key="lIdx" class="hover:bg-slate-50/70">
              <td class="py-3 px-4 font-bold text-[#008779]">
                {{ log.certificateId }}
              </td>
              <td class="py-3 px-4 font-sans">
                <span class="font-bold text-slate-900 block">{{ log.signerName }}</span>
                <span class="text-slate-500 text-[10px] block font-mono">{{ log.role }}</span>
              </td>
              <td class="py-3 px-4 font-sans">
                <span class="font-medium text-slate-800">{{ log.projectName }}</span>
                <span class="text-slate-400 text-[10px] block font-mono">{{ log.reportType }}</span>
              </td>
              <td class="py-3 px-4 text-slate-600">
                <span>{{ log.signedAt }}</span>
                <span class="text-slate-400 text-[10px] block">{{ log.ipAddress }}</span>
              </td>
              <td class="py-3 px-4 text-center font-sans">
                <span class="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {{ log.type }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <ApprovalWorkflowModal
      v-if="selectedWorkflow"
      v-model="isWorkflowModalOpen"
      :workflow="selectedWorkflow"
      @signed="showToast('E-Signature certificate issued successfully!')"
    />

    <EmailApprovalSimulatorModal
      v-if="selectedSimWorkflow && selectedSimStep"
      v-model="isSimModalOpen"
      :workflow="selectedSimWorkflow"
      :step="selectedSimStep"
      @approved="showToast('Email approval link action executed successfully!')"
    />

  </div>
</template>
