<script setup lang="ts">
import { ref } from 'vue'

const externalApprovals = ref([
  {
    id: 1,
    name: 'jodjung@gmail.com',
    email: 'jodjung@gmail.com',
    requested: 'Requested 1d ago',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'p.wiwat@outlook.com',
    email: 'p.wiwat@outlook.com',
    requested: 'Requested 1d ago',
    status: 'Pending'
  },
  {
    id: 3,
    name: 'SURATCHADAPORN JAROENRIT',
    email: 'suratchadaporn.jan@cpf.co.th',
    requested: 'Requested 12/9/2025',
    status: 'Pending'
  }
])

const projectsInProgress = ref([
  {
    id: 1,
    name: 'Auto Heating Yield Monitoring Project',
    owner: 'Nadtapong Aontawee',
    status: 'Active',
    phase: 'Measure',
    phaseColor: 'blue',
    lastUpdated: '18h ago'
  },
  {
    id: 2,
    name: 'Example เพิ่ม % Total Yield สินค้าไก่ทอด',
    owner: 'Romteera Tadderm',
    status: 'Active',
    phase: 'Improve',
    phaseColor: 'emerald',
    lastUpdated: '1d ago'
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header Title -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        Dashboard
      </h1>
    </div>

    <!-- Main 2-Column Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column (8 cols) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- 1. Quick Actions Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5">
          <h2 class="text-base font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- View Projects Button -->
            <NuxtLink
              to="/admin/projects"
              class="bg-[#008779] hover:bg-[#007366] text-white font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm shadow-xs transition-colors"
            >
              <UIcon name="i-lucide-folder" class="size-4.5" />
              <span>View Projects</span>
            </NuxtLink>

            <!-- Admin Panel Button -->
            <NuxtLink
              to="/admin"
              class="bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-800 font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm shadow-xs transition-colors"
            >
              <UIcon name="i-lucide-settings" class="size-4.5 text-gray-600" />
              <span>Admin Panel</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Projects In Progress Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5">
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-gray-900">
              Projects In Progress
            </h2>
            <NuxtLink
              to="/admin/projects"
              class="text-xs font-semibold text-[#008779] hover:underline flex items-center gap-1"
            >
              <span>View all projects</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </div>

          <!-- Projects Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-gray-200 text-gray-400 uppercase text-[11px] font-semibold">
                  <th class="pb-3 font-semibold">Project name</th>
                  <th class="pb-3 font-semibold">Status</th>
                  <th class="pb-3 font-semibold">Phase</th>
                  <th class="pb-3 font-semibold">Last updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="project in projectsInProgress" :key="project.id" class="hover:bg-gray-50/70 transition-colors">
                  <!-- Project Name & Owner -->
                  <td class="py-3.5 pr-4">
                    <NuxtLink :to="`/admin/projects/${project.id}`" class="font-bold text-[#008779] hover:underline text-sm block">
                      {{ project.name }}
                    </NuxtLink>
                    <span class="text-xs text-gray-500 mt-0.5 block">
                      Owner: {{ project.owner }}
                    </span>
                  </td>

                  <!-- Status Badge -->
                  <td class="py-3.5 pr-4 align-middle">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span class="size-1.5 rounded-full bg-emerald-500"></span>
                      {{ project.status }}
                    </span>
                  </td>

                  <!-- Phase Badge -->
                  <td class="py-3.5 pr-4 align-middle">
                    <span
                      v-if="project.phaseColor === 'blue'"
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <span class="size-1.5 rounded-full bg-blue-500"></span>
                      {{ project.phase }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <span class="size-1.5 rounded-full bg-emerald-500"></span>
                      {{ project.phase }}
                    </span>
                  </td>

                  <!-- Last Updated -->
                  <td class="py-3.5 text-gray-500 align-middle text-xs">
                    {{ project.lastUpdated }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column (4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        <!-- 1. Pending Approval Requests Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5">
          <!-- Main Header -->
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 class="text-base font-bold text-gray-900">
              Pending Approval Requests
            </h2>
            <NuxtLink to="/admin/approvals" class="text-xs font-semibold text-[#008779] hover:underline flex items-center gap-0.5">
              <span>View all</span>
              <UIcon name="i-lucide-arrow-right" class="size-3" />
            </NuxtLink>
          </div>

          <!-- Section A: External User Approvals -->
          <div class="mt-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  EXTERNAL USER APPROVALS
                </span>
                <span class="size-4.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                  4
                </span>
              </div>
              <NuxtLink to="/admin/approvals" class="text-xs font-semibold text-[#008779] hover:underline flex items-center gap-0.5">
                <span>Manage</span>
                <UIcon name="i-lucide-arrow-right" class="size-3" />
              </NuxtLink>
            </div>

            <!-- List of Pending External Users -->
            <div class="space-y-4">
              <div
                v-for="item in externalApprovals"
                :key="item.id"
                class="pt-3 first:pt-0 border-t first:border-t-0 border-gray-100"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 truncate">
                      {{ item.name }}
                    </p>
                    <p class="text-[11px] text-gray-500 truncate">
                      {{ item.email }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-0.5">
                      {{ item.requested }}
                    </p>
                  </div>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    {{ item.status }}
                  </span>
                </div>

                <div class="mt-2">
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-medium px-3.5 py-1 rounded shadow-xs transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section B: Project Approval Requests -->
          <div class="mt-6 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">
                PROJECT APPROVAL REQUESTS
              </span>
              <NuxtLink to="/admin/approvals" class="text-xs font-semibold text-[#008779] hover:underline flex items-center gap-0.5">
                <span>Manage</span>
                <UIcon name="i-lucide-arrow-right" class="size-3" />
              </NuxtLink>
            </div>
            <p class="text-xs text-gray-400 py-1">
              No pending approval requests.
            </p>
          </div>
        </div>

        <!-- 2. User Information Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5">
          <h2 class="text-base font-bold text-gray-900 mb-4">
            User Information
          </h2>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <!-- Full name -->
            <div>
              <span class="text-gray-400 font-medium block">Full name</span>
              <span class="text-gray-900 font-semibold mt-0.5 block">
                Romteera Tadderm
              </span>
            </div>

            <!-- Email address -->
            <div>
              <span class="text-gray-400 font-medium block">Email address</span>
              <span class="text-gray-900 font-medium mt-0.5 block truncate" title="romteera.tad@cpf.co.th">
                romteera.tad@cpf.co.th
              </span>
            </div>

            <!-- Roles -->
            <div>
              <span class="text-gray-400 font-medium block">Roles</span>
              <div class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Admin
                </span>
              </div>
            </div>

            <!-- Last login -->
            <div>
              <span class="text-gray-400 font-medium block">Last login</span>
              <span class="text-gray-700 font-medium mt-1 block">
                2/24/2026, 3:11:29 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
