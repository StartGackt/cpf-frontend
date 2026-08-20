<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const processMaps = ref([
  {
    name: 'Process Map สินค้าไก่ทอด',
    elements: '28 nodes',
    lastModifiedDate: 'Dec 26, 2025',
    lastModifiedUser: 'Romteera Tadderm'
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
      <span class="text-gray-900 font-bold">Process Map</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Process Map"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Collapsible Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Process Map Stage
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Create and manage visual representations of your process flow
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Process Maps
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Create visual representations of your process flow
              </p>
            </div>

            <NuxtLink
              :to="`/admin/projects/${projectId}/measure/process-map/canvas`"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <UIcon name="i-lucide-plus" class="size-4" />
              <span>Create Process Map</span>
            </NuxtLink>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold">PROCESS MAP</th>
                  <th class="py-3 px-4 font-semibold w-40">ELEMENTS</th>
                  <th class="py-3 px-6 font-semibold">LAST MODIFIED</th>
                  <th class="py-3 px-4 font-semibold text-center w-36">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in processMaps" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-medium text-gray-900">
                    {{ item.name }}
                  </td>
                  <td class="py-3.5 px-4 text-gray-600">
                    {{ item.elements }}
                  </td>
                  <td class="py-3.5 px-6">
                    <span class="text-gray-900 font-medium block">{{ item.lastModifiedDate }}</span>
                    <span class="text-gray-400 text-[11px]">{{ item.lastModifiedUser }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/measure/process-map/canvas`"
                        class="p-1 text-gray-400 hover:text-[#008779] transition-colors"
                        title="View Canvas"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </NuxtLink>
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/measure/process-map/canvas`"
                        class="p-1 text-gray-400 hover:text-[#008779] transition-colors"
                        title="Edit Canvas"
                      >
                        <UIcon name="i-lucide-edit-2" class="size-4" />
                      </NuxtLink>
                      <button type="button" class="p-1 text-gray-400 hover:text-[#008779] transition-colors" title="Export">
                        <UIcon name="i-lucide-download" class="size-4" />
                      </button>
                      <button type="button" class="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <UIcon name="i-lucide-trash-2" class="size-4 text-red-400 hover:text-red-600" />
                      </button>
                    </div>
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
