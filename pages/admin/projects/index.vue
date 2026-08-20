<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const sortBy = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')

const projects = ref([
  {
    id: 'example-total-yield',
    name: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    isOriginal: true,
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    manager: 'Romteera Tadderm',
    year: '2025',
    phase: 'Improve',
    phaseColor: 'emerald',
    status: 'Active',
    lastUpdate: '24/02/2026'
  },
  {
    id: 'p2',
    name: 'Auto Heating Yield Monitoring Project',
    isOriginal: true,
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    manager: 'Nadtapong Aontawee',
    year: '2025',
    phase: 'Measure',
    phaseColor: 'blue',
    status: 'Active',
    lastUpdate: '24/02/2026'
  }
])

const filteredProjects = computed(() => {
  let list = [...projects.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.manager.toLowerCase().includes(q)
    )
  }
  return list
})

const isNewProjectModalOpen = ref(false)
const isDuplicateRunModalOpen = ref(false)
const selectedSourceProject = ref<any>(null)
const duplicateProjectTitle = ref('')
const duplicateLocation = ref('loc-1')

// Module Scope Checkboxes (Phase 2 feature)
const copyScope = ref({
  define: true,
  processMap: true,
  fishbone: true,
  fmea: true,
  hypothesis: true,
  doe: false,
  controlPlan: false
})

const openDuplicateModal = (project: any) => {
  selectedSourceProject.value = project
  duplicateProjectTitle.value = `${project.name} (Run 2 - Line B)`
  isDuplicateRunModalOpen.value = true
}

const confirmDuplicateRun = () => {
  if (selectedSourceProject.value) {
    projects.value.unshift({
      id: `proj-run-${Date.now()}`,
      name: duplicateProjectTitle.value,
      isOriginal: false,
      location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
      manager: 'Romteera Tadderm',
      year: '2026',
      phase: 'Define',
      phaseColor: 'blue',
      status: 'Active',
      lastUpdate: 'Just now'
    })
  }
  isDuplicateRunModalOpen.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header & Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Project Dashboard
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Manage, duplicate, and track your Six Sigma DMAIC projects
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Export Button -->
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Export</span>
        </button>

        <!-- Refresh Button -->
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-rotate-cw" class="size-3.5 text-gray-500" />
          <span>Refresh</span>
        </button>

        <!-- Deleted Projects Button -->
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-trash" class="size-3.5 text-gray-500" />
          <span>Deleted Projects (0)</span>
        </button>

        <!-- Create Project Button (Teal) -->
        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="isNewProjectModalOpen = true"
        >
          <UIcon name="i-lucide-plus" class="size-3.5" />
          <span>New Project</span>
        </button>
      </div>
    </div>

    <!-- 4 Stats Cards Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Projects -->
      <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center gap-3">
        <div class="size-10 rounded-lg bg-teal-50 text-[#008779] flex items-center justify-center">
          <UIcon name="i-lucide-folder" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium block">Total Projects</span>
          <span class="text-xl font-bold text-gray-900 font-mono">{{ projects.length }}</span>
        </div>
      </div>

      <!-- Active Projects -->
      <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center gap-3">
        <div class="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <UIcon name="i-lucide-activity" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium block">Active Projects</span>
          <span class="text-xl font-bold text-blue-600 font-mono">{{ projects.length }}</span>
        </div>
      </div>

      <!-- Completed Projects -->
      <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center gap-3">
        <div class="size-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <UIcon name="i-lucide-check-circle" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium block">Completed Projects</span>
          <span class="text-xl font-bold text-emerald-600 font-mono">0</span>
        </div>
      </div>

      <!-- Projects by Phase -->
      <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center gap-3">
        <div class="size-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <UIcon name="i-lucide-layers" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-500 font-medium block">Projects by Phase</span>
          <span class="text-xs font-bold text-gray-800 font-mono">
            Measure: 1, Improve: 1
          </span>
        </div>
      </div>
    </div>

    <!-- Filter & Table Card -->
    <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs overflow-hidden">
      <!-- Search and Sort Controls -->
      <div class="p-4 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Search Input -->
        <div class="relative max-w-sm w-full">
          <UIcon name="i-lucide-search" class="size-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects by name, location, owner..."
            class="w-full bg-white border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#008779]"
          />
        </div>

        <!-- Sort Selects -->
        <div class="flex items-center gap-2 flex-wrap">
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Sort by</span>
            <select
              v-model="sortBy"
              class="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
            >
              <option value="name">Name</option>
              <option value="location">Location</option>
              <option value="manager">Manager</option>
              <option value="year">Year</option>
              <option value="lastUpdate">Last Update</option>
            </select>
          </div>

          <select
            v-model="sortOrder"
            class="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <!-- Projects Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">NAME</th>
              <th class="py-3 px-4 font-semibold">LOCATION</th>
              <th class="py-3 px-4 font-semibold">MANAGER</th>
              <th class="py-3 px-4 font-semibold">YEAR</th>
              <th class="py-3 px-4 font-semibold">PHASE</th>
              <th class="py-3 px-4 font-semibold">STATUS</th>
              <th class="py-3 px-4 font-semibold">LAST UPDATE</th>
              <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="project in filteredProjects"
              :key="project.id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <!-- Name -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}`"
                    class="font-bold text-gray-900 hover:text-[#008779]"
                  >
                    {{ project.name }}
                  </NuxtLink>
                  <span
                    v-if="project.isOriginal"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    Original
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    Project Run
                  </span>
                </div>
              </td>

              <!-- Location -->
              <td class="py-4 px-4 text-gray-600">
                {{ project.location }}
              </td>

              <!-- Manager -->
              <td class="py-4 px-4 font-medium text-gray-800">
                {{ project.manager }}
              </td>

              <!-- Year -->
              <td class="py-4 px-4 text-gray-600 font-mono">
                {{ project.year }}
              </td>

              <!-- Phase -->
              <td class="py-4 px-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  :class="project.phase === 'Measure' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                >
                  {{ project.phase }}
                </span>
              </td>

              <!-- Status -->
              <td class="py-4 px-4">
                <span class="text-emerald-600 font-semibold">
                  {{ project.status }}
                </span>
              </td>

              <!-- Last Update -->
              <td class="py-4 px-4 text-gray-600">
                {{ project.lastUpdate }}
              </td>

              <!-- Actions (Run, Duplicate Run, Presentation, Edit, Delete) -->
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-1.5">
                  <!-- Run/Detail Action Button (Teal) -->
                  <NuxtLink
                    :to="`/admin/projects/${project.id}`"
                    class="size-7 bg-[#008779] hover:bg-[#007366] text-white rounded flex items-center justify-center shadow-xs transition-colors"
                    title="Open DMAIC Workflow"
                  >
                    <UIcon name="i-lucide-play" class="size-3.5 fill-white" />
                  </NuxtLink>

                  <!-- Create Project Run / Duplicate (Blue) -->
                  <button
                    type="button"
                    class="size-7 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded flex items-center justify-center transition-colors cursor-pointer"
                    title="Create Project Run (Duplicate with Module Scope)"
                    @click="openDuplicateModal(project)"
                  >
                    <UIcon name="i-lucide-copy" class="size-3.5" />
                  </button>

                  <!-- Presentation Mode (Purple) -->
                  <NuxtLink
                    :to="`/admin/projects/${project.id}/presentation`"
                    class="size-7 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded flex items-center justify-center transition-colors"
                    title="Presentation Mode"
                  >
                    <UIcon name="i-lucide-presentation" class="size-3.5" />
                  </NuxtLink>

                  <!-- Delete Action Button (Red) -->
                  <button
                    type="button"
                    class="size-7 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded flex items-center justify-center transition-colors"
                    title="Delete Project"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE PROJECT RUN / SELECTIVE DUPLICATION MODAL (Module 2 Feature) -->
    <div
      v-if="isDuplicateRunModalOpen && selectedSourceProject"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900">
              Create Project Run (Selective Module Duplication)
            </h3>
            <p class="text-[11px] text-gray-500">Source: {{ selectedSourceProject.name }}</p>
          </div>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1"
            @click="isDuplicateRunModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <!-- New Title -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">New Run Title *</label>
            <input
              v-model="duplicateProjectTitle"
              type="text"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>

          <!-- Target Plant Location -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Target Plant / Production Line *</label>
            <select
              v-model="duplicateLocation"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
            >
              <option value="loc-1">โรงงานแปรรูปโชคชัย (Line B)</option>
              <option value="loc-2">โรงงานแปรรูปอาหาร 2 (Line 1)</option>
              <option value="loc-3">โรงงานแปรรูปสระบุรี (Line A)</option>
            </select>
          </div>

          <!-- Module Scope Selection (Phase 1 & Phase 2) -->
          <div class="space-y-2 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <label class="font-bold text-gray-900 block">Select Scope of Modules to Copy:</label>
              <span class="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                Customizable Run
              </span>
            </div>

            <div class="space-y-2 bg-gray-50/70 border border-gray-200 rounded-lg p-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.define" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Define Phase: Copy Project Charter & BEG Formulation Targets</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.processMap" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Measure Phase: Copy 28-Node Process Flowchart Canvas</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.fishbone" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Measure Phase: Copy 41 Causes Ishikawa Diagram</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.fmea" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Measure Phase: Copy FMEA Failure Modes & Scoring Rubrics</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.hypothesis" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Analyze Phase: Copy 7-Factor Hypothesis Test Framework</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.doe" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Improve Phase: Copy DOE Experimental Factors (Uncheck for fresh trials)</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.controlPlan" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-gray-800">Control Phase: Copy Standardized Control Plan Matrix</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isDuplicateRunModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            @click="confirmDuplicateRun"
          >
            <UIcon name="i-lucide-rocket" class="size-3.5" />
            <span>Create Project Run</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE PROJECT MODAL -->
    <div
      v-if="isNewProjectModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">
            Create Project
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1"
            @click="isNewProjectModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <!-- Project Name -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Project Name *</label>
            <input
              type="text"
              placeholder="Enter project name"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>

          <!-- Project Belt / Type Selection -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Project Belt / Type *</label>
            <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]">
              <option value="bb">Black Belt (BB)</option>
              <option value="gb" selected>Green Belt (GB)</option>
              <option value="yb">Yellow Belt (YB)</option>
              <option value="sme">SME / Automation Innovation</option>
              <option value="kaizen">Kaizen / Quick Win</option>
            </select>
          </div>

          <!-- Business -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Business *</label>
            <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]">
              <option value="food">Food Business</option>
              <option value="feed">Feed Business</option>
              <option value="farm">Farm Business</option>
            </select>
          </div>

          <!-- Business Unit -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Business Unit *</label>
            <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]">
              <option value="chicken">Chicken Processing</option>
              <option value="swine">Swine Processing</option>
              <option value="rte">Ready-to-Eat Food Division</option>
            </select>
          </div>

          <!-- Plant / Location -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Plant / Location *</label>
            <select class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#008779]">
              <option value="loc-1">โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)</option>
              <option value="loc-2">โรงงานแปรรูปอาหาร 2 (นครราชสีมา)</option>
              <option value="loc-3">โรงงานแปรรูปสระบุรี</option>
              <option value="loc-4">โรงงานแปรรูปมีนบุรี</option>
            </select>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isNewProjectModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="isNewProjectModalOpen = false"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
