<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const activeSubTab = ref<'chart' | 'charter' | 'counterbalance' | 'versions'>('chart')

// BEG Metric Formulation State
const begData = ref({
  baseline: 83.75,
  entitlement: 88.00,
  goalLss: 87.15,
  goalBu: 86.50,
  goalChallenge: 89.00
})

// Counterbalance Targets (Module 3 Requirement)
const counterbalanceTargets = ref([
  { id: 1, name: 'Product Quality Defect Rate (%)', current: '0.45%', limit: '< 0.50%', status: 'Within Limit' },
  { id: 2, name: 'Energy Consumption (kWh/ton)', current: '112.4', limit: '< 120.0', status: 'Within Limit' },
  { id: 3, name: 'Customer Complaint PPM', current: '12 ppm', limit: '< 15 ppm', status: 'Within Limit' }
])

// PCR Version History (Module 3 Requirement)
const pcrVersions = ref([
  {
    version: 'V2.0 (Active)',
    approvedBy: 'Dr. Prasert Chareon (MBB)',
    approvedAt: '24/02/2026',
    status: 'Active',
    baseline: '83.75%',
    goal: '87.15%',
    comment: 'Updated goal calculation with 80% entitlement gap closure.'
  },
  {
    version: 'V1.0',
    approvedBy: 'Somchai Vong (Champion)',
    approvedAt: '15/01/2026',
    status: 'Archived',
    baseline: '82.50%',
    goal: '86.00%',
    comment: 'Initial charter draft.'
  }
])

const isSaveConfirmed = ref(false)
const saveChanges = () => {
  isSaveConfirmed.value = true
  setTimeout(() => { isSaveConfirmed.value = false }, 3000)
}
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
      <span class="text-gray-700 font-medium">Define</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">BEG & Project Charter</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="BEG Chart"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Sub Navigation Tabs -->
        <div class="flex items-center border-b border-gray-200 space-x-6 text-xs font-semibold">
          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'chart' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'chart'"
          >
            <UIcon name="i-lucide-line-chart" class="size-4" />
            <span>BEG Analysis Chart</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'charter' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'charter'"
          >
            <UIcon name="i-lucide-file-text" class="size-4" />
            <span>Project Charter (PCR Form / WYSIWYG)</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'counterbalance' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'counterbalance'"
          >
            <UIcon name="i-lucide-scale" class="size-4" />
            <span>Counterbalance Targets</span>
          </button>

          <button
            type="button"
            class="pb-3 flex items-center gap-1.5 transition-colors relative"
            :class="activeSubTab === 'versions' ? 'text-[#008779] border-b-2 border-[#008779]' : 'text-gray-500 hover:text-gray-800'"
            @click="activeSubTab = 'versions'"
          >
            <UIcon name="i-lucide-history" class="size-4" />
            <span>PCR Version History</span>
          </button>
        </div>

        <!-- 1. BEG Analysis Chart View -->
        <div v-if="activeSubTab === 'chart'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                BEG Statistical Time-Series Chart (Sequential Row Plotting)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Displays chronological data points with Entitlement (88.00%), Goal LSS (87.15%), and Baseline (83.75%)
              </p>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-xs font-mono font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded">
                Entitlement Gap Closure: 80.0%
              </span>
            </div>
          </div>

          <!-- SVG Time-Series Chart -->
          <div class="h-64 border border-gray-100 rounded-lg p-4 bg-gray-50/40 flex items-center justify-center">
            <svg class="w-full h-full" viewBox="0 0 700 200">
              <!-- Y Axis Reference Lines -->
              <!-- Entitlement Line (88.00) - Amber -->
              <line x1="50" y1="40" x2="660" y2="40" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="665" y="44" font-size="10" fill="#f59e0b" font-weight="bold">Entitlement: 88.00</text>

              <!-- Goal Line (87.15) - Purple -->
              <line x1="50" y1="65" x2="660" y2="65" stroke="#9333ea" stroke-width="2" />
              <text x="665" y="69" font-size="10" fill="#9333ea" font-weight="bold">Goal LSS: 87.15</text>

              <!-- Baseline Line (83.75) - Red -->
              <line x1="50" y1="130" x2="660" y2="130" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 4" />
              <text x="665" y="134" font-size="10" fill="#dc2626" font-weight="bold">Baseline: 83.75</text>

              <!-- Actual Data Points Line (Sequential Row Plotting) -->
              <polyline
                points="80,160 130,120 180,120 230,135 280,145 330,110 380,40 430,135 480,110 530,145 580,120 630,110"
                fill="none"
                stroke="#008779"
                stroke-width="2.5"
              />

              <!-- Data Dots -->
              <circle cx="80" cy="160" r="4" fill="#008779" />
              <circle cx="130" cy="120" r="4" fill="#008779" />
              <circle cx="180" cy="120" r="4" fill="#008779" />
              <circle cx="230" cy="135" r="4" fill="#008779" />
              <circle cx="280" cy="145" r="4" fill="#008779" />
              <circle cx="330" cy="110" r="4" fill="#008779" />
              <circle cx="380" cy="40" r="4" fill="#008779" />
              <circle cx="430" cy="135" r="4" fill="#008779" />
              <circle cx="480" cy="110" r="4" fill="#008779" />
              <circle cx="530" cy="145" r="4" fill="#008779" />
              <circle cx="580" cy="120" r="4" fill="#008779" />
              <circle cx="630" cy="110" r="4" fill="#008779" />
            </svg>
          </div>

          <!-- BEG Goals Form Fields (Optional BU / Challenge Goals) -->
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <div class="border border-red-200 rounded p-2.5 bg-red-50/30">
              <label class="text-[10px] text-red-700 font-bold block uppercase">Baseline (B)</label>
              <input v-model="begData.baseline" type="text" class="w-full bg-white border border-red-300 rounded px-2 py-1 text-xs font-mono font-bold text-red-700 mt-1" />
            </div>

            <div class="border border-amber-200 rounded p-2.5 bg-amber-50/30">
              <label class="text-[10px] text-amber-700 font-bold block uppercase">Entitlement (E)</label>
              <input v-model="begData.entitlement" type="text" class="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs font-mono font-bold text-amber-700 mt-1" />
            </div>

            <div class="border border-purple-200 rounded p-2.5 bg-purple-50/30">
              <label class="text-[10px] text-purple-700 font-bold block uppercase">Goal LSS (G)</label>
              <input v-model="begData.goalLss" type="text" class="w-full bg-white border border-purple-300 rounded px-2 py-1 text-xs font-mono font-bold text-purple-700 mt-1" />
            </div>

            <div class="border border-gray-200 rounded p-2.5 bg-gray-50">
              <label class="text-[10px] text-gray-600 font-bold block uppercase">Goal BU (Optional)</label>
              <input v-model="begData.goalBu" type="text" placeholder="e.g. 86.50" class="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono mt-1" />
            </div>

            <div class="border border-gray-200 rounded p-2.5 bg-gray-50">
              <label class="text-[10px] text-gray-600 font-bold block uppercase">Goal Challenge (Opt)</label>
              <input v-model="begData.goalChallenge" type="text" placeholder="e.g. 89.00" class="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono mt-1" />
            </div>
          </div>
        </div>

        <!-- 2. Project Charter Form / WYSIWYG View -->
        <div v-if="activeSubTab === 'charter'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Project Charter (PCR) Documentation Editor
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Structured fields component with rich formatting for PDF/Image 100% boundary export
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
              @click="saveChanges"
            >
              Save Charter Changes
            </button>
          </div>

          <div v-if="isSaveConfirmed" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-md font-semibold">
            ✓ Project Charter modifications saved as new pending revision.
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Problem Statement *</label>
              <textarea
                rows="3"
                class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
                value="% Total Yield สินค้าไก่ทอดต่ำกว่าเกณฑ์มาตรฐาน (Baseline 83.75%) ส่งผลให้เกิดการสูญเสียต้นทุนวัตถุดิบและเกิด Giveaway เกินเป้าหมาย"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-gray-700 block">Goal Statement *</label>
              <textarea
                rows="3"
                class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
                value="เพิ่ม %Total Yield สินค้าไก่ทอดขึ้นเป็น 87.15% (Goal LSS) ภายใน Q4/2025 โดยใช้ระเบียบวิธี Six Sigma DMAIC เพื่อลด Giveaway"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 3. Counterbalance Targets View -->
        <div v-if="activeSubTab === 'counterbalance'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Counterbalance Metrics & Side-Effect Guardrails
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Ensures yield improvement does not degrade product quality, energy efficiency, or customer satisfaction
              </p>
            </div>

            <button class="bg-[#008779] text-white text-xs font-semibold px-3 py-1.5 rounded-md">
              + Add Counterbalance Metric
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <th class="py-3 px-4">COUNTERBALANCE TARGET</th>
                  <th class="py-3 px-4 font-mono text-center">CURRENT PERFORMANCE</th>
                  <th class="py-3 px-4 font-mono text-center">ACCEPTABLE LIMIT</th>
                  <th class="py-3 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="cb in counterbalanceTargets" :key="cb.id">
                  <td class="py-3 px-4 font-bold text-gray-900">{{ cb.name }}</td>
                  <td class="py-3 px-4 text-center font-mono font-semibold text-gray-700">{{ cb.current }}</td>
                  <td class="py-3 px-4 text-center font-mono font-semibold text-teal-700">{{ cb.limit }}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      {{ cb.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. PCR Version History View -->
        <div v-if="activeSubTab === 'versions'" class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <div class="pb-3 border-b border-gray-100">
            <h2 class="text-sm font-bold text-gray-900">
              PCR Version Archive & Active Sign-off Log
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              The latest approved version is treated as Active; all previous versions remain archived.
            </p>
          </div>

          <div class="space-y-3">
            <div
              v-for="(ver, idx) in pcrVersions"
              :key="idx"
              class="border rounded-lg p-4 text-xs space-y-2"
              :class="ver.status === 'Active' ? 'border-teal-300 bg-teal-50/30' : 'border-gray-200 bg-gray-50/50'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm text-gray-900">{{ ver.version }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    :class="ver.status === 'Active' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'"
                  >
                    {{ ver.status }}
                  </span>
                </div>
                <span class="text-gray-500 font-mono text-[11px]">Approved: {{ ver.approvedAt }} by {{ ver.approvedBy }}</span>
              </div>

              <div class="flex items-center gap-6 text-[11px] font-mono text-gray-700">
                <span>Baseline: <strong>{{ ver.baseline }}</strong></span>
                <span>Goal LSS: <strong>{{ ver.goal }}</strong></span>
              </div>

              <p class="text-gray-600 text-[11px] italic">{{ ver.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
