<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedBusiness = ref('All')
const selectedBelt = ref('All')
const selectedCategory = ref('All')

const kmProjects = ref([
  {
    id: 'PFR-CPF-2026-088',
    projectId: 'example-total-yield',
    title: 'เพิ่ม %Total Yield สินค้าไก่ทอดแช่แข็ง',
    business: 'Food Business',
    businessUnit: 'Processing Plant Chokchai',
    belt: 'Black Belt',
    author: 'Romteera Tadderm',
    category: 'Yield & Giveaway Reduction',
    closedDate: '24/02/2026',
    verifiedSavings: '4,250,000 THB / Year',
    yieldGain: '+3.95%',
    accessLevel: 'CPF Corporate Internal',
    tags: ['Six Sigma', 'DOE', 'Giveaway', 'Multihead', 'Yield']
  },
  {
    id: 'PFR-CPF-2025-042',
    projectId: 'feed-energy-reduction',
    title: 'ลดการใช้พลังงานไฟฟ้าในกระบวนการอัดเม็ดอาหารสัตว์',
    business: 'Feed Business',
    businessUnit: 'Feed Mill Saraburi',
    belt: 'Green Belt',
    author: 'Anan Petcharat',
    category: 'Energy & Utility Optimization',
    closedDate: '15/11/2025',
    verifiedSavings: '2,800,000 THB / Year',
    yieldGain: '-12.4% kWh/Ton',
    accessLevel: 'CPF Corporate Internal',
    tags: ['Energy', 'Pelleting', 'Green Belt', 'Regression']
  },
  {
    id: 'PFR-CPF-2025-019',
    projectId: 'farm-fcr-improvement',
    title: 'ปรับปรุงค่า FCR ไก่เนื้อฟาร์มปิดระบบ Evap',
    business: 'Farm Business',
    businessUnit: 'Broiler Farm Korat',
    belt: 'Black Belt',
    author: 'Kitti Somwong',
    category: 'FCR & Biological Performance',
    closedDate: '30/08/2025',
    verifiedSavings: '5,600,000 THB / Year',
    yieldGain: '-0.04 FCR',
    accessLevel: 'Restricted (Farm HQ)',
    tags: ['FCR', 'Broiler', 'Evap', 'ANOVA', 'Black Belt']
  },
  {
    id: 'PFR-CPF-2024-091',
    projectId: 'shrimp-survival-rate',
    title: 'ยกระดับอัตรารอดลูกกุ้งขาวแวนนาไมในบ่ออนุบาล',
    business: 'Aquaculture',
    businessUnit: 'Hatchery Trat',
    belt: 'Green Belt',
    author: 'Sunisa Kaewmanee',
    category: 'Survival & Mortality Reduction',
    closedDate: '12/12/2024',
    verifiedSavings: '1,950,000 THB / Year',
    yieldGain: '+8.2% Survival',
    accessLevel: 'CPF Corporate Internal',
    tags: ['Aquaculture', 'Shrimp', 'Water Quality']
  }
])

const filteredProjects = computed(() => {
  return kmProjects.value.filter(p => {
    const matchesSearch = searchQuery.value === '' ||
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesBusiness = selectedBusiness.value === 'All' || p.business === selectedBusiness.value
    const matchesBelt = selectedBelt.value === 'All' || p.belt === selectedBelt.value
    const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value

    return matchesSearch && matchesBusiness && matchesBelt && matchesCategory
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-gray-500 -mt-2">
      <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
        <UIcon name="i-lucide-home" class="size-3.5" />
        <span>Home</span>
      </NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-bold">GenieWisdom: KM Repository</span>
    </div>

    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-teal-900 via-[#008779] to-teal-800 rounded-xl text-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-book-open" class="size-6 text-amber-300" />
          <h1 class="text-xl font-bold tracking-tight">
            GenieWisdom: Six Sigma KM Repository
          </h1>
        </div>
        <p class="text-xs text-teal-100 max-w-2xl leading-relaxed">
          Central enterprise repository for completed Lean Six Sigma projects, Project Final Reports (PFR), and best practice knowledge transfer across CPF businesses.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-center">
          <span class="text-[10px] text-teal-200 uppercase font-bold block">ARCHIVED PROJECTS</span>
          <span class="text-xl font-mono font-bold text-white">{{ kmProjects.length }}</span>
        </div>
        <div class="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-center">
          <span class="text-[10px] text-teal-200 uppercase font-bold block">TOTAL CUMULATIVE VALUE</span>
          <span class="text-xl font-mono font-bold text-amber-300">14.6M ฿</span>
        </div>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white rounded-xl border border-gray-200/80 shadow-xs p-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <!-- Search -->
        <div class="relative">
          <UIcon name="i-lucide-search" class="size-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search title, author, keyword, or PFR ID..."
            class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779] focus:bg-white"
          />
        </div>

        <!-- Business Filter -->
        <div>
          <select
            v-model="selectedBusiness"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
          >
            <option value="All">All Businesses</option>
            <option value="Food Business">Food Business</option>
            <option value="Feed Business">Feed Business</option>
            <option value="Farm Business">Farm Business</option>
            <option value="Aquaculture">Aquaculture</option>
          </select>
        </div>

        <!-- Belt Filter -->
        <div>
          <select
            v-model="selectedBelt"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
          >
            <option value="All">All Belts</option>
            <option value="Black Belt">Black Belt</option>
            <option value="Green Belt">Green Belt</option>
            <option value="Yellow Belt">Yellow Belt</option>
          </select>
        </div>

        <!-- Problem Category Filter -->
        <div>
          <select
            v-model="selectedCategory"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
          >
            <option value="All">All Problem Categories</option>
            <option value="Yield & Giveaway Reduction">Yield & Giveaway Reduction</option>
            <option value="Energy & Utility Optimization">Energy & Utility Optimization</option>
            <option value="FCR & Biological Performance">FCR & Biological Performance</option>
            <option value="Survival & Mortality Reduction">Survival & Mortality Reduction</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Project Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="p in filteredProjects"
        :key="p.id"
        class="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-2.5">
          <!-- Top Tag Bar -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="bg-gray-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                {{ p.id }}
              </span>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                :class="p.belt === 'Black Belt' ? 'bg-black text-white' : 'bg-emerald-100 text-emerald-800'"
              >
                {{ p.belt }}
              </span>
            </div>
            <span class="text-[10px] text-gray-400 font-mono">Closed: {{ p.closedDate }}</span>
          </div>

          <!-- Title -->
          <h2 class="text-sm font-bold text-gray-900 leading-snug">
            {{ p.title }}
          </h2>

          <div class="text-[11px] text-gray-500 space-y-0.5">
            <p><strong class="text-gray-700">Business Unit:</strong> {{ p.business }} › {{ p.businessUnit }}</p>
            <p><strong class="text-gray-700">Project Leader:</strong> {{ p.author }}</p>
          </div>

          <!-- Highlight Metrics Pill Box -->
          <div class="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-lg text-xs font-mono">
            <div>
              <span class="text-[10px] text-gray-500 uppercase block font-sans">IMPROVEMENT GAIN</span>
              <span class="font-bold text-emerald-700">{{ p.yieldGain }}</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-500 uppercase block font-sans">ANNUAL SAVINGS</span>
              <span class="font-bold text-[#008779]">{{ p.verifiedSavings }}</span>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex items-center gap-1 flex-wrap pt-1">
            <span
              v-for="tag in p.tags"
              :key="tag"
              class="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Actions Toolbar -->
        <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span class="text-[10px] text-gray-400 flex items-center gap-1">
            <UIcon name="i-lucide-lock" class="size-3" />
            <span>{{ p.accessLevel }}</span>
          </span>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/admin/projects/${p.projectId}/presentation`"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <UIcon name="i-lucide-presentation" class="size-3.5" />
              <span>Slides</span>
            </NuxtLink>

            <NuxtLink
              :to="`/admin/projects/${p.projectId}/report`"
              class="bg-[#008779] hover:bg-[#007366] text-white px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <UIcon name="i-lucide-download" class="size-3.5" />
              <span>View PFR</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
