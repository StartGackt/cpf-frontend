<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const actionItems = ref([
  {
    id: 'ACT-01',
    factor: 'การ set ค่าน้ำหนักเผื่อของเครื่อง Multihead',
    beforeCondition: 'ตั้งค่าน้ำหนักเผื่อ 15g (Giveaway 4.25%)',
    afterCondition: 'ปรับตั้งค่ามาตรฐานใหม่เป็น 10g พร้อมล็อก PLC Code (Giveaway 2.20%)',
    responsible: 'Romteera Tadderm (BB) / Line Leader',
    targetDate: '15/02/2026',
    status: 'Implemented & Standardized',
    savingsImpact: '2,800,000 THB / Year'
  },
  {
    id: 'ACT-02',
    factor: 'จำนวน Drop ของเครื่อง Multihead',
    beforeCondition: 'ปล่อยอิสระ 1-3 drops ตามเซ็นเซอร์สวิง',
    afterCondition: 'ติดตั้งโปรแกรมบังคับ 1 drop คงที่ และทำความสะอาดหัวพ่นลมทุกกะ',
    responsible: 'Somchai Maintenance / Production',
    targetDate: '18/02/2026',
    status: 'Implemented & Standardized',
    savingsImpact: '1,450,000 THB / Year'
  },
  {
    id: 'ACT-03',
    factor: 'ความเร็วเครื่องเติมแป้ง Predust',
    beforeCondition: 'ความเร็วไม่สม่ำเสมอ (30 - 50 Hz)',
    afterCondition: 'ล็อกความเร็ว Inverter ที่ 40 Hz คงที่',
    responsible: 'QC Supervisor',
    targetDate: '20/02/2026',
    status: 'Implemented & Standardized',
    savingsImpact: 'Yield Stability Gain'
  }
])

const isAddModalOpen = ref(false)
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
      <span class="text-gray-700 font-medium">Improve</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Action (Before vs After)</span>
    </div>

    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="Action"
      />

      <div class="flex-1 min-w-0 space-y-4">
        <!-- Main Actions Container -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h1 class="text-base font-bold text-gray-900">
                Improvement Action Plans (Before vs After Comparison)
              </h1>
              <p class="text-xs text-gray-500 mt-0.5">
                Standardizes root cause countermeasures and quantifies financial yield impact
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              @click="isAddModalOpen = true"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>+ Add Improvement Action</span>
            </button>
          </div>

          <!-- Actions Table with Before/After Columns -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold">
                  <th class="py-3 px-3 text-center">ID</th>
                  <th class="py-3 px-4">ROOT CAUSE FACTOR</th>
                  <th class="py-3 px-4 text-red-700">สภาพก่อนปรับปรุง (BEFORE)</th>
                  <th class="py-3 px-4 text-emerald-700">สภาพหลังปรับปรุง (AFTER)</th>
                  <th class="py-3 px-3">RESPONSIBLE</th>
                  <th class="py-3 px-3 text-center">SAVINGS IMPACT</th>
                  <th class="py-3 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="act in actionItems" :key="act.id" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-gray-900">{{ act.id }}</td>
                  <td class="py-3.5 px-4 font-bold text-gray-900">{{ act.factor }}</td>
                  <td class="py-3.5 px-4 text-gray-700 bg-red-50/20 text-[11px]">{{ act.beforeCondition }}</td>
                  <td class="py-3.5 px-4 font-medium text-emerald-900 bg-emerald-50/20 text-[11px]">{{ act.afterCondition }}</td>
                  <td class="py-3.5 px-3 text-gray-700">{{ act.responsible }}</td>
                  <td class="py-3.5 px-3 text-center font-bold text-[#008779] font-mono">{{ act.savingsImpact }}</td>
                  <td class="py-3.5 px-3 text-center">
                    <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {{ act.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
