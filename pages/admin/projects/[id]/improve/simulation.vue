<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

// Simulation Input Parameter Sliders (Transfer Function Predictor)
const weightOffset = ref(10.0) // grams (range: 5 to 25)
const dropCount = ref(1) // drops (range: 1 to 3)
const predustSpeed = ref(40) // Hz (range: 20 to 60)
const fryingTemp = ref(175) // deg C (range: 160 to 190)

// Mathematical Transfer Function computed from DOE & Regression:
// %Giveaway = 1.140 + 0.1060*(WeightOffset) + 0.954*(DropCount) - 0.005*(PredustSpeed - 40)
const predictedGiveaway = computed(() => {
  const base = 1.140 + 0.1060 * weightOffset.value + 0.954 * dropCount.value - 0.005 * (predustSpeed.value - 40)
  return Number(Math.max(0.5, base).toFixed(2))
})

// %Total Yield = 90.0 - %Giveaway - 0.10
const predictedYield = computed(() => {
  return Number((90.0 - predictedGiveaway.value - 0.10).toFixed(2))
})

// Financial Annual Savings Impact (Baseline Giveaway was 4.25%)
const baselineGiveaway = 4.25
const annualVolumeTons = 2500
const costPerKgThb = 85.0

const predictedAnnualSavingsThb = computed(() => {
  const giveawayReductionPct = Math.max(0, baselineGiveaway - predictedGiveaway.value)
  const savingsThb = (giveawayReductionPct / 100) * annualVolumeTons * 1000 * costPerKgThb
  return Math.round(savingsThb).toLocaleString()
})

const scenarios = ref([
  { name: 'Baseline Condition (Before)', weight: 15.0, drops: 2, speed: 45, yieldVal: '83.75%', giveaway: '4.25%', savings: '0 THB' },
  { name: 'DOE Recommended Optimum', weight: 10.0, drops: 1, speed: 40, yieldVal: '87.70%', giveaway: '2.20%', savings: '4,356,250 THB' },
  { name: 'Aggressive Lean Trial', weight: 8.0, drops: 1, speed: 42, yieldVal: '87.90%', giveaway: '1.99%', savings: '4,802,500 THB' }
])
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
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h1 class="text-base font-bold text-gray-900">
                What-If Scenario Simulation Engine (Transfer Function)
              </h1>
              <p class="text-xs text-gray-500 mt-0.5">
                Real-time mathematical prediction of Yield & Giveaway based on DOE & Regression models
              </p>
            </div>
            <span class="text-xs font-bold text-[#008779] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Live Transfer Function Connected
            </span>
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
                  <span class="font-mono text-[#008779] font-bold">{{ weightOffset }} g</span>
                </div>
                <input
                  v-model.number="weightOffset"
                  type="range"
                  min="5"
                  max="25"
                  step="0.5"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>5 g (Low)</span>
                  <span>10 g (Optimum)</span>
                  <span>25 g (High)</span>
                </div>
              </div>

              <!-- Slider 2: Drop Count -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Multihead Drop Setting:</span>
                  <span class="font-mono text-[#008779] font-bold">{{ dropCount }} Drop(s)</span>
                </div>
                <input
                  v-model.number="dropCount"
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>1 Drop (Fast/Precise)</span>
                  <span>2 Drops</span>
                  <span>3 Drops</span>
                </div>
              </div>

              <!-- Slider 3: Predust Speed -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Predust Feeder Inverter Speed:</span>
                  <span class="font-mono text-[#008779] font-bold">{{ predustSpeed }} Hz</span>
                </div>
                <input
                  v-model.number="predustSpeed"
                  type="range"
                  min="20"
                  max="60"
                  step="1"
                  class="w-full accent-[#008779] cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>20 Hz</span>
                  <span>40 Hz (STD)</span>
                  <span>60 Hz</span>
                </div>
              </div>
            </div>

            <!-- Right: Real-time Output Predictor Cards (5 Cols) -->
            <div class="lg:col-span-5 space-y-3">
              <!-- Predicted %Total Yield -->
              <div class="border-2 border-emerald-300 bg-emerald-50/50 rounded-xl p-4 text-center space-y-1 shadow-xs">
                <span class="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">PREDICTED %TOTAL YIELD</span>
                <p class="text-3xl font-black text-emerald-700 font-mono">{{ predictedYield }}%</p>
                <span class="text-[11px] text-emerald-600 font-semibold">Goal LSS (87.15%) Exceeded!</span>
              </div>

              <!-- Predicted %Giveaway -->
              <div class="border border-teal-200 bg-teal-50/50 rounded-xl p-3.5 text-center space-y-1">
                <span class="text-[10px] text-teal-800 uppercase font-bold block">PREDICTED %GIVEAWAY</span>
                <p class="text-2xl font-bold text-[#008779] font-mono">{{ predictedGiveaway }}%</p>
                <span class="text-[10px] text-teal-600 font-mono">Reduced from Baseline (4.25%)</span>
              </div>

              <!-- Annual Financial Savings Impact -->
              <div class="border border-gray-200 bg-white rounded-xl p-3.5 text-center space-y-1">
                <span class="text-[10px] text-gray-500 uppercase font-bold block">ESTIMATED ANNUAL SAVINGS</span>
                <p class="text-xl font-bold text-gray-900 font-mono">{{ predictedAnnualSavingsThb }} THB</p>
                <span class="text-[10px] text-gray-400 font-mono">Based on 2,500 Tons/Year Capacity</span>
              </div>
            </div>
          </div>

          <!-- Scenario Comparison Matrix -->
          <div class="space-y-2 pt-2 border-t border-gray-100">
            <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Saved Simulation Scenarios
            </h3>
            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th class="py-3 px-4">SCENARIO NAME</th>
                    <th class="py-3 px-3 text-center">OFFSET (G)</th>
                    <th class="py-3 px-3 text-center">DROPS</th>
                    <th class="py-3 px-3 text-center">SPEED (HZ)</th>
                    <th class="py-3 px-3 text-center font-bold text-emerald-700">%YIELD</th>
                    <th class="py-3 px-3 text-center font-bold text-teal-700">%GIVEAWAY</th>
                    <th class="py-3 px-4 text-center">ANNUAL SAVINGS</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 font-mono">
                  <tr v-for="(sc, sIdx) in scenarios" :key="sIdx" class="hover:bg-gray-50/50">
                    <td class="py-3.5 px-4 font-bold text-gray-900 font-sans">{{ sc.name }}</td>
                    <td class="py-3.5 px-3 text-center text-gray-700">{{ sc.weight }}</td>
                    <td class="py-3.5 px-3 text-center text-gray-700">{{ sc.drops }}</td>
                    <td class="py-3.5 px-3 text-center text-gray-700">{{ sc.speed }}</td>
                    <td class="py-3.5 px-3 text-center font-bold text-emerald-700">{{ sc.yieldVal }}</td>
                    <td class="py-3.5 px-3 text-center font-bold text-teal-700">{{ sc.giveaway }}</td>
                    <td class="py-3.5 px-4 text-center font-bold text-[#008779]">{{ sc.savings }}</td>
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
