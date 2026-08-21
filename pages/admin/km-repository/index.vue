<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedBusiness = ref('All')
const selectedBelt = ref('All')
const selectedCategory = ref('All')
const selectedSort = ref('savings')

// Knowledge Repository Projects (Connected to Chatbot Grounding Store)
interface KmRecord {
  id: string
  projectId: string
  title: string
  business: string
  businessUnit: string
  belt: string
  author: string
  category: string
  closedDate: string
  verifiedSavings: string
  savingsAmount: number
  yieldGain: string
  accessLevel: string
  tags: string[]
  aiSummary: string
  vitalFewFactors: string[]
  keyTool: string
  vectorChunks: number
}

const kmProjects = ref<KmRecord[]>([
  {
    id: 'PFR-CPF-2026-088',
    projectId: 'example-total-yield',
    title: 'เพิ่ม %Total Yield สินค้าไก่ทอดแช่แข็ง และลด Giveaway น้ำหนักเกิน',
    business: 'Food Business',
    businessUnit: 'Processing Plant Chokchai (Line 2)',
    belt: 'Black Belt',
    author: 'Romteera Tadderm',
    category: 'Yield & Giveaway Reduction',
    closedDate: '24/02/2026',
    verifiedSavings: '4,250,000 THB / Year',
    savingsAmount: 4250000,
    yieldGain: '+3.95%',
    accessLevel: 'CPF Corporate Internal',
    tags: ['Six Sigma', 'DOE 2^3', 'Giveaway', 'Multihead Weigher', 'Yield', 'ANOVA'],
    aiSummary: 'ปรับลดน้ำหนักเผื่อใน Multihead Weigher จาก 18g เป็น 15g และล็อกความเร็ว Predust 40Hz ด้วย Full Factorial 2^3 DOE',
    vitalFewFactors: ['Multihead Target Weight', 'Predust Belt Speed (40Hz)', 'Batter Viscosity (30s)'],
    keyTool: 'DOE 2^3 & One-Way ANOVA',
    vectorChunks: 24
  },
  {
    id: 'PFR-CPF-2025-042',
    projectId: 'feed-energy-reduction',
    title: 'ลดการใช้พลังงานไฟฟ้าในกระบวนการอัดเม็ดอาหารสัตว์ (Pelleting Mill)',
    business: 'Feed Business',
    businessUnit: 'Feed Mill Saraburi (Plant 1)',
    belt: 'Green Belt',
    author: 'Anan Petcharat',
    category: 'Energy & Utility Optimization',
    closedDate: '15/11/2025',
    verifiedSavings: '2,800,000 THB / Year',
    savingsAmount: 2800000,
    yieldGain: '-12.4% kWh/Ton',
    accessLevel: 'CPF Corporate Internal',
    tags: ['Energy', 'Pelleting', 'Regression', 'Steam Conditioning'],
    aiSummary: 'ปรับสมดุลแรงดันไอน้ำ Conditioner 2.2 Bar และเปลี่ยน Die Spec เพิ่มประสิทธิภาพการอัดเม็ดลดโหลดมอเตอร์ 75kW',
    vitalFewFactors: ['Steam Pressure (2.2 Bar)', 'Conditioner Retention Time (45s)'],
    keyTool: 'Multiple Linear Regression',
    vectorChunks: 18
  },
  {
    id: 'PFR-CPF-2025-019',
    projectId: 'farm-fcr-improvement',
    title: 'ปรับปรุงค่า FCR ไก่เนื้อฟาร์มปิดระบบ Evaporative Cooling',
    business: 'Farm Business',
    businessUnit: 'Broiler Farm Korat (Zone A)',
    belt: 'Black Belt',
    author: 'Kitti Somwong',
    category: 'FCR & Biological Performance',
    closedDate: '30/08/2025',
    verifiedSavings: '5,600,000 THB / Year',
    savingsAmount: 5600000,
    yieldGain: '-0.04 FCR',
    accessLevel: 'Restricted (Farm HQ)',
    tags: ['FCR', 'Broiler', 'Evap', 'ANOVA', 'Black Belt', 'Air Velocity'],
    aiSummary: 'ควบคุมความเร็วลมกึ่งกลางโรงเรือน 2.5 m/s และปรับโปรแกรมแสงสว่างลดความเครียดช่วงสัปดาห์ที่ 4–5',
    vitalFewFactors: ['Tunnel Air Speed (2.5 m/s)', 'Lighting Intermittent Program'],
    keyTool: 'ANOVA & 2-Sample T Test',
    vectorChunks: 32
  },
  {
    id: 'PFR-CPF-2024-091',
    projectId: 'shrimp-survival-rate',
    title: 'ยกระดับอัตรารอดลูกกุ้งขาวแวนนาไมในบ่ออนุบาลด้วยระบบจุลินทรีย์โปรไบโอติก',
    business: 'Aquaculture',
    businessUnit: 'Hatchery Trat (Nursery Unit)',
    belt: 'Green Belt',
    author: 'Sunisa Kaewmanee',
    category: 'Survival & Mortality Reduction',
    closedDate: '12/12/2024',
    verifiedSavings: '1,950,000 THB / Year',
    savingsAmount: 1950000,
    yieldGain: '+8.2% Survival',
    accessLevel: 'CPF Corporate Internal',
    tags: ['Aquaculture', 'Shrimp', 'Water Quality', 'Probiotics'],
    aiSummary: 'ควบคุมค่า pH ในช่วง 7.8–8.1 และเติมจุลินทรีย์กลุ่ม Bacillus ทุก 48 ชั่วโมงเพื่อลดแอมโมเนียในน้ำอนุบาล',
    vitalFewFactors: ['Alkalinity Control (>120 ppm)', 'Bacillus Dosing Schedule'],
    keyTool: 'Process Capability & I-MR Chart',
    vectorChunks: 16
  }
])

// Filter & Search Logic
const filteredProjects = computed(() => {
  let list = kmProjects.value.filter(p => {
    const matchesSearch = searchQuery.value === '' ||
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.aiSummary.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesBusiness = selectedBusiness.value === 'All' || p.business === selectedBusiness.value
    const matchesBelt = selectedBelt.value === 'All' || p.belt === selectedBelt.value
    const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value

    return matchesSearch && matchesBusiness && matchesBelt && matchesCategory
  })

  if (selectedSort.value === 'savings') {
    list.sort((a, b) => b.savingsAmount - a.savingsAmount)
  } else if (selectedSort.value === 'recent') {
    list.reverse()
  }

  return list
})

// Selected Project for Quick Drawer Details
const selectedRecord = ref<KmRecord | null>(null)
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <div class="flex items-center justify-between text-xs text-slate-500 -mt-2">
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
          <UIcon name="i-lucide-home" class="size-3.5" />
          <span>Home</span>
        </NuxtLink>
        <span>›</span>
        <span class="text-slate-900 font-bold">GenieWisdom: KM Repository</span>
      </div>

      <!-- Live AI Grounding Sync Status Indicator -->
      <div class="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] font-medium shadow-2xs">
        <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>AI Vector Grounding: <strong>100% Synced</strong> with Genie 2.5 Pro</span>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- HERO HEADER: Knowledge Grounding Hub for Chatbot -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-2xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <!-- Ambient Sparkle Glow in Background -->
      <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-book-open-check" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight">
              GenieWisdom: Six Sigma KM Repository
            </h1>
            <span class="text-xs text-teal-200">CPF Enterprise Knowledge Base & AI Grounding Store</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          คลังความรู้มาตรฐาน Lean Six Sigma และรายงาน Project Final Report (PFR) ที่ผ่านการรับรอง ผลลัพธ์ทั้งหมดถูกเชื่อมโยงเป็น <strong>Grounding Context</strong> ให้กับ GenieWisdom AI Chatbot เพื่อแนะนำแนวทางแก้ไขปัญหาและสูตรสถิติอย่างแม่นยำ
        </p>
      </div>

      <!-- Quick Metrics Telemetry Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10 shrink-0">
        <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center">
          <span class="text-[10px] text-teal-200 uppercase font-bold block">Archived PFR</span>
          <span class="text-xl font-mono font-bold text-white mt-0.5 block">{{ kmProjects.length }} Projects</span>
          <span class="text-[9px] text-teal-300">100% Verified</span>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center">
          <span class="text-[10px] text-teal-200 uppercase font-bold block">Annual Value</span>
          <span class="text-xl font-mono font-bold text-amber-300 mt-0.5 block">14.6M ฿</span>
          <span class="text-[9px] text-teal-300">Hard Savings</span>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
          <span class="text-[10px] text-teal-200 uppercase font-bold block">Vector Chunks</span>
          <span class="text-xl font-mono font-bold text-emerald-300 mt-0.5 block">90+ Vectors</span>
          <span class="text-[9px] text-emerald-200 flex items-center justify-center gap-1">
            <UIcon name="i-lucide-sparkles" class="size-2.5" />
            <span>AI Ready</span>
          </span>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- GEMINI PROMPT SEARCH BAR: Ask AI across all KM Repository -->
    <!-- ========================================================= -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
      
      <!-- AI Search / Query Input Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div class="relative flex-1">
          <UIcon name="i-lucide-search" class="size-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาชื่อโครงการ, รหัส PFR, ปัญหา (เช่น Giveaway, FCR, พลังงาน), หรือปัจจัยทดสอบ..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#008779] focus:bg-white transition-all shadow-2xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 text-xs"
            @click="searchQuery = ''"
          >
            Clear
          </button>
        </div>

        <!-- Ask AI Direct Action Button -->
        <NuxtLink
          to="/admin/chatbot"
          class="bg-gradient-to-r from-[#008779] to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <UIcon name="i-lucide-sparkles" class="size-4 text-amber-300" />
          <span>Ask GenieWisdom in Chatbot</span>
        </NuxtLink>
      </div>

      <!-- Filter Controls Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1 border-t border-slate-100">
        <!-- Business Unit -->
        <div>
          <label class="text-[10px] font-bold text-slate-400 block mb-1">Business Unit</label>
          <select
            v-model="selectedBusiness"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="All">All Businesses</option>
            <option value="Food Business">Food Business</option>
            <option value="Feed Business">Feed Business</option>
            <option value="Farm Business">Farm Business</option>
            <option value="Aquaculture">Aquaculture</option>
          </select>
        </div>

        <!-- Belt Level -->
        <div>
          <label class="text-[10px] font-bold text-slate-400 block mb-1">Belt Certification</label>
          <select
            v-model="selectedBelt"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="All">All Belts</option>
            <option value="Black Belt">Black Belt</option>
            <option value="Green Belt">Green Belt</option>
          </select>
        </div>

        <!-- Problem Category -->
        <div>
          <label class="text-[10px] font-bold text-slate-400 block mb-1">Problem Category</label>
          <select
            v-model="selectedCategory"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer truncate"
          >
            <option value="All">All Categories</option>
            <option value="Yield & Giveaway Reduction">Yield & Giveaway</option>
            <option value="Energy & Utility Optimization">Energy & Utility</option>
            <option value="FCR & Biological Performance">FCR Biological</option>
            <option value="Survival & Mortality Reduction">Survival & Mortality</option>
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label class="text-[10px] font-bold text-slate-400 block mb-1">Sort Results</label>
          <select
            v-model="selectedSort"
            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#008779] cursor-pointer"
          >
            <option value="savings">Highest Verified Savings</option>
            <option value="recent">Most Recent Projects</option>
          </select>
        </div>
      </div>

    </div>

    <!-- ========================================================= -->
    <!-- KNOWLEDGE CARDS GRID: Rich Grounding Cards -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="p in filteredProjects"
        :key="p.id"
        class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between group hover:border-[#008779]/40 relative overflow-hidden"
      >
        <!-- Top Glow Accent Line on Hover -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#008779] to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div class="space-y-3">
          <!-- Top Row: PFR Badge, Belt, & AI Vector Tag -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                {{ p.id }}
              </span>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs"
                :class="p.belt === 'Black Belt'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-emerald-50 text-[#008779] border-emerald-200'"
              >
                {{ p.belt }}
              </span>
            </div>

            <!-- AI Grounding Vector Count -->
            <div class="flex items-center gap-1 text-[10px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              <UIcon name="i-lucide-sparkles" class="size-3 text-[#008779]" />
              <span>{{ p.vectorChunks }} Chunks Grounded</span>
            </div>
          </div>

          <!-- Project Title -->
          <h2 class="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008779] transition-colors">
            {{ p.title }}
          </h2>

          <div class="text-[11px] text-slate-500 space-y-0.5">
            <p><strong class="text-slate-700">Business Unit:</strong> {{ p.business }} › {{ p.businessUnit }}</p>
            <p><strong class="text-slate-700">Project Leader:</strong> {{ p.author }}</p>
          </div>

          <!-- AI Executive Summary Callout Box -->
          <div class="bg-[#F0F4F9] border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
              <UIcon name="i-lucide-brain" class="size-3.5 text-[#008779]" />
              <span>AI Synthesized Best Practice:</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ p.aiSummary }}
            </p>
          </div>

          <!-- Metric Highlight Grid -->
          <div class="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs font-mono border border-slate-100">
            <div>
              <span class="text-[10px] text-slate-400 uppercase block font-sans font-bold">IMPROVEMENT GAIN</span>
              <span class="font-bold text-emerald-700 text-sm">{{ p.yieldGain }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase block font-sans font-bold">ANNUAL SAVINGS</span>
              <span class="font-bold text-teal-800 text-sm">{{ p.verifiedSavings }}</span>
            </div>
          </div>

          <!-- Vital Few Factors Tags -->
          <div class="space-y-1 pt-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Vital Few (X Factors):</span>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span
                v-for="(factor, fIdx) in p.vitalFewFactors"
                :key="fIdx"
                class="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1"
              >
                <UIcon name="i-lucide-check-circle-2" class="size-2.5 text-[#008779]" />
                <span>{{ factor }}</span>
              </span>
            </div>
          </div>

          <!-- Tag Pills -->
          <div class="flex items-center gap-1 flex-wrap pt-1">
            <span
              v-for="tag in p.tags"
              :key="tag"
              class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-mono"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Action Toolbar with Direct AI Chatbot Connection -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <span class="text-[10px] text-slate-400 flex items-center gap-1">
            <UIcon name="i-lucide-shield-check" class="size-3 text-emerald-600" />
            <span>{{ p.accessLevel }}</span>
          </span>

          <div class="flex items-center gap-2">
            <!-- Ask AI in Chatbot with this Context -->
            <NuxtLink
              to="/admin/chatbot"
              class="bg-teal-50 hover:bg-teal-100/80 text-[#008779] border border-teal-200 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Chat with GenieWisdom about this case study"
            >
              <UIcon name="i-lucide-bot" class="size-3.5" />
              <span>Chat with Case</span>
            </NuxtLink>

            <!-- Slides Presentation Link -->
            <NuxtLink
              :to="`/admin/projects/${p.projectId}/presentation`"
              class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-colors"
              title="View Slides"
            >
              <UIcon name="i-lucide-presentation" class="size-3.5" />
              <span class="hidden sm:inline">Slides</span>
            </NuxtLink>

            <!-- View PFR Report Link -->
            <NuxtLink
              :to="`/admin/projects/${p.projectId}/report`"
              class="bg-[#008779] hover:bg-[#007366] text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <UIcon name="i-lucide-file-text" class="size-3.5" />
              <span>View PFR</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
