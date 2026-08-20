<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const controlPlanItems = ref([
  {
    process: 'Packing',
    factor: 'การsetค่าน้ำหนักเผื่อของเครื่องMultihead',
    standard: '10 กรัม',
    frequency: 'ทุกกะ (Shift)',
    responsible: 'Operator / QA',
    controlMethod: 'Checklist & Scale Verification',
    reactionPlan: 'ปรับตั้งค่าหัวชั่งใหม่ทันทีเมื่อคลาดเคลื่อน'
  },
  {
    process: 'Packing',
    factor: 'จำนวนDropของเครื่องMultihead',
    standard: '1 drop',
    frequency: 'เริ่มกะการผลิต',
    responsible: 'Technician',
    controlMethod: 'PLC Parameter Lock',
    reactionPlan: 'แจ้งหัวหน้าช่างเพื่อตรวจสอบโปรแกรม'
  },
  {
    process: 'Predusting',
    factor: 'ความเร็วรอบเครื่อง DB4',
    standard: '40 Hz',
    frequency: 'ต่อเนื่อง',
    responsible: 'Operator',
    controlMethod: 'Inverter Display Monitor',
    reactionPlan: 'ปรับความถี่ให้อยู่ในย่าน 40 Hz'
  },
  {
    process: 'Predusting',
    factor: 'ความเร็วเครื่องเติมแป้งPredust',
    standard: '2 Hz',
    frequency: 'ต่อเนื่อง',
    responsible: 'Operator',
    controlMethod: 'Feeder Control Panel',
    reactionPlan: 'ตรวจสอบระดับแป้งและปรับความเร็ว'
  },
  {
    process: 'Predusting',
    factor: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
    standard: '1 cm',
    frequency: 'ก่อนเริ่มงาน',
    responsible: 'Leader / QA',
    controlMethod: 'Feeler Gauge Measurement',
    reactionPlan: 'ตั้งระดับแผงกั้นใหม่ให้ได้ 1 cm'
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
      <span class="text-gray-700 font-medium">Control</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Control Plan</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Control"
        active-step="Control Plan"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Control Plan
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Establish standard operating procedures and monitoring controls for optimal settings
              </p>
            </div>
          </div>
          <span class="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Process Control Plan Matrix
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Standardized parameters derived from DOE optimization results
              </p>
            </div>

            <button
              type="button"
              class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
              <span>Export Control Plan</span>
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-3 font-semibold">PROCESS</th>
                  <th class="py-3 px-4 font-semibold">FACTOR</th>
                  <th class="py-3 px-3 font-semibold text-center">BEST SETTING / STD</th>
                  <th class="py-3 px-3 font-semibold">FREQUENCY</th>
                  <th class="py-3 px-3 font-semibold">RESPONSIBLE</th>
                  <th class="py-3 px-4 font-semibold">CONTROL METHOD</th>
                  <th class="py-3 px-4 font-semibold">REACTION PLAN</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in controlPlanItems" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-3">
                    <span class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded">
                      {{ item.process }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-medium text-gray-900">
                    {{ item.factor }}
                  </td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-[#008779] border border-teal-200">
                      {{ item.standard }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-gray-700">
                    {{ item.frequency }}
                  </td>
                  <td class="py-3.5 px-3 font-medium text-gray-800">
                    {{ item.responsible }}
                  </td>
                  <td class="py-3.5 px-4 text-gray-600">
                    {{ item.controlMethod }}
                  </td>
                  <td class="py-3.5 px-4 text-amber-800 text-[11px]">
                    {{ item.reactionPlan }}
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
        <UIcon name="i-lucide-edit" class="size-4" />
        <span>Edit</span>
      </button>
    </div>
  </div>
</template>
