<script setup lang="ts">
import { ref } from 'vue'

const externalApprovals = ref([
  {
    id: 1,
    name: 'Somchai Prasert',
    email: 'somchai.p@partner.com',
    company: 'CP FreshMart Partner',
    role: 'External Auditor',
    requestedAt: '2026-02-23',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Wichai Thongdee',
    email: 'wichai.t@consultant.com',
    company: 'LSS Consulting Group',
    role: 'Six Sigma Master Black Belt',
    requestedAt: '2026-02-24',
    status: 'Pending'
  }
])

const projectApprovals = ref([
  {
    id: 1,
    projectName: 'Auto Heating Yield Monitoring Project',
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    submittedBy: 'Nadtapong Aontawee',
    phase: 'Measure Phase Sign-off',
    submittedAt: '2026-02-24',
    status: 'Under Review'
  },
  {
    id: 2,
    projectName: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    submittedBy: 'Romteera Tadderm',
    phase: 'Improve Phase Sign-off',
    submittedAt: '2026-02-24',
    status: 'Approved'
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Approval Center
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Review and approve external user access and DMAIC project phase sign-offs
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin"
          class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 1. External User Approvals -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user-check" class="size-4 text-[#008779]" />
          <h2 class="text-sm font-bold text-gray-900">
            External User Access Requests
          </h2>
        </div>
        <span class="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          2 Pending
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">NAME</th>
              <th class="py-3 px-4 font-semibold">EMAIL</th>
              <th class="py-3 px-4 font-semibold">COMPANY / ORG</th>
              <th class="py-3 px-4 font-semibold">ROLE</th>
              <th class="py-3 px-4 font-semibold">REQUESTED DATE</th>
              <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in externalApprovals" :key="user.id" class="hover:bg-gray-50/50">
              <td class="py-3 px-4 font-bold text-gray-900">{{ user.name }}</td>
              <td class="py-3 px-4 text-gray-600 font-mono">{{ user.email }}</td>
              <td class="py-3 px-4 text-gray-800">{{ user.company }}</td>
              <td class="py-3 px-4">
                <span class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-500 font-mono">{{ user.requestedAt }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-center gap-1.5">
                  <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors shadow-xs">
                    Approve
                  </button>
                  <button type="button" class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-semibold px-2.5 py-1 rounded transition-colors">
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. Project Phase Sign-Offs -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-clipboard-check" class="size-4 text-[#008779]" />
          <h2 class="text-sm font-bold text-gray-900">
            Project Phase Approvals
          </h2>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">PROJECT NAME</th>
              <th class="py-3 px-4 font-semibold">LOCATION</th>
              <th class="py-3 px-4 font-semibold">SUBMITTED BY</th>
              <th class="py-3 px-4 font-semibold">PHASE SIGN-OFF</th>
              <th class="py-3 px-4 font-semibold text-center">STATUS</th>
              <th class="py-3 px-4 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="proj in projectApprovals" :key="proj.id" class="hover:bg-gray-50/50">
              <td class="py-3 px-4 font-bold text-gray-900">{{ proj.projectName }}</td>
              <td class="py-3 px-4 text-gray-600">{{ proj.location }}</td>
              <td class="py-3 px-4 font-medium text-gray-800">{{ proj.submittedBy }}</td>
              <td class="py-3 px-4">
                <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded">
                  {{ proj.phase }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="proj.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ proj.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-center gap-1.5">
                  <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors shadow-xs">
                    Review
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
