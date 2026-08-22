<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const doeId = (route.params.doeId as string) || 'doe-1'

const doeTitle = ref(doeId.toUpperCase().replace('-', '.'))

const regressionEquation = ref('Y = -0.6775 + 1.5675*จำนวนDropของเครื่องMultihead + 0.1971*การsetค่าน้ำหนักเผื่อของเครื่องMultihead - 0.0661*จำนวนDropของเครื่องMultihead*การsetค่าน้ำหนักเผื่อของเครื่องMultihead')

const modelTerms = ref([
  {
    term: 'Intercept (β0)',
    formula: 'Y = β0',
    coefficient: '+3.1433',
    fStat: '0.00',
    pVal: '< 0.001',
    significance: 'Significant',
    partialR2: '0.0%',
    effect: '-'
  },
  {
    term: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    formula: 'Y = β0 + β1X1',
    coefficient: '+0.4898',
    fStat: '919.80',
    pVal: '< 0.001',
    significance: 'Significant',
    partialR2: '68.3%',
    effect: 'Strong positive effect (68.3% of variance)'
  },
  {
    term: 'จำนวนDropของเครื่องMultihead',
    formula: 'Y = β0 + β2X2',
    coefficient: '+0.2883',
    fStat: '318.61',
    pVal: '< 0.001',
    significance: 'Significant',
    partialR2: '23.7%',
    effect: 'Moderate positive effect (23.7% of variance)'
  },
  {
    term: 'จำนวนDropของเครื่องMultihead * การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    formula: 'Y = β0 + β3X1X2',
    coefficient: '-0.1651',
    fStat: '104.55',
    pVal: '< 0.001',
    significance: 'Significant',
    partialR2: '7.8%',
    effect: 'Moderate interaction (7.8% of variance)'
  }
])
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe`"
          class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#008779] font-medium transition-colors mb-1.5"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to DOE List</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-900 tracking-tight">
            DOE Analysis Results
          </h1>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-slate-600 font-semibold font-mono">{{ doeTitle }} - %Giveaway</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Minimizing
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe/${doeId}/residual-plots`"
          class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <UIcon name="i-lucide-activity" class="size-3.5 text-[#008779]" />
          <span>Residual Diagnostic Plots</span>
        </NuxtLink>

        <!-- Button 1 (Circled in Image 5): Edit Data -->
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe/${doeId}`"
          class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <UIcon name="i-lucide-pencil" class="size-3.5 text-slate-500" />
          <span>Edit Data</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-slate-500" />
          <span>Export</span>
        </button>

        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/summary`"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-check" class="size-4" />
          <span>Done</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="DOE"
      />

      <!-- Content Column -->
      <div class="flex-1 space-y-6 min-w-0 w-full">
        <!-- 1. Summary Card (Matching Image 5) -->
        <div class="bg-emerald-50/40 border border-emerald-200 rounded-3xl p-6 space-y-3 shadow-2xs">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-check-circle" class="size-4 text-emerald-600" />
              <span>สรุปผล (DOE Optimization Result)</span>
            </h2>
            <span class="text-xs text-slate-500 font-mono">
              Optimized for minimum %Giveaway
            </span>
          </div>

          <div class="text-xs text-slate-700 space-y-2 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <p>
              ปัจจัยที่มีผลต่อ <strong class="text-slate-900">%Giveaway</strong> คือ <span class="text-[#008779] font-bold">จำนวนDropของเครื่องMultihead</span> และ <span class="text-[#008779] font-bold">การsetค่าน้ำหนักเผื่อของเครื่องMultihead</span>
            </p>
            <p>
              • จำนวนDropของเครื่องMultihead แนะนำให้ใช้ <strong class="text-emerald-700 font-mono">1 drop</strong>
            </p>
            <p>
              • การsetค่าน้ำหนักเผื่อของเครื่องMultihead แนะนำให้ใช้ <strong class="text-emerald-700 font-mono">10 กรัม</strong>
            </p>
            <p class="pt-2 text-sm font-bold text-[#008779]">
              จะได้ค่า %Giveaway คาดการณ์ที่เหมาะสมที่สุดอยู่ที่ <span class="font-mono underline">2.20 %</span>
            </p>
          </div>
        </div>

        <!-- 2. Cube Plot Card (Matching Image 5) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div>
            <h2 class="text-sm font-bold text-slate-900">
              Cube plot (fitted means) for %Giveaway
            </h2>
            <p class="text-xs text-slate-500">แสดงค่าเฉลี่ยจำลองของ %Giveaway ที่สภาวะ Factor Level ต่างๆ</p>
          </div>

          <!-- Cube Plot Graphical Display -->
          <div class="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-slate-200/80 relative">
            <div class="relative w-full max-w-lg h-72 flex items-center justify-center">
              <!-- Y-Axis Label (Vertical) -->
              <div class="absolute -left-16 text-center -rotate-90 text-xs font-semibold text-slate-600">
                การsetค่าน้ำหนักเผื่อของเครื่องMultihead (กรัม)
              </div>

              <!-- Plot Box Canvas -->
              <div class="relative w-80 h-56 border-2 border-slate-400 bg-white rounded-xl shadow-xs">
                <!-- Top-Left Corner (Low X: 1, High Y: 20) -->
                <div class="absolute -top-3.5 -left-3.5 flex flex-col items-center">
                  <div class="size-3 rounded-full bg-emerald-600 ring-2 ring-white"></div>
                  <span class="bg-amber-200 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1 font-mono">
                    3.51000
                  </span>
                </div>

                <!-- Top-Right Corner (High X: 2, High Y: 20) -->
                <div class="absolute -top-3.5 -right-3.5 flex flex-col items-center">
                  <div class="size-3 rounded-full bg-emerald-600 ring-2 ring-white"></div>
                  <span class="bg-amber-200 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1 font-mono">
                    3.75630
                  </span>
                </div>

                <!-- Bottom-Left Corner (OPTIMAL: Low X: 1, Low Y: 10) -->
                <div class="absolute -bottom-3.5 -left-3.5 flex flex-col items-center z-10">
                  <div class="size-4 rounded-full border-2 border-red-600 bg-white flex items-center justify-center">
                    <div class="size-2 rounded-full bg-red-600"></div>
                  </div>
                  <span class="bg-amber-400 border border-red-500 text-slate-900 text-[11px] font-black px-2 py-0.5 rounded shadow-xs mt-1 ring-2 ring-red-400/40 font-mono">
                    2.20000 (Optimal)
                  </span>
                </div>

                <!-- Bottom-Right Corner (High X: 2, Low Y: 10) -->
                <div class="absolute -bottom-3.5 -right-3.5 flex flex-col items-center">
                  <div class="size-3 rounded-full bg-slate-400 ring-2 ring-white"></div>
                  <span class="bg-amber-200 text-slate-900 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1 font-mono">
                    3.10690
                  </span>
                </div>

                <!-- Y-Axis Values on Left -->
                <span class="absolute top-0 -left-14 text-[11px] text-slate-500 font-mono font-semibold">High: 20</span>
                <span class="absolute bottom-0 -left-14 text-[11px] text-slate-500 font-mono font-semibold">Low: 10</span>

                <!-- X-Axis Values on Bottom -->
                <span class="absolute -bottom-7 left-0 text-[11px] text-slate-500 font-mono font-semibold">Low: 1</span>
                <span class="absolute -bottom-7 right-0 text-[11px] text-slate-500 font-mono font-semibold">High: 2</span>
              </div>
            </div>

            <!-- X-Axis Bottom Label -->
            <div class="text-xs font-semibold text-slate-700 mt-6">
              จำนวนDropของเครื่องMultihead (drop)
            </div>

            <!-- Color Scale Legend -->
            <div class="mt-4 flex flex-col items-center gap-1.5">
              <span class="text-[11px] text-slate-500 font-medium">Response Value Spectrum</span>
              <div class="w-48 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 shadow-inner"></div>
              <div class="w-48 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2.2% (Best)</span>
                <span>3.0%</span>
                <span>3.8%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Statistical Summary (Matching Image 5) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h2 class="text-sm font-bold text-slate-900">
            Statistical Summary (ANOVA Fit)
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span class="text-slate-500 text-[11px] block">R²</span>
              <span class="text-sm font-bold font-mono text-slate-900">99.70%</span>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span class="text-slate-500 text-[11px] block">Adjusted R²</span>
              <span class="text-sm font-bold font-mono text-slate-900">99.48%</span>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span class="text-slate-500 text-[11px] block">Predicted R²</span>
              <span class="text-sm font-bold font-mono text-slate-900">98.81%</span>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span class="text-slate-500 text-[11px] block">Standard Error</span>
              <span class="text-sm font-bold font-mono text-slate-900">0.0456837</span>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
              <span class="text-slate-500 text-[11px] block">Degrees of Freedom</span>
              <span class="text-sm font-bold font-mono text-slate-900">7 (model 3, error 4)</span>
            </div>
          </div>
        </div>

        <!-- 4. Statistical Model Analysis & Regression Equation (Matching Image 5) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Statistical Model Analysis
              </h2>
              <p class="text-xs text-slate-500">Full factorial regression coefficients and term effects</p>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#008779] text-white">Actual Values</span>
              <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">Coded Values</span>
            </div>
          </div>

          <!-- Regression Equation Box -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Regression Equation:</span>
            <p class="text-xs font-mono font-bold text-slate-800 break-all leading-relaxed">
              {{ regressionEquation }}
            </p>
          </div>

          <!-- Model Terms Table (Matching Image 5) -->
          <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-3">TERM</th>
                  <th class="py-3 px-3">FORMULA</th>
                  <th class="py-3 px-3 text-center">COEFFICIENT</th>
                  <th class="py-3 px-3 text-center">F-STATISTIC</th>
                  <th class="py-3 px-3 text-center">P-VALUE</th>
                  <th class="py-3 px-3 text-center">SIGNIFICANCE</th>
                  <th class="py-3 px-3 text-center">PARTIAL R²</th>
                  <th class="py-3 px-3">EFFECT</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-800">
                <tr v-for="(t, idx) in modelTerms" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3 px-3 font-bold text-slate-900">{{ t.term }}</td>
                  <td class="py-3 px-3 font-mono text-slate-600">{{ t.formula }}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold text-slate-800">{{ t.coefficient }}</td>
                  <td class="py-3 px-3 text-center font-mono text-slate-700">{{ t.fStat }}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold text-emerald-700">{{ t.pVal }}</td>
                  <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      {{ t.significance }}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center font-mono text-slate-700">{{ t.partialR2 }}</td>
                  <td class="py-3 px-3 text-[11px] text-slate-600">{{ t.effect }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
