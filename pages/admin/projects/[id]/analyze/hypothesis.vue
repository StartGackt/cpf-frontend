<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const activeSubTab = ref<'standard' | 'counterbalance' | 'samplesize'>('standard')

// Standard Hypothesis Tests Battery
const tests = ref([
  {
    id: 'T1',
    factor: 'การ set ค่าน้ำหนักเผื่อ Multihead (10g vs 15g)',
    tool: '2-Sample T Test',
    sampleSize: 64,
    pVal: '0.000',
    decision: 'Reject H0 (Significant)',
    aiSummary: 'Significant effect on %Giveaway (P < 0.001). Setting 10g saves approx 2.05% product giveaway.',
    status: 'Confirmed Vital Few'
  },
  {
    id: 'T2',
    factor: 'จำนวน Drop เครื่อง Multihead (1 drop vs 2 drops)',
    tool: '2-Sample T Test',
    sampleSize: 64,
    pVal: '0.000',
    decision: 'Reject H0 (Significant)',
    aiSummary: '1 Drop significantly stabilizes packaging weight distribution.',
    status: 'Confirmed Vital Few'
  },
  {
    id: 'T3',
    factor: 'ความเร็วเครื่องเติมแป้ง Predust (30Hz vs 40Hz vs 50Hz)',
    tool: 'One-Way ANOVA',
    sampleSize: 45,
    pVal: '0.012',
    decision: 'Reject H0 (Significant)',
    aiSummary: 'ANOVA indicates 40Hz provides uniform predust pickup without clumping.',
    status: 'Confirmed Vital Few'
  },
  {
    id: 'T4',
    factor: 'รอบเวลาการทอด Frying Time (Shift 1 vs Shift 2)',
    tool: 'Mann-Whitney (Non-Parametric for 2)',
    sampleSize: 30,
    pVal: '0.428',
    decision: 'Fail to Reject H0 (Insignificant)',
    aiSummary: 'No statistically significant shift difference in frying time.',
    status: 'Insignificant'
  }
])

// Counterbalance Tests (Module 5 Phase 2 Requirement)
const counterbalanceTests = ref([
  {
    id: 'CB-01',
    metric: 'Crumb Adhesion Defect Rate (%)',
    tool: '2-Proportion Test',
    sampleSize: 200,
    baselineP: '1.20%',
    afterP: '0.40%',
    pVal: '0.024',
    result: 'Defect rate did NOT increase (Improved from 1.2% to 0.4%)',
    status: 'Passed'
  },
  {
    id: 'CB-02',
    metric: 'Sensory Crispiness Score (1-10)',
    tool: 'Mood\'s Median (Non-Parametric)',
    sampleSize: 30,
    baselineP: '8.2',
    afterP: '8.5',
    pVal: '0.312',
    result: 'No degradation in organoleptic sensory score.',
    status: 'Passed'
  }
])

// Sample Size Calculator (Module 5 Phase 1 Requirement)
const sampleSizeState = ref({
  deltaDifference: 0.5,
  estStdDev: 1.2,
  power: 0.80,
  alpha: 0.05,
  calculatedSampleSize: 46
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
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Hypothesis Testing Suite</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Hypothesis Testing"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Subtabs Navigation -->
        <div class="flex items-center border-b border-gray-200 space-x-6 text-xs font-semibold">
          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'standard' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'standard'"
          >
            <UIcon name="i-lucide-test-tube" class="size-4" />
            <span>Parametric & Non-Parametric Battery</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'counterbalance' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'counterbalance'"
          >
            <UIcon name="i-lucide-scale" class="size-4" />
            <span>Counterbalance Testing (Phase 2)</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'samplesize' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'samplesize'"
          >
            <UIcon name="i-lucide-calculator" class="size-4" />
            <span>Sample Size Recommender</span>
          </button>
        </div>

        <!-- 1. STANDARD TESTS TABLE WITH AI SYNTHESIS -->
        <div v-if="activeSubTab === 'standard'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Validated Root Causes (Automated Tool Selection & P-Value)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Automatically executes 2-Sample T, ANOVA, 1-Prop, 2-Prop, or Non-Parametric tests based on data normality
              </p>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              3 Vital Few Confirmed
            </span>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th class="py-3 px-3 text-center">ID</th>
                  <th class="py-3 px-4">TESTED FACTOR</th>
                  <th class="py-3 px-3 font-semibold">STATISTICAL TOOL</th>
                  <th class="py-3 px-3 text-center">SAMPLE N</th>
                  <th class="py-3 px-3 text-center">P-VALUE</th>
                  <th class="py-3 px-4">AI NATURAL LANGUAGE INTERPRETATION</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="t in tests" :key="t.id" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-gray-900">{{ t.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">
                    <NuxtLink :to="`/admin/projects/${projectId}/analyze/tests/1`" class="hover:text-[#008779]">
                      {{ t.factor }}
                    </NuxtLink>
                  </td>
                  <td class="py-3.5 px-3 font-medium text-gray-800">{{ t.tool }}</td>
                  <td class="py-3.5 px-3 text-center font-mono text-gray-700">{{ t.sampleSize }}</td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold" :class="t.pVal === '0.000' ? 'text-emerald-600' : 'text-gray-700'">
                    {{ t.pVal }}
                  </td>
                  <td class="py-3.5 px-4 text-gray-600 text-[11px] leading-relaxed">
                    <div class="flex items-start gap-1">
                      <UIcon name="i-lucide-sparkles" class="size-3 text-[#008779] shrink-0 mt-0.5" />
                      <span>{{ t.aiSummary }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="t.status.includes('Confirmed') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'"
                    >
                      {{ t.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. COUNTERBALANCE TESTS VIEW (Module 5 Phase 2 Requirement) -->
        <div v-if="activeSubTab === 'counterbalance'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Counterbalance Hypothesis Testing
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Statistical verification ensuring process optimization does not cause unintended secondary defects
              </p>
            </div>
            <button class="bg-[#008779] text-white text-xs font-semibold px-3 py-1.5 rounded-md">
              + New Counterbalance Test
            </button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th class="py-3 px-3 text-center">ID</th>
                  <th class="py-3 px-4">COUNTERBALANCE METRIC</th>
                  <th class="py-3 px-3">TOOL</th>
                  <th class="py-3 px-3 text-center font-mono">BASELINE</th>
                  <th class="py-3 px-3 text-center font-mono">AFTER RUN</th>
                  <th class="py-3 px-3 text-center font-mono">P-VALUE</th>
                  <th class="py-3 px-4">STATISTICAL RESULT</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="cb in counterbalanceTests" :key="cb.id">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-gray-900">{{ cb.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">{{ cb.metric }}</td>
                  <td class="py-3.5 px-3 text-gray-700">{{ cb.tool }}</td>
                  <td class="py-3.5 px-3 text-center font-mono text-gray-600">{{ cb.baselineP }}</td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-emerald-700">{{ cb.afterP }}</td>
                  <td class="py-3.5 px-3 text-center font-mono text-gray-700">{{ cb.pVal }}</td>
                  <td class="py-3.5 px-4 text-gray-700 text-[11px]">{{ cb.result }}</td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {{ cb.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. SAMPLE SIZE RECOMMENDER (Module 5 Phase 1 Requirement) -->
        <div v-if="activeSubTab === 'samplesize'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="pb-3 border-b border-gray-100">
            <h2 class="text-sm font-bold text-gray-900">
              Sample Size Power & Precision Recommender
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Calculates minimal sample count required to detect differences with specified statistical power (1-&beta; = 80%)
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Detectable Difference (&delta;):</label>
              <input v-model="sampleSizeState.deltaDifference" type="number" step="0.1" class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono" />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Estimated Std Dev (&sigma;):</label>
              <input v-model="sampleSizeState.estStdDev" type="number" step="0.1" class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono" />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Target Power (1 - &beta;):</label>
              <input v-model="sampleSizeState.power" type="number" step="0.05" class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono" />
            </div>

            <div class="space-y-1 bg-teal-50 border border-teal-200 rounded-lg p-3 text-center">
              <span class="text-[10px] text-teal-800 font-bold uppercase block">RECOMMENDED SAMPLE N</span>
              <span class="text-2xl font-bold font-mono text-[#008779]">{{ sampleSizeState.calculatedSampleSize }} points / group</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
