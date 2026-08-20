<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

// Advanced Regression Workspace State
const responseVariable = ref('Percent_Giveaway')
const predictors = ref(['Multihead_Weight_Offset', 'Drop_Count', 'Predust_Speed', 'Frying_Time'])

// Best Subsets Regression Models (Module 5 Phase 2 Requirement)
const bestSubsets = ref([
  {
    varsCount: 1,
    rSq: 68.4,
    rSqAdj: 67.2,
    mallowsCp: 18.2,
    sVal: 0.384,
    includedVars: ['Multihead_Weight_Offset'],
    isRecommended: false
  },
  {
    varsCount: 2,
    rSq: 88.6,
    rSqAdj: 87.8,
    mallowsCp: 2.8,
    sVal: 0.198,
    includedVars: ['Multihead_Weight_Offset', 'Drop_Count'],
    isRecommended: true // Lowest Cp close to p=2 and high R-sq
  },
  {
    varsCount: 3,
    rSq: 89.1,
    rSqAdj: 87.6,
    mallowsCp: 4.0,
    sVal: 0.201,
    includedVars: ['Multihead_Weight_Offset', 'Drop_Count', 'Predust_Speed'],
    isRecommended: false
  },
  {
    varsCount: 4,
    rSq: 89.3,
    rSqAdj: 86.9,
    mallowsCp: 5.0,
    sVal: 0.208,
    includedVars: ['Multihead_Weight_Offset', 'Drop_Count', 'Predust_Speed', 'Frying_Time'],
    isRecommended: false
  }
])

const regressionEquation = ref('%Giveaway = 1.140 + 0.1060 (Multihead_Weight_Offset) + 0.954 (Drop_Count)')

// AI Synthesis
const aiSummary = ref('Best Subsets Regression identifies a 2-variable model (Multihead_Weight_Offset + Drop_Count) as optimal, explaining 88.6% of giveaway variance with minimal Mallows\' Cp (2.8). Adding further predictors yields diminishing returns.')
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
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Regression Analysis</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Regression"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h1 class="text-base font-bold text-gray-900">
                Advanced Regression & Best Subsets Analysis
              </h1>
              <p class="text-xs text-gray-500 mt-0.5">
                Model selection based on R-sq (adj), Mallows' Cp, and Standard Error S
              </p>
            </div>
            <span class="text-xs font-bold text-[#008779] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Response: %Giveaway
            </span>
          </div>

          <!-- AI Natural Language Executive Synthesis (Module 5 Phase 2 Requirement) -->
          <div class="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4 space-y-1.5 text-xs text-teal-950">
            <div class="flex items-center gap-2 font-bold text-[#008779]">
              <UIcon name="i-lucide-sparkles" class="size-4" />
              <span>AI Statistical Interpretation (Phase 2):</span>
            </div>
            <p class="leading-relaxed">{{ aiSummary }}</p>
          </div>

          <!-- Mathematical Transfer Function Fitted Line Equation -->
          <div class="bg-gray-900 text-white rounded-lg p-4 space-y-1 font-mono text-xs">
            <span class="text-[10px] text-gray-400 uppercase font-sans font-bold block">FITTED REGRESSION TRANSFER FUNCTION</span>
            <p class="text-sm font-bold text-emerald-400">{{ regressionEquation }}</p>
          </div>

          <!-- Best Subsets Table -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Best Subsets Model Evaluation Matrix
            </h3>
            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <tr class="divide-x divide-gray-200/60">
                    <th class="py-3 px-3 text-center">VARS</th>
                    <th class="py-3 px-3 text-center">R-SQ</th>
                    <th class="py-3 px-3 text-center">R-SQ (ADJ)</th>
                    <th class="py-3 px-3 text-center">MALLOWS' CP</th>
                    <th class="py-3 px-3 text-center">S (ERROR)</th>
                    <th class="py-3 px-4">INCLUDED PREDICTORS</th>
                    <th class="py-3 px-3 text-center">RECOMMENDATION</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 font-mono">
                  <tr
                    v-for="(sub, idx) in bestSubsets"
                    :key="idx"
                    class="hover:bg-gray-50/50 transition-colors"
                    :class="sub.isRecommended ? 'bg-teal-50/40 font-bold' : ''"
                  >
                    <td class="py-3 px-3 text-center text-gray-900">{{ sub.varsCount }}</td>
                    <td class="py-3 px-3 text-center text-gray-800">{{ sub.rSq }}%</td>
                    <td class="py-3 px-3 text-center text-gray-800">{{ sub.rSqAdj }}%</td>
                    <td class="py-3 px-3 text-center font-bold" :class="sub.mallowsCp <= 3 ? 'text-emerald-700' : 'text-amber-600'">
                      {{ sub.mallowsCp }}
                    </td>
                    <td class="py-3 px-3 text-center text-gray-700">{{ sub.sVal }}</td>
                    <td class="py-3 px-4 font-sans text-xs text-gray-900">
                      {{ sub.includedVars.join(', ') }}
                    </td>
                    <td class="py-3 px-3 text-center font-sans">
                      <span
                        v-if="sub.isRecommended"
                        class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        ✓ Optimal Model
                      </span>
                      <span v-else class="text-gray-400 text-[10px]">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
