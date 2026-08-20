<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const fmeaStages = ref([
  {
    problemStatement: '% Total Yield สินค้าไก่ทอดต่ำ',
    causesCount: '41 causes',
    categoriesCount: '6 categories',
    processMapName: 'Process Map สินค้าไก่ทอด',
    processMapLink: `/admin/projects/${projectId}/measure/process-map/canvas`,
    status: 'Completed',
    progress: 100,
    createdDate: 'Dec 26, 2025'
  }
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
      <span class="text-gray-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">FMEA</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="FMEA"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Collapsible Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                FMEA Stage
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Complete failure mode and effects analysis for all fishbone diagrams
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Table Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div>
            <h2 class="text-base font-bold text-gray-900">
              FMEA Analysis
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Perform risk assessment for each fishbone diagram to identify and prioritize failure modes
            </p>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold">PROBLEM STATEMENT</th>
                  <th class="py-3 px-4 font-semibold">CAUSES</th>
                  <th class="py-3 px-4 font-semibold">PROCESS MAP</th>
                  <th class="py-3 px-3 font-semibold text-center">STATUS</th>
                  <th class="py-3 px-4 font-semibold w-36">PROGRESS</th>
                  <th class="py-3 px-4 font-semibold">CREATED DATE</th>
                  <th class="py-3 px-3 font-semibold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in fmeaStages" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-bold text-gray-900">
                    {{ item.problemStatement }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="text-gray-900 font-medium block">{{ item.causesCount }}</span>
                    <span class="text-gray-400 text-[11px]">{{ item.categoriesCount }}</span>
                  </td>
                  <td class="py-3.5 px-4">
                    <NuxtLink :to="item.processMapLink" class="text-blue-600 hover:text-blue-800 hover:underline">
                      {{ item.processMapName }}
                    </NuxtLink>
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
                      <span>{{ item.status }}</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="space-y-1">
                      <div class="flex justify-between text-[10px] font-semibold text-gray-600">
                        <span>{{ item.progress }}%</span>
                      </div>
                      <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-[#008779] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-gray-600">
                    {{ item.createdDate }}
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/measure/fmea`"
                      class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <UIcon name="i-lucide-eye" class="size-3.5 text-gray-500" />
                      <span>View</span>
                    </NuxtLink>
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
        <UIcon name="i-lucide-eye" class="size-4" />
        <span>View</span>
      </button>
    </div>
  </div>
</template>
