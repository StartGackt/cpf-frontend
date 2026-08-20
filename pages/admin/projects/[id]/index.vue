<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const projectName = ref('Example เพิ่ม %Total Yield สินค้าไก่ทอด')
const owner = ref('Romteera Tadderm')
const location = ref('โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)')
const year = ref('2025')
const lastUpdated = ref('Feb 24, 2026')
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
      <span class="text-gray-900 font-bold truncate max-w-[280px]">
        {{ projectName }}
      </span>
    </div>

    <!-- Main Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="Insight Data"
      />

      <!-- Main Content Area: 2 Cards (Image 3) -->
      <div class="flex-1 space-y-6 min-w-0">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- LEFT CARD: Project Overview (8 Cols) -->
          <div class="lg:col-span-8 bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
            <div>
              <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                PROJECT OVERVIEW
              </span>
              <h1 class="text-xl font-bold text-gray-900">
                {{ projectName }}
              </h1>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Status: Active
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-[#008779] border border-teal-200">
                  Phase: Improve
                </span>
              </div>
            </div>

            <!-- 4 Stat Boxes in Grid (Image 3) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Owner -->
              <div class="bg-gray-50/60 border border-gray-100 rounded-lg p-3.5 flex items-start gap-3">
                <div class="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-lucide-user" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">OWNER</span>
                  <p class="text-xs font-bold text-gray-900 truncate">{{ owner }}</p>
                </div>
              </div>

              <!-- Location -->
              <div class="bg-gray-50/60 border border-gray-100 rounded-lg p-3.5 flex items-start gap-3">
                <div class="size-8 rounded-full bg-teal-50 text-[#008779] flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-lucide-map-pin" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">LOCATION</span>
                  <p class="text-xs font-bold text-gray-900 truncate">{{ location }}</p>
                </div>
              </div>

              <!-- Year -->
              <div class="bg-gray-50/60 border border-gray-100 rounded-lg p-3.5 flex items-start gap-3">
                <div class="size-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-lucide-calendar" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">YEAR</span>
                  <p class="text-xs font-bold text-gray-900">{{ year }}</p>
                </div>
              </div>

              <!-- Last Updated -->
              <div class="bg-gray-50/60 border border-gray-100 rounded-lg p-3.5 flex items-start gap-3">
                <div class="size-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UIcon name="i-lucide-clock" class="size-4" />
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">LAST UPDATED</span>
                  <p class="text-xs font-bold text-gray-900">{{ lastUpdated }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT CARD: Overall Progress (4 Cols - Image 3) -->
          <div class="lg:col-span-4 bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs text-gray-500 font-medium block">Overall progress</span>
                <p class="text-2xl font-bold text-[#008779]">100%</p>
              </div>
              <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-50 text-[#008779] border border-teal-200">
                Improve
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-[#008779] h-full w-full rounded-full"></div>
            </div>

            <!-- 4 Phase Step Counters -->
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-2.5">
                <span class="text-[11px] text-gray-500 font-medium block">Define</span>
                <span class="text-xs font-bold text-gray-900 font-mono">2/2</span>
              </div>
              <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-2.5">
                <span class="text-[11px] text-gray-500 font-medium block">Measure</span>
                <span class="text-xs font-bold text-gray-900 font-mono">5/5</span>
              </div>
              <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-2.5">
                <span class="text-[11px] text-gray-500 font-medium block">Analyze</span>
                <span class="text-xs font-bold text-gray-900 font-mono">4/4</span>
              </div>
              <div class="bg-gray-50/70 border border-gray-100 rounded-lg p-2.5">
                <span class="text-[11px] text-gray-500 font-medium block">Improve</span>
                <span class="text-xs font-bold text-gray-900 font-mono">2/2</span>
              </div>
            </div>

            <!-- Bottom All Steps Complete Button -->
            <NuxtLink
              :to="`/admin/projects/${projectId}/improve/summary`"
              class="w-full bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <UIcon name="i-lucide-play" class="size-3.5 fill-white" />
              <span>All steps complete</span>
            </NuxtLink>
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
