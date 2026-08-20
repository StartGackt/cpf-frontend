<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const monthlyTracking = ref([
  { month: 'M1 (Mar 25)', targetYield: 87.15, actualYield: 87.50, giveaway: 2.25, savingsThb: 354000, status: 'Audited' },
  { month: 'M2 (Apr 25)', targetYield: 87.15, actualYield: 87.65, giveaway: 2.18, savingsThb: 362000, status: 'Audited' },
  { month: 'M3 (May 25)', targetYield: 87.15, actualYield: 87.80, giveaway: 2.10, savingsThb: 375000, status: 'Audited' },
  { month: 'M4 (Jun 25)', targetYield: 87.15, actualYield: 87.70, giveaway: 2.15, savingsThb: 368000, status: 'Audited' },
  { month: 'M5 (Jul 25)', targetYield: 87.15, actualYield: 87.90, giveaway: 2.05, savingsThb: 382000, status: 'Audited' },
  { month: 'M6 (Aug 25)', targetYield: 87.15, actualYield: 87.85, giveaway: 2.12, savingsThb: 371000, status: 'Audited' },
  { month: 'M7 (Sep 25)', targetYield: 87.15, actualYield: 87.75, giveaway: 2.19, savingsThb: 365000, status: 'Audited' },
  { month: 'M8 (Oct 25)', targetYield: 87.15, actualYield: 87.80, giveaway: 2.14, savingsThb: 370000, status: 'Audited' },
  { month: 'M9 (Nov 25)', targetYield: 87.15, actualYield: 87.60, giveaway: 2.22, savingsThb: 358000, status: 'Audited' },
  { month: 'M10 (Dec 25)', targetYield: 87.15, actualYield: 87.95, giveaway: 2.00, savingsThb: 389000, status: 'Audited' },
  { month: 'M11 (Jan 26)', targetYield: 87.15, actualYield: 87.70, giveaway: 2.16, savingsThb: 367000, status: 'Audited' },
  { month: 'M12 (Feb 26)', targetYield: 87.15, actualYield: 87.75, giveaway: 2.15, savingsThb: 369000, status: 'Audited' }
])

const totalCumulativeSavings = computed(() => {
  const sum = monthlyTracking.value.reduce((acc, row) => acc + row.savingsThb, 0)
  return sum.toLocaleString() + ' THB'
})

const averageSustainedYield = computed(() => {
  const sum = monthlyTracking.value.reduce((acc, row) => acc + row.actualYield, 0)
  return (sum / monthlyTracking.value.length).toFixed(2) + '%'
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
      <span class="text-gray-700 font-medium">Control</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">12-Month Realization Tracking</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Realization"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Monthly Update Reminder Alert Banner (Module 7 Requirement) -->
        <div class="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center font-bold">
              <UIcon name="i-lucide-bell" class="size-4" />
            </div>
            <div>
              <h3 class="font-bold text-teal-950">
                12-Month Financial Realization Tracking (System Reminder Active)
              </h3>
              <p class="text-teal-700 mt-0.5">
                Monthly email triggers sent on the 1st of every month to line champions to verify sustained yield and audited financial savings.
              </p>
            </div>
          </div>
          <span class="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            12/12 Months Completed
          </span>
        </div>

        <!-- Summary KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">12-MONTH CUMULATIVE SAVINGS</span>
            <p class="text-2xl font-bold text-emerald-700 font-mono">{{ totalCumulativeSavings }}</p>
            <span class="text-[10px] text-emerald-600 font-semibold">100% Finance Audited</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">AVERAGE SUSTAINED YIELD</span>
            <p class="text-2xl font-bold text-[#008779] font-mono">{{ averageSustainedYield }}</p>
            <span class="text-[10px] text-teal-600 font-semibold font-mono">&gt; Goal LSS (87.15%)</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">YIELD RETENTION RATE</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">100%</p>
            <span class="text-[10px] text-gray-500">Zero Process Regression</span>
          </div>
        </div>

        <!-- 12-Month Data Table Grid -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Monthly Breakdown (Month 1 to Month 12)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Tracks sustained operational performance and bottom-line profit impact
              </p>
            </div>

            <button class="bg-[#008779] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs">
              + Update Current Month
            </button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th class="py-3 px-4">TRACKING PERIOD</th>
                  <th class="py-3 px-3 text-center font-mono">TARGET YIELD</th>
                  <th class="py-3 px-3 text-center font-mono">ACTUAL YIELD</th>
                  <th class="py-3 px-3 text-center font-mono text-teal-700">%GIVEAWAY</th>
                  <th class="py-3 px-4 text-center font-mono font-bold text-emerald-700">AUDITED SAVINGS (THB)</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-mono">
                <tr v-for="(row, idx) in monthlyTracking" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-sans font-bold text-gray-900">{{ row.month }}</td>
                  <td class="py-3.5 px-3 text-center text-gray-500">{{ row.targetYield }}%</td>
                  <td class="py-3.5 px-3 text-center font-bold text-[#008779]">{{ row.actualYield }}%</td>
                  <td class="py-3.5 px-3 text-center font-semibold text-gray-700">{{ row.giveaway }}%</td>
                  <td class="py-3.5 px-4 text-center font-bold text-emerald-700">{{ row.savingsThb.toLocaleString() }} THB</td>
                  <td class="py-3.5 px-3 text-center font-sans">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
