<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'org' | 'types' | 'units'>('org')

// Modals
const isAddModalOpen = ref(false)
const modalType = ref<'business' | 'bu' | 'location' | 'projectType'>('location')
const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'business': return 'Add Business Group'
    case 'bu': return 'Add Business Unit'
    case 'location': return 'Add Plant / Location'
    case 'projectType': return 'Add Project Type'
  }
})

// Organization Tree Data (Business -> BU -> Location)
const organizationData = ref([
  {
    id: 'food',
    name: 'Food Business',
    code: 'FOOD',
    expanded: true,
    bus: [
      {
        id: 'chicken',
        name: 'Chicken Processing',
        code: 'CHK',
        expanded: true,
        locations: [
          { id: 'loc-1', name: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)', code: 'CK-PLT-01', projects: 8, status: 'Active' },
          { id: 'loc-2', name: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)', code: 'CK-PLT-02', projects: 4, status: 'Active' },
          { id: 'loc-3', name: 'โรงงานแปรรูปสระบุรี', code: 'CK-PLT-03', projects: 4, status: 'Active' },
          { id: 'loc-4', name: 'โรงงานแปรรูปมีนบุรี', code: 'CK-PLT-04', projects: 2, status: 'Active' }
        ]
      },
      {
        id: 'swine',
        name: 'Swine Processing',
        code: 'SWN',
        expanded: false,
        locations: [
          { id: 'loc-5', name: 'โรงงานแปรรูปเนื้อสุกร บางคล้า', code: 'SW-PLT-01', projects: 5, status: 'Active' },
          { id: 'loc-6', name: 'โรงงานแปรรูปเนื้อสุกร สงขลา', code: 'SW-PLT-02', projects: 3, status: 'Active' }
        ]
      },
      {
        id: 'rte',
        name: 'Ready-to-Eat Food Division',
        code: 'RTE',
        expanded: false,
        locations: [
          { id: 'loc-7', name: 'โรงงานอาหารสำเร็จรูป หนองจอก', code: 'RTE-PLT-01', projects: 4, status: 'Active' },
          { id: 'loc-8', name: 'โรงงานอาหารสำเร็จรูป มหาชัย', code: 'RTE-PLT-02', projects: 2, status: 'Active' }
        ]
      }
    ]
  },
  {
    id: 'feed',
    name: 'Feed Business',
    code: 'FEED',
    expanded: false,
    bus: [
      {
        id: 'livestock-feed',
        name: 'Livestock Feed Division',
        code: 'LSF',
        expanded: false,
        locations: [
          { id: 'loc-9', name: 'โรงงานอาหารสัตว์บก บางนา', code: 'FD-PLT-01', projects: 3, status: 'Active' },
          { id: 'loc-10', name: 'โรงงานอาหารสัตว์บก ขอนแก่น', code: 'FD-PLT-02', projects: 2, status: 'Active' }
        ]
      },
      {
        id: 'aqua-feed',
        name: 'Aqua Feed Division',
        code: 'AQF',
        expanded: false,
        locations: [
          { id: 'loc-11', name: 'โรงงานอาหารสัตว์น้ำ สมุทรสาคร', code: 'AQ-PLT-01', projects: 2, status: 'Active' }
        ]
      }
    ]
  },
  {
    id: 'farm',
    name: 'Farm Business',
    code: 'FARM',
    expanded: false,
    bus: [
      {
        id: 'broiler-farm',
        name: 'Broiler Commercial Farm',
        code: 'BRF',
        expanded: false,
        locations: [
          { id: 'loc-12', name: 'ฟาร์มไก่เนื้อ สระบุรี คอมเพล็กซ์', code: 'FM-PLT-01', projects: 3, status: 'Active' }
        ]
      }
    ]
  }
])

// Project Types Master Data
const projectTypes = ref([
  {
    id: 'bb',
    name: 'Black Belt (BB)',
    code: 'BB-DMAIC',
    minDuration: '4 - 6 Months',
    targetSavings: '≥ 2,000,000 THB',
    requiredRole: 'Certified Black Belt',
    status: 'Active',
    description: 'High-impact enterprise DMAIC projects solving complex cross-functional root causes.'
  },
  {
    id: 'gb',
    name: 'Green Belt (GB)',
    code: 'GB-DMAIC',
    minDuration: '3 - 4 Months',
    targetSavings: '≥ 500,000 THB',
    requiredRole: 'Certified Green Belt',
    status: 'Active',
    description: 'Plant-level operational variance reduction and yield optimization projects.'
  },
  {
    id: 'yb',
    name: 'Yellow Belt (YB)',
    code: 'YB-DMAIC',
    minDuration: '1 - 2 Months',
    targetSavings: '≥ 100,000 THB',
    requiredRole: 'Yellow Belt / Supervisor',
    status: 'Active',
    description: 'Focused line-level problem solving using 7 QC tools and standard work.'
  },
  {
    id: 'kaizen',
    name: 'Kaizen / Quick Win',
    code: 'KZ-QW',
    minDuration: '≤ 1 Month',
    targetSavings: 'Immediate Improvement',
    requiredRole: 'Any',
    status: 'Active',
    description: 'Continuous daily improvement and fast-track standard adjustments.'
  }
])

// Units & Problem Categories Master Data
const measurementUnits = ref([
  { id: 'u1', name: 'Percentage (%)', symbol: '%', type: 'Ratio', status: 'Active' },
  { id: 'u2', name: 'Kilograms (kg)', symbol: 'kg', type: 'Weight', status: 'Active' },
  { id: 'u3', name: 'Grams (g)', symbol: 'g', type: 'Weight', status: 'Active' },
  { id: 'u4', name: 'Millimeters (mm)', symbol: 'mm', type: 'Dimension', status: 'Active' },
  { id: 'u5', name: 'Seconds (s)', symbol: 's', type: 'Time', status: 'Active' },
  { id: 'u6', name: 'Hertz (Hz)', symbol: 'Hz', type: 'Frequency', status: 'Active' },
  { id: 'u7', name: 'Baht per Ton (THB/ton)', symbol: 'THB/ton', type: 'Financial', status: 'Active' }
])

const problemCategories = ref([
  { id: 'c1', name: 'Quality (Yield & Defect)', code: 'QUAL', focus: '%Total Yield, Scrap Rate, Defect PPM' },
  { id: 'c2', name: 'Cost (Waste & Material)', code: 'COST', focus: '%Giveaway, Flour Usage, Energy Consumption' },
  { id: 'c3', name: 'Speed (Cycle Time & OEE)', code: 'SPD', focus: 'Bottleneck Throughput, Changeover Time' },
  { id: 'c4', name: 'Delivery (OTIF)', code: 'DLV', focus: 'On-Time In-Full Order Fulfillment' }
])

const openAddModal = (type: 'business' | 'bu' | 'location' | 'projectType') => {
  modalType.value = type
  isAddModalOpen.value = true
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- ========================================================= -->
    <!-- HERO HEADER: Master Data Management -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <!-- Ambient Glow in Background -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-database" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Master Data & Enterprise Standards
            </h1>
            <span class="text-xs text-teal-200">Organization Hierarchy (Business › BU › Plant), Project Types, and Metric Units</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          กำหนดโครงสร้างองค์กร 3 ระดับ, เกณฑ์การประเมิน Belt Level, และหน่วยวัดสถิติที่ใช้เป็นมาตรฐานเดียวกันทั่วทั้งระบบ
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap relative z-10 shrink-0">
        <button
          type="button"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          @click="openAddModal('business')"
        >
          <UIcon name="i-lucide-plus" class="size-4 text-emerald-300" />
          <span>+ Business</span>
        </button>

        <button
          type="button"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          @click="openAddModal('bu')"
        >
          <UIcon name="i-lucide-plus" class="size-4 text-teal-300" />
          <span>+ Business Unit</span>
        </button>

        <button
          type="button"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
          @click="openAddModal('location')"
        >
          <UIcon name="i-lucide-map-pin" class="size-4 text-[#008779]" />
          <span>+ Plant Location</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- NAVIGATION TABS (Pill Style) -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-2 flex items-center gap-1.5 flex-wrap text-xs">
      <button
        type="button"
        class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'org' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="activeTab = 'org'"
      >
        <UIcon name="i-lucide-network" class="size-4" />
        <span>Organization Hierarchy (Business › BU › Location)</span>
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'types' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="activeTab = 'types'"
      >
        <UIcon name="i-lucide-award" class="size-4" />
        <span>Project Types (Belt Levels)</span>
      </button>

      <button
        type="button"
        class="px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'units' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
        @click="activeTab = 'units'"
      >
        <UIcon name="i-lucide-ruler" class="size-4" />
        <span>Units & Problem Categories</span>
      </button>
    </div>

    <!-- TAB 1: Organization Hierarchy Tree -->
    <div v-if="activeTab === 'org'" class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-building-2" class="size-4 text-[#008779]" />
              <span>CPF Organization Structure Tree</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              3-level hierarchy used across all DMAIC filters and project assignments
            </p>
          </div>
          <span class="text-xs text-[#008779] font-bold bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            3 Businesses • 7 Business Units • 12 Locations
          </span>
        </div>

        <!-- Tree Nodes -->
        <div class="space-y-3">
          <div
            v-for="biz in organizationData"
            :key="biz.id"
            class="border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-2xs"
          >
            <!-- Business Level (Level 1) -->
            <div
              class="bg-slate-50/90 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              @click="biz.expanded = !biz.expanded"
            >
              <div class="flex items-center gap-2.5">
                <UIcon
                  :name="biz.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                  class="size-4 text-slate-400"
                />
                <UIcon name="i-lucide-building-2" class="size-4 text-[#008779]" />
                <span class="text-sm font-bold text-slate-900">{{ biz.name }}</span>
                <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                  {{ biz.code }}
                </span>
              </div>

              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span class="font-medium">{{ biz.bus.length }} Business Units</span>
                <button
                  type="button"
                  class="text-[#008779] hover:underline font-bold text-xs flex items-center gap-0.5"
                  @click.stop="openAddModal('bu')"
                >
                  <UIcon name="i-lucide-plus" class="size-3" />
                  <span>Add BU</span>
                </button>
              </div>
            </div>

            <!-- Business Units (Level 2) -->
            <div v-if="biz.expanded" class="p-3.5 pl-8 space-y-3 bg-white border-t border-slate-100">
              <div
                v-for="bu in biz.bus"
                :key="bu.id"
                class="border border-slate-100 rounded-xl overflow-hidden"
              >
                <!-- BU Header -->
                <div
                  class="bg-teal-50/40 p-3 flex items-center justify-between cursor-pointer hover:bg-teal-50/70 transition-colors"
                  @click="bu.expanded = !bu.expanded"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      :name="bu.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                      class="size-3.5 text-slate-400"
                    />
                    <UIcon name="i-lucide-folder-tree" class="size-3.5 text-teal-600" />
                    <span class="text-xs font-bold text-slate-800">{{ bu.name }}</span>
                    <span class="text-[10px] text-slate-500 font-mono">({{ bu.code }})</span>
                  </div>

                  <div class="flex items-center gap-3 text-xs text-slate-500">
                    <span>{{ bu.locations.length }} Plants</span>
                    <button
                      type="button"
                      class="text-[#008779] hover:underline font-bold text-[11px] flex items-center gap-0.5"
                      @click.stop="openAddModal('location')"
                    >
                      <UIcon name="i-lucide-plus" class="size-3" />
                      <span>Add Plant</span>
                    </button>
                  </div>
                </div>

                <!-- Locations / Plants (Level 3) -->
                <div v-if="bu.expanded" class="p-2.5 pl-6 space-y-1.5 bg-slate-50/30">
                  <div
                    v-for="loc in bu.locations"
                    :key="loc.id"
                    class="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs hover:border-teal-200 transition-colors shadow-2xs"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-map-pin" class="size-3.5 text-teal-600" />
                      <span class="font-bold text-slate-900">{{ loc.name }}</span>
                      <span class="text-[10px] text-slate-400 font-mono">[{{ loc.code }}]</span>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="text-[11px] text-slate-600 font-mono font-medium">
                        {{ loc.projects }} active projects
                      </span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {{ loc.status }}
                      </span>
                      <button type="button" class="text-slate-400 hover:text-slate-700 p-1">
                        <UIcon name="i-lucide-edit-2" class="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Project Types (Belt Levels) -->
    <div v-if="activeTab === 'types'" class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-lucide-award" class="size-4 text-purple-600" />
              <span>DMAIC Project Types & Methodology Standards</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Criteria, minimum duration, financial threshold, and role qualifications
            </p>
          </div>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
            @click="openAddModal('projectType')"
          >
            <UIcon name="i-lucide-plus" class="size-3.5" />
            <span>Add Project Type</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th class="py-3.5 px-4 font-semibold">PROJECT TYPE</th>
                <th class="py-3.5 px-4 font-semibold">CODE</th>
                <th class="py-3.5 px-3 font-semibold text-center">MIN DURATION</th>
                <th class="py-3.5 px-4 font-semibold">SAVINGS / IMPACT THRESHOLD</th>
                <th class="py-3.5 px-4 font-semibold">REQUIRED QUALIFICATION</th>
                <th class="py-3.5 px-3 font-semibold text-center">STATUS</th>
                <th class="py-3.5 px-4 font-semibold text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="pt in projectTypes" :key="pt.id" class="hover:bg-slate-50/70">
                <td class="py-4 px-4 font-bold text-slate-900">
                  {{ pt.name }}
                  <span class="block text-[11px] text-slate-500 font-normal mt-0.5">{{ pt.description }}</span>
                </td>
                <td class="py-4 px-4 font-mono text-slate-700 font-bold">{{ pt.code }}</td>
                <td class="py-4 px-3 text-center text-slate-800 font-medium">{{ pt.minDuration }}</td>
                <td class="py-4 px-4 font-bold text-[#008779] font-mono">{{ pt.targetSavings }}</td>
                <td class="py-4 px-4">
                  <span class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {{ pt.requiredRole }}
                  </span>
                </td>
                <td class="py-4 px-3 text-center">
                  <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {{ pt.status }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center">
                  <button type="button" class="text-slate-400 hover:text-slate-700 p-1">
                    <UIcon name="i-lucide-edit-2" class="size-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: Units & Categories -->
    <div v-if="activeTab === 'units'" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Measurement Units -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">Measurement Units</h3>
          <button type="button" class="text-[#008779] hover:underline font-bold text-xs flex items-center gap-1">
            <UIcon name="i-lucide-plus" class="size-3.5" />
            <span>Add Unit</span>
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                <th class="py-3 px-4">NAME</th>
                <th class="py-3 px-3 text-center">SYMBOL</th>
                <th class="py-3 px-3">TYPE</th>
                <th class="py-3 px-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="unit in measurementUnits" :key="unit.id" class="hover:bg-slate-50/70">
                <td class="py-3 px-4 font-bold text-slate-900">{{ unit.name }}</td>
                <td class="py-3 px-3 text-center font-mono font-bold text-[#008779]">{{ unit.symbol }}</td>
                <td class="py-3 px-3 text-slate-600">{{ unit.type }}</td>
                <td class="py-3 px-3 text-center">
                  <span class="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {{ unit.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Problem Categories -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">Problem Categories</h3>
          <button type="button" class="text-[#008779] hover:underline font-bold text-xs flex items-center gap-1">
            <UIcon name="i-lucide-plus" class="size-3.5" />
            <span>Add Category</span>
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                <th class="py-3 px-4">CATEGORY</th>
                <th class="py-3 px-3 font-mono">CODE</th>
                <th class="py-3 px-4">COMMON KPI TARGETS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="cat in problemCategories" :key="cat.id" class="hover:bg-slate-50/70">
                <td class="py-3 px-4 font-bold text-slate-900">{{ cat.name }}</td>
                <td class="py-3 px-3 font-mono text-slate-600 font-bold">{{ cat.code }}</td>
                <td class="py-3 px-4 text-slate-600 text-[11px]">{{ cat.focus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ADD MASTER DATA MODAL -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900">{{ modalTitle }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg" @click="isAddModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Name *</label>
            <input
              type="text"
              placeholder="Enter name"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779] focus:bg-white"
            />
          </div>

          <div class="space-y-1">
            <label class="font-semibold text-slate-700 block">Code *</label>
            <input
              type="text"
              placeholder="e.g. CK-PLT-05"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#008779] focus:bg-white"
            />
          </div>

          <div v-if="modalType === 'location'" class="space-y-1">
            <label class="font-semibold text-slate-700 block">Parent Business Unit *</label>
            <select class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#008779]">
              <option value="chicken">Chicken Processing</option>
              <option value="swine">Swine Processing</option>
              <option value="rte">Ready-to-Eat Food Division</option>
            </select>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            @click="isAddModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
            @click="isAddModalOpen = false"
          >
            Save
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
