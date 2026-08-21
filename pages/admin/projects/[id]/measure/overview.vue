<script setup lang="ts">
import { ref } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project } = useProjectData(projectId)

const measureActivities = [
  {
    title: 'Capability Analysis',
    desc: 'Process capability assessment (Cp, Cpk, Pp, Ppk) with dynamic normal distribution bell curve and histogram.',
    status: 'Complete',
    icon: 'i-lucide-gauge',
    link: `/admin/projects/${projectId}/measure/capability`
  },
  {
    title: 'Measurement System Analysis (MSA)',
    desc: 'Gage R&R studies to assess repeatability and reproducibility variation across inspection equipment.',
    status: 'Complete',
    icon: 'i-lucide-ruler',
    link: `/admin/projects/${projectId}/measure/msa`
  },
  {
    title: 'Process Map',
    desc: 'Visual representation of the process flow to identify value-added and non-value-added steps.',
    status: 'Complete',
    icon: 'i-lucide-git-merge',
    link: `/admin/projects/${projectId}/measure/process-map`
  },
  {
    title: 'Fishbone Diagram',
    desc: 'Cause-and-effect analysis to systematically brainstorm potential causes across 6 categories.',
    status: 'Complete',
    icon: 'i-lucide-git-branch',
    link: `/admin/projects/${projectId}/measure/fishbone`
  },
  {
    title: 'FMEA',
    desc: 'Failure Mode and Effects Analysis to quantify risk and prioritize top 20% high-impact causes (RPN).',
    status: 'Complete',
    icon: 'i-lucide-table',
    link: `/admin/projects/${projectId}/measure/fmea`
  },
  {
    title: 'Introduction to Hypothesis Testing',
    desc: 'Formulate null and alternative hypotheses to statistically test critical root causes.',
    status: 'Complete',
    icon: 'i-lucide-file-question',
    link: `/admin/projects/${projectId}/measure/intro-hypothesis`
  }
]
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
      <span class="text-gray-900 font-bold">Overview</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Overview"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Measure Phase Progress
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Complete the overview and all 6 activities to understand and quantify baseline process performance
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed (6/6 Activities)
          </span>
        </div>

        <!-- Activities Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="act in measureActivities"
            :key="act.title"
            class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-3 hover:border-teal-300 transition-all flex flex-col justify-between"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="size-9 rounded-lg bg-teal-50 text-[#008779] flex items-center justify-center">
                    <UIcon :name="act.icon" class="size-5" />
                  </div>
                  <h3 class="text-sm font-bold text-gray-900">
                    {{ act.title }}
                  </h3>
                </div>
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <UIcon name="i-lucide-check-circle" class="size-3 text-emerald-500" />
                  <span>{{ act.status }}</span>
                </span>
              </div>

              <p class="text-xs text-gray-600 leading-relaxed">
                {{ act.desc }}
              </p>
            </div>

            <div class="pt-2 flex justify-end">
              <NuxtLink
                :to="act.link"
                class="inline-flex items-center gap-1 text-xs font-bold text-[#008779] hover:underline"
              >
                <span>Open {{ act.title }}</span>
                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
