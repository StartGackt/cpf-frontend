<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const isFishboneComplete = computed(() => project.value.isFishboneCompleted !== false)

const fmeaStages = ref([
  {
    problemStatement: '% Total Yield สินค้าไก่ทอดต่ำ',
    causesCount: '41 causes',
    categoriesCount: '6 categories',
    processMapName: 'Process Map สินค้าไก่ทอด',
    processMapLink: `/admin/projects/${projectId}/measure/process-map`,
    status: 'Completed',
    progress: 100,
    createdDate: 'Dec 26, 2025'
  }
])
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-slate-500 pb-1">
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
      <span class="text-slate-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-slate-900 font-bold">FMEA Stage</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="FMEA"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-5 min-w-0 w-full">
        
        <!-- STAGE GATE WARNING IF FISHBONE INCOMPLETE (Requirement Image 2.6) -->
        <div
          v-if="!isFishboneComplete"
          class="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-2xs"
        >
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-lock" class="size-5 text-amber-600 shrink-0" />
            <div>
              <span class="font-bold block">🔒 ขั้นตอน FMEA ถูกล็อกการทำงาน (Strict Gating Active)</span>
              <p class="text-[11px] text-amber-800 mt-0.5">
                ต้องทำก้างปลา (Fishbone Diagram) ให้เสร็จสมบูรณ์ก่อน จึงจะสามารถทำขั้นตอนนี้ได้
              </p>
            </div>
          </div>
          <NuxtLink
            :to="`/admin/projects/${projectId}/measure/fishbone`"
            class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
          >
            ไปยังหน้า Fishbone Diagram
          </NuxtLink>
        </div>

        <!-- Collapsible Header Banner: FMEA Stage (Matching Image 2.6) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h1 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-chevron-right" class="size-4 text-slate-400" />
              <span>FMEA Stage</span>
            </h1>
            <p class="text-xs text-slate-500">
              Complete failure mode and effects analysis for all fishbone diagrams
            </p>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
            Completed
          </span>
        </div>

        <!-- Main Table Card (Matching Image 2.6) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-5">
          <div>
            <h2 class="text-sm font-bold text-slate-900">
              FMEA Analysis
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Perform risk assessment for each fishbone diagram to identify and prioritize failure modes
            </p>
          </div>

          <!-- Table matching Image 2.6 -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-4">PROBLEM STATEMENT</th>
                  <th class="py-3 px-4">CAUSES</th>
                  <th class="py-3 px-4">PROCESS MAP</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                  <th class="py-3 px-4 w-36">PROGRESS</th>
                  <th class="py-3 px-4">CREATED DATE</th>
                  <th class="py-3 px-4 text-center w-28">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-800">
                <tr v-for="(item, idx) in fmeaStages" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3.5 px-4 font-bold text-slate-900">
                    {{ item.problemStatement }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="text-slate-900 font-medium block">{{ item.causesCount }}</span>
                    <span class="text-slate-400 text-[11px]">{{ item.categoriesCount }}</span>
                  </td>
                  <td class="py-3.5 px-4">
                    <NuxtLink :to="item.processMapLink" class="text-[#008779] hover:underline font-medium">
                      {{ item.processMapName }}
                    </NuxtLink>
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
                      <span>{{ item.status }}</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="space-y-1">
                      <div class="flex justify-between text-[10px] font-semibold text-slate-600 font-mono">
                        <span>{{ item.progress }}%</span>
                      </div>
                      <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-[#008779] h-full w-full rounded-full"></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 text-slate-600">
                    {{ item.createdDate }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <!-- Button 1 (Circled in Image 2.6): Opens Cause Scoring & Pareto Analysis -->
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/measure/fmea`"
                      class="bg-white border border-slate-300 hover:bg-[#008779] hover:text-white hover:border-[#008779] text-slate-700 text-xs font-bold px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      title="เข้าสู่หน้าให้คะแนนแต่ละปัจจัยและวิเคราะห์ Pareto (1)"
                    >
                      <UIcon name="i-lucide-eye" class="size-3.5 text-slate-400 group-hover:text-white" />
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
  </div>
</template>
