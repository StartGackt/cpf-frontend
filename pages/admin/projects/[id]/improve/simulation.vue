<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const {
  project,
  simulatedGiveaway,
  simulatedYield,
  simulatedAnnualSavingsThb,
  applySimulationToProject
} = useProjectData(projectId)

const sim = computed(() => project.value.simulationState)
const scenarios = computed(() => project.value.simulationScenarios)

const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

const handleApplyOptimum = () => {
  applySimulationToProject()
  showToast(`Applied predicted Yield ${simulatedYield.value}% to project target metrics!`)
}

const saveAsNewScenario = () => {
  const name = prompt('Enter name for this simulation scenario:', `Scenario ${scenarios.value.length + 1}`)
  if (name) {
    project.value.simulationScenarios.push({
      name,
      weight: sim.value.weightOffset,
      drops: sim.value.dropCount,
      speed: sim.value.predustSpeed,
      temp: sim.value.fryingTemp,
      yieldVal: `${simulatedYield.value}%`,
      giveaway: `${simulatedGiveaway.value}%`,
      savings: `${simulatedAnnualSavingsThb.value.toLocaleString()} THB`
    })
    showToast(`Saved "${name}" to scenario matrix`)
  }
}

const loadScenario = (sc: any) => {
  sim.value.weightOffset = sc.weight
  sim.value.dropCount = sc.drops
  sim.value.predustSpeed = sc.speed
  if (sc.temp) sim.value.fryingTemp = sc.temp
  showToast(`Loaded scenario: ${sc.name}`)
}
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Toast Feedback -->
    <div
      v-if="toastMsg"
      class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
    >
      <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
      <span>{{ toastMsg }}</span>
    </div>

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
      <span class="text-gray-700 font-medium">Improve</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">What-If Simulation Model</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="Simulation Model"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Main Simulation Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
            <div>
              <h1 class="text-base font-bold text-gray-900">
                What-If Scenario Simulation Engine (Transfer Function)
              </h1>
              <p class="text-xs text-gray-500 mt-0.5">
                Real-time mathematical prediction of Yield & Giveaway based on DOE & Regression models
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                @click="saveAsNewScenario"
              >
                <UIcon name="i-lucide-bookmark" class="size-3.5" />
                <span>Save Current Scenario</span>
              </button>
              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                @click="handleApplyOptimum"
              >
                <UIcon name="i-lucide-check-circle" class="size-3.5" />
                <span>Apply to Project Targets</span>
              </button>
            </div>
          </div>

          <!-- Split: Left Sliders, Right Real-Time Prediction Gauges -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <!-- Left: Factor Sliders (7 Cols) -->
            <div class="lg:col-span-7 space-y-4 bg-gray-50/70 border border-gray-200 rounded-xl p-5">
              <h2 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-sliders" class="size-4 text-[#008779]" />
                <span>Adjust Critical Process Parameters (Inputs X)</span>
              </h2>

              <!-- Slider 1: Weight Offset -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Multihead Weight Offset:</span>
                  <span class="font-mono text-[#008779] font-bold">{{ sim.weightOffset }} g</span>
                </div>
                <input
                  v-model.number="sim.weightOffset"
                  type="range"
                  min="5"
                  max="25"
                  step="0.5"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>5.0g (Lean Target)</span>
                  <span>10.0g (Optimum)</span>
                  <span>25.0g (High Loss)</span>
                </div>
              </div>

              <!-- Slider 2: Drop Count -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Multihead Drop Count:</span>
                  <span class="font-mono text-[#008779] font-bold">{{ sim.dropCount }} drop(s)</span>
                </div>
                <input
                  v-model.number="sim.dropCount"
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>1 Drop (Stable Pack)</span>
                  <span>2 Drops</span>
                  <span>3 Drops (High Variation)</span>
                </div>
              </div>

              <!-- Slider 3: Predust Speed -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Predust Feeder Speed:</span>
                  <span class="font-mono text-[#008779] font-bold">{{ sim.predustSpeed }} Hz</span>
                </div>
                <input
                  v-model.number="sim.predustSpeed"
                  type="range"
                  min="20"
                  max="60"
                  step="1"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>20 Hz</span>
                  <span>40 Hz (Standard)</span>
                  <span>60 Hz</span>
                </div>
              </div>

              <!-- Slider 4: Frying Temperature -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Continuous Fryer Temp:</span>
                  <span class="font-mono text-[#008779] font-bold">{{ sim.fryingTemp }} °C</span>
                </div>
                <input
                  v-model.number="sim.fryingTemp"
                  type="range"
                  min="160"
                  max="190"
                  step="1"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>160 °C</span>
                  <span>175 °C</span>
                  <span>190 °C</span>
                </div>
              </div>
            </div>

            <!-- Right: Real-Time Output KPI Gauges (5 Cols) -->
            <div class="lg:col-span-5 space-y-4">
              <!-- Gauge 1: Predicted Giveaway -->
              <div class="bg-teal-900 text-white rounded-xl p-4 shadow-md space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-teal-200 uppercase">PREDICTED %GIVEAWAY</span>
                  <span class="text-[10px] font-mono text-teal-300">Lower is better (&le; 2.20%)</span>
                </div>
                <div class="flex items-baseline justify-between">
                  <p class="text-3xl font-black font-mono tracking-tight">{{ simulatedGiveaway }}%</p>
                  <span
                    class="text-xs font-bold px-2 py-0.5 rounded"
                    :class="simulatedGiveaway <= 2.20 ? 'bg-emerald-400 text-gray-950' : 'bg-amber-400 text-gray-950'"
                  >
                    {{ simulatedGiveaway <= 2.20 ? '✓ Target Met' : '! Exceeds Limit' }}
                  </span>
                </div>
                <div class="w-full bg-teal-950/80 h-2 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="simulatedGiveaway <= 2.20 ? 'bg-emerald-400' : 'bg-amber-400'"
                    :style="`width: ${Math.min(100, (simulatedGiveaway / 5.0) * 100)}%`"
                  ></div>
                </div>
              </div>

              <!-- Gauge 2: Predicted Total Yield -->
              <div class="bg-white border-2 border-emerald-500 rounded-xl p-4 shadow-xs space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-gray-700 uppercase">PREDICTED %TOTAL YIELD</span>
                  <span class="text-[10px] font-mono text-emerald-600 font-bold">Goal &ge; 87.15%</span>
                </div>
                <p class="text-3xl font-black font-mono text-emerald-700 tracking-tight">{{ simulatedYield }}%</p>
                <span class="text-[11px] text-gray-500 block">
                  Calculated from: 90.0% - {{ simulatedGiveaway }}% Giveaway - 0.10% Sludge
                </span>
              </div>

              <!-- Gauge 3: Annual Cost Savings Impact -->
              <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-1">
                <span class="text-[10px] text-gray-400 font-bold uppercase block">ESTIMATED ANNUAL SAVINGS</span>
                <p class="text-xl font-bold font-mono text-gray-900">{{ simulatedAnnualSavingsThb.toLocaleString() }} THB / Year</p>
                <span class="text-[10px] text-emerald-600 font-semibold font-mono">
                  From giveaway reduction vs 4.25% Baseline
                </span>
              </div>
            </div>
          </div>

          <!-- Scenario Comparison Table -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <h2 class="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Saved Scenario Comparison Matrix
              </h2>
            </div>

            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th class="py-3 px-4">SCENARIO NAME</th>
                    <th class="py-3 px-3 text-center">WEIGHT OFFSET</th>
                    <th class="py-3 px-3 text-center">DROPS</th>
                    <th class="py-3 px-3 text-center">FEEDER SPEED</th>
                    <th class="py-3 px-3 text-center font-mono font-bold text-emerald-700">PREDICTED YIELD</th>
                    <th class="py-3 px-3 text-center font-mono font-bold text-teal-700">%GIVEAWAY</th>
                    <th class="py-3 px-4 text-center font-mono font-bold">ANNUAL SAVINGS</th>
                    <th class="py-3 px-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 font-mono">
                  <tr v-for="(sc, scIdx) in scenarios" :key="scIdx" class="hover:bg-gray-50/50">
                    <td class="py-3 px-4 font-sans font-bold text-gray-900">{{ sc.name }}</td>
                    <td class="py-3 px-3 text-center text-gray-700">{{ sc.weight }} g</td>
                    <td class="py-3 px-3 text-center text-gray-700">{{ sc.drops }} drop</td>
                    <td class="py-3 px-3 text-center text-gray-700">{{ sc.speed }} Hz</td>
                    <td class="py-3 px-3 text-center font-bold text-emerald-700">{{ sc.yieldVal }}</td>
                    <td class="py-3 px-3 text-center font-bold text-[#008779]">{{ sc.giveaway }}</td>
                    <td class="py-3 px-4 text-center font-bold text-gray-900">{{ sc.savings }}</td>
                    <td class="py-3 px-3 text-center font-sans">
                      <button
                        type="button"
                        class="text-xs text-[#008779] hover:underline font-bold cursor-pointer"
                        @click="loadScenario(sc)"
                      >
                        Load
                      </button>
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
