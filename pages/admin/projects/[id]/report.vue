<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

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
        <h1 class="text-xl font-bold text-gray-900">
          Project Final Report (PFR) Documentation
        </h1>
      </div>

      <div class="flex items-center gap-2">
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
              DOC ID: PFR-CPF-2026-088
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
            <span class="text-base font-bold text-red-600 font-mono">83.75%</span>
          </div>
          <div class="border border-gray-200 rounded p-3 bg-gray-50/50">
            <span class="text-[10px] text-gray-500 font-bold block">ENTITLEMENT MAX</span>
            <span class="text-base font-bold text-amber-600 font-mono">88.00%</span>
          </div>
          <div class="border border-gray-200 rounded p-3 bg-teal-50/50 border-teal-200">
            <span class="text-[10px] text-teal-800 font-bold block">TARGET GOAL (LSS)</span>
            <span class="text-base font-bold text-[#008779] font-mono">87.15%</span>
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

      <!-- 5. Section: Control & Financial Sign-off -->
      <div class="space-y-4">
        <h2 class="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 flex items-center gap-2">
          <span class="size-5 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center text-[10px] font-bold">4</span>
          <span>Control Phase & Financial Sign-off</span>
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4 space-y-1">
            <span class="text-[10px] font-bold text-emerald-800 uppercase block">FINAL %YIELD GAIN</span>
            <p class="text-xl font-bold text-emerald-800 font-mono">87.70% (+3.95%)</p>
            <span class="text-[11px] text-emerald-700">Process Capability Index Cpk = 1.45 (Stable)</span>
          </div>

          <div class="border border-teal-200 bg-teal-50/50 rounded-lg p-4 space-y-1">
            <span class="text-[10px] font-bold text-teal-800 uppercase block">VERIFIED FINANCIAL BENEFIT</span>
            <p class="text-xl font-bold text-[#008779] font-mono">4,250,000 THB / Year</p>
            <span class="text-[11px] text-teal-700">Audited by Finance & CI Committee</span>
          </div>
        </div>

        <!-- 4-Signatures Block -->
        <div class="grid grid-cols-4 gap-4 pt-6 text-center border-t border-gray-200">
          <div class="space-y-8">
            <span class="text-[11px] font-bold text-gray-700 block">Project Leader</span>
            <div class="border-b border-gray-400 pb-1 font-bold text-gray-900">Romteera Tadderm</div>
            <span class="text-[10px] text-gray-500">Black Belt</span>
          </div>
          <div class="space-y-8">
            <span class="text-[11px] font-bold text-gray-700 block">MBB Reviewer</span>
            <div class="border-b border-gray-400 pb-1 font-bold text-gray-900">Dr. Prasert Chareon</div>
            <span class="text-[10px] text-gray-500">Master Black Belt</span>
          </div>
          <div class="space-y-8">
            <span class="text-[11px] font-bold text-gray-700 block">Plant Champion</span>
            <div class="border-b border-gray-400 pb-1 font-bold text-gray-900">Somchai Vong</div>
            <span class="text-[10px] text-gray-500">Plant Manager</span>
          </div>
          <div class="space-y-8">
            <span class="text-[11px] font-bold text-gray-700 block">Corporate PMO</span>
            <div class="border-b border-gray-400 pb-1 font-bold text-gray-900">Quality Excellence HQ</div>
            <span class="text-[10px] text-gray-500">Final System Registry</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
