<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApprovalWorkflow, type ApprovalWorkflow } from '~/composables/useApprovalWorkflow'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { getProjectWorkflow } = useApprovalWorkflow()

const isWorkflowModalOpen = ref(false)

const pfrWorkflow = computed<ApprovalWorkflow | undefined>(() => {
  return getProjectWorkflow(projectId, 'PFR') || getProjectWorkflow('example-total-yield', 'PFR')
})

const printReport = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Action Bar (Hidden during Print) -->
    <div class="flex items-center justify-between print:hidden">
      <div>
        <div class="flex items-center gap-2 text-xs text-gray-500 pb-1">
          <NuxtLink to="/admin" class="hover:text-[#008779]">Home</NuxtLink>
          <span>›</span>
          <NuxtLink to="/admin/projects" class="hover:text-[#008779]">Projects</NuxtLink>
          <span>›</span>
          <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779]">Overview</NuxtLink>
          <span>›</span>
          <span class="text-gray-900 font-bold">Project Final Report (PFR)</span>
        </div>
        <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>Project Final Report (PFR) Documentation</span>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full">
            E-Sign Certified
          </span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="isWorkflowModalOpen = true"
        >
          <UIcon name="i-lucide-file-signature" class="size-3.5 text-[#008779]" />
          <span>Approval Workflow</span>
        </button>

        <NuxtLink
          :to="`/admin/projects/${projectId}/presentation`"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors"
        >
          <UIcon name="i-lucide-presentation" class="size-3.5" />
          <span>Presentation Mode</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="printReport"
        >
          <UIcon name="i-lucide-printer" class="size-3.5" />
          <span>Print / Export PDF (100% Fit)</span>
        </button>
      </div>
    </div>

    <!-- PFR Printable Document Sheet (A4 Styled Container) -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto p-10 space-y-8 print:p-0 print:shadow-none print:border-none text-xs text-gray-800 leading-relaxed font-sans">
      <!-- 1. Report Header -->
      <div class="border-b-2 border-[#008779] pb-6 flex items-start justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="bg-[#008779] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              SIX SIGMA DMAIC
            </span>
            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">
              DOC ID: {{ pfrWorkflow?.metricsSummary?.pfrDocId || 'PFR-CPF-2026-088' }}
            </span>
            <span class="text-[10px] font-bold bg-teal-50 text-[#008779] border border-teal-200 px-2 py-0.5 rounded font-mono">
              STATUS: {{ pfrWorkflow?.status || 'APPROVED' }}
            </span>
          </div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">
            PROJECT FINAL REPORT (PFR)
          </h1>
          <p class="text-sm font-bold text-[#008779]">
            Example เพิ่ม %Total Yield สินค้าไก่ทอด
          </p>
        </div>

        <div class="text-right text-[11px] text-gray-500 space-y-0.5 font-mono">
          <p>Location: <strong>โรงงานแปรรูปโชคชัย</strong></p>
          <p>Business: <strong>Food Business (Chicken)</strong></p>
          <p>Date: <strong>Feb 24, 2026</strong></p>
          <p>Belt Level: <strong>Black Belt (BB)</strong></p>
        </div>
      </div>

      <!-- 2. Section: Define Phase -->
      <div class="space-y-3">
        <h2 class="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 flex items-center gap-2">
          <span class="size-5 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center text-[10px] font-bold">1</span>
          <span>Define Phase: Problem Formulation & BEG Targets</span>
        </h2>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="border border-gray-200 rounded p-3 bg-gray-50/50">
            <span class="text-[10px] text-gray-500 font-bold block">BASELINE METRIC</span>
            <span class="text-base font-bold text-red-600 font-mono">{{ pfrWorkflow?.metricsSummary?.baseline || '83.75%' }}</span>
          </div>
          <div class="border border-gray-200 rounded p-3 bg-gray-50/50">
            <span class="text-[10px] text-gray-500 font-bold block">ENTITLEMENT MAX</span>
            <span class="text-base font-bold text-amber-600 font-mono">{{ pfrWorkflow?.metricsSummary?.entitlement || '88.00%' }}</span>
          </div>
          <div class="border border-gray-200 rounded p-3 bg-teal-50/50 border-teal-200">
            <span class="text-[10px] text-teal-800 font-bold block">TARGET GOAL (LSS)</span>
            <span class="text-base font-bold text-[#008779] font-mono">{{ pfrWorkflow?.metricsSummary?.targetGoal || '87.15%' }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Section: Measure Phase -->
      <div class="space-y-3">
        <h2 class="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 flex items-center gap-2">
          <span class="size-5 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center text-[10px] font-bold">2</span>
          <span>Measure Phase: Process Mapping & FMEA Cause Prioritization</span>
        </h2>
        <p>
          The end-to-end processing pipeline was mapped into 28 standardized nodes. A 6-category Ishikawa Fishbone analysis identified 41 potential causes. FMEA RPN ranking identified the top critical failure modes:
        </p>
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th class="p-2">Rank</th>
                <th class="p-2">Potential Cause</th>
                <th class="p-2 text-center">Severity</th>
                <th class="p-2 text-center">Occurrence</th>
                <th class="p-2 text-center">Detection</th>
                <th class="p-2 text-center">RPN</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="p-2 font-bold font-mono">#1</td>
                <td class="p-2 font-medium text-gray-900">การ set ค่าน้ำหนักเผื่อของเครื่อง Multihead</td>
                <td class="p-2 text-center">7</td>
                <td class="p-2 text-center">10</td>
                <td class="p-2 text-center">7</td>
                <td class="p-2 text-center font-bold text-red-600 font-mono">490</td>
              </tr>
              <tr>
                <td class="p-2 font-bold font-mono">#2</td>
                <td class="p-2 font-medium text-gray-900">จำนวน Drop ของเครื่อง Multihead</td>
                <td class="p-2 text-center">7</td>
                <td class="p-2 text-center">4</td>
                <td class="p-2 text-center">10</td>
                <td class="p-2 text-center font-bold text-red-600 font-mono">280</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. Section: Analyze & Improve -->
      <div class="space-y-3">
        <h2 class="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 flex items-center gap-2">
          <span class="size-5 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center text-[10px] font-bold">3</span>
          <span>Analyze & Improve: Hypothesis Validation & DOE Optimization</span>
        </h2>
        <div class="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
          <div class="flex justify-between items-center">
            <span class="font-bold text-gray-900">Anderson-Darling Normality Test:</span>
            <span class="font-mono text-emerald-700 font-bold">P-Value = 0.417 (Data is Normal)</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-bold text-gray-900">2-Sample T Test Significance:</span>
            <span class="font-mono text-emerald-700 font-bold">P-Value = 0.000 (Significant difference confirmed)</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-bold text-gray-900">DOE Optimum Parameters:</span>
            <span class="font-mono text-[#008779] font-bold">Weight: 10g | Drops: 1 drop &rarr; %Giveaway = 2.20%</span>
          </div>
        </div>
      </div>

      <!-- 5. Section: Control & Financial Sign-off with Certified E-Signatures -->
      <div class="space-y-4">
        <h2 class="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 flex items-center gap-2">
          <span class="size-5 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center text-[10px] font-bold">4</span>
          <span>Control Phase & Financial Sign-off (Certified E-Signatures)</span>
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4 space-y-1">
            <span class="text-[10px] font-bold text-emerald-800 uppercase block">FINAL %YIELD GAIN</span>
            <p class="text-xl font-bold text-emerald-800 font-mono">87.70% (+3.95%)</p>
            <span class="text-[11px] text-emerald-700">Process Capability Index Cpk = 1.45 (Stable)</span>
          </div>

          <div class="border border-teal-200 bg-teal-50/50 rounded-lg p-4 space-y-1">
            <span class="text-[10px] font-bold text-teal-800 uppercase block">VERIFIED FINANCIAL BENEFIT</span>
            <p class="text-xl font-bold text-[#008779] font-mono">{{ pfrWorkflow?.metricsSummary?.financialSavings || '4,250,000 THB / Year' }}</p>
            <span class="text-[11px] text-teal-700">Audited by Finance & CI Committee</span>
          </div>
        </div>

        <!-- 4-Signatures Block with Real Digital Certificates -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
          <div
            v-for="(step, sIdx) in (pfrWorkflow?.steps || [])"
            :key="step.id || sIdx"
            class="border rounded-lg p-3 text-center space-y-1.5 bg-gray-50/40"
            :class="step.status === 'Approved' ? 'border-teal-300 bg-teal-50/20' : 'border-gray-200'"
          >
            <span class="text-[10px] font-bold text-gray-500 uppercase block">{{ step.role }}</span>
            <div class="border-b border-gray-300 pb-1 font-bold text-gray-900 text-xs">
              {{ step.approverName }}
            </div>
            <div v-if="step.signature" class="space-y-0.5">
              <span class="text-[9px] font-bold text-emerald-700 block">✓ E-Signed & Verified</span>
              <span class="text-[8px] text-gray-400 font-mono block">{{ step.signature.certificateId }}</span>
              <span class="text-[8px] text-gray-400 font-mono block">{{ step.signedAt }}</span>
            </div>
            <div v-else class="text-[9px] text-amber-600 font-semibold">
              Pending Sign-off
            </div>
          </div>
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

<style scoped>
@media print {
  @page {
    size: portrait;
    margin: 1cm;
  }
}
</style>
