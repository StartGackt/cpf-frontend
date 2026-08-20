<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const zoomLevel = ref(100)

const mapType = ref<'flowchart' | 'sipoc' | 'swimlane'>('flowchart')
const isAiGeneratorModalOpen = ref(false)
const aiPrompt = ref('กระบวนการผลิตไก่ทอดแช่แข็ง โรงงานแปรรูปโชคชัย ตั้งแต่รับเนื้อไก่ดิบ, หมัก Tumbling, เคลือบ Predust & Batter, ทอด Frying, แช่เยือกแข็ง Freezing, ถึงบรรจุ Multihead Packing')

const isGenerating = ref(false)
const generateAiProcessMap = () => {
  isGenerating.value = true
  setTimeout(() => {
    isGenerating.value = false
    isAiGeneratorModalOpen.value = false
  }, 1000)
}

const zoomIn = () => {
  if (zoomLevel.value < 150) zoomLevel.value += 10
}
const zoomOut = () => {
  if (zoomLevel.value > 60) zoomLevel.value -= 10
}
</script>

<template>
  <div class="space-y-3 -mt-2">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-gray-500 pb-1">
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
      <NuxtLink :to="`/admin/projects/${projectId}/measure/process-map`" class="hover:text-[#008779]">
        Measure
      </NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-bold">Process Map</span>
    </div>

    <!-- CANVAS WRAPPER -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col overflow-hidden min-h-[640px]">
      <!-- 1. Top Editor Toolbar -->
      <div class="p-3 border-b border-gray-200 bg-gray-50/70 flex flex-wrap items-center justify-between gap-4">
        <!-- View Type Selector & AI Generator (Module 4 Requirement) -->
        <div class="flex items-center gap-2">
          <div class="flex items-center bg-white border border-gray-200 rounded-md p-0.5 text-xs font-semibold">
            <button
              type="button"
              class="px-2.5 py-1 rounded transition-colors"
              :class="mapType === 'flowchart' ? 'bg-[#008779] text-white' : 'text-gray-600 hover:text-gray-900'"
              @click="mapType = 'flowchart'"
            >
              Standard Flow
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded transition-colors"
              :class="mapType === 'sipoc' ? 'bg-[#008779] text-white' : 'text-gray-600 hover:text-gray-900'"
              @click="mapType = 'sipoc'"
            >
              SIPOC Matrix
            </button>
            <button
              type="button"
              class="px-2.5 py-1 rounded transition-colors"
              :class="mapType === 'swimlane' ? 'bg-[#008779] text-white' : 'text-gray-600 hover:text-gray-900'"
              @click="mapType = 'swimlane'"
            >
              Swimlane
            </button>
          </div>

          <!-- AI Process Map Generator (Phase 2 Feature) -->
          <button
            type="button"
            class="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            @click="isAiGeneratorModalOpen = true"
          >
            <UIcon name="i-lucide-sparkles" class="size-3.5 text-amber-200" />
            <span>AI Process Generator</span>
          </button>
        </div>

        <!-- Right: Zoom & Save -->
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-white border border-gray-200 rounded-md text-xs">
            <button type="button" class="px-2 py-1 hover:bg-gray-50 border-r border-gray-200" @click="zoomOut">-</button>
            <span class="px-2.5 py-1 font-mono font-bold">{{ zoomLevel }}%</span>
            <button type="button" class="px-2 py-1 hover:bg-gray-50 border-l border-gray-200" @click="zoomIn">+</button>
          </div>

          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs"
          >
            Save Layout
          </button>
        </div>
      </div>

      <!-- 2. CANVAS CONTENT -->
      <div class="flex-1 bg-slate-50/50 p-6 overflow-auto relative">
        <!-- SIPOC MATRIX VIEW -->
        <div v-if="mapType === 'sipoc'" class="space-y-4">
          <h3 class="text-xs font-bold text-gray-900 uppercase">SIPOC High-Level Scope Mapping</h3>
          <div class="grid grid-cols-5 gap-3 text-xs">
            <div class="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <span class="font-bold text-blue-700 block border-b pb-1">Suppliers (S)</span>
              <ul class="space-y-1 text-gray-700 list-disc pl-3 text-[11px]">
                <li>ฟาร์มไก่เนื้อ สระบุรี</li>
                <li>CP Food Supplier (Flour)</li>
                <li>Oil Refinery Supplier</li>
              </ul>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <span class="font-bold text-teal-700 block border-b pb-1">Inputs (I)</span>
              <ul class="space-y-1 text-gray-700 list-disc pl-3 text-[11px]">
                <li>เนื้อไก่ตัดแต่ง (Trimmed)</li>
                <li>Batter & Predust Flour</li>
                <li>Palm Olein Frying Oil</li>
              </ul>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <span class="font-bold text-emerald-700 block border-b pb-1">Process (P)</span>
              <ul class="space-y-1 text-gray-700 list-disc pl-3 text-[11px]">
                <li>1. Tumbling Marination</li>
                <li>2. Predust & Battering</li>
                <li>3. Continuous Frying</li>
                <li>4. Spiral Freezing</li>
                <li>5. Multihead Weighing</li>
              </ul>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <span class="font-bold text-amber-700 block border-b pb-1">Outputs (O)</span>
              <ul class="space-y-1 text-gray-700 list-disc pl-3 text-[11px]">
                <li>ไก่ทอดกรอบแช่แข็ง (IQF)</li>
                <li>1,000g Sealed Retail Bag</li>
                <li>Giveaway within 2.2%</li>
              </ul>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <span class="font-bold text-purple-700 block border-b pb-1">Customers (C)</span>
              <ul class="space-y-1 text-gray-700 list-disc pl-3 text-[11px]">
                <li>CP FreshMart</li>
                <li>Export Japan Market</li>
                <li>Domestic QSR Chains</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SWIMLANE VIEW -->
        <div v-else-if="mapType === 'swimlane'" class="space-y-3">
          <h3 class="text-xs font-bold text-gray-900 uppercase">Cross-Functional Swimlane Diagram</h3>
          <div class="space-y-2 text-xs">
            <div class="border border-gray-200 bg-white rounded-lg p-3 flex items-center gap-4">
              <span class="w-28 font-bold text-gray-900 shrink-0 border-r pr-2">Production Dept</span>
              <div class="flex items-center gap-2">
                <span class="bg-teal-50 border border-teal-200 text-teal-900 px-3 py-1.5 rounded font-medium">Tumbling &rarr; Predust</span>
                <span class="text-gray-400">&rarr;</span>
                <span class="bg-teal-50 border border-teal-200 text-teal-900 px-3 py-1.5 rounded font-medium">Continuous Frying Line</span>
              </div>
            </div>
            <div class="border border-gray-200 bg-white rounded-lg p-3 flex items-center gap-4">
              <span class="w-28 font-bold text-gray-900 shrink-0 border-r pr-2">Packaging Dept</span>
              <div class="flex items-center gap-2">
                <span class="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded font-medium">Multihead Weigher Dispenser</span>
                <span class="text-gray-400">&rarr;</span>
                <span class="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded font-medium">Form-Fill-Seal Packaging</span>
              </div>
            </div>
            <div class="border border-gray-200 bg-white rounded-lg p-3 flex items-center gap-4">
              <span class="w-28 font-bold text-gray-900 shrink-0 border-r pr-2">QA / QC Dept</span>
              <div class="flex items-center gap-2">
                <span class="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded font-medium">Hourly Metal Detector Check</span>
                <span class="text-gray-400">&rarr;</span>
                <span class="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded font-medium">Weight Sampling Calibration</span>
              </div>
            </div>
          </div>
        </div>

        <!-- STANDARD 28-NODE FLOWCHART CANVAS -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-800">Process Canvas: 28 Standardized Step Nodes</span>
            <span class="text-[11px] text-gray-500 font-mono">Row 1 (Receiving) &rarr; Row 2 (Processing) &rarr; Row 3 (Packaging)</span>
          </div>

          <div class="grid grid-cols-6 gap-3 text-xs">
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">1. รับวัตถุดิบไก่สด</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">2. ตรวจสอบอุณหภูมิ</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">3. ตัดแต่งชิ้นเนื้อ</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">4. Tumbling Marination</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">5. เติมแป้ง Predust</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">6. ชุบน้ำแป้ง Batter</div>
            <div class="bg-teal-50 border border-teal-200 rounded p-2.5 font-bold text-teal-900 shadow-2xs">7. ทอดน้ำมัน Frying</div>
            <div class="bg-teal-50 border border-teal-200 rounded p-2.5 font-bold text-teal-900 shadow-2xs">8. อบไอน้ำ Roasting</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">9. แช่เยือกแข็ง IQF</div>
            <div class="bg-amber-50 border border-amber-300 rounded p-2.5 font-bold text-amber-900 shadow-2xs">10. Multihead Weigher</div>
            <div class="bg-white border border-gray-200 rounded p-2.5 font-medium shadow-2xs">11. บรรจุถุง Form-Fill</div>
            <div class="bg-emerald-50 border border-emerald-200 rounded p-2.5 font-bold text-emerald-900 shadow-2xs">12. จัดส่งเข้าคลังสินค้า</div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI PROCESS MAP GENERATOR MODAL (Phase 2 Feature) -->
    <div
      v-if="isAiGeneratorModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-sparkles" class="size-5 text-[#008779]" />
            <h3 class="text-sm font-bold text-gray-900">AI Process Map Generator (Phase 2)</h3>
          </div>
          <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="isAiGeneratorModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-gray-800 block">Describe Manufacturing Process Flow:</label>
            <textarea
              v-model="aiPrompt"
              rows="4"
              class="w-full bg-white border border-gray-200 rounded-md p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            ></textarea>
          </div>

          <div class="bg-teal-50 border border-teal-200 rounded-lg p-3 text-[11px] text-teal-950 space-y-1">
            <strong>AI Flow Analysis:</strong>
            <p>Generates step sequence, decision points, critical parameters, and auto-identifies candidate MSA inspection stations.</p>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isAiGeneratorModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            :disabled="isGenerating"
            @click="generateAiProcessMap"
          >
            <UIcon :name="isGenerating ? 'i-lucide-loader-2' : 'i-lucide-sparkles'" class="size-3.5" :class="isGenerating ? 'animate-spin' : ''" />
            <span>{{ isGenerating ? 'Synthesizing...' : 'Generate Diagram' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
