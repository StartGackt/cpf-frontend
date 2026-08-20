<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const isPfrSubmitted = ref(true)
const pfrStatus = ref<'draft' | 'pending' | 'approved'>('approved')
const isArchivedToKm = ref(true)

const projectSummary = {
  name: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
  leader: 'Romteera Tadderm (Black Belt)',
  plant: 'โรงงานแปรรูปโชคชัย (Food Business)',
  baselineYield: '83.75%',
  finalYield: '87.70%',
  yieldImprovement: '+3.95%',
  baselineGiveaway: '4.25%',
  finalGiveaway: '2.20%',
  verifiedAnnualSavings: '4,250,000 THB / Year',
  cpk: '1.45 (Stable)',
  pfrDocId: 'PFR-CPF-2026-088'
}

const signOffSteps = ref([
  { role: 'Project Leader', name: 'Romteera Tadderm', status: 'Approved', date: '20/02/2026', signature: 'E-Signed (CPF Auth)' },
  { role: 'Master Black Belt (MBB)', name: 'Dr. Prasert Chareon', status: 'Approved', date: '22/02/2026', signature: 'E-Signed (CPF Auth)' },
  { role: 'Plant Champion / GM', name: 'Somchai Vong', status: 'Approved', date: '24/02/2026', signature: 'E-Signed (CPF Auth)' },
  { role: 'Corporate PMO HQ', name: 'Quality Excellence Committee', status: 'Approved', date: '24/02/2026', signature: 'System Registered & Archived' }
])
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
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Control</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Project Finish & PFR Sign-off</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Project Finish"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- 1. Close-out Congratulation & KM Archive Auto-Push Banner (Module 7 Requirement) -->
        <div class="bg-gradient-to-r from-teal-900 to-emerald-900 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="bg-amber-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded tracking-wide">
                PROJECT CLOSED & CERTIFIED
              </span>
              <span class="text-xs text-teal-200 font-mono">Doc: {{ projectSummary.pfrDocId }}</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-white">
              {{ projectSummary.name }}
            </h1>
            <p class="text-xs text-teal-100">
              PFR Workflow Approved. Project documentation has been automatically synced to CPF KM Repository.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <NuxtLink
              :to="`/admin/projects/${projectId}/presentation`"
              class="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <UIcon name="i-lucide-presentation" class="size-3.5" />
              <span>Presentation Mode</span>
            </NuxtLink>

            <NuxtLink
              :to="`/admin/projects/${projectId}/report`"
              class="bg-white text-[#008779] hover:bg-gray-100 text-xs font-bold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <UIcon name="i-lucide-file-check" class="size-4" />
              <span>Export Signed PFR (PDF)</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Final Verified Metrics Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">FINAL YIELD GAIN</span>
            <p class="text-2xl font-bold text-emerald-700 font-mono">{{ projectSummary.finalYield }}</p>
            <span class="text-[10px] text-emerald-600 font-semibold font-mono">{{ projectSummary.yieldImprovement }} vs Baseline</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">GIVEAWAY REDUCTION</span>
            <p class="text-2xl font-bold text-[#008779] font-mono">{{ projectSummary.finalGiveaway }}</p>
            <span class="text-[10px] text-teal-600 font-mono">From 4.25% &rarr; 2.20%</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">FINANCIAL BENEFIT</span>
            <p class="text-xl font-bold text-teal-800 font-mono">{{ projectSummary.verifiedAnnualSavings }}</p>
            <span class="text-[10px] text-emerald-600 font-semibold">Audited Cost Savings</span>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 text-center space-y-1">
            <span class="text-[10px] text-gray-500 font-bold uppercase">CAPABILITY STABILITY</span>
            <p class="text-2xl font-bold text-gray-900 font-mono">{{ projectSummary.cpk }}</p>
            <span class="text-[10px] text-gray-500">Six Sigma Sustained</span>
          </div>
        </div>

        <!-- 3. Four-Step E-Signature Close-out Approval Chain -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                PFR Electronic Sign-off Chain (E-Signature Verified)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Sequential approval workflow linked with CPF Corporate IAM authentication
              </p>
            </div>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ✓ Fully Approved (4/4 Signatures)
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div
              v-for="(step, idx) in signOffSteps"
              :key="idx"
              class="border border-emerald-200 bg-emerald-50/40 rounded-lg p-3.5 space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-emerald-800 uppercase">Step {{ idx + 1 }}: {{ step.role }}</span>
                <UIcon name="i-lucide-check-circle-2" class="size-4 text-emerald-600" />
              </div>
              <p class="font-bold text-gray-900 text-xs">{{ step.name }}</p>
              <div class="text-[10px] text-gray-600 space-y-0.5 font-mono pt-1 border-t border-emerald-200/60">
                <p>Status: <strong class="text-emerald-700">{{ step.status }}</strong></p>
                <p>Date: {{ step.date }}</p>
                <p class="text-emerald-800 font-semibold">{{ step.signature }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. KM Repository Auto-Sync Confirmation Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div class="size-9 rounded-lg bg-teal-50 text-[#008779] flex items-center justify-center">
              <UIcon name="i-lucide-database" class="size-5" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900">
                CPF KM Repository Storage Status: Active & Searchable
              </h3>
              <p class="text-gray-500 text-[11px] mt-0.5">
                Archived under: Food Business › Chicken Processing › Yield & Giveaway Category
              </p>
            </div>
          </div>

          <NuxtLink
            to="/admin/km-repository"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
          >
            <span>Open KM Repository</span>
            <UIcon name="i-lucide-arrow-right" class="size-3" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
