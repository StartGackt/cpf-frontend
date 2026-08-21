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
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- ========================================================= -->
    <!-- HERO HEADER: E-Learning Course Management -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-graduation-cap" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              E-Learning & Curriculum Academy
            </h1>
            <span class="text-xs text-teal-200">Interactive Six Sigma DMAIC Training & Screen Location Bindings</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          หลักสูตรการเรียนรู้และคู่มือการใช้เครื่องมือสถิติที่เชื่อมโยงกับทุกหน้าจอในระบบ เพื่อพัฒนาทักษะระดับองค์กร
        </p>
      </div>

      <div class="flex items-center gap-2.5 relative z-10 shrink-0">
        <button
          type="button"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
          @click="isAddCourseModalOpen = true"
        >
          <UIcon name="i-lucide-plus" class="size-4 text-[#008779]" />
          <span>Create New Course</span>
        </button>
      </div>
    </div>

    <!-- 3 Stat Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">ACTIVE DMAIC COURSES</span>
        <p class="text-2xl font-bold text-[#008779] font-mono">6</p>
        <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
          <UIcon name="i-lucide-check-circle-2" class="size-3" />
          <span>100% Screen Location Coverage</span>
        </span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">ACTIVE LEARNERS</span>
        <p class="text-2xl font-bold text-slate-900 font-mono">298</p>
        <span class="text-[11px] text-slate-500">
          Across all CPF Business Units
        </span>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-1 hover:shadow-xs transition-shadow">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">COMPLETION RATE</span>
        <p class="text-2xl font-bold text-purple-700 font-mono">92.4%</p>
        <span class="text-[11px] text-[#008779] font-semibold">
          Auto User Level Upgrade Qualified
        </span>
      </div>
    </div>

    <!-- Courses Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UIcon name="i-lucide-book-open" class="size-4 text-[#008779]" />
            <span>Curriculum Catalog & Screen Location Bindings</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">DMAIC step-by-step contextual micro-lessons</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4 font-semibold">COURSE TITLE</th>
              <th class="py-3.5 px-4 font-semibold">BOUND SCREEN LOCATION</th>
              <th class="py-3.5 px-3 font-semibold text-center">DURATION</th>
              <th class="py-3.5 px-3 font-semibold text-center">MODULES</th>
              <th class="py-3.5 px-3 font-semibold text-center">ENROLLED</th>
              <th class="py-3.5 px-4 font-semibold text-center">STATUS</th>
              <th class="py-3.5 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="course in courses" :key="course.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-4 px-4 font-bold text-slate-900">
                {{ course.title }}
                <span class="block text-[10px] text-[#008779] font-medium mt-0.5">{{ course.badge }}</span>
              </td>
              <td class="py-4 px-4 font-mono text-slate-600">
                {{ course.screenLocation }}
              </td>
              <td class="py-4 px-3 text-center text-slate-700 font-mono">{{ course.duration }}</td>
              <td class="py-4 px-3 text-center text-slate-700 font-mono">{{ course.modulesCount }}</td>
              <td class="py-4 px-3 text-center text-[#008779] font-bold font-mono">{{ course.enrolledUsers }}</td>
              <td class="py-4 px-4 text-center">
                <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                  {{ course.status }}
                </span>
              </td>
              <td class="py-4 px-4 text-center">
                <button type="button" class="size-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors mx-auto cursor-pointer">
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">Create New E-Learning Course</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg" @click="isAddCourseModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-3.5 text-xs">
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Course Title *</label>
            <input
              type="text"
              placeholder="e.g. Statistical Hypothesis Testing Guide"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779] focus:bg-white"
            />
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1">Bound Screen Location *</label>
            <select class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]">
              <option value="define">Define › BEG Chart & Insight Data</option>
              <option value="measure">Measure › Process Map & Fishbone</option>
              <option value="analyze">Analyze › Hypothesis & Regression</option>
              <option value="improve">Improve › DOE Analysis</option>
              <option value="control">Control › Control Plan & Cpk</option>
            </select>
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1">Duration & Category *</label>
            <div class="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="e.g. 45 mins"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779] focus:bg-white"
              />
              <select class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]">
                <option>Core Curriculum</option>
                <option>Advanced Statistics</option>
                <option>Black Belt</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            @click="isAddCourseModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
            @click="isAddCourseModalOpen = false"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
