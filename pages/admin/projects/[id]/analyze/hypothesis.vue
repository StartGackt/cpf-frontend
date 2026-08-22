<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const activeSubTab = ref<'battery' | 'counterbalance' | 'samplesize'>('battery')

// Toast notification state
const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

export interface HypothesisTestingRow {
  id: string
  process: string
  factor: string
  level1: string
  level2: string
  unit: string
  response: string
  testType: string
  pVal?: string
  result: 'Significant' | 'Not Significant' | 'Unanalyzed'
  version: string
  isAnalyzed: boolean
}

// Factors Table Matching Image 2.7 Item 3
const testingRows = ref<HypothesisTestingRow[]>([
  {
    id: 'T1',
    process: 'Packing',
    factor: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    level1: '10',
    level2: '20',
    unit: 'กรัม',
    response: '%Giveaway',
    testType: '2-Sample T',
    pVal: '0.000',
    result: 'Significant',
    version: 'Version 1',
    isAnalyzed: true
  },
  {
    id: 'T2',
    process: 'Packing',
    factor: 'จำนวนDropของเครื่องMultihead',
    level1: '1',
    level2: '2',
    unit: 'drop',
    response: '%Giveaway',
    testType: '2-Sample T',
    pVal: '0.001',
    result: 'Significant',
    version: 'Version 1',
    isAnalyzed: true
  },
  {
    id: 'T3',
    process: 'Frying',
    factor: 'ค่า Av น้ำมัน',
    level1: '0.8',
    level2: '1.5',
    unit: 'mg KOH/g',
    response: '%Yield',
    testType: '2-Sample T',
    pVal: '0.003',
    result: 'Significant',
    version: 'Version 1',
    isAnalyzed: true
  },
  {
    id: 'T4',
    process: 'Predusting',
    factor: 'ความเร็วเครื่องเติมแป้งPredust',
    level1: '35',
    level2: '45',
    unit: 'Hz',
    response: '%การใช้แป้ง',
    testType: '2-Sample T',
    pVal: '0.002',
    result: 'Significant',
    version: 'Version 1',
    isAnalyzed: true
  },
  {
    id: 'T5',
    process: 'Packing',
    factor: 'ความแรงการสั่นDFของเครื่องMultihead',
    level1: '40',
    level2: '60',
    unit: 'Hz',
    response: '%การใช้แป้ง',
    testType: '2-Sample T',
    pVal: '0.004',
    result: 'Significant',
    version: 'Version 1',
    isAnalyzed: true
  },
  {
    id: 'T6',
    process: 'Predusting',
    factor: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    level1: '-',
    level2: '-',
    unit: 'cm',
    response: '%การใช้แป้ง',
    testType: '2-Sample T',
    result: 'Unanalyzed',
    version: 'Version 1',
    isAnalyzed: false
  },
  {
    id: 'T7',
    process: 'Predusting',
    factor: 'ความเร็วรอบเครื่อง DB4',
    level1: '-',
    level2: '-',
    unit: 'Hz',
    response: '%การใช้แป้ง',
    testType: '2-Sample T',
    result: 'Unanalyzed',
    version: 'Version 1',
    isAnalyzed: false
  }
])

// Modal for Running Statistical Test on Unanalyzed Factor
const isRunTestModalOpen = ref(false)
const selectedFactorForTest = ref<HypothesisTestingRow | null>(null)
const runTestForm = ref({
  level1: '',
  level2: '',
  sampleN: 50,
  pVal: '0.002',
  notes: ''
})

const openRunTestModal = (row: HypothesisTestingRow) => {
  selectedFactorForTest.value = row
  runTestForm.value = {
    level1: row.level1 !== '-' ? row.level1 : '15',
    level2: row.level2 !== '-' ? row.level2 : '30',
    sampleN: 50,
    pVal: '0.002',
    notes: `ทำการทดสอบเปรียบเทียบค่า ${row.factor} ที่ระดับต่างๆ`
  }
  isRunTestModalOpen.value = true
}

const executeTest = () => {
  if (!selectedFactorForTest.value) return
  const p = parseFloat(runTestForm.value.pVal)
  const isSig = p < 0.05

  selectedFactorForTest.value.level1 = runTestForm.value.level1
  selectedFactorForTest.value.level2 = runTestForm.value.level2
  selectedFactorForTest.value.pVal = runTestForm.value.pVal
  selectedFactorForTest.value.result = isSig ? 'Significant' : 'Not Significant'
  selectedFactorForTest.value.isAnalyzed = true

  isRunTestModalOpen.value = false
  showToast(`✓ วิเคราะห์ปัจจัย "${selectedFactorForTest.value.factor}" สำเร็จ (P-Value = ${runTestForm.value.pVal}) ผลลัพธ์: ${selectedFactorForTest.value.result}`)
}

// Sample size calculator state
const sampleSizeState = computed(() => project.value.sampleSizeConfig)
const counterbalanceTests = computed(() => project.value.counterbalanceTests)

const recalculateSampleSize = () => {
  const { deltaDifference, estStdDev, power, alpha } = sampleSizeState.value
  const d = Math.max(0.01, deltaDifference)
  const s = Math.max(0.01, estStdDev)
  const zAlpha = alpha === 0.01 ? 2.576 : (alpha === 0.1 ? 1.645 : 1.96)
  const zBeta = power >= 0.9 ? 1.282 : (power >= 0.8 ? 0.842 : 0.524)
  const n = 2 * Math.pow(zAlpha + zBeta, 2) * Math.pow(s / d, 2)
  sampleSizeState.value.calculatedSampleSize = Math.max(4, Math.ceil(n))
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
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

    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-slate-500 pb-1">
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
      <span class="text-slate-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-slate-900 font-bold">Hypothesis Testing</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Hypothesis Testing"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-5 min-w-0 w-full">
        
        <!-- Header Banner (Matching Image 2.7 Item 3) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h1 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-chevron-right" class="size-4 text-slate-400" />
              <span>Hypothesis Testing</span>
            </h1>
            <p class="text-xs text-slate-500">
              Perform statistical hypothesis tests on selected factors to validate root causes
            </p>
          </div>

          <div class="flex items-center gap-2">
            <div class="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs font-semibold">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                :class="activeSubTab === 'battery' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                @click="activeSubTab = 'battery'"
              >
                Hypothesis Testing
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                :class="activeSubTab === 'counterbalance' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                @click="activeSubTab = 'counterbalance'"
              >
                Counterbalance
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                :class="activeSubTab === 'samplesize' ? 'bg-white text-[#008779] shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
                @click="activeSubTab = 'samplesize'"
              >
                Sample Size
              </button>
            </div>
          </div>
        </div>

        <!-- 1. HYPOTHESIS TESTING BATTERY VIEW (Matching Image 2.7 Item 3) -->
        <div v-if="activeSubTab === 'battery'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Hypothesis Testing Battery
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Perform statistical hypothesis tests on selected factors to validate root causes
              </p>
            </div>

            <!-- Product Tag Tab -->
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-[#008779] border border-teal-200 rounded-xl font-bold text-xs font-mono">
              <span>%Total Yield สินค้าไก่ทอดต่ำ</span>
            </div>
          </div>

          <!-- Table matching Image 2.7 Item 3 -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-3">PROCESS</th>
                  <th class="py-3 px-4">FACTOR</th>
                  <th class="py-3 px-3 text-center">LEVEL</th>
                  <th class="py-3 px-3 text-center">UNIT</th>
                  <th class="py-3 px-3">RESPONSE</th>
                  <th class="py-3 px-3 text-center">HYPOTHESIS TEST</th>
                  <th class="py-3 px-3 text-center">RESULT</th>
                  <th class="py-3 px-3 text-center">VERSION</th>
                  <th class="py-3 px-3 text-center w-28">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-800">
                <tr
                  v-for="row in testingRows"
                  :key="row.id"
                  class="hover:bg-slate-50/60 transition-colors"
                  :class="!row.isAnalyzed ? 'bg-amber-50/20' : ''"
                >
                  <!-- Process -->
                  <td class="py-3.5 px-3 font-semibold text-slate-700">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px]">
                      {{ row.process }}
                    </span>
                  </td>

                  <!-- Factor -->
                  <td class="py-3.5 px-4 font-bold text-slate-900">
                    {{ row.factor }}
                  </td>

                  <!-- Level (e.g. 10 | 20 or - | -) -->
                  <td class="py-3.5 px-3 text-center font-mono">
                    <span v-if="row.isAnalyzed" class="font-bold text-slate-800">
                      {{ row.level1 }} &nbsp;|&nbsp; {{ row.level2 }}
                    </span>
                    <span v-else class="text-slate-400 font-bold">
                      - &nbsp;|&nbsp; -
                    </span>
                  </td>

                  <!-- Unit -->
                  <td class="py-3.5 px-3 text-center font-mono text-slate-600">
                    {{ row.unit }}
                  </td>

                  <!-- Response -->
                  <td class="py-3.5 px-3 font-medium text-slate-700">
                    {{ row.response }}
                  </td>

                  <!-- Hypothesis Test Tool -->
                  <td class="py-3.5 px-3 text-center">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {{ row.testType }}
                    </span>
                  </td>

                  <!-- Result (Significant vs Unanalyzed) -->
                  <td class="py-3.5 px-3 text-center">
                    <span
                      v-if="row.isAnalyzed"
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      :class="row.result === 'Significant' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-200'"
                    >
                      <UIcon :name="row.result === 'Significant' ? 'i-lucide-check-circle-2' : 'i-lucide-x-circle'" class="size-3" />
                      <span>{{ row.result }}</span>
                    </span>

                    <button
                      v-else
                      type="button"
                      class="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs cursor-pointer transition-colors flex items-center gap-1 mx-auto"
                      title="กดเพื่อกรอกข้อมูลและทำการวิเคราะห์ทางสถิติ"
                      @click="openRunTestModal(row)"
                    >
                      <UIcon name="i-lucide-play" class="size-3" />
                      <span>กดวิเคราะห์ข้อมูล</span>
                    </button>
                  </td>

                  <!-- Version -->
                  <td class="py-3.5 px-3 text-center">
                    <span class="inline-flex items-center gap-1 text-[10px] font-mono text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      <UIcon name="i-lucide-clock" class="size-2.5 text-teal-500" />
                      <span>{{ row.version }}</span>
                    </span>
                  </td>

                  <!-- Action -->
                  <td class="py-3.5 px-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button
                        v-if="row.isAnalyzed"
                        type="button"
                        class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        title="ดูผลการวิเคราะห์ Normality & 2-Sample T"
                        @click="openRunTestModal(row)"
                      >
                        <UIcon name="i-lucide-eye" class="size-3 text-slate-500" />
                        <span>View</span>
                      </button>

                      <button
                        v-else
                        type="button"
                        class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        @click="openRunTestModal(row)"
                      >
                        <UIcon name="i-lucide-sparkles" class="size-3" />
                        <span>Analyze</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. COUNTERBALANCE TESTS VIEW -->
        <div v-else-if="activeSubTab === 'counterbalance'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h2 class="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Counterbalance Hypothesis Verification (No Side Effects on Quality)
          </h2>
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
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
              <tbody class="divide-y divide-slate-100">
                <tr v-for="cb in counterbalanceTests" :key="cb.id">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-slate-900">{{ cb.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-slate-900">{{ cb.metric }}</td>
                  <td class="py-3.5 px-3 text-slate-700 font-mono">{{ cb.tool }}</td>
                  <td class="py-3.5 px-3 text-center font-mono text-slate-700">{{ cb.baselineP }}</td>
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

        <!-- 3. SAMPLE SIZE CALCULATOR VIEW -->
        <div v-else-if="activeSubTab === 'samplesize'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Statistical Power & Sample Size Determination
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Calculates minimum required sample size to detect target delta (&delta;) at specified power
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div class="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label class="font-bold text-slate-800 block mb-1">Target Detectable Difference (&delta;)</label>
                <input
                  v-model.number="sampleSizeState.deltaDifference"
                  type="number"
                  step="0.1"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs focus:border-[#008779] focus:outline-none"
                  @input="recalculateSampleSize"
                />
              </div>

              <div>
                <label class="font-bold text-slate-800 block mb-1">Estimated Process Standard Deviation (&sigma;)</label>
                <input
                  v-model.number="sampleSizeState.estStdDev"
                  type="number"
                  step="0.1"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs focus:border-[#008779] focus:outline-none"
                  @input="recalculateSampleSize"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="font-bold text-slate-800 block mb-1">Target Power (1 - &beta;)</label>
                  <select
                    v-model.number="sampleSizeState.power"
                    class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#008779] focus:outline-none"
                    @change="recalculateSampleSize"
                  >
                    <option :value="0.80">80% (Standard)</option>
                    <option :value="0.90">90% (High Confidence)</option>
                    <option :value="0.70">70% (Preliminary)</option>
                  </select>
                </div>

                <div>
                  <label class="font-bold text-slate-800 block mb-1">Significance Level (&alpha;)</label>
                  <select
                    v-model.number="sampleSizeState.alpha"
                    class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-[#008779] focus:outline-none"
                    @change="recalculateSampleSize"
                  >
                    <option :value="0.05">0.05 (95% Conf)</option>
                    <option :value="0.01">0.01 (99% Conf)</option>
                    <option :value="0.10">0.10 (90% Conf)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="border-2 border-teal-200 bg-teal-50/40 rounded-2xl p-8 text-center space-y-3">
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

    <!-- RUN / ANALYZE STATISTICAL TEST MODAL (Matching Requirement Image 2.7 Item 3) -->
    <Teleport to="body">
      <div
        v-if="isRunTestModalOpen && selectedFactorForTest"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-xs">
          <!-- Modal Header -->
          <div class="p-5 bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 text-white flex items-center justify-between">
            <div class="space-y-0.5">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <UIcon name="i-lucide-test-tube-2" class="size-4 text-teal-300" />
                <span>วิเคราะห์สมมติฐานทางสถิติ (Hypothesis Analysis)</span>
              </h3>
              <p class="text-[11px] text-teal-200">
                ปัจจัย: <strong>{{ selectedFactorForTest.factor }}</strong> ({{ selectedFactorForTest.process }})
              </p>
            </div>
            <button
              type="button"
              class="size-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              @click="isRunTestModalOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div class="flex justify-between">
                <span class="text-slate-500">เครื่องมือทดสอบ (Tool):</span>
                <span class="font-bold font-mono text-blue-700">{{ selectedFactorForTest.testType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">ตัวแปรตอบสนอง (Response Y):</span>
                <span class="font-bold text-slate-800">{{ selectedFactorForTest.response }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">หน่วยวัด (Unit):</span>
                <span class="font-mono text-slate-800">{{ selectedFactorForTest.unit }}</span>
              </div>
            </div>

            <!-- Level 1 & Level 2 Inputs -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-700 block mb-1">ระดับทดสอบที่ 1 (Level 1)</label>
                <input
                  v-model="runTestForm.level1"
                  type="text"
                  placeholder="เช่น 15"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#008779] focus:outline-none"
                />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">ระดับทดสอบที่ 2 (Level 2)</label>
                <input
                  v-model="runTestForm.level2"
                  type="text"
                  placeholder="เช่น 30"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#008779] focus:outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-700 block mb-1">ขนาดตัวอย่าง (Sample Size N)</label>
                <input
                  v-model.number="runTestForm.sampleN"
                  type="number"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#008779] focus:outline-none"
                />
              </div>
              <div>
                <label class="font-bold text-slate-700 block mb-1">P-Value ผลการคำนวณ</label>
                <input
                  v-model="runTestForm.pVal"
                  type="text"
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:border-[#008779] focus:outline-none"
                />
              </div>
            </div>

            <div class="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-[11px] text-teal-900 space-y-1">
              <span class="font-bold">เกณฑ์ตัดสินทางสถิติ (&alpha; = 0.05):</span>
              <p>• P-Value &lt; 0.05: <strong>Reject H0 (Significant)</strong> — ปัจจัยนี้ส่งผลต่อ {{ selectedFactorForTest.response }} อย่างมีนัยสำคัญ</p>
              <p>• P-Value &ge; 0.05: <strong>Fail to Reject H0 (Not Significant)</strong> — ไม่มีนัยสำคัญ</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              @click="isRunTestModalOpen = false"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              @click="executeTest"
            >
              <UIcon name="i-lucide-check-circle" class="size-3.5" />
              <span>บันทึกผลการวิเคราะห์ (Run Analysis)</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
