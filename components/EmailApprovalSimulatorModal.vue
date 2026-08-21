<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalWorkflow, type ApprovalWorkflow, type ApprovalStep } from '~/composables/useApprovalWorkflow'

const props = defineProps<{
  workflow: ApprovalWorkflow
  step: ApprovalStep
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'approved'): void
  (e: 'revised'): void
}>()

const { simulateEmailLinkApproval } = useApprovalWorkflow()

const isProcessing = ref(false)
const actionMessage = ref('')
const revisionComment = ref('')
const isRevisionBoxOpen = ref(false)

const handleQuickApprove = () => {
  if (!props.step.emailToken) return
  isProcessing.value = true

  setTimeout(() => {
    const res = simulateEmailLinkApproval(props.step.emailToken!, 'approve', 'Approved via 1-Click Email Secure Link')
    isProcessing.value = false
    if (res.success) {
      actionMessage.value = '✓ Successfully Approved via Secure Email Link Token!'
      setTimeout(() => {
        emit('approved')
        emit('close')
      }, 1500)
    } else {
      alert(res.message)
    }
  }, 600)
}

const handleQuickRevision = () => {
  if (!props.step.emailToken || !revisionComment.value.trim()) {
    alert('Please enter revision comments.')
    return
  }
  isProcessing.value = true
  setTimeout(() => {
    const res = simulateEmailLinkApproval(props.step.emailToken!, 'revise', revisionComment.value)
    isProcessing.value = false
    if (res.success) {
      actionMessage.value = '↻ Revision request sent to project team.'
      setTimeout(() => {
        emit('revised')
        emit('close')
      }, 1500)
    }
  }, 600)
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden text-gray-900 text-xs animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
      <!-- Email Client Window Titlebar -->
      <div class="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-mail" class="size-4 text-teal-400" />
          <span class="font-bold text-xs">CPF Enterprise Mail — Email Link Quick Approval Simulator</span>
        </div>
        <button
          type="button"
          class="text-gray-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          @click="emit('close')"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>

      <!-- Processing or Success Overlay Banner -->
      <div v-if="actionMessage" class="bg-emerald-600 text-white p-3 text-center font-bold text-xs flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
        <UIcon name="i-lucide-check-circle" class="size-4" />
        <span>{{ actionMessage }}</span>
      </div>

      <!-- Email Content Body Area (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/50">
        <!-- Email Meta Header -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-2 shadow-2xs">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <div class="space-y-0.5">
              <span class="text-gray-500 text-[11px] block">From: <strong>CPF Six Sigma PMO & Workflow System</strong> &lt;approval.system@cpf.co.th&gt;</span>
              <span class="text-gray-900 text-[11px] block">To: <strong>{{ step.approverName }}</strong> &lt;{{ step.approverEmail }}&gt;</span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono">{{ new Date().toLocaleDateString() }} (Just now)</span>
          </div>

          <div class="pt-1">
            <h2 class="text-sm font-bold text-gray-900">
              [Action Required] Sign-off Request: {{ workflow.reportType }} for {{ workflow.projectName }}
            </h2>
          </div>
        </div>

        <!-- Corporate Email Template Card -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-xs">
          <!-- CPF Brand Top Header -->
          <div class="border-b-2 border-[#008779] pb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="size-7 rounded bg-[#008779] text-white flex items-center justify-center font-bold text-xs">
                IG
              </div>
              <div>
                <span class="font-bold text-xs text-gray-900 tracking-tight block">INSIGHTGENIE SIX SIGMA</span>
                <span class="text-[10px] text-gray-500 block">CPF Digital Transformation & Quality Excellence</span>
              </div>
            </div>

            <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded">
              {{ workflow.reportType === 'PCR' ? 'Project Charter Sign-off' : 'Project Final Report Sign-off' }}
            </span>
          </div>

          <!-- Greeting & Description -->
          <div class="space-y-2 text-xs leading-relaxed text-gray-800">
            <p>Dear <strong>{{ step.approverName }}</strong> ({{ step.role }}),</p>
            <p>
              A new Six Sigma DMAIC milestone requires your authorization. Please review the project details below and click the action button to submit your decision directly via secure corporate token.
            </p>
          </div>

          <!-- Project Metrics Summary Box -->
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-900 uppercase">
                Project Key Performance Indicators
              </h3>
              <span class="font-mono text-[10px] text-slate-500">Plant: {{ workflow.location }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-white border border-red-200 rounded p-2">
                <span class="text-[9px] text-red-500 font-bold block">BASELINE</span>
                <span class="text-sm font-bold text-red-600 font-mono">{{ workflow.metricsSummary.baseline }}</span>
              </div>
              <div class="bg-white border border-amber-200 rounded p-2">
                <span class="text-[9px] text-amber-500 font-bold block">ENTITLEMENT</span>
                <span class="text-sm font-bold text-amber-600 font-mono">{{ workflow.metricsSummary.entitlement }}</span>
              </div>
              <div class="bg-white border border-purple-200 rounded p-2">
                <span class="text-[9px] text-purple-600 font-bold block">GOAL (LSS)</span>
                <span class="text-sm font-bold text-purple-700 font-mono">{{ workflow.metricsSummary.targetGoal }}</span>
              </div>
            </div>

            <div class="bg-teal-50 border border-teal-200 rounded p-2.5 text-center text-teal-950 font-bold">
              💰 Expected Annual Financial Benefit: {{ workflow.metricsSummary.financialSavings }}
            </div>
          </div>

          <!-- Sequential Approval Chain Indicator -->
          <div class="space-y-2">
            <span class="text-[11px] font-bold text-gray-700 block">Approval Sequence Status:</span>
            <div class="space-y-1.5 pl-2 border-l-2 border-teal-200">
              <div
                v-for="st in workflow.steps"
                :key="st.id"
                class="flex items-center justify-between text-xs py-1"
                :class="st.id === step.id ? 'bg-teal-50/80 -ml-2 pl-2 rounded pr-2 font-bold text-[#008779]' : 'text-gray-600'"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    :name="st.status === 'Approved' ? 'i-lucide-check-circle-2' : st.id === step.id ? 'i-lucide-clock' : 'i-lucide-circle'"
                    class="size-3.5"
                    :class="st.status === 'Approved' ? 'text-emerald-500' : st.id === step.id ? 'text-amber-500 animate-pulse' : 'text-gray-400'"
                  />
                  <span>Step {{ st.stepNumber }}: {{ st.role }} ({{ st.approverName }})</span>
                </div>
                <span
                  class="text-[10px] px-1.5 py-0.5 rounded font-mono"
                  :class="st.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : st.id === step.id ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-400'"
                >
                  {{ st.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- 1-Click Interactive Action Buttons -->
          <div class="border-t border-gray-100 pt-5 space-y-3">
            <span class="text-xs font-bold text-gray-900 block text-center">
              Click below to submit your decision via Secure Link:
            </span>

            <div class="flex items-center justify-center gap-3">
              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
                :disabled="isProcessing"
                @click="handleQuickApprove"
              >
                <UIcon name="i-lucide-check" class="size-4" />
                <span>✓ Approve via Email Link</span>
              </button>

              <button
                type="button"
                class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                @click="isRevisionBoxOpen = !isRevisionBoxOpen"
              >
                <UIcon name="i-lucide-rotate-ccw" class="size-3.5" />
                <span>Request Revision</span>
              </button>
            </div>

            <!-- Revision Comment Box -->
            <div v-if="isRevisionBoxOpen" class="space-y-2 p-3 bg-amber-50/60 border border-amber-200 rounded-lg animate-in slide-in-from-top duration-150">
              <label class="text-[11px] font-bold text-amber-900 block">Revision Comments for Project Leader:</label>
              <textarea
                v-model="revisionComment"
                rows="2"
                class="w-full bg-white border border-amber-300 rounded p-2 text-xs focus:outline-hidden focus:border-amber-500"
                placeholder="Enter feedback or additional information requested..."
              ></textarea>
              <button
                type="button"
                class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded font-bold text-xs"
                @click="handleQuickRevision"
              >
                Submit Revision Request
              </button>
            </div>

            <p class="text-[10px] text-gray-400 text-center font-mono">
              Secure Token: {{ step.emailToken }} • Verified CPF Intranet Authorization Link
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 bg-gray-100 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          @click="emit('close')"
        >
          Close Preview
        </button>
      </div>
    </div>
  </div>
</template>
