<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const msaStudies = computed(() => project.value.msaStudies)

const isAddStudyModalOpen = ref(false)
const isExportedToFishbone = ref(false)

const newStudy = ref({
  id: '',
  equipmentName: '',
  characteristic: '',
  operators: 3,
  parts: 10,
  trials: 3,
  studyVarPct: 9.5,
  ndc: 10,
  recommendation: ''
})

const openAddModal = () => {
  newStudy.value = {
    id: `MSA-0${project.value.msaStudies.length + 1}`,
    equipmentName: '',
    characteristic: '',
    operators: 3,
    parts: 10,
    trials: 3,
    studyVarPct: 9.5,
    ndc: 10,
    recommendation: ''
  }
  isAddStudyModalOpen.value = true
}

const saveStudy = () => {
  if (!newStudy.value.equipmentName) {
    alert('Please enter equipment name')
    return
  }
  const isUnacceptable = newStudy.value.studyVarPct > 30 || newStudy.value.ndc < 5
  project.value.msaStudies.push({
    id: newStudy.value.id || `MSA-0${project.value.msaStudies.length + 1}`,
    equipmentName: newStudy.value.equipmentName,
    characteristic: newStudy.value.characteristic || 'Weight Variation',
    operators: newStudy.value.operators,
    parts: newStudy.value.parts,
    trials: newStudy.value.trials,
    studyVarPct: newStudy.value.studyVarPct,
    ndc: newStudy.value.ndc,
    status: isUnacceptable ? 'Unacceptable (> 30%)' : 'Acceptable',
    recommendation: newStudy.value.recommendation || (isUnacceptable ? 'Requires calibration' : 'Gage capable')
  })
  isAddStudyModalOpen.value = false
}

const removeStudy = (idx: number) => {
  project.value.msaStudies.splice(idx, 1)
}

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
      <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[200px]">
        {{ project.name }}
      </NuxtLink>
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
        <!-- MSA Non-Compliant Alert Banner -->
        <div v-if="msaStudies.some(s => s.studyVarPct > 30)" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <h3 class="font-bold text-red-900">
                MSA Study Notice: Some Gauges Failed Precision Standards (%StudyVar &gt; 30% or ndc &lt; 5)
              </h3>
              <p class="text-red-700 mt-0.5">
                Measurement system variation exceeds allowable limits. Flagged for Root Cause Fishbone analysis.
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
              @click="openAddModal"
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
                  <th class="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(study, idx) in msaStudies" :key="study.id" class="hover:bg-gray-50/50">
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
                  <td class="py-3.5 px-3 text-center">
                    <button type="button" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer" @click="removeStudy(idx)">
                      <UIcon name="i-lucide-trash-2" class="size-3.5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Study Modal -->
    <div v-if="isAddStudyModalOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden text-xs">
        <div class="p-4 bg-[#008779] text-white flex items-center justify-between">
          <h3 class="font-bold text-sm">Add Gage R&R Study</h3>
          <button type="button" class="text-white/80 hover:text-white cursor-pointer" @click="isAddStudyModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
        <div class="p-4 space-y-3">
          <div>
            <label class="font-bold text-gray-700 block mb-1">Equipment Name *</label>
            <input v-model="newStudy.equipmentName" type="text" placeholder="e.g. Checkweigher B" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div>
            <label class="font-bold text-gray-700 block mb-1">Characteristic</label>
            <input v-model="newStudy.characteristic" type="text" placeholder="e.g. Net Weight (g)" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-gray-700 block mb-1">%StudyVar (%GRR)</label>
              <input v-model.number="newStudy.studyVarPct" type="number" step="0.1" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[#008779] focus:outline-hidden" />
            </div>
            <div>
              <label class="font-bold text-gray-700 block mb-1">NDC (Distinct Categories)</label>
              <input v-model.number="newStudy.ndc" type="number" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-mono focus:border-[#008779] focus:outline-hidden" />
            </div>
          </div>
          <div>
            <label class="font-bold text-gray-700 block mb-1">Recommendation / Note</label>
            <input v-model="newStudy.recommendation" type="text" placeholder="e.g. Acceptable for production" class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#008779] focus:outline-hidden" />
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button type="button" class="px-3 py-1.5 rounded text-gray-600 hover:bg-gray-100 cursor-pointer" @click="isAddStudyModalOpen = false">Cancel</button>
            <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white font-bold px-4 py-1.5 rounded shadow-xs cursor-pointer" @click="saveStudy">Save Study</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
