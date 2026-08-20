<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const doeId = (route.params.doeId as string) || 'doe-1'

const doeTitle = ref(doeId.toUpperCase().replace('-', '.'))
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe`"
          class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#008779] font-medium transition-colors mb-2"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to DOE List</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
            DOE Analysis Results
          </h1>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-gray-600 font-semibold">{{ doeTitle }} - %Giveaway</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Minimizing
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Residual Diagnostic Plots Link Button -->
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe/${doeId}/residual-plots`"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-activity" class="size-3.5 text-[#008779]" />
          <span>Residual Diagnostic Plots</span>
        </NuxtLink>

        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe/${doeId}`"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-edit-3" class="size-3.5 text-gray-500" />
          <span>Edit Data</span>
        </NuxtLink>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Export</span>
        </button>

        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/summary`"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-check" class="size-4" />
          <span>Done</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="DOE"
      />

      <!-- Content -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- 1. Summary Card -->
        <div class="bg-teal-50/30 border border-teal-100 rounded-lg p-6 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-bold text-gray-900">
              สรุปผล
            </h2>
            <span class="text-xs text-gray-500">
              Optimized for minimum %Giveaway
            </span>
          </div>

          <div class="text-xs text-gray-700 space-y-2 leading-relaxed font-sans bg-white p-4 rounded-md border border-gray-200/80">
            <p>
              ปัจจัยที่มีผลต่อ <strong class="text-gray-900">%Giveaway</strong> คือ <span class="text-[#008779] font-medium">จำนวนDropของเครื่องMultihead</span> และ <span class="text-[#008779] font-medium">การsetค่าน้ำหนักเผื่อของเครื่องMultihead</span>
            </p>
            <p>
              จำนวนDropของเครื่องMultihead แนะนำให้ใช้ <strong class="text-emerald-700">1 drop</strong>
            </p>
            <p>
              การsetค่าน้ำหนักเผื่อของเครื่องMultihead แนะนำให้ใช้ <strong class="text-emerald-700">10 กรัม</strong>
            </p>
            <p class="pt-1 text-sm font-bold text-[#008779]">
              จะได้ %Giveaway อยู่ที่ 2.20 %
            </p>
          </div>
        </div>

        <!-- 2. Cube Plot Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div>
            <h2 class="text-base font-bold text-gray-900">
              Cube plot (fitted means) for %Giveaway
            </h2>
          </div>

          <!-- Cube Plot Graphical Display -->
          <div class="flex flex-col items-center justify-center p-8 bg-gray-50/40 rounded-xl border border-gray-100 relative">
            <div class="relative w-full max-w-lg h-72 flex items-center justify-center">
              <!-- Y-Axis Label (Vertical) -->
              <div class="absolute -left-16 text-center -rotate-90 text-xs font-medium text-gray-600">
                การsetค่าน้ำหนักเผื่อของเครื่องMultihead (กรัม)
              </div>

              <!-- Plot Box Canvas -->
              <div class="relative w-80 h-56 border-2 border-gray-400 bg-white rounded shadow-xs">
                <!-- Top-Left Corner (Low X: 1, High Y: 20) -->
                <div class="absolute -top-3.5 -left-3.5 flex flex-col items-center">
                  <div class="size-2.5 rounded-full bg-emerald-600 ring-2 ring-white"></div>
                  <span class="bg-amber-300 text-gray-900 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1">
                    3.51000
                  </span>
                </div>

                <!-- Top-Right Corner (High X: 2, High Y: 20) -->
                <div class="absolute -top-3.5 -right-3.5 flex flex-col items-center">
                  <div class="size-2.5 rounded-full bg-emerald-600 ring-2 ring-white"></div>
                  <span class="bg-amber-300 text-gray-900 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1">
                    3.75630
                  </span>
                </div>

                <!-- Bottom-Left Corner (OPTIMAL: Low X: 1, Low Y: 10) -->
                <div class="absolute -bottom-3.5 -left-3.5 flex flex-col items-center z-10">
                  <div class="size-4 rounded-full border-2 border-red-600 bg-white flex items-center justify-center">
                    <div class="size-2 rounded-full bg-red-600"></div>
                  </div>
                  <span class="bg-amber-400 border border-red-500 text-gray-900 text-[11px] font-black px-2 py-0.5 rounded shadow-xs mt-1 ring-2 ring-red-400/40">
                    2.20000
                  </span>
                </div>

                <!-- Bottom-Right Corner (High X: 2, Low Y: 10) -->
                <div class="absolute -bottom-3.5 -right-3.5 flex flex-col items-center">
                  <div class="size-2.5 rounded-full bg-gray-400 ring-2 ring-white"></div>
                  <span class="bg-amber-300 text-gray-900 text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs mt-1">
                    3.10690
                  </span>
                </div>

                <!-- Y-Axis Values on Left -->
                <span class="absolute top-0 -left-12 text-[11px] text-gray-500">High: 20</span>
                <span class="absolute bottom-0 -left-12 text-[11px] text-gray-500">Low: 10</span>

                <!-- X-Axis Values on Bottom -->
                <span class="absolute -bottom-10 left-0 text-[11px] text-gray-500">Low: 1</span>
                <span class="absolute -bottom-10 right-0 text-[11px] text-gray-500">High: 2</span>
              </div>
            </div>

            <!-- X-Axis Bottom Label -->
            <div class="text-xs font-medium text-gray-600 mt-6">
              จำนวนDropของเครื่องMultihead (drop)
            </div>

            <!-- Color Scale Legend -->
            <div class="mt-6 flex flex-col items-center gap-1.5">
              <span class="text-[11px] text-gray-500 font-medium">Response Value</span>
              <div class="w-48 h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 shadow-inner"></div>
              <div class="w-48 flex justify-between text-[10px] text-gray-400 font-mono">
                <span>2.2</span>
                <span>3.0</span>
                <span>3.8</span>
              </div>
            </div>
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
