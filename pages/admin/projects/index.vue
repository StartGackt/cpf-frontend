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

// New Project Form State (Design 1)
const newProjectForm = ref({
  name: '',
  type: 'Internal' as 'Internal' | 'External',
  business: 'Food Business',
  businessUnit: 'Chicken Processing Plant 1',
  workingCommittee: 'Lean Six Sigma Steering Committee',
  location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)'
})

const locationOptions = ref([
  'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
  'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
  'โรงงานแปรรูปสระบุรี',
  'โรงงานอาหารสำเร็จรูปหนองจอก',
  'โรงงานแปรรูปเนื้อไก่มีนบุรี'
])

const isAddingCustomLocation = ref(false)
const customLocationInput = ref('')

const saveCustomLocation = () => {
  if (customLocationInput.value.trim()) {
    const newLoc = customLocationInput.value.trim()
    if (!locationOptions.value.includes(newLoc)) {
      locationOptions.value.unshift(newLoc)
    }
    newProjectForm.value.location = newLoc
    customLocationInput.value = ''
    isAddingCustomLocation.value = false
  }
}

const handleCreateProject = () => {
  if (!newProjectForm.value.name.trim()) {
    alert('Please enter a project name.')
    return
  }

  projects.value.unshift({
    id: `proj-${Date.now()}`,
    name: newProjectForm.value.name.trim(),
    isOriginal: true,
    location: newProjectForm.value.location,
    manager: 'Romteera Tadderm',
    year: '2026',
    phase: 'Define',
    phaseColor: 'blue',
    status: 'Active',
    lastUpdate: 'Just now'
  })

  // Reset form
  newProjectForm.value.name = ''
  isNewProjectModalOpen.value = false
}

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
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- ========================================================= -->
    <!-- HERO HEADER: Project Management & DMAIC Portfolio -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <!-- Ambient Sparkle Glow in Background -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-folder-kanban" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Project Dashboard & Portfolio
            </h1>
            <span class="text-xs text-teal-200">Manage, Duplicate Runs, and Track DMAIC Phase Roadmaps</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          ระบบบริหารจัดการโครงการ Lean Six Sigma ติดตามความก้าวหน้าข้าม 5 เฟส DMAIC พร้อมระบบ Selective Run Duplication
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap relative z-10 shrink-0">
        <button
          type="button"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <UIcon name="i-lucide-download" class="size-4 text-emerald-300" />
          <span>Export</span>
        </button>

        <button
          type="button"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
          @click="isNewProjectModalOpen = true"
        >
          <UIcon name="i-lucide-plus" class="size-4 text-[#008779] group-hover:rotate-90 transition-transform" />
          <span>New Project</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 4 STATS CARDS -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Projects -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex items-center gap-3.5 hover:shadow-xs transition-shadow">
        <div class="size-11 rounded-2xl bg-teal-50 text-[#008779] border border-teal-200/60 flex items-center justify-center shadow-2xs">
          <UIcon name="i-lucide-folder" class="size-5" />
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-bold uppercase block">TOTAL PROJECTS</span>
          <span class="text-2xl font-bold text-slate-900 font-mono">{{ projects.length }}</span>
        </div>
      </div>

      <!-- Active Projects -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex items-center gap-3.5 hover:shadow-xs transition-shadow">
        <div class="size-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shadow-2xs">
          <UIcon name="i-lucide-activity" class="size-5" />
        </div>
        <div>
          <span class="text-[10px] text-blue-600 font-bold uppercase block">ACTIVE PIPELINE</span>
          <span class="text-2xl font-bold text-blue-700 font-mono">{{ projects.length }}</span>
        </div>
      </div>

      <!-- Completed Projects -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex items-center gap-3.5 hover:shadow-xs transition-shadow">
        <div class="size-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-2xs">
          <UIcon name="i-lucide-check-circle" class="size-5" />
        </div>
        <div>
          <span class="text-[10px] text-emerald-600 font-bold uppercase block">VERIFIED PFR</span>
          <span class="text-2xl font-bold text-emerald-700 font-mono">0</span>
        </div>
      </div>

      <!-- Projects by Phase -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex items-center gap-3.5 hover:shadow-xs transition-shadow">
        <div class="size-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shadow-2xs">
          <UIcon name="i-lucide-layers" class="size-5" />
        </div>
        <div>
          <span class="text-[10px] text-purple-600 font-bold uppercase block">PHASE DISTRIBUTION</span>
          <span class="text-xs font-bold text-slate-800 font-mono">
            Measure: 1 • Improve: 1
          </span>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- FILTER & DATA TABLE CARD -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <!-- Search and Sort Controls -->
      <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Search Input -->
        <div class="relative max-w-sm w-full">
          <UIcon name="i-lucide-search" class="size-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects by name, location, leader..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008779] focus:bg-white transition-all"
          />
        </div>

        <!-- Sort Selects -->
        <div class="flex items-center gap-2 flex-wrap">
          <div class="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Sort by</span>
            <select
              v-model="sortBy"
              class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
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
            class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
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
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4 font-semibold">PROJECT NAME</th>
              <th class="py-3.5 px-4 font-semibold">LOCATION</th>
              <th class="py-3.5 px-4 font-semibold">LEADER</th>
              <th class="py-3.5 px-4 font-semibold">YEAR</th>
              <th class="py-3.5 px-4 font-semibold">DMAIC PHASE</th>
              <th class="py-3.5 px-4 font-semibold">STATUS</th>
              <th class="py-3.5 px-4 font-semibold">LAST UPDATE</th>
              <th class="py-3.5 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="project in filteredProjects"
              :key="project.id"
              class="hover:bg-slate-50/70 transition-colors group"
            >
              <!-- Name -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}`"
                    class="font-bold text-slate-900 group-hover:text-[#008779] transition-colors"
                  >
                    {{ project.name }}
                  </NuxtLink>
                  <span
                    v-if="project.isOriginal"
                    class="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    Original
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    Project Run
                  </span>
                </div>
              </td>

              <!-- Location -->
              <td class="py-4 px-4 text-slate-600">
                {{ project.location }}
              </td>

              <!-- Manager -->
              <td class="py-4 px-4 font-medium text-slate-800">
                {{ project.manager }}
              </td>

              <!-- Year -->
              <td class="py-4 px-4 text-slate-600 font-mono">
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
                <span class="text-emerald-600 font-semibold flex items-center gap-1">
                  <span class="size-1.5 rounded-full bg-emerald-500"></span>
                  <span>{{ project.status }}</span>
                </span>
              </td>

              <!-- Last Update -->
              <td class="py-4 px-4 text-slate-500 font-mono text-[11px]">
                {{ project.lastUpdate }}
              </td>

              <!-- Actions (Run, Duplicate Run, Presentation, Delete) -->
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-1.5">
                  <!-- Run/Detail Action Button -->
                  <NuxtLink
                    :to="`/admin/projects/${project.id}`"
                    class="size-8 bg-[#008779] hover:bg-[#007366] text-white rounded-lg flex items-center justify-center shadow-2xs transition-colors"
                    title="Open DMAIC Workflow"
                  >
                    <UIcon name="i-lucide-play" class="size-3.5 fill-white" />
                  </NuxtLink>

                  <!-- Create Project Run / Duplicate -->
                  <button
                    type="button"
                    class="size-8 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                    title="Create Project Run (Duplicate with Module Scope)"
                    @click="openDuplicateModal(project)"
                  >
                    <UIcon name="i-lucide-copy" class="size-3.5" />
                  </button>

                  <!-- Presentation Mode -->
                  <NuxtLink
                    :to="`/admin/projects/${project.id}/presentation`"
                    class="size-8 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-lg flex items-center justify-center transition-colors"
                    title="Presentation Mode"
                  >
                    <UIcon name="i-lucide-presentation" class="size-3.5" />
                  </NuxtLink>

                  <!-- Delete Action Button -->
                  <button
                    type="button"
                    class="size-8 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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

    <!-- CREATE PROJECT RUN / SELECTIVE DUPLICATION MODAL -->
    <div
      v-if="isDuplicateRunModalOpen && selectedSourceProject"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-slate-900">
              Create Project Run (Selective Module Duplication)
            </h3>
            <p class="text-[11px] text-slate-500">Source: {{ selectedSourceProject.name }}</p>
          </div>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            @click="isDuplicateRunModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <!-- New Title -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">New Run Title *</label>
            <input
              v-model="duplicateProjectTitle"
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779] focus:bg-white"
            />
          </div>

          <!-- Target Plant Location -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Target Plant / Production Line *</label>
            <select
              v-model="duplicateLocation"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]"
            >
              <option value="loc-1">โรงงานแปรรูปโชคชัย (Line B)</option>
              <option value="loc-2">โรงงานแปรรูปอาหาร 2 (Line 1)</option>
              <option value="loc-3">โรงงานแปรรูปสระบุรี (Line A)</option>
            </select>
          </div>

          <!-- Module Scope Selection -->
          <div class="space-y-2 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-900 block">Select Scope of Modules to Copy:</label>
              <span class="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                Customizable Run
              </span>
            </div>

            <div class="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.define" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Define Phase: Copy Project Charter & Targets</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.processMap" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Measure Phase: Copy Process Flowchart Canvas</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.fishbone" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Measure Phase: Copy Ishikawa Fishbone Diagram</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.fmea" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Measure Phase: Copy FMEA Failure Modes</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.hypothesis" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Analyze Phase: Copy Hypothesis Test Framework</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.doe" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Improve Phase: Copy DOE Experimental Factors</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="copyScope.controlPlan" type="checkbox" class="accent-[#008779]" />
                <span class="font-medium text-slate-800">Control Phase: Copy Control Plan Matrix</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            @click="isDuplicateRunModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            @click="confirmDuplicateRun"
          >
            <UIcon name="i-lucide-rocket" class="size-3.5" />
            <span>Create Project Run</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE PROJECT MODAL (Matching Design 1) -->
    <div
      v-if="isNewProjectModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">
            Create Project
          </h3>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            @click="isNewProjectModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <!-- Project Name -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Project Name *</label>
            <input
              v-model="newProjectForm.name"
              type="text"
              placeholder="Enter project name"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#008779] focus:bg-white transition-colors"
            />
          </div>

          <!-- Project Type (Internal / External Toggle) -->
          <div class="space-y-1.5">
            <label class="font-semibold text-slate-700 block">Project Type</label>
            <div class="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span class="text-xs font-semibold" :class="newProjectForm.type === 'Internal' ? 'text-[#008779]' : 'text-slate-500'">
                Internal
              </span>
              <button
                type="button"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="newProjectForm.type === 'External' ? 'bg-[#008779]' : 'bg-slate-300'"
                @click="newProjectForm.type = newProjectForm.type === 'Internal' ? 'External' : 'Internal'"
              >
                <span
                  class="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                  :class="newProjectForm.type === 'External' ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
              <span class="text-xs font-semibold" :class="newProjectForm.type === 'External' ? 'text-[#008779]' : 'text-slate-500'">
                External
              </span>
            </div>
          </div>

          <!-- Business -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Business *</label>
            <select
              v-model="newProjectForm.business"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008779]"
            >
              <option value="Food Business">Food Business</option>
              <option value="Agro-Industrial Business">Agro-Industrial Business</option>
              <option value="Feed Business">Feed Business</option>
              <option value="Livestock & Farm">Livestock & Farm</option>
              <option value="International Operations">International Operations</option>
            </select>
          </div>

          <!-- Business Unit -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Business Unit *</label>
            <select
              v-model="newProjectForm.businessUnit"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008779]"
            >
              <option value="Chicken Processing Plant 1">Chicken Processing Plant 1</option>
              <option value="Chicken Processing Plant 2">Chicken Processing Plant 2</option>
              <option value="Swine Processing Plant">Swine Processing Plant</option>
              <option value="Ready-to-Eat Food Facility">Ready-to-Eat Food Facility</option>
              <option value="Aqua Feed Mill">Aqua Feed Mill</option>
            </select>
          </div>

          <!-- Working Committee -->
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Working Committee *</label>
            <select
              v-model="newProjectForm.workingCommittee"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008779]"
            >
              <option value="Lean Six Sigma Steering Committee">Lean Six Sigma Steering Committee</option>
              <option value="Operations Excellence & Quality Board">Operations Excellence & Quality Board</option>
              <option value="Productivity Improvement Taskforce">Productivity Improvement Taskforce</option>
              <option value="Cost Optimization Committee">Cost Optimization Committee</option>
            </select>
          </div>

          <!-- Location * -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-slate-700 block">Location *</label>
              <button
                type="button"
                class="text-[11px] font-bold text-[#008779] hover:underline flex items-center gap-1 cursor-pointer"
                @click="isAddingCustomLocation = !isAddingCustomLocation"
              >
                <UIcon name="i-lucide-plus" class="size-3" />
                <span>+ Add Location</span>
              </button>
            </div>

            <!-- Custom Location Inline Input -->
            <div v-if="isAddingCustomLocation" class="flex items-center gap-1.5 p-2 bg-teal-50/70 border border-teal-200 rounded-xl">
              <input
                v-model="customLocationInput"
                type="text"
                placeholder="Enter new plant location name"
                class="flex-1 bg-white border border-teal-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                @keyup.enter="saveCustomLocation"
              />
              <button
                type="button"
                class="bg-[#008779] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[#007366]"
                @click="saveCustomLocation"
              >
                Add
              </button>
            </div>

            <select
              v-model="newProjectForm.location"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008779]"
            >
              <option v-for="loc in locationOptions" :key="loc" :value="loc">
                {{ loc }}
              </option>
            </select>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            @click="isNewProjectModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            @click="handleCreateProject"
          >
            <UIcon name="i-lucide-check" class="size-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
