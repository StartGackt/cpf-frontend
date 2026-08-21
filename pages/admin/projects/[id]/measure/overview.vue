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
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
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
      <span class="text-slate-900 font-bold">Overview</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Overview"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-6 min-w-0 w-full">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div class="space-y-1 relative z-10">
            <h2 class="text-xl font-bold tracking-tight">
              Measure Phase Suite & Tool Registry
            </h2>
            <p class="text-xs text-teal-200">
              Quantify baseline process variability, validate measurement systems, and prioritize root causes
            </p>
          </div>
          <span class="bg-white/10 backdrop-blur-md border border-white/20 text-teal-100 text-xs font-bold px-3 py-1.5 rounded-full relative z-10 shadow-2xs">
            Completed (6/6 Activities)
          </span>
        </div>

        <!-- Activities Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="act in measureActivities"
            :key="act.title"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-3 hover:border-[#008779]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-2xl bg-teal-50 text-[#008779] border border-teal-200/60 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <UIcon :name="act.icon" class="size-5" />
                  </div>
                  <h3 class="text-sm font-bold text-slate-900 group-hover:text-[#008779] transition-colors">
                    {{ act.title }}
                  </h3>
                </div>
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <UIcon name="i-lucide-check-circle-2" class="size-3 text-emerald-500" />
                  <span>{{ act.status }}</span>
                </span>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed">
                {{ act.desc }}
              </p>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <NuxtLink
                :to="act.link"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-[#008779] hover:underline"
              >
                <span>Launch Workspace</span>
                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
