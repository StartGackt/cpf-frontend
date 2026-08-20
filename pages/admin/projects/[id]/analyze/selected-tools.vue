<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const actionItems = ref([
  {
    cause: 'วางแผนการผลิตไม่ต่อเนื่อง',
    decision: 'Action Item',
    process: 'Prepare RM&Ingredients',
    isDone: true
  },
  {
    cause: 'เศษชิ้นเล็ก',
    decision: 'Action Item',
    process: 'Prepare RM&Ingredients',
    isDone: true
  },
  {
    cause: 'อุณหภูมิสินค้าหลังสุก',
    decision: 'Action Item',
    process: 'Frying',
    isDone: true
  }
])

const hypothesisGiveaway = ref([
  {
    id: 'weight-multihead',
    cause: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    process: 'Packing',
    unit: 'กรัม',
    responseVar: '%Giveaway',
    responseUnit: '%',
    target: 'Lower is better',
    targetType: 'lower',
    isDone: true
  },
  {
    id: 'drop-multihead',
    cause: 'จำนวนDropของเครื่องMultihead',
    process: 'Packing',
    unit: 'drop',
    responseVar: '%Giveaway',
    responseUnit: '%',
    target: 'Lower is better',
    targetType: 'lower',
    isDone: true
  }
])

const hypothesisYield = ref([
  {
    id: 'av-oil',
    cause: 'ค่า Av น้ำมัน',
    process: 'Frying',
    unit: 'mg KOH/g',
    responseVar: '%Yield',
    responseUnit: '%',
    target: 'Greater is better',
    targetType: 'greater',
    isDone: true
  }
])

const hypothesisFlour = ref([
  {
    id: 'predust-speed',
    cause: 'ความเร็วเครื่องเติมแป้งPredust',
    process: 'Predusting',
    unit: 'Hz',
    responseVar: '%การใช้แป้ง',
    responseUnit: '%',
    target: 'Lower is better',
    targetType: 'lower',
    isDone: true
  },
  {
    id: 'vibration-df',
    cause: 'ความแรงการสั่นDFของเครื่องMultihead',
    process: 'Packing',
    unit: 'Hz',
    responseVar: '%การใช้แป้ง',
    responseUnit: '%',
    target: 'Lower is better',
    targetType: 'lower',
    isDone: true
  },
  {
    id: 'height-predust',
    cause: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    process: 'Predusting',
    unit: 'cm',
    responseVar: '%การใช้แป้ง',
    responseUnit: '%',
    target: 'Lower is better',
    targetType: 'lower',
    isDone: true
  },
  {
    id: 'speed-db4',
    cause: 'ความเร็วรอบเครื่อง DB4',
    process: 'Predusting',
    unit: 'Hz',
    responseVar: '%การใช้แป้ง',
    responseUnit: '%',
    target: 'Lower is better',
    targetType: 'lower',
    isDone: true
  }
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
      <span class="text-gray-700 font-medium">Analyze</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Selected Tools</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Selected Tools"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-6 min-w-0">
        <!-- Collapsible Header Banner (Matching Image 1) -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Selected Tools
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Factors selected for analysis based on Pareto 80% principle from FMEA
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Section Title & All Changes Saved Status -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-gray-900">
              Selected Tools
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Factors selected for analysis based on Pareto 80% principle from FMEA
            </p>
          </div>
          <span class="text-xs text-gray-400 font-medium">
            All changes saved
          </span>
        </div>

        <!-- Product Tab -->
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border-b-2 border-[#008779] text-[#008779] font-bold text-xs">
            <span>% Total Yield สินค้าไก่ทอดต่ำ</span>
          </div>
        </div>

        <!-- 1. Action Items Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UIcon name="i-lucide-zap" class="size-4 text-amber-500" />
            <h2 class="text-sm font-bold text-gray-900">
              Action Items ({{ actionItems.length }} factors)
            </h2>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-2.5 px-4 font-semibold">CAUSE</th>
                  <th class="py-2.5 px-4 font-semibold text-center w-36">DECISION</th>
                  <th class="py-2.5 px-4 font-semibold">PROCESS</th>
                  <th class="py-2.5 px-4 font-semibold w-12 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in actionItems" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3 px-4 font-medium text-gray-800">
                    {{ item.cause }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <UIcon name="i-lucide-zap" class="size-3 text-amber-500" />
                      <span>Action Item</span>
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-600">
                    <input
                      v-model="item.process"
                      type="text"
                      class="w-full bg-transparent border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-700"
                    />
                  </td>
                  <td class="py-3 px-4 text-center">
                    <UIcon name="i-lucide-check" class="size-4 text-emerald-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. Hypothesis: %Giveaway (2 factors) -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UIcon name="i-lucide-flask-conical" class="size-4 text-[#008779]" />
            <h2 class="text-sm font-bold text-gray-900">
              Hypothesis: %Giveaway ({{ hypothesisGiveaway.length }} factors)
            </h2>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-2.5 px-3 font-semibold">CAUSE</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-36">DECISION</th>
                  <th class="py-2.5 px-3 font-semibold">PROCESS</th>
                  <th class="py-2.5 px-3 font-semibold">UNIT OF CAUSE</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE VARIABLE</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE UNIT</th>
                  <th class="py-2.5 px-3 font-semibold text-center">TARGET OF RESPONSE</th>
                  <th class="py-2.5 px-3 font-semibold w-8 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in hypothesisGiveaway" :key="item.id" class="hover:bg-gray-50/50">
                  <td class="py-3 px-3 font-medium text-gray-800">
                    {{ item.cause }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <UIcon name="i-lucide-flask-conical" class="size-3" />
                      <span>Hypothesis Test</span>
                    </NuxtLink>
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.process" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.unit" type="text" class="w-16 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.responseVar" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.responseUnit" type="text" class="w-12 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 text-center" />
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                      <span>↘ Lower is better</span>
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <UIcon name="i-lucide-check" class="size-4 text-emerald-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. Hypothesis: %Yield (1 factor) -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UIcon name="i-lucide-flask-conical" class="size-4 text-[#008779]" />
            <h2 class="text-sm font-bold text-gray-900">
              Hypothesis: %Yield ({{ hypothesisYield.length }} factor)
            </h2>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-2.5 px-3 font-semibold">CAUSE</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-36">DECISION</th>
                  <th class="py-2.5 px-3 font-semibold">PROCESS</th>
                  <th class="py-2.5 px-3 font-semibold">UNIT OF CAUSE</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE VARIABLE</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE UNIT</th>
                  <th class="py-2.5 px-3 font-semibold text-center">TARGET OF RESPONSE</th>
                  <th class="py-2.5 px-3 font-semibold w-8 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in hypothesisYield" :key="item.id" class="hover:bg-gray-50/50">
                  <td class="py-3 px-3 font-medium text-gray-800">
                    {{ item.cause }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <UIcon name="i-lucide-flask-conical" class="size-3" />
                      <span>Hypothesis Test</span>
                    </NuxtLink>
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.process" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.unit" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.responseVar" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.responseUnit" type="text" class="w-12 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 text-center" />
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span>↗ Greater is better</span>
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <UIcon name="i-lucide-check" class="size-4 text-emerald-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. Hypothesis: %การใช้แป้ง (4 factors) -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UIcon name="i-lucide-flask-conical" class="size-4 text-[#008779]" />
            <h2 class="text-sm font-bold text-gray-900">
              Hypothesis: %การใช้แป้ง ({{ hypothesisFlour.length }} factors)
            </h2>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-2.5 px-3 font-semibold">CAUSE</th>
                  <th class="py-2.5 px-3 font-semibold text-center w-36">DECISION</th>
                  <th class="py-2.5 px-3 font-semibold">PROCESS</th>
                  <th class="py-2.5 px-3 font-semibold">UNIT OF CAUSE</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE VARIABLE</th>
                  <th class="py-2.5 px-3 font-semibold">RESPONSE UNIT</th>
                  <th class="py-2.5 px-3 font-semibold text-center">TARGET OF RESPONSE</th>
                  <th class="py-2.5 px-3 font-semibold w-8 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in hypothesisFlour" :key="item.id" class="hover:bg-gray-50/50">
                  <td class="py-3 px-3 font-medium text-gray-800">
                    {{ item.cause }}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <NuxtLink
                      :to="`/admin/projects/${projectId}/analyze/tests/${item.id}`"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <UIcon name="i-lucide-flask-conical" class="size-3" />
                      <span>Hypothesis Test</span>
                    </NuxtLink>
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.process" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.unit" type="text" class="w-16 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.responseVar" type="text" class="w-24 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700" />
                  </td>
                  <td class="py-3 px-3">
                    <input v-model="item.responseUnit" type="text" class="w-12 bg-transparent border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 text-center" />
                  </td>
                  <td class="py-3 px-3 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                      <span>↘ Lower is better</span>
                    </span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <UIcon name="i-lucide-check" class="size-4 text-emerald-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-6 right-24 flex items-center gap-3 z-30">
      <button class="bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-105 cursor-pointer">
        <UIcon name="i-lucide-eye" class="size-4" />
        <span>View</span>
      </button>
    </div>
  </div>
</template>
