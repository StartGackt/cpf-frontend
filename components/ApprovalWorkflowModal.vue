<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalWorkflow, type ApprovalWorkflow, type ApprovalStep, type ESignatureData } from '~/composables/useApprovalWorkflow'

const props = defineProps<{
  workflow: ApprovalWorkflow
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const { approveStep, requestRevision, sendReminder } = useApprovalWorkflow()

const activeTab = ref<'timeline' | 'metrics' | 'audit'>('timeline')
const isSignPadOpen = ref(false)
const selectedStepForSigning = ref<ApprovalStep | null>(null)
const isEmailSimulatorOpen = ref(false)
const selectedStepForEmail = ref<ApprovalStep | null>(null)

const revisionComments = ref('')
const isRevisionModalOpen = ref(false)
const toastMsg = ref('')

const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

const currentActiveStep = computed(() => {
  return props.workflow.steps.find(s => s.status === 'Pending') || props.workflow.steps[props.workflow.steps.length - 1]
})

const openSignPadForStep = (step: ApprovalStep) => {
  selectedStepForSigning.value = step
  isSignPadOpen.value = true
}

const handleSignatureCompleted = (sig: ESignatureData) => {
  if (!selectedStepForSigning.value) return

  const res = approveStep(props.workflow.id, selectedStepForSigning.value.id, sig, 'Signed and approved via Portal E-Signature Pad.')
  isSignPadOpen.value = false
  if (res.success) {
    showToast(res.message)
    emit('updated')
  } else {
    alert(res.message)
  }
}

const handleSendReminder = (step: ApprovalStep) => {
  const res = sendReminder(props.workflow.id, step.id)
  if (res.success) {
    showToast(res.message)
    emit('updated')
  }
}

const openEmailSimulatorForStep = (step: ApprovalStep) => {
  selectedStepForEmail.value = step
  isEmailSimulatorOpen.value = true
}

const submitRevision = () => {
  if (!currentActiveStep.value || !revisionComments.value.trim()) {
    alert('Please enter revision comments.')
    return
  }

  const res = requestRevision(
    props.workflow.id,
    currentActiveStep.value.id,
    revisionComments.value,
    'Reviewer'
  )
  isRevisionModalOpen.value = false
  revisionComments.value = ''
  if (res.success) {
    showToast('Revision request submitted!')
    emit('updated')
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full overflow-hidden text-gray-900 text-xs animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-teal-900 to-[#008779] text-white flex items-center justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono"
              :class="workflow.reportType === 'PCR' ? 'bg-blue-400 text-blue-950' : 'bg-amber-400 text-amber-950'"
            >
              {{ workflow.reportType === 'PCR' ? 'PROJECT CHARTER (PCR)' : 'FINAL REPORT (PFR)' }}
            </span>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              :class="workflow.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400' : 'bg-amber-500/20 text-amber-200 border-amber-400'"
            >
              ● {{ workflow.status }}
            </span>
            <span class="text-[10px] text-teal-200 font-mono">Doc ID: {{ workflow.metricsSummary.pfrDocId }}</span>
          </div>

          <h2 class="text-base font-bold text-white tracking-tight">
            {{ workflow.projectName }}
          </h2>
          <p class="text-[11px] text-teal-100">
            {{ workflow.location }} • Submitted by {{ workflow.submittedBy }}
          </p>
        </div>

        <button
          type="button"
          class="text-white/80 hover:text-white p-1 rounded transition-colors cursor-pointer"
          @click="emit('close')"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>

      <!-- Toast Feedback -->
      <div v-if="toastMsg" class="bg-emerald-600 text-white p-2.5 text-center font-bold text-xs flex items-center justify-center gap-2">
        <UIcon name="i-lucide-check-circle" class="size-4" />
        <span>{{ toastMsg }}</span>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 text-xs px-6">
        <button
          type="button"
          class="py-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'timeline' ? 'border-[#008779] text-[#008779] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'"
          @click="activeTab = 'timeline'"
        >
          <UIcon name="i-lucide-git-commit" class="size-3.5" />
          <span>Sequential Sign-off Steps ({{ workflow.steps.length }})</span>
        </button>
        <button
          type="button"
          class="py-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'metrics' ? 'border-[#008779] text-[#008779] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'"
          @click="activeTab = 'metrics'"
        >
          <UIcon name="i-lucide-bar-chart-2" class="size-3.5" />
          <span>Project KPIs & Charter Metrics</span>
        </button>
        <button
          type="button"
          class="py-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5"
          :class="activeTab === 'audit' ? 'border-[#008779] text-[#008779] bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'"
          @click="activeTab = 'audit'"
        >
          <UIcon name="i-lucide-history" class="size-3.5" />
          <span>Digital Audit Trail Log ({{ workflow.auditLog.length }})</span>
        </button>
      </div>

      <!-- Main Body Content -->
      <div class="p-6 overflow-y-auto flex-1 bg-gray-50/50 space-y-6">
        <!-- TAB 1: Sequential Sign-off Steps Timeline -->
        <div v-show="activeTab === 'timeline'" class="space-y-4">
          <!-- Summary Banner -->
          <div class="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <div>
              <span class="font-bold text-gray-900 block text-xs">Current Approval Stage:</span>
              <p class="text-gray-600 text-[11px] mt-0.5">
                Step {{ workflow.currentStepNumber }} of {{ workflow.steps.length }} — {{ currentActiveStep?.role }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="currentActiveStep?.status === 'Pending'"
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                @click="openSignPadForStep(currentActiveStep)"
              >
                <UIcon name="i-lucide-pen-tool" class="size-3.5" />
                <span>Sign & Approve Now</span>
              </button>

              <button
                v-if="currentActiveStep?.status === 'Pending'"
                type="button"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                @click="openEmailSimulatorForStep(currentActiveStep)"
              >
                <UIcon name="i-lucide-mail" class="size-3.5" />
                <span>Simulate Email View</span>
              </button>
            </div>
          </div>

          <!-- Step Cards Chain -->
          <div class="space-y-3">
            <div
              v-for="(step, idx) in workflow.steps"
              :key="step.id"
              class="bg-white border rounded-lg p-4 transition-all shadow-xs space-y-3"
              :class="[
                step.status === 'Approved' ? 'border-emerald-200 bg-emerald-50/10' :
                step.status === 'Pending' ? 'border-teal-500 bg-teal-50/30 ring-1 ring-teal-400' :
                step.status === 'Needs Revision' ? 'border-amber-300 bg-amber-50/20' :
                'border-gray-200 opacity-75'
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-3">
                  <!-- Step Circle Number -->
                  <div
                    class="size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"
                    :class="[
                      step.status === 'Approved' ? 'bg-emerald-500 text-white' :
                      step.status === 'Pending' ? 'bg-[#008779] text-white animate-pulse' :
                      step.status === 'Needs Revision' ? 'bg-amber-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    ]"
                  >
                    <UIcon v-if="step.status === 'Approved'" name="i-lucide-check" class="size-4" />
                    <span v-else>{{ step.stepNumber }}</span>
                  </div>

                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-gray-900">
                        Step {{ step.stepNumber }}: {{ step.role }}
                      </span>
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono"
                        :class="[
                          step.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          step.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          step.status === 'Needs Revision' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-gray-100 text-gray-500'
                        ]"
                      >
                        {{ step.status }}
                      </span>
                    </div>

                    <p class="text-xs font-medium text-gray-800 mt-0.5">
                      {{ step.approverName }} <span class="text-gray-400 font-mono">({{ step.approverEmail }})</span>
                    </p>
                    <span class="text-[10px] text-gray-500 block">{{ step.designation }}</span>
                  </div>
                </div>

                <!-- Right Action Buttons for Step -->
                <div class="flex items-center gap-2">
                  <button
                    v-if="step.status === 'Pending'"
                    type="button"
                    class="text-[11px] text-[#008779] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    @click="handleSendReminder(step)"
                  >
                    <UIcon name="i-lucide-bell" class="size-3" />
                    <span>Send Reminder</span>
                  </button>

                  <button
                    v-if="step.status === 'Pending'"
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs cursor-pointer"
                    @click="openSignPadForStep(step)"
                  >
                    Sign & Approve
                  </button>

                  <button
                    type="button"
                    class="text-[11px] text-gray-500 hover:text-gray-800 p-1"
                    title="Simulate email notification link"
                    @click="openEmailSimulatorForStep(step)"
                  >
                    <UIcon name="i-lucide-mail" class="size-3.5" />
                  </button>
                </div>
              </div>

              <!-- E-Signature Verification Badge if Signed -->
              <div
                v-if="step.signature"
                class="bg-white border border-teal-200 rounded-lg p-3 flex items-center justify-between text-[11px]"
              >
                <div class="flex items-center gap-3">
                  <div class="size-7 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-[#008779]">
                    <UIcon name="i-lucide-shield-check" class="size-4" />
                  </div>
                  <div>
                    <span class="font-bold text-teal-950 block">E-Signature Certified & Validated</span>
                    <span class="text-[10px] text-gray-500 font-mono">Certificate: {{ step.signature.certificateId }} • {{ step.signedAt }}</span>
                  </div>
                </div>

                <div class="text-right">
                  <span class="text-[10px] text-emerald-600 font-bold block">✓ Verified Identity</span>
                  <span class="text-[9px] text-gray-400 font-mono">{{ step.signature.ipAddress }}</span>
                </div>
              </div>

              <!-- Comments Box if available -->
              <div v-if="step.comments" class="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                <strong>Sign-off Remarks:</strong> {{ step.comments }}
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: Project KPIs & Charter Metrics -->
        <div v-show="activeTab === 'metrics'" class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-xs">
            <h3 class="font-bold text-xs text-gray-900 uppercase tracking-wider">
              Project Metric Formulation (BEG Baseline & Target)
            </h3>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="border border-red-200 bg-red-50/40 rounded-lg p-3">
                <span class="text-[10px] text-red-600 font-bold block">BASELINE METRIC</span>
                <span class="text-xl font-bold text-red-600 font-mono">{{ workflow.metricsSummary.baseline }}</span>
              </div>
              <div class="border border-amber-200 bg-amber-50/40 rounded-lg p-3">
                <span class="text-[10px] text-amber-600 font-bold block">ENTITLEMENT MAX</span>
                <span class="text-xl font-bold text-amber-600 font-mono">{{ workflow.metricsSummary.entitlement }}</span>
              </div>
              <div class="border border-purple-200 bg-purple-50/40 rounded-lg p-3">
                <span class="text-[10px] text-purple-600 font-bold block">TARGET GOAL (LSS)</span>
                <span class="text-xl font-bold text-purple-700 font-mono">{{ workflow.metricsSummary.targetGoal }}</span>
              </div>
            </div>

            <div class="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center space-y-0.5">
              <span class="text-[10px] text-teal-800 font-bold uppercase block">EXPECTED ANNUAL FINANCIAL IMPACT</span>
              <span class="text-base font-bold text-[#008779] font-mono">{{ workflow.metricsSummary.financialSavings }}</span>
            </div>
          </div>
        </div>

        <!-- TAB 3: Digital Audit Trail Log -->
        <div v-show="activeTab === 'audit'" class="space-y-3">
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 text-[10px] uppercase">
                <tr>
                  <th class="p-3">Event / Action</th>
                  <th class="p-3">Actor</th>
                  <th class="p-3">Details</th>
                  <th class="p-3">Timestamp</th>
                  <th class="p-3">Certificate ID</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-[11px]">
                <tr v-for="log in workflow.auditLog" :key="log.id" class="hover:bg-gray-50/60">
                  <td class="p-3 font-bold text-gray-900">{{ log.action }}</td>
                  <td class="p-3 text-gray-700">{{ log.performedBy }}</td>
                  <td class="p-3 text-gray-600 max-w-xs truncate">{{ log.details }}</td>
                  <td class="p-3 text-gray-500 font-mono">{{ log.timestamp }}</td>
                  <td class="p-3 font-mono text-teal-700 font-semibold">{{ log.certificateId || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            v-if="workflow.status === 'Under Review'"
            type="button"
            class="text-amber-700 hover:text-amber-800 text-xs font-semibold px-3 py-1.5 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 cursor-pointer"
            @click="isRevisionModalOpen = true"
          >
            Request Revision
          </button>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          @click="emit('close')"
        >
          Close Drawer
        </button>
      </div>
    </div>

    <!-- Embedded E-Signature Pad Modal -->
    <div
      v-if="isSignPadOpen && selectedStepForSigning"
      class="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4"
    >
      <ESignaturePad
        :signer-name="selectedStepForSigning.approverName"
        :signer-email="selectedStepForSigning.approverEmail"
        :signer-role="selectedStepForSigning.role"
        :document-title="`${workflow.reportType} Sign-off for ${workflow.projectName}`"
        @sign="handleSignatureCompleted"
        @cancel="isSignPadOpen = false"
      />
    </div>

    <!-- Embedded Email Simulator Modal -->
    <EmailApprovalSimulatorModal
      v-if="isEmailSimulatorOpen && selectedStepForEmail"
      :workflow="workflow"
      :step="selectedStepForEmail"
      @close="isEmailSimulatorOpen = false"
      @approved="emit('updated')"
      @revised="emit('updated')"
    />

    <!-- Revision Comment Dialog -->
    <div
      v-if="isRevisionModalOpen"
      class="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
        <h3 class="font-bold text-sm text-gray-900">Request Revision for {{ workflow.reportType }}</h3>
        <textarea
          v-model="revisionComments"
          rows="3"
          class="w-full border border-gray-300 rounded p-2 text-xs focus:outline-hidden focus:border-[#008779]"
          placeholder="Describe required adjustments or missing documents..."
        ></textarea>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded text-xs text-gray-600 hover:bg-gray-100"
            @click="isRevisionModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-1.5 rounded"
            @click="submitRevision"
          >
            Send Revision Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
