<script setup lang="ts">
import { ref } from 'vue'

const courses = ref([
  {
    id: 'CRS-01',
    title: 'Define Phase: Target Formulation & BEG Chart',
    screenLocation: 'Define › BEG Chart & Insight Data',
    duration: '45 mins',
    modulesCount: 4,
    enrolledUsers: 64,
    status: 'Published',
    badge: 'Core Curriculum'
  },
  {
    id: 'CRS-02',
    title: 'Measure Phase: 28-Node Process Flowcharting & Ishikawa Fishbone',
    screenLocation: 'Measure › Process Map & Fishbone Diagram',
    duration: '60 mins',
    modulesCount: 6,
    enrolledUsers: 58,
    status: 'Published',
    badge: 'Core Curriculum'
  },
  {
    id: 'CRS-03',
    title: 'Measure Phase: FMEA Risk Priority Number (RPN) & Pareto 80/20',
    screenLocation: 'Measure › FMEA Workspace',
    duration: '50 mins',
    modulesCount: 5,
    enrolledUsers: 52,
    status: 'Published',
    badge: 'Core Curriculum'
  },
  {
    id: 'CRS-04',
    title: 'Analyze Phase: Anderson-Darling Normality & 2-Sample T Hypothesis',
    screenLocation: 'Analyze › Hypothesis Testing & Selected Tools',
    duration: '75 mins',
    modulesCount: 8,
    enrolledUsers: 40,
    status: 'Published',
    badge: 'Advanced Statistics'
  },
  {
    id: 'CRS-05',
    title: 'Improve Phase: Design of Experiments (DOE) & Cube Plot Optimization',
    screenLocation: 'Improve › DOE Analysis & Cube Plots',
    duration: '90 mins',
    modulesCount: 9,
    enrolledUsers: 36,
    status: 'Published',
    badge: 'Black Belt Certification'
  },
  {
    id: 'CRS-06',
    title: 'Control Phase: Process Capability (Cpk) & Control Tracking',
    screenLocation: 'Control › Control Plan & Tracking',
    duration: '40 mins',
    modulesCount: 4,
    enrolledUsers: 48,
    status: 'Published',
    badge: 'Sustainability'
  }
])

const isAddCourseModalOpen = ref(false)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          E-Learning Course Management
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Create and assign Six Sigma training curricula contextualized across all DMAIC Screen Locations
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="isAddCourseModalOpen = true"
        >
          <UIcon name="i-lucide-plus" class="size-3.5" />
          <span>Create New Course</span>
        </button>
      </div>
    </div>

    <!-- 3 Stat Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
        <span class="text-xs text-gray-500 font-medium">Active DMAIC Courses</span>
        <p class="text-2xl font-bold text-[#008779] font-mono">6</p>
        <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
          <UIcon name="i-lucide-check-circle-2" class="size-3" />
          <span>100% Screen Location Coverage</span>
        </span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
        <span class="text-xs text-gray-500 font-medium">Total Active Learners</span>
        <p class="text-2xl font-bold text-gray-900 font-mono">298</p>
        <span class="text-[11px] text-gray-500">
          Across all CPF Business Units
        </span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
        <span class="text-xs text-gray-500 font-medium">Certification Completion Rate</span>
        <p class="text-2xl font-bold text-gray-900 font-mono">92.4%</p>
        <span class="text-[11px] text-teal-600 font-semibold">
          Auto User Level Upgrade Qualified
        </span>
      </div>
    </div>

    <!-- Courses Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-sm font-bold text-gray-900">
          Curriculum Catalog & Screen Location Bindings
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">COURSE TITLE</th>
              <th class="py-3 px-4 font-semibold">BOUND SCREEN LOCATION</th>
              <th class="py-3 px-3 font-semibold text-center">DURATION</th>
              <th class="py-3 px-3 font-semibold text-center">MODULES</th>
              <th class="py-3 px-3 font-semibold text-center">ENROLLED</th>
              <th class="py-3 px-4 font-semibold text-center">STATUS</th>
              <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50/50">
              <td class="py-3.5 px-4 font-bold text-gray-900">
                {{ course.title }}
                <span class="block text-[10px] text-teal-700 font-normal mt-0.5">{{ course.badge }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded">
                  {{ course.screenLocation }}
                </span>
              </td>
              <td class="py-3.5 px-3 text-center text-gray-700 font-mono">{{ course.duration }}</td>
              <td class="py-3.5 px-3 text-center text-gray-800 font-mono font-bold">{{ course.modulesCount }}</td>
              <td class="py-3.5 px-3 text-center text-gray-900 font-mono">{{ course.enrolledUsers }}</td>
              <td class="py-3.5 px-4 text-center">
                <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {{ course.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <button type="button" class="text-gray-400 hover:text-gray-700 p-1">
                  <UIcon name="i-lucide-edit-2" class="size-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE COURSE MODAL -->
    <div
      v-if="isAddCourseModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">Create New Course</h3>
          <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="isAddCourseModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Course Title *</label>
            <input
              type="text"
              placeholder="e.g. Master Class: DOE Optimization in Frying Process"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Bound Screen Location *</label>
            <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]">
              <option value="define-beg">Define › BEG Chart</option>
              <option value="measure-process-map">Measure › Process Map</option>
              <option value="measure-fishbone">Measure › Fishbone Diagram</option>
              <option value="measure-fmea">Measure › FMEA</option>
              <option value="analyze-hypothesis">Analyze › Hypothesis Testing</option>
              <option value="improve-doe">Improve › DOE Analysis</option>
              <option value="control-plan">Control › Control Plan</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Estimated Duration</label>
            <input
              type="text"
              placeholder="e.g. 45 mins"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isAddCourseModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="isAddCourseModalOpen = false"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
