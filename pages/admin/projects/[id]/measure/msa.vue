<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const msaStudies = ref([
  {
    id: 'MSA-01',
    equipmentName: 'Multihead Weigher Scale A',
    characteristic: 'Finished Pack Weight (g)',
    operators: 3,
    parts: 10,
    trials: 3,
    studyVarPct: 8.4, // < 10% Acceptable
    ndc: 12, // >= 5 Acceptable
    status: 'Acceptable',
    recommendation: 'Gage is capable of detecting process shifts.'
  },
  {
    id: 'MSA-02',
    equipmentName: 'Predust Viscosity Tester',
    characteristic: 'Viscosity (cP)',
    operators: 3,
    parts: 10,
    trials: 2,
    studyVarPct: 34.2, // > 30% Unacceptable -> Alert & Send to Fishbone
    ndc: 2, // < 5 Unacceptable
    status: 'Unacceptable (> 30%)',
    recommendation: 'High operator measurement variation. Requires gauge calibration and operator retraining.'
  }
])

const isAddStudyModalOpen = ref(false)
const isExportedToFishbone = ref(false)

const exportNonCompliantToFishbone = () => {
  isExportedToFishbone.value = true
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
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Measurement System Analysis (MSA)</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="MSA"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- MSA Non-Compliant Alert Banner (Module 4 Requirement) -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <h3 class="font-bold text-red-900">
                MSA Study Failed: Predust Viscosity Tester (%StudyVar = 34.2% &gt; 30%, ndc = 2)
              </h3>
              <p class="text-red-700 mt-0.5">
                Measurement system cannot distinguish process variation. Automatically flagged for Root Cause Fishbone analysis.
              </p>
            </div>
          </div>

          <button
            type="button"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            :disabled="isExportedToFishbone"
            @click="exportNonCompliantToFishbone"
          >
            <UIcon name="i-lucide-git-branch" class="size-3.5" />
            <span>{{ isExportedToFishbone ? '✓ Added to Fishbone Inbox' : 'Auto-Feed to Fishbone' }}</span>
          </button>
        </div>

        <!-- Studies Table -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Gage R&R Studies & Process Map Recommendations
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Evaluates repeatability and reproducibility across operators and measuring gauges
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              @click="isAddStudyModalOpen = true"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>New Gage R&R Study</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-4">STUDY ID</th>
                  <th class="py-3 px-4">EQUIPMENT & GAUGE</th>
                  <th class="py-3 px-4">CHARACTERISTIC</th>
                  <th class="py-3 px-3 text-center">%STUDY VAR (%GRR)</th>
                  <th class="py-3 px-3 text-center">NDC</th>
                  <th class="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="study in msaStudies" :key="study.id" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-mono font-bold text-gray-900">{{ study.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">
                    {{ study.equipmentName }}
                    <span class="block text-[11px] text-gray-500 font-normal mt-0.5">{{ study.recommendation }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-gray-700">{{ study.characteristic }}</td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold" :class="study.studyVarPct > 30 ? 'text-red-600' : 'text-emerald-700'">
                    {{ study.studyVarPct }}%
                  </td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold" :class="study.ndc < 5 ? 'text-red-600' : 'text-emerald-700'">
                    {{ study.ndc }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="study.status.includes('Unacceptable') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                    >
                      {{ study.status }}
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
