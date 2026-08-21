<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const activeSubTab = ref<'standard' | 'counterbalance' | 'samplesize'>('standard')

const tests = computed(() => project.value.hypothesisTests)
const counterbalanceTests = computed(() => project.value.counterbalanceTests)
const sampleSizeState = computed(() => project.value.sampleSizeConfig)

// Interactive Sample Size Recalculation
const recalculateSampleSize = () => {
  const { deltaDifference, estStdDev, power, alpha } = sampleSizeState.value
  const d = Math.max(0.01, deltaDifference)
  const s = Math.max(0.01, estStdDev)
  // Standard two-sample t test sample size formula approximation:
  // n = 2 * ((Z_alpha/2 + Z_beta)^2) * (s / d)^2
  const zAlpha = alpha === 0.01 ? 2.576 : (alpha === 0.1 ? 1.645 : 1.96)
  const zBeta = power >= 0.9 ? 1.282 : (power >= 0.8 ? 0.842 : 0.524)
  const n = 2 * Math.pow(zAlpha + zBeta, 2) * Math.pow(s / d, 2)
  sampleSizeState.value.calculatedSampleSize = Math.max(4, Math.ceil(n))
}

// Add/Edit Test Modal
const isAddTestModalOpen = ref(false)
const newTest = ref({
  id: '',
  factor: '',
  tool: '2-Sample T Test',
  sampleSize: 64,
  pVal: '0.000',
  decision: 'Reject H0 (Significant)',
  aiSummary: '',
  status: 'Confirmed Vital Few'
})

const openAddTestModal = () => {
  newTest.value = {
    id: `T${project.value.hypothesisTests.length + 1}`,
    factor: '',
    tool: '2-Sample T Test',
    sampleSize: 50,
    pVal: '0.005',
    decision: 'Reject H0 (Significant)',
    aiSummary: '',
    status: 'Confirmed Vital Few'
  }
  isAddTestModalOpen.value = true
}

const saveTest = () => {
  if (!newTest.value.factor) {
    alert('Please enter factor name')
    return
  }
  const isSig = parseFloat(newTest.value.pVal) < 0.05
  project.value.hypothesisTests.push({
    id: newTest.value.id || `T${project.value.hypothesisTests.length + 1}`,
    factor: newTest.value.factor,
    tool: newTest.value.tool,
    sampleSize: newTest.value.sampleSize,
    pVal: newTest.value.pVal,
    decision: isSig ? 'Reject H0 (Significant)' : 'Fail to Reject H0 (Insignificant)',
    aiSummary: newTest.value.aiSummary || (isSig ? 'Statistically significant impact on yield/giveaway.' : 'No significant effect detected.'),
    status: isSig ? 'Confirmed Vital Few' : 'Insignificant'
  })
  isAddTestModalOpen.value = false
}

const removeTest = (idx: number) => {
  project.value.hypothesisTests.splice(idx, 1)
}
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
      <span class="text-gray-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Hypothesis Testing Battery</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Hypothesis Testing"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Sub Navigation Tabs -->
        <div class="flex items-center border-b border-gray-200 space-x-6 text-xs font-semibold">
          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'standard' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'standard'"
          >
            <UIcon name="i-lucide-test-tube-2" class="size-4" />
            <span>Root Cause Hypothesis Battery</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'counterbalance' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'counterbalance'"
          >
            <UIcon name="i-lucide-scale" class="size-4" />
            <span>Counterbalance Confirmation</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer"
            :class="activeSubTab === 'samplesize' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'samplesize'"
          >
            <UIcon name="i-lucide-calculator" class="size-4" />
            <span>Power & Sample Size Calculator</span>
          </button>
        </div>

        <!-- 1. Standard Hypothesis Tests View -->
        <div v-if="activeSubTab === 'standard'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Root Cause Hypothesis Testing Battery (Statistically Verified)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Evaluates significance against &alpha; = 0.05. Statistically confirmed factors feed directly into Improve DOE.
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              @click="openAddTestModal"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>+ Add Hypothesis Test</span>
            </button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <th class="py-3 px-3 text-center">ID</th>
                  <th class="py-3 px-4">SUSPECTED FACTOR (X)</th>
                  <th class="py-3 px-3">TOOL</th>
                  <th class="py-3 px-3 text-center">N</th>
                  <th class="py-3 px-3 text-center font-mono font-bold">P-VALUE</th>
                  <th class="py-3 px-4">STATISTICAL DECISION</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                  <th class="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(t, idx) in tests" :key="t.id" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-gray-900">{{ t.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">
                    {{ t.factor }}
                    <span class="block text-[11px] text-gray-500 font-normal mt-0.5">{{ t.aiSummary }}</span>
                  </td>
                  <td class="py-3.5 px-3 text-gray-700 font-mono text-[11px]">{{ t.tool }}</td>
                  <td class="py-3.5 px-3 text-center font-mono">{{ t.sampleSize }}</td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold" :class="parseFloat(t.pVal) < 0.05 ? 'text-red-600' : 'text-gray-500'">
                    {{ t.pVal }}
                  </td>
                  <td class="py-3.5 px-4 text-[11px]" :class="parseFloat(t.pVal) < 0.05 ? 'text-emerald-800 font-semibold' : 'text-gray-500'">
                    {{ t.decision }}
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="t.status.includes('Vital Few') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'"
                    >
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <button type="button" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer" @click="removeTest(idx)">
                      <UIcon name="i-lucide-trash-2" class="size-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Counterbalance Tests View -->
        <div v-if="activeSubTab === 'counterbalance'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <h2 class="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
            Counterbalance Hypothesis Verification (No Side Effects on Quality)
          </h2>
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th class="py-3 px-3 text-center">ID</th>
                  <th class="py-3 px-4">COUNTERBALANCE METRIC</th>
                  <th class="py-3 px-3">TOOL</th>
                  <th class="py-3 px-3 text-center">BEFORE</th>
                  <th class="py-3 px-3 text-center">AFTER</th>
                  <th class="py-3 px-3 text-center font-mono">P-VAL</th>
                  <th class="py-3 px-4">VERIFICATION RESULT</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="cb in counterbalanceTests" :key="cb.id">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-gray-900">{{ cb.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">{{ cb.metric }}</td>
                  <td class="py-3.5 px-3 text-gray-700 font-mono">{{ cb.tool }}</td>
                  <td class="py-3.5 px-3 text-center font-mono text-gray-700">{{ cb.baselineP }}</td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-emerald-700">{{ cb.afterP }}</td>
                  <td class="py-3.5 px-3 text-center font-mono">{{ cb.pVal }}</td>
                  <td class="py-3.5 px-4 text-emerald-800 font-medium">{{ cb.result }}</td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ {{ cb.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. Sample Size Calculator View -->
        <div v-if="activeSubTab === 'samplesize'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Statistical Power & Sample Size Determination (Interactive)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Calculates minimum required sample size to detect target delta (&delta;) at specified statistical power (1 - &beta;)
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div class="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200 text-xs">
              <div>
                <label class="font-bold text-gray-800 block mb-1">Target Detectable Difference (&delta;)</label>
                <input
                  v-model.number="sampleSizeState.deltaDifference"
                  type="number"
                  step="0.1"
                  class="w-full bg-white border border-gray-300 rounded px-3 py-2 font-mono text-xs focus:border-[#008779] focus:outline-hidden"
                  @input="recalculateSampleSize"
                />
              </div>

              <div>
                <label class="font-bold text-gray-800 block mb-1">Estimated Process Standard Deviation (&sigma;)</label>
                <input
                  v-model.number="sampleSizeState.estStdDev"
                  type="number"
                  step="0.1"
                  class="w-full bg-white border border-gray-300 rounded px-3 py-2 font-mono text-xs focus:border-[#008779] focus:outline-hidden"
                  @input="recalculateSampleSize"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-bold text-gray-800 block mb-1">Target Power (1 - &beta;)</label>
                  <select
                    v-model.number="sampleSizeState.power"
                    class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#008779] focus:outline-hidden"
                    @change="recalculateSampleSize"
                  >
                    <option :value="0.80">80% (Standard)</option>
                    <option :value="0.90">90% (High Confidence)</option>
                    <option :value="0.70">70% (Preliminary)</option>
                  </select>
                </div>

                <div>
                  <label class="font-bold text-gray-800 block mb-1">Significance Level (&alpha;)</label>
                  <select
                    v-model.number="sampleSizeState.alpha"
                    class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs focus:border-[#008779] focus:outline-hidden"
                    @change="recalculateSampleSize"
                  >
                    <option :value="0.05">0.05 (95% Conf)</option>
                    <option :value="0.01">0.01 (99% Conf)</option>
                    <option :value="0.10">0.10 (90% Conf)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="border-2 border-teal-200 bg-teal-50/40 rounded-xl p-8 text-center space-y-3">
              <span class="text-xs font-bold text-[#008779] uppercase tracking-wider block">RECOMMENDED MINIMUM SAMPLE SIZE (N)</span>
              <p class="text-5xl font-black text-teal-900 font-mono">
                {{ sampleSizeState.calculatedSampleSize }}
              </p>
              <span class="text-xs text-teal-700 block font-medium">
                Sample units per test condition to achieve {{ (sampleSizeState.power * 100).toFixed(0) }}% statistical power
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Test Modal -->
    <div v-if="isAddTestModalOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">Add Root Cause Hypothesis Test</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isAddTestModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <label class="font-bold text-gray-700 block mb-1">Suspected Factor (X) *</label>
            <input v-model="newTest.factor" type="text" placeholder="e.g. ความเร็วสายพานทอด" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">Statistical Tool</label>
              <select v-model="newTest.tool" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden">
                <option>2-Sample T Test</option>
                <option>One-Way ANOVA</option>
                <option>Mann-Whitney</option>
                <option>2-Proportion Test</option>
                <option>Mood's Median</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">Sample Size (N)</label>
              <input v-model.number="newTest.sampleSize" type="number" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div>
            <label class="font-bold text-gray-700 block mb-1">Calculated P-Value</label>
            <input v-model="newTest.pVal" type="text" placeholder="e.g. 0.002" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div>
            <label class="font-bold text-gray-700 block mb-1">AI Synthesis / Conclusion</label>
            <input v-model="newTest.aiSummary" type="text" placeholder="e.g. Significant effect on yield." class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isAddTestModalOpen = false">Cancel</button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveTest">Save Hypothesis Test</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
