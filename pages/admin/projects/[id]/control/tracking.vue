<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const trackingData = ref([
  { date: '2026-01-05', shift: 'Shift A', yieldVal: 87.2, giveaway: 2.18, flourPct: 18.5, status: 'In Control' },
  { date: '2026-01-12', shift: 'Shift B', yieldVal: 87.5, giveaway: 2.20, flourPct: 18.4, status: 'In Control' },
  { date: '2026-01-19', shift: 'Shift A', yieldVal: 87.8, giveaway: 2.19, flourPct: 18.2, status: 'In Control' },
  { date: '2026-01-26', shift: 'Shift B', yieldVal: 87.4, giveaway: 2.21, flourPct: 18.6, status: 'In Control' },
  { date: '2026-02-02', shift: 'Shift A', yieldVal: 88.1, giveaway: 2.17, flourPct: 18.3, status: 'In Control' },
  { date: '2026-02-09', shift: 'Shift B', yieldVal: 88.0, giveaway: 2.18, flourPct: 18.1, status: 'In Control' },
  { date: '2026-02-16', shift: 'Shift A', yieldVal: 87.9, giveaway: 2.20, flourPct: 18.5, status: 'In Control' }
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
      <span class="text-gray-700 font-medium">Control</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Control Tracking</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Control Tracking"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Control Tracking
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Track long-term process stability and monitor sustaining project yield gains
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            In Control
          </span>
        </div>

        <!-- 3 Stat Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
            <span class="text-xs text-gray-500 font-medium">Avg Post-Improvement %Yield</span>
            <p class="text-2xl font-bold text-[#008779] font-mono">87.70%</p>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-trending-up" class="size-3" />
              <span>+3.95% vs Baseline (83.75%)</span>
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
            <span class="text-xs text-gray-500 font-medium">Avg %Giveaway</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">2.19%</p>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-check-circle" class="size-3" />
              <span>Within Target (&lt; 2.20%)</span>
            </span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
            <span class="text-xs text-gray-500 font-medium">Process Stability (Cpk)</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">1.45</p>
            <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-shield-check" class="size-3" />
              <span>Capable & Stable</span>
            </span>
          </div>
        </div>

        <!-- Tracking Table -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 class="text-base font-bold text-gray-900">
              Weekly Post-Implementation Tracking Log
            </h3>
            <button
              type="button"
              class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs"
            >
              <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
              <span>Export Log</span>
            </button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold">DATE</th>
                  <th class="py-3 px-4 font-semibold">SHIFT</th>
                  <th class="py-3 px-4 font-semibold text-center">% TOTAL YIELD</th>
                  <th class="py-3 px-4 font-semibold text-center">% GIVEAWAY</th>
                  <th class="py-3 px-4 font-semibold text-center">% FLOUR USAGE</th>
                  <th class="py-3 px-4 font-semibold text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(row, idx) in trackingData" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-medium text-gray-900">{{ row.date }}</td>
                  <td class="py-3.5 px-4 text-gray-600">{{ row.shift }}</td>
                  <td class="py-3.5 px-4 text-center font-bold text-emerald-700 font-mono">{{ row.yieldVal }}%</td>
                  <td class="py-3.5 px-4 text-center font-semibold text-gray-800 font-mono">{{ row.giveaway }}%</td>
                  <td class="py-3.5 px-4 text-center text-gray-700 font-mono">{{ row.flourPct }}%</td>
                  <td class="py-3.5 px-4 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
                      <span>{{ row.status }}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-6 right-24 flex items-center gap-3 z-30">
      <button class="bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-105 cursor-pointer">
        <UIcon name="i-lucide-edit" class="size-4" />
        <span>Edit</span>
      </button>
    </div>
  </div>
</template>
