<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project, setProcessMapComplete } = useProjectData(projectId)

const activeFormatTab = ref<'maps' | 'sipoc' | 'swimlane'>('maps')

const isCompleted = computed({
  get: () => project.value.isProcessMapCompleted !== false,
  set: (val: boolean) => setProcessMapComplete(val)
})

// Toast Feedback Notification
const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

const toggleStageCompletion = () => {
  isCompleted.value = !isCompleted.value
  showToast(isCompleted.value ? '✓ Process Map stage marked as Complete! Fishbone Diagram unlocked.' : 'Process Map stage marked as Incomplete.')
}

// Process Maps List (Matching Image 4)
const processMapsList = ref([
  {
    id: 'pm-1',
    name: 'Process Map สินค้าไก่ทอด',
    elements: '28 nodes',
    lastModifiedDate: 'Dec 26, 2025',
    lastModifiedUser: 'Romteera Tadderm'
  }
])

// SIPOC Matrix Data
const sipocRows = ref([
  {
    supplier: 'Supplier แป้ง & สารปรุงแต่ง (External Vendor)',
    input: 'แป้งสาลี, แป้งดัดแปร, เกลือ, เครื่องเทศ',
    process: '1. ผสมแป้งแห้ง Predust & เตรียมน้ำแป้งชุบ (Batter Mix)',
    output: 'น้ำแป้งความหนืด 30±2 วินาที (Zahn Cup #4)',
    customer: 'สายการผลิตทอด (Production Line 1)'
  },
  {
    supplier: 'แผนกตัดแต่งเนื้อไก่ (Deboning Section)',
    input: 'ชิ้นเนื้อไก่สดอุณหภูมิ 2-4°C',
    process: '2. ลำเลียงชิ้นเนื้อไก่ผ่านเครื่องโรยแป้งรองพื้น (Predust Applicator)',
    output: 'เนื้อไก่เคลือบแป้ง Predust สม่ำเสมอ (Coating 8-10%)',
    customer: 'เครื่องชุบน้ำแป้ง (Batter Applicator)'
  },
  {
    supplier: 'ฝ่ายผลิต (Production Shift A)',
    input: 'ชิ้นไก่คลุกแป้ง Predust, น้ำแป้ง Batter',
    process: '3. ชุบน้ำแป้งและทอดกึ่งสุก (Continuous Fryer 180°C, 90s)',
    output: 'ไก่ทอดสีทอง ความชื้นคงที่ Yield หลังทอด 88%',
    customer: 'เครื่องแช่เยือกแข็ง (IQF Spiral Freezer)'
  },
  {
    supplier: 'ฝ่ายคลังสินค้าและบรรจุภัณฑ์',
    input: 'ไก่ทอดแช่แข็ง -18°C, ถุงฟอยล์พิมพ์ลาย',
    process: '4. ชั่งน้ำหนักอัตโนมัติ (Multihead Weigher) และบรรจุถุง',
    output: 'ถุงสินค้าสำเร็จรูป 1,000g (Giveaway ≤ 1.5%)',
    customer: 'ลูกค้าส่งออก (Export QA & Consumer)'
  }
])

// Swimlane Lanes Data
const swimlanes = ref([
  {
    role: 'Warehouse / Prep',
    steps: ['รับวัตถุดิบแป้งและสารปรุงแต่ง', 'ตรวจสอบใบ COA และวัดความชื้น', 'เบิกจ่ายวัตถุดิบเข้าห้องผสม']
  },
  {
    role: 'Production Line',
    steps: ['ผสมแป้ง Predust (40Hz Belt)', 'ชุบน้ำแป้ง Batter (30s Viscosity)', 'ทอดในกระทะทอดต่อเนื่อง 180°C', 'ลำเลียงเข้า Spiral Freezer -18°C']
  },
  {
    role: 'Packaging & QC',
    steps: ['ชั่งน้ำหนัก Multihead Weigher', 'ตรวจจับโลหะ (Metal Detector)', 'สุ่มตรวจค่า %Yield และบันทึกผล']
  }
])

// AI Process Map Generator Modal State
const isAiModalOpen = ref(false)
const aiPrompt = ref('สร้างกระบวนการผลิตไก่ทอดแช่แข็งพร้อมจุดควบคุม %Yield และจุดชั่งน้ำหนัก Multihead')
const isGenerating = ref(false)
const aiSuccessMsg = ref('')

const generateAiProcessMap = () => {
  isGenerating.value = true
  setTimeout(() => {
    isGenerating.value = false
    aiSuccessMsg.value = 'AI ได้สร้างผังกระบวนการแบบ Swimlane และ SIPOC สำเร็จแล้ว!'
    setTimeout(() => {
      aiSuccessMsg.value = ''
      isAiModalOpen.value = false
    }, 1800)
  }, 1200)
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
    <!-- Toast Feedback Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toastMsg"
        class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-slate-500 pb-1">
      <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
        <UIcon name="i-lucide-home" class="size-3.5" />
        <span>Home</span>
      </NuxtLink>
      <span>›</span>
      <NuxtLink to="/admin/projects" class="hover:text-[#008779]">
        Projects
      </NuxtLink>
      <span>›</span>
      <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[200px]">
        {{ project.name }}
      </NuxtLink>
      <span>›</span>
      <span class="text-slate-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-slate-900 font-bold">Process Map</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Process Map"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-5 min-w-0 w-full">
        
        <!-- Header Banner: Process Map Stage (Matching Image 4) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h1 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Process Map Stage</span>
            </h1>
            <p class="text-xs text-slate-500">
              Create visual representations of your process flow
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              :class="isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-200'"
              @click="toggleStageCompletion"
            >
              <UIcon :name="isCompleted ? 'i-lucide-check-circle-2' : 'i-lucide-circle'" class="size-4" :class="isCompleted ? 'text-emerald-600' : 'text-slate-400'" />
              <span>{{ isCompleted ? 'Completed (Fishbone Unlocked)' : 'Mark as Completed' }}</span>
            </button>

            <NuxtLink
              :to="`/admin/projects/${projectId}/measure/process-map/canvas`"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <UIcon name="i-lucide-network" class="size-3.5" />
              <span>Open Canvas Editor</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Format Switcher Pill Tabs -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-2 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="activeFormatTab === 'maps' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'"
              @click="activeFormatTab === 'maps'"
            >
              <UIcon name="i-lucide-files" class="size-3.5" />
              <span>Process Maps</span>
            </button>
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="activeFormatTab === 'sipoc' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'"
              @click="activeFormatTab === 'sipoc'"
            >
              <UIcon name="i-lucide-table-properties" class="size-3.5" />
              <span>SIPOC Matrix</span>
            </button>
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="activeFormatTab === 'swimlane' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'"
              @click="activeFormatTab === 'swimlane'"
            >
              <UIcon name="i-lucide-git-commit" class="size-3.5" />
              <span>Swimlane Flowchart</span>
            </button>
          </div>

          <button
            type="button"
            class="bg-teal-50 hover:bg-teal-100 text-[#008779] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-teal-200"
            @click="isAiModalOpen = true"
          >
            <UIcon name="i-lucide-sparkles" class="size-3.5 text-amber-500" />
            <span>AI Process Map Generator</span>
          </button>
        </div>

        <!-- 1. PROCESS MAPS TABLE VIEW (Matching Image 4) -->
        <div v-if="activeFormatTab === 'maps'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">Process Maps</h2>
              <p class="text-xs text-slate-500">Create and manage visual representations of your process flow</p>
            </div>

            <NuxtLink
              :to="`/admin/projects/${projectId}/measure/process-map/canvas`"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>+ Create Process Map</span>
            </NuxtLink>
          </div>

          <!-- Table of Process Maps (Matching Image 4) -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">PROCESS MAP</th>
                  <th class="py-3 px-4">ELEMENTS</th>
                  <th class="py-3 px-4">LAST MODIFIED</th>
                  <th class="py-3 px-4 text-center w-36">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-800">
                <tr v-for="pm in processMapsList" :key="pm.id" class="hover:bg-slate-50/70 transition-colors">
                  <td class="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <UIcon name="i-lucide-git-merge" class="size-4 text-[#008779]" />
                    <span>{{ pm.name }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-slate-600 font-mono">
                    {{ pm.elements }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-600">
                    <span class="font-mono text-slate-900 block">{{ pm.lastModifiedDate }}</span>
                    <span class="text-[11px] text-slate-400">{{ pm.lastModifiedUser }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <!-- Chat action -->
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-[#008779] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="AI Analysis"
                      >
                        <UIcon name="i-lucide-message-square" class="size-3.5" />
                      </button>

                      <!-- Action Button 1 (Circled in Image 4): Open Canvas Editor -->
                      <NuxtLink
                        :to="`/admin/projects/${projectId}/measure/process-map/canvas`"
                        class="p-1.5 rounded-lg bg-teal-50 text-[#008779] hover:bg-[#008779] hover:text-white border border-teal-200 transition-colors cursor-pointer shadow-2xs"
                        title="Edit Process Flowchart Canvas (1)"
                      >
                        <UIcon name="i-lucide-pencil" class="size-3.5" />
                      </NuxtLink>

                      <!-- Delete action -->
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Process Map"
                        @click="showToast('Process map is preserved for project integrity')"
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

        <!-- 2. SIPOC VIEW -->
        <div v-else-if="activeFormatTab === 'sipoc'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                SIPOC Process Map Matrix
              </h2>
              <p class="text-xs text-slate-500">Suppliers • Inputs • Process • Outputs • Customers</p>
            </div>
          </div>

          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th class="p-3 font-bold text-sky-800 bg-sky-50/50">SUPPLIER (S)</th>
                  <th class="p-3 font-bold text-indigo-800 bg-indigo-50/50">INPUT (I)</th>
                  <th class="p-3 font-bold text-teal-800 bg-teal-50/50">PROCESS (P)</th>
                  <th class="p-3 font-bold text-purple-800 bg-purple-50/50">OUTPUT (O)</th>
                  <th class="p-3 font-bold text-rose-800 bg-rose-50/50">CUSTOMER (C)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                <tr v-for="(row, rIdx) in sipocRows" :key="rIdx" class="hover:bg-slate-50/60 transition-colors">
                  <td class="p-3 text-slate-800 bg-sky-50/10">{{ row.supplier }}</td>
                  <td class="p-3 text-slate-800 bg-indigo-50/10">{{ row.input }}</td>
                  <td class="p-3 font-semibold text-[#008779] bg-teal-50/20">{{ row.process }}</td>
                  <td class="p-3 text-slate-800 bg-purple-50/10">{{ row.output }}</td>
                  <td class="p-3 text-slate-800 bg-rose-50/10">{{ row.customer }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. SWIMLANE VIEW -->
        <div v-else-if="activeFormatTab === 'swimlane'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Cross-Functional Swimlane Flowchart
              </h2>
              <p class="text-xs text-slate-500">ผังกระบวนการจำแนกตามหน่วยงานผู้รับผิดชอบ</p>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="lane in swimlanes"
              :key="lane.role"
              class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/40 flex flex-col md:flex-row items-start md:items-center gap-3"
            >
              <div class="w-44 shrink-0 font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs flex items-center gap-2">
                <UIcon name="i-lucide-user-check" class="size-4 text-[#008779]" />
                <span>{{ lane.role }}</span>
              </div>

              <div class="flex-1 flex items-center gap-2 flex-wrap">
                <template v-for="(step, sIdx) in lane.steps" :key="step">
                  <div class="bg-white border border-teal-200/80 rounded-xl p-2 shadow-2xs text-xs text-slate-800 font-medium">
                    {{ step }}
                  </div>
                  <UIcon v-if="sIdx < lane.steps.length - 1" name="i-lucide-arrow-right" class="size-3 text-slate-400" />
                </template>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- AI Process Map Modal -->
    <Teleport to="body">
      <div
        v-if="isAiModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="size-9 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#008779]">
                <UIcon name="i-lucide-sparkles" class="size-5 text-amber-500" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">AI Process Map Generator</h3>
                <span class="text-xs text-slate-500">สร้างผัง SIPOC และ Swimlane จากข้อความคำสั่ง</span>
              </div>
            </div>
            <button
              type="button"
              class="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              @click="isAiModalOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <div v-if="aiSuccessMsg" class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-semibold flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="size-4 text-emerald-600" />
            <span>{{ aiSuccessMsg }}</span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="space-y-1.5">
              <label class="font-bold text-slate-700 block">ระบุคำอธิบายกระบวนการผลิต</label>
              <textarea
                v-model="aiPrompt"
                rows="4"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#008779]"
                placeholder="เช่น กระบวนการแปรรูปเนื้อไก่ทอดตั้งแต่รับวัตถุดิบจนถึงบรรจุหีบห่อ..."
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              @click="isAiModalOpen = false"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008779] hover:bg-[#007366] transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
              :disabled="isGenerating"
              @click="generateAiProcessMap"
            >
              <UIcon v-if="isGenerating" name="i-lucide-loader-2" class="size-3.5 animate-spin" />
              <UIcon v-else name="i-lucide-wand-2" class="size-3.5" />
              <span>{{ isGenerating ? 'AI กำลังสร้างผัง...' : 'Generate Process Map' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
