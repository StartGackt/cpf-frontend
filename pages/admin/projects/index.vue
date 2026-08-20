<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')

const projects = ref([
  {
    id: 'auto-heating-yield',
    name: 'Auto Heating Yield Monitoring Project',
    isOriginal: true,
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    manager: 'Nadtapong Aontawee',
    year: '2026',
    phase: 'Measure',
    phaseColor: 'blue',
    status: 'Active',
    lastUpdate: '2/24/2026'
  },
  {
    id: 'example-total-yield',
    name: 'Example เพิ่ม % Total Yield สินค้าไก่ทอด',
    isOriginal: true,
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    manager: 'Romteera Tadderm',
    year: '2025',
    phase: 'Improve',
    phaseColor: 'emerald',
    status: 'Active',
    lastUpdate: '2/24/2026'
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
          Manage and track your DMAIC projects
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Export</span>
        </button>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-refresh-cw" class="size-3.5 text-gray-500" />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-archive" class="size-3.5 text-gray-500" />
          <span>Deleted Projects</span>
        </button>

        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="isNewProjectModalOpen = true"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          <span>New Project</span>
        </button>
      </div>
    </div>

    <!-- 4 Stats Cards Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. Total Projects -->
      <div class="bg-white rounded-lg border border-gray-200/80 p-4 flex items-center gap-4 shadow-xs">
        <div class="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <UIcon name="i-lucide-folder" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-400 font-medium block">Total Projects</span>
          <span class="text-xl font-bold text-gray-900 mt-0.5 block">2</span>
        </div>
      </div>

      <!-- 2. Active Projects -->
      <div class="bg-white rounded-lg border border-gray-200/80 p-4 flex items-center gap-4 shadow-xs">
        <div class="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
          <UIcon name="i-lucide-play" class="size-5 fill-emerald-600" />
        </div>
        <div>
          <span class="text-xs text-gray-400 font-medium block">Active Projects</span>
          <span class="text-xl font-bold text-gray-900 mt-0.5 block">2</span>
        </div>
      </div>

      <!-- 3. Completed Projects -->
      <div class="bg-white rounded-lg border border-gray-200/80 p-4 flex items-center gap-4 shadow-xs">
        <div class="size-10 rounded-full bg-teal-50 flex items-center justify-center text-[#008779]">
          <UIcon name="i-lucide-check-circle-2" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-400 font-medium block">Completed Projects</span>
          <span class="text-xl font-bold text-gray-900 mt-0.5 block">1</span>
        </div>
      </div>

      <!-- 4. Projects by Phase -->
      <div class="bg-white rounded-lg border border-gray-200/80 p-4 flex items-center gap-4 shadow-xs">
        <div class="size-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
          <UIcon name="i-lucide-bar-chart-2" class="size-5" />
        </div>
        <div>
          <span class="text-xs text-gray-400 font-medium block">Projects by Phase</span>
          <span class="text-xs font-semibold text-gray-800 mt-0.5 block">
            Measure: 1, Improve: 1
          </span>
        </div>
      </div>
    </div>

    <!-- Filter & Table Card -->
    <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs overflow-hidden">
      <!-- Search & Sort Controls -->
      <div class="p-4 border-b border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-96">
          <UIcon name="i-lucide-search" class="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="w-full bg-white border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#008779]"
          />
        </div>

        <!-- Sort Selects -->
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 whitespace-nowrap">Sort by</span>
            <select
              v-model="sortBy"
              class="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
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
            class="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#008779]"
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
            <tr class="border-b border-gray-200 bg-gray-50/50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider">
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
              class="hover:bg-gray-50/70 transition-colors border-l-4 border-l-[#008779]"
            >
              <!-- Name with Original badge -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/projects/${project.id}`"
                    class="font-bold text-gray-900 hover:text-[#008779] transition-colors"
                  >
                    {{ project.name }}
                  </NuxtLink>
                  <span
                    v-if="project.isOriginal"
                    class="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded"
                  >
                    Original
                  </span>
                </div>
              </td>

              <!-- Location -->
              <td class="py-4 px-4 text-gray-600">
                {{ project.location }}
              </td>

              <!-- Manager -->
              <td class="py-4 px-4 text-gray-800 font-medium">
                {{ project.manager }}
              </td>

              <!-- Year -->
              <td class="py-4 px-4 text-gray-600">
                {{ project.year }}
              </td>

              <!-- Phase Badge -->
              <td class="py-4 px-4">
                <span
                  v-if="project.phaseColor === 'blue'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {{ project.phase }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
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

              <!-- Actions (Run, Edit, Delete) -->
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

                  <!-- Edit Action Button (Gray) -->
                  <button
                    type="button"
                    class="size-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded flex items-center justify-center transition-colors"
                    title="Edit Project Details"
                  >
                    <UIcon name="i-lucide-edit-3" class="size-3.5" />
                  </button>

                  <!-- Delete Action Button (Red) -->
                  <button
                    type="button"
                    class="size-7 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors"
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

      <!-- Pagination Footer -->
      <div class="p-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
        <div>
          Showing 1 to {{ filteredProjects.length }} of {{ filteredProjects.length }} results
        </div>

        <div class="flex items-center gap-1">
          <button class="size-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-40" disabled>
            <UIcon name="i-lucide-chevron-left" class="size-3.5" />
          </button>
          <button class="size-7 border border-[#008779] bg-[#008779] text-white font-bold rounded flex items-center justify-center">
            1
          </button>
          <button class="size-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-40" disabled>
            <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- CREATE PROJECT MODAL (Image 4) -->
    <div
      v-if="isNewProjectModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
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

        <!-- Form Body -->
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

          <!-- Project Type Toggle -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Project Type</label>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-600">Internal</span>
              <div class="w-10 h-5 bg-emerald-600 rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                <div class="size-4 bg-white rounded-full shadow-xs"></div>
              </div>
              <span class="text-xs text-gray-400">External</span>
            </div>
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

        <!-- Footer -->
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
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isNewProjectModalOpen = false"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
