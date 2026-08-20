<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const doeGroups = ref([
  {
    id: 'doe-1',
    group: 'DOE.1',
    response: '%Giveaway',
    factors: [
      'จำนวนDropของเครื่องMultihead',
      'การsetค่าน้ำหนักเผื่อของเครื่องMultihead'
    ],
    bestSettings: [
      'จำนวนDropของเครื่องMultihead: 1 drop',
      'การsetค่าน้ำหนักเผื่อของเครื่องMultihead: 10 กรัม'
    ],
    version: 'Version 1',
    status: 'Analyzed'
  },
  {
    id: 'doe-2',
    group: 'DOE.2',
    response: '%การใช้แป้ง',
    factors: [
      'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
      'ความเร็วเครื่องเติมแป้งPredust',
      'ความเร็วรอบเครื่อง DB4'
    ],
    bestSettings: [
      'ระดับความสูงแผงเครื่องเติมแป้ง Predust: 1 cm',
      'ความเร็วเครื่องเติมแป้งPredust: 2 Hz',
      'ความเร็วรอบเครื่อง DB4: 40 Hz'
    ],
    version: 'Version 1',
    status: 'Analyzed'
  }
])
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Breadcrumb Bar -->
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
      <span class="text-gray-900 font-bold">DOE</span>
    </div>

    <!-- Main Workspace with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="DOE"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Collapsible Phase Info Header -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Design of Experiments (DOE)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Conduct full factorial experiments to determine optimal factor settings
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Card: DOE Groups -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                DOE Groups
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Manage experiments generated from hypothesis testing
              </p>
            </div>
            <span class="text-xs text-gray-500 font-medium">
              2 of 2 completed
            </span>
          </div>

          <!-- Product Tag Tab -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border-b-2 border-[#008779] text-[#008779] font-bold text-xs">
              <span>% Total Yield สินค้าไก่ทอด</span>
              <span class="size-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold">GROUP</th>
                  <th class="py-3 px-4 font-semibold">RESPONSE</th>
                  <th class="py-3 px-4 font-semibold">FACTORS</th>
                  <th class="py-3 px-4 font-semibold">BEST SETTINGS</th>
                  <th class="py-3 px-4 font-semibold">ACTIVE VERSION</th>
                  <th class="py-3 px-4 font-semibold">STATUS</th>
                  <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="doe in doeGroups"
                  :key="doe.id"
                  class="hover:bg-gray-50/60 transition-colors"
                >
                  <!-- Group -->
                  <td class="py-4 px-4 font-bold text-gray-900">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/improve/doe/${doe.id}`"
                      class="hover:text-[#008779] hover:underline"
                    >
                      {{ doe.group }}
                    </NuxtLink>
                  </td>

                  <!-- Response -->
                  <td class="py-4 px-4 text-gray-700 font-medium">
                    {{ doe.response }}
                  </td>

                  <!-- Factors -->
                  <td class="py-4 px-4 text-gray-700 text-xs leading-relaxed">
                    <div v-for="(factor, fIdx) in doe.factors" :key="fIdx">
                      {{ factor }}
                    </div>
                  </td>

                  <!-- Best Settings -->
                  <td class="py-4 px-4 text-gray-700 text-xs leading-relaxed">
                    <div v-for="(setting, sIdx) in doe.bestSettings" :key="sIdx">
                      {{ setting }}
                    </div>
                  </td>

                  <!-- Active Version -->
                  <td class="py-4 px-4">
                    <span class="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <UIcon name="i-lucide-check-circle-2" class="size-3.5 text-emerald-500" />
                      <span>{{ doe.version }}</span>
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="py-4 px-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {{ doe.status }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-4 text-center">
                    <div class="inline-flex items-center gap-2">
                      <!-- View/Analyze Results Action -->
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/improve/doe/${doe.id}/analysis`"
                        class="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                        title="View DOE Analysis & Cube Plot"
                      >
                        <UIcon name="i-lucide-eye" class="size-4" />
                      </NuxtLink>

                      <!-- Run Experiments Action -->
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/improve/doe/${doe.id}`"
                        class="size-6 bg-[#008779] hover:bg-[#007366] text-white rounded flex items-center justify-center shadow-xs transition-colors"
                        title="Open Experimental Runs Table"
                      >
                        <UIcon name="i-lucide-play" class="size-3 fill-white" />
                      </NuxtLink>
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
        <UIcon name="i-lucide-edit" class="size-4" />
        <span>Edit</span>
      </button>
    </div>
  </div>
</template>
