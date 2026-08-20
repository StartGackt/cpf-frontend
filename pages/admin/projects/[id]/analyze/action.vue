<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const actionRows = ref([
  {
    category: 'Method',
    causeText: 'วางแผนการผลิตไม่ต่อเนื่อง',
    rpn: 490,
    problemDesc: 'Current Problem for: วางแผนการผลิตไม่ต่อเนื่อง'
  },
  {
    category: 'Material',
    causeText: 'เศษชิ้นเล็ก',
    rpn: 280,
    problemDesc: 'Current Problem for: เศษชิ้นเล็ก'
  },
  {
    category: 'Method',
    causeText: 'อุณหภูมิสินค้าหลังสุก',
    rpn: 64,
    problemDesc: 'Current Problem for: อุณหภูมิสินค้าหลังสุก'
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
      <span class="text-gray-900 font-bold">Action</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Analyze"
        active-step="Action"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Collapsible Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Action
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Current Problem Description
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Action
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Current Problem Description
              </p>
            </div>
            <span class="text-xs text-gray-400 flex items-center gap-1">
              <UIcon name="i-lucide-check" class="size-3 text-emerald-500" />
              <span>Auto-save ready</span>
            </span>
          </div>

          <!-- Product Tag Tab -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50/70 border-b-2 border-[#008779] text-[#008779] font-bold text-xs">
              <span>% Total Yield สินค้าไก่ทอด</span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th class="py-3 px-4 font-semibold w-36">CATEGORY</th>
                  <th class="py-3 px-6 font-semibold w-72">CAUSE TEXT</th>
                  <th class="py-3 px-4 font-semibold w-24">RPN</th>
                  <th class="py-3 px-6 font-semibold">CURRENT PROBLEM DESCRIPTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(item, idx) in actionRows" :key="idx" class="hover:bg-gray-50/50">
                  <td class="py-3.5 px-4 font-medium text-gray-700">
                    {{ item.category }}
                  </td>
                  <td class="py-3.5 px-6 font-medium text-gray-900">
                    {{ item.causeText }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="font-bold text-gray-900 font-mono">{{ item.rpn }}</span>
                  </td>
                  <td class="py-3.5 px-6">
                    <input
                      v-model="item.problemDesc"
                      type="text"
                      class="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#008779]"
                    />
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
