<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const categories = [
  { name: 'Material', count: 7, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Machine', count: 12, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { name: 'Method', count: 13, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { name: 'Measurement', count: 3, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { name: 'Man', count: 3, color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { name: 'Environment', count: 3, color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { name: 'Total', count: 41, color: 'bg-gray-100 text-gray-800 border-gray-300 font-bold' }
]

// Phase 2 Auto-feed Inbox for Capability & MSA failed factors
const incomingUnassignedFactors = ref([
  { id: 'in-1', source: 'Capability Analysis (Cpk 0.29 < 1.0)', factorName: 'High Variation in Finished Weight', suggestedCategory: 'Machine' },
  { id: 'in-2', source: 'MSA Study (%StudyVar 34.2% > 30%)', factorName: 'Predust Viscosity Measurement Bias', suggestedCategory: 'Measurement' }
])

// 5-Why Drill-down Modal State
const is5WhyModalOpen = ref(false)
const selectedCategory = ref('Machine')
const whyBranches = ref([
  {
    level1: 'การ set ค่าน้ำหนักเผื่อ Multihead เกินสเปก',
    level2: 'ผู้ปฏิบัติงานตั้งค่าตามความเคยชิน',
    level3: 'ไม่มีการล็อก PLC Parameter สำหรับแต่ละสูตรการผลิต',
    rootCauseType: 'C', // 'C' for Control, 'N' for Noise
    status: 'Completed'
  },
  {
    level1: 'จำนวน Drop ของเครื่อง Multihead สวิง',
    level2: 'Sensor ตรวจจับการตกของสินค้ามีคราบแป้งเกาะ',
    level3: 'หัวฉีดลมเป่าทำความสะอาดแรงดันตก',
    rootCauseType: 'C',
    status: 'Completed'
  }
])

const open5WhyEditor = (categoryName: string) => {
  selectedCategory.value = categoryName
  is5WhyModalOpen.value = true
}

const addWhyBranch = () => {
  whyBranches.value.push({
    level1: 'New observed issue in ' + selectedCategory.value,
    level2: '',
    level3: '',
    rootCauseType: 'C',
    status: 'In Progress'
  })
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
      <span class="text-gray-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Fishbone Diagram</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Fishbone Diagram"
      />

      <div class="flex-1 space-y-4 min-w-0">
        <!-- Phase 2: Incoming Auto-Feed Inbox Banner -->
        <div v-if="incomingUnassignedFactors.length > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 font-bold text-amber-900">
              <UIcon name="i-lucide-inbox" class="size-4 text-amber-600" />
              <span>Auto-Feed Factors from Capability & MSA ({{ incomingUnassignedFactors.length }} items pending 5M1E assignment)</span>
            </div>
            <span class="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">Phase 2 Auto-Sync</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="item in incomingUnassignedFactors"
              :key="item.id"
              class="bg-white border border-amber-200 rounded p-2.5 flex items-center justify-between text-xs"
            >
              <div>
                <span class="font-bold text-gray-900 block">{{ item.factorName }}</span>
                <span class="text-[10px] text-gray-500">{{ item.source }}</span>
              </div>
              <button
                type="button"
                class="bg-[#008779] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs"
                @click="open5WhyEditor(item.suggestedCategory)"
              >
                Assign & 5-Why
              </button>
            </div>
          </div>
        </div>

        <!-- Main Fishbone Container Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Ishikawa Fishbone Diagram (with [ C ] Control & [ N ] Noise Tagging)
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Multi-branch 5-Why root cause classification across 5M1E categories
              </p>
            </div>

            <!-- Categories Badges with 5-Why Trigger -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-for="cat in categories.slice(0, 6)"
                :key="cat.name"
                type="button"
                class="px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                :class="cat.color"
                @click="open5WhyEditor(cat.name)"
              >
                <span>{{ cat.name }}:</span>
                <span>{{ cat.count }}</span>
                <UIcon name="i-lucide-edit-3" class="size-3 opacity-60 ml-0.5" />
              </button>
            </div>
          </div>

          <!-- ISHIKAWA FISHBONE DIAGRAM (SVG Canvas) with [ C ] and [ N ] Tagging -->
          <div class="w-full overflow-x-auto bg-gray-50/30 border border-gray-200/80 rounded-xl p-4 flex items-center justify-center">
            <svg class="w-full max-w-[1000px] h-[520px]" viewBox="0 0 920 480">
              <!-- Center Backbone Horizontal Arrow -->
              <line x1="80" y1="240" x2="680" y2="240" stroke="#1e293b" stroke-width="2" />
              <polygon points="680,235 695,240 680,245" fill="#1e293b" />

              <!-- Central Target Box (Effect) -->
              <rect x="710" y="215" width="160" height="50" rx="4" fill="#0f172a" />
              <text x="790" y="238" font-size="11" fill="#ffffff" font-weight="bold" text-anchor="middle">
                %Total Yield
              </text>
              <text x="790" y="252" font-size="10" fill="#cbd5e1" text-anchor="middle">
                สินค้าไก่ทอดต่ำกว่าเกณฑ์
              </text>

              <!-- ================= TOP BONES ================= -->
              <!-- 1. MATERIAL (Top Left) -->
              <rect x="180" y="70" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="215" y="86" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Material</text>
              <line x1="215" y1="94" x2="295" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones with [ C ] and [ N ] Badges -->
              <line x1="160" y1="120" x2="230" y2="120" stroke="#64748b" stroke-width="1" />
              <text x="155" y="118" font-size="8" fill="#334155" text-anchor="end">ความหนืด Batter ต่ำกว่า STD [ C ]</text>

              <line x1="180" y1="140" x2="240" y2="140" stroke="#64748b" stroke-width="1" />
              <text x="175" y="138" font-size="8" fill="#334155" text-anchor="end">Coating ไม่เกาะทั่วชิ้น [ C ]</text>

              <!-- 2. MACHINE (Top Center) -->
              <rect x="360" y="70" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="395" y="86" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Machine</text>
              <line x1="395" y1="94" x2="475" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <line x1="340" y1="120" x2="410" y2="120" stroke="#64748b" stroke-width="1" />
              <text x="335" y="118" font-size="8" fill="#dc2626" font-weight="bold" text-anchor="end">Set ค่าน้ำหนักเผื่อ Multihead [ C ]</text>

              <line x1="360" y1="140" x2="420" y2="140" stroke="#64748b" stroke-width="1" />
              <text x="355" y="138" font-size="8" fill="#dc2626" font-weight="bold" text-anchor="end">จำนวน Drop เครื่อง Multihead [ C ]</text>

              <line x1="380" y1="160" x2="430" y2="160" stroke="#64748b" stroke-width="1" />
              <text x="375" y="158" font-size="8" fill="#334155" text-anchor="end">ความเร็วเครื่องเติมแป้ง Predust [ C ]</text>

              <!-- 3. METHOD (Top Right) -->
              <rect x="540" y="70" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="575" y="86" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Method</text>
              <line x1="575" y1="94" x2="655" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <line x1="520" y1="120" x2="590" y2="120" stroke="#64748b" stroke-width="1" />
              <text x="515" y="118" font-size="8" fill="#334155" text-anchor="end">รอบเวลา Frying ไม่คงที่ [ C ]</text>

              <!-- ================= BOTTOM BONES ================= -->
              <!-- 4. MEASUREMENT (Bottom Left) -->
              <rect x="180" y="380" width="90" height="24" rx="2" fill="#0f172a" />
              <text x="225" y="396" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Measurement</text>
              <line x1="225" y1="380" x2="305" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <line x1="160" y1="340" x2="230" y2="340" stroke="#64748b" stroke-width="1" />
              <text x="155" y="342" font-size="8" fill="#334155" text-anchor="end">ความถี่การ Calibrate ตาชั่ง [ C ]</text>

              <!-- 5. MAN (Bottom Center) -->
              <rect x="360" y="380" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="395" y="396" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Man</text>
              <line x1="395" y1="380" x2="475" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <line x1="340" y1="340" x2="410" y2="340" stroke="#64748b" stroke-width="1" />
              <text x="335" y="342" font-size="8" fill="#334155" text-anchor="end">ทักษะการเติม Batter ไม่เท่ากัน [ C ]</text>

              <!-- 6. ENVIRONMENT (Bottom Right) -->
              <rect x="540" y="380" width="90" height="24" rx="2" fill="#0f172a" />
              <text x="585" y="396" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Environment</text>
              <line x1="585" y1="380" x2="665" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <line x1="520" y1="340" x2="590" y2="340" stroke="#64748b" stroke-width="1" />
              <text x="515" y="342" font-size="8" fill="#64748b" text-anchor="end">ความชื้นสัมพัทธ์ในห้องแปรรูป [ N ]</text>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 5-WHY DRILL-DOWN MODAL -->
    <div
      v-if="is5WhyModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900">
              5-Why Analysis Tree & Root Cause Classification
            </h3>
            <p class="text-[11px] text-gray-500">Category: {{ selectedCategory }}</p>
          </div>
          <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="is5WhyModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          <div
            v-for="(branch, bIdx) in whyBranches"
            :key="bIdx"
            class="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900 text-xs">Branch #{{ bIdx + 1 }}</span>
              <!-- Mandatory [ C ] Control vs [ N ] Noise Selection -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-gray-500 font-bold uppercase">Root Cause Type:</span>
                <label class="flex items-center gap-1 cursor-pointer">
                  <input v-model="branch.rootCauseType" type="radio" value="C" class="accent-emerald-600" />
                  <span class="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">[ C ] Control</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer">
                  <input v-model="branch.rootCauseType" type="radio" value="N" class="accent-slate-600" />
                  <span class="font-bold text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-[10px]">[ N ] Noise</span>
                </label>
              </div>
            </div>

            <!-- Why Level 1 -->
            <div class="space-y-1">
              <label class="text-[10px] text-gray-500 font-bold">Why 1 (Observed Phenomenon):</label>
              <input v-model="branch.level1" type="text" class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#008779]" />
            </div>

            <!-- Why Level 2 -->
            <div class="space-y-1 pl-3 border-l-2 border-teal-200">
              <label class="text-[10px] text-gray-500 font-bold">Why 2 (Direct Cause):</label>
              <input v-model="branch.level2" type="text" class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#008779]" />
            </div>

            <!-- Why Level 3 / Root Cause -->
            <div class="space-y-1 pl-6 border-l-2 border-teal-400">
              <label class="text-[10px] text-gray-500 font-bold">Why 3 (Root Cause):</label>
              <input v-model="branch.level3" type="text" class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-[#008779]" />
            </div>
          </div>

          <button
            type="button"
            class="w-full border-2 border-dashed border-teal-200 hover:bg-teal-50/50 text-[#008779] py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            @click="addWhyBranch"
          >
            <UIcon name="i-lucide-plus" class="size-3.5" />
            <span>+ Add Sibling 5-Why Branch</span>
          </button>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="is5WhyModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="is5WhyModalOpen = false"
          >
            Save & Redraw Fishbone
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
