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
    business: 'Food Business › Chicken Processing',
    belt: 'Green Belt (GB)',
    submittedBy: 'Nadtapong Aontawee',
    reportType: 'Project Charter Report (PCR)',
    phase: 'Measure Phase Sign-off',
    submittedAt: '2026-02-24',
    baseline: '81.20%',
    entitlement: '86.50%',
    targetGoal: '85.44%',
    financialSavings: '2,800,000 THB / Year',
    status: 'Under Review'
  },
  {
    id: 2,
    projectName: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    business: 'Food Business › Chicken Processing',
    belt: 'Black Belt (BB)',
    submittedBy: 'Romteera Tadderm',
    reportType: 'Project Final Report (PFR)',
    phase: 'Improve Phase Sign-off',
    submittedAt: '2026-02-24',
    baseline: '83.75%',
    entitlement: '88.00%',
    targetGoal: '87.15%',
    financialSavings: '4,250,000 THB / Year',
    status: 'Approved'
  }
])

const isReviewDrawerOpen = ref(false)
const selectedProject = ref<any>(null)
const reviewComment = ref('')

const openReview = (proj: any) => {
  selectedProject.value = proj
  reviewComment.value = ''
  isReviewDrawerOpen.value = true
}

const approveProject = () => {
  if (selectedProject.value) {
    selectedProject.value.status = 'Approved'
  }
  isReviewDrawerOpen.value = false
}

const requestRevision = () => {
  if (selectedProject.value) {
    selectedProject.value.status = 'Needs Revision'
  }
  isReviewDrawerOpen.value = false
}
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
          Review and approve external user access requests and DMAIC Project Charter (PCR) / Final (PFR) Sign-offs
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

    <!-- 2. Project Phase Sign-Offs (PCR & PFR) -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-clipboard-check" class="size-4 text-[#008779]" />
          <h2 class="text-sm font-bold text-gray-900">
            Project Phase & Charter Sign-off Requests
          </h2>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">PROJECT NAME</th>
              <th class="py-3 px-4 font-semibold">LOCATION</th>
              <th class="py-3 px-4 font-semibold">LEADER & BELT</th>
              <th class="py-3 px-4 font-semibold">REPORT / PHASE</th>
              <th class="py-3 px-4 font-semibold text-center">STATUS</th>
              <th class="py-3 px-4 font-semibold text-center">CONSIDERATION</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="proj in projectApprovals" :key="proj.id" class="hover:bg-gray-50/50">
              <td class="py-3.5 px-4 font-bold text-gray-900">{{ proj.projectName }}</td>
              <td class="py-3.5 px-4 text-gray-600">{{ proj.location }}</td>
              <td class="py-3.5 px-4">
                <span class="font-medium text-gray-800 block">{{ proj.submittedBy }}</span>
                <span class="text-[10px] text-gray-500">{{ proj.belt }}</span>
              </td>
              <td class="py-3.5 px-4">
                <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded block w-fit">
                  {{ proj.phase }}
                </span>
                <span class="text-[10px] text-gray-500 font-mono mt-0.5 block">{{ proj.reportType }}</span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="proj.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ proj.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <button
                  type="button"
                  class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-xs cursor-pointer flex items-center gap-1 mx-auto"
                  @click="openReview(proj)"
                >
                  <UIcon name="i-lucide-file-search" class="size-3.5" />
                  <span>Review Details</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PROJECT CONSIDERATION REVIEW DRAWER / MODAL -->
    <div
      v-if="isReviewDrawerOpen && selectedProject"
      class="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/60 backdrop-blur-xs"
    >
      <div class="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto border-l border-gray-200 animate-in slide-in-from-right duration-200 flex flex-col justify-between">
        <!-- Drawer Header -->
        <div class="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#008779] border border-teal-200 px-2 py-0.5 rounded">
                {{ selectedProject.reportType }}
              </span>
              <span class="text-[10px] font-bold text-gray-500 font-mono">
                Submitted: {{ selectedProject.submittedAt }}
              </span>
            </div>
            <h2 class="text-base font-bold text-gray-900 mt-1">
              {{ selectedProject.projectName }}
            </h2>
          </div>

          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
            @click="isReviewDrawerOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>

        <!-- Drawer Content Body -->
        <div class="p-6 space-y-6 text-xs flex-1">
          <!-- 1. Executive Summary Grid -->
          <div class="grid grid-cols-2 gap-3 bg-gray-50/70 border border-gray-100 rounded-lg p-3.5">
            <div>
              <span class="text-[10px] text-gray-400 uppercase font-bold block">PROJECT LEADER</span>
              <span class="font-bold text-gray-900">{{ selectedProject.submittedBy }}</span>
              <span class="text-[11px] text-gray-500 block">({{ selectedProject.belt }})</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-400 uppercase font-bold block">LOCATION / PLANT</span>
              <span class="font-bold text-gray-900">{{ selectedProject.location }}</span>
              <span class="text-[11px] text-gray-500 block">{{ selectedProject.business }}</span>
            </div>
          </div>

          <!-- 2. Problem Statement & Goal -->
          <div class="space-y-3">
            <h3 class="font-bold text-gray-900 text-xs border-b border-gray-100 pb-1">
              1. Project Problem Statement & Goal
            </h3>
            <div class="space-y-2">
              <div class="bg-red-50/50 border border-red-100 rounded-md p-3">
                <strong class="text-red-900 block mb-0.5">Problem Statement:</strong>
                <p class="text-gray-700 leading-relaxed">
                  % Total Yield สินค้าไก่ทอดต่ำกว่าเกณฑ์มาตรฐาน (Baseline {{ selectedProject.baseline }}) ส่งผลให้เกิดการสูญเสียต้นทุนวัตถุดิบและเกิด Giveaway เกินเป้าหมาย
                </p>
              </div>

              <div class="bg-emerald-50/50 border border-emerald-100 rounded-md p-3">
                <strong class="text-emerald-900 block mb-0.5">Target Goal:</strong>
                <p class="text-gray-700 leading-relaxed">
                  ยกระดับ %Total Yield ขึ้นเป็น {{ selectedProject.targetGoal }} โดยใช้ระเบียบวิธี Six Sigma DMAIC เพื่อลด Giveaway และควบคุมการใช้แป้งให้อยู่ในเกณฑ์มาตรฐาน
                </p>
              </div>
            </div>
          </div>

          <!-- 3. BEG Metrics & Financial Savings -->
          <div class="space-y-3">
            <h3 class="font-bold text-gray-900 text-xs border-b border-gray-100 pb-1">
              2. BEG Improvement Targets & Financial Impact
            </h3>
            <div class="grid grid-cols-4 gap-3 text-center">
              <div class="border border-gray-200 rounded-lg p-2.5 bg-white">
                <span class="text-[10px] text-gray-400 uppercase font-semibold block">BASELINE</span>
                <span class="text-sm font-bold text-red-600 font-mono">{{ selectedProject.baseline }}</span>
              </div>
              <div class="border border-gray-200 rounded-lg p-2.5 bg-white">
                <span class="text-[10px] text-gray-400 uppercase font-semibold block">ENTITLEMENT</span>
                <span class="text-sm font-bold text-amber-600 font-mono">{{ selectedProject.entitlement }}</span>
              </div>
              <div class="border border-gray-200 rounded-lg p-2.5 bg-white">
                <span class="text-[10px] text-gray-400 uppercase font-semibold block">GOAL LSS</span>
                <span class="text-sm font-bold text-purple-700 font-mono">{{ selectedProject.targetGoal }}</span>
              </div>
              <div class="border border-teal-200 rounded-lg p-2.5 bg-teal-50/50">
                <span class="text-[10px] text-teal-800 uppercase font-bold block">SAVINGS IMPACT</span>
                <span class="text-xs font-bold text-[#008779] font-mono">{{ selectedProject.financialSavings }}</span>
              </div>
            </div>
          </div>

          <!-- 4. Sequential Approval Chain -->
          <div class="space-y-3">
            <h3 class="font-bold text-gray-900 text-xs border-b border-gray-100 pb-1">
              3. Sequential Approval Workflow
            </h3>
            <div class="space-y-2">
              <div class="flex items-center gap-3 p-2.5 rounded-md bg-emerald-50/60 border border-emerald-200">
                <div class="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <div class="flex-1">
                  <span class="font-bold text-gray-900 block">Step 1: Project Leader Submission</span>
                  <span class="text-gray-500 text-[11px]">Submitted by {{ selectedProject.submittedBy }} on {{ selectedProject.submittedAt }}</span>
                </div>
                <span class="text-[10px] font-bold text-emerald-700">Completed</span>
              </div>

              <div class="flex items-center gap-3 p-2.5 rounded-md bg-emerald-50/60 border border-emerald-200">
                <div class="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <div class="flex-1">
                  <span class="font-bold text-gray-900 block">Step 2: Master Black Belt (MBB) Review</span>
                  <span class="text-gray-500 text-[11px]">Reviewed by Dr. Prasert Chareon (Methodology & stats approved)</span>
                </div>
                <span class="text-[10px] font-bold text-emerald-700">Approved</span>
              </div>

              <div class="flex items-center gap-3 p-2.5 rounded-md bg-amber-50/60 border border-amber-200">
                <div class="size-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                  3
                </div>
                <div class="flex-1">
                  <span class="font-bold text-gray-900 block">Step 3: Champion / Plant Sponsor Sign-off</span>
                  <span class="text-gray-500 text-[11px]">Assigned to Somchai Vong (Plant Manager)</span>
                </div>
                <span class="text-[10px] font-bold text-amber-700 animate-pulse">Current Reviewer</span>
              </div>

              <div class="flex items-center gap-3 p-2.5 rounded-md bg-gray-50 border border-gray-200 opacity-60">
                <div class="size-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-[10px]">
                  4
                </div>
                <div class="flex-1">
                  <span class="font-bold text-gray-900 block">Step 4: System PMO Registration</span>
                  <span class="text-gray-500 text-[11px]">Final System Archive & Certificate Issuance</span>
                </div>
                <span class="text-[10px] text-gray-500">Pending</span>
              </div>
            </div>
          </div>

          <!-- 5. Approver Feedback Remarks -->
          <div class="space-y-1.5 pt-2">
            <label class="font-semibold text-gray-800 block">Approver Consideration Remarks / Comments</label>
            <textarea
              v-model="reviewComment"
              rows="3"
              placeholder="Enter sign-off comments, approval notes, or required revisions..."
              class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            ></textarea>
          </div>
        </div>

        <!-- Drawer Action Footer -->
        <div class="p-5 border-t border-gray-200 bg-gray-50/90 flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            class="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
            @click="isReviewDrawerOpen = false"
          >
            Close
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-md transition-colors"
              @click="isReviewDrawerOpen = false"
            >
              Reject
            </button>

            <button
              type="button"
              class="border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-semibold px-3 py-2 rounded-md transition-colors"
              @click="requestRevision"
            >
              Request Revisions
            </button>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-5 py-2 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              @click="approveProject"
            >
              <UIcon name="i-lucide-check-circle" class="size-4" />
              <span>Approve Phase Sign-off</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
