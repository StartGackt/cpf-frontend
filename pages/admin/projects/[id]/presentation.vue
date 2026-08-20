<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const currentSlideIndex = ref(0)
const isFullscreen = ref(false)
const isCustomizing = ref(false)

const slides = ref([
  {
    id: 1,
    title: '1. Executive Summary & Project Charter (PCR/PFR)',
    subtitle: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด — โรงงานแปรรูปโชคชัย',
    widgets: [
      { id: 'w1', type: 'charter', x: 20, y: 20, w: 460, h: 260, title: 'Project Overview & Objectives' },
      { id: 'w2', type: 'beg', x: 500, y: 20, w: 460, h: 260, title: 'BEG Target Baseline vs Goal' }
    ]
  },
  {
    id: 2,
    title: '2. Measure Phase: Process Flow & Fishbone Root Causes',
    subtitle: '28-Node Process Flowchart & 41 Causes Ishikawa Diagram',
    widgets: [
      { id: 'w3', type: 'processMap', x: 20, y: 20, w: 460, h: 260, title: 'Process Flow Snapshot' },
      { id: 'w4', type: 'fishbone', x: 500, y: 20, w: 460, h: 260, title: 'Top Prioritized Causes (FMEA)' }
    ]
  },
  {
    id: 3,
    title: '3. Analyze & Improve: Hypothesis Validation & DOE Optimization',
    subtitle: 'Anderson-Darling Normality, 2-Sample T & Response Surface Cube Plot',
    widgets: [
      { id: 'w5', type: 'normality', x: 20, y: 20, w: 460, h: 260, title: 'Normality & Statistical Significance' },
      { id: 'w6', type: 'cubePlot', x: 500, y: 20, w: 460, h: 260, title: 'DOE Optimum Parameter Settings' }
    ]
  },
  {
    id: 4,
    title: '4. Control & Financial Benefits: Sustaining Yield Gains',
    subtitle: 'Control Plan Standardization & Cumulative Financial Impact',
    widgets: [
      { id: 'w7', type: 'controlPlan', x: 20, y: 20, w: 460, h: 260, title: 'SOP Process Control Matrix' },
      { id: 'w8', type: 'tracking', x: 500, y: 20, w: 460, h: 260, title: 'Weekly Yield Stability & Cost Savings' }
    ]
  }
])

const currentSlide = computed(() => slides.value[currentSlideIndex.value])

const prevSlide = () => {
  if (currentSlideIndex.value > 0) currentSlideIndex.value--
}

const nextSlide = () => {
  if (currentSlideIndex.value < slides.value.length - 1) currentSlideIndex.value++
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Breadcrumbs (hidden in fullscreen) -->
    <div v-if="!isFullscreen" class="flex items-center gap-2 text-xs text-gray-500 pb-2">
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
        Example เพิ่ม %Total Yield สินค้าไก่ทอด
      </NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-bold">Presentation Mode & Slide Builder</span>
    </div>

    <!-- Presentation Canvas & Controls Container -->
    <div
      class="bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all"
      :class="isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[740px] border border-gray-800'"
    >
      <!-- Top Slide Presentation Toolbar -->
      <div class="bg-gray-800/90 backdrop-blur-md px-6 py-3 border-b border-gray-700/80 flex items-center justify-between text-white text-xs">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="size-3 rounded-full bg-red-500"></span>
            <span class="size-3 rounded-full bg-amber-500"></span>
            <span class="size-3 rounded-full bg-emerald-500"></span>
          </div>

          <div class="border-l border-gray-700 pl-4">
            <span class="font-bold text-sm text-gray-100">{{ currentSlide.title }}</span>
            <span class="text-[11px] text-gray-400 block">{{ currentSlide.subtitle }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Slide Counter -->
          <div class="bg-gray-700/70 px-3 py-1.5 rounded-md font-mono text-gray-300 font-bold text-xs flex items-center gap-2">
            <button
              type="button"
              class="hover:text-white disabled:opacity-30 cursor-pointer"
              :disabled="currentSlideIndex === 0"
              @click="prevSlide"
            >
              <UIcon name="i-lucide-chevron-left" class="size-3.5" />
            </button>
            <span>Slide {{ currentSlideIndex + 1 }} / {{ slides.length }}</span>
            <button
              type="button"
              class="hover:text-white disabled:opacity-30 cursor-pointer"
              :disabled="currentSlideIndex === slides.length - 1"
              @click="nextSlide"
            >
              <UIcon name="i-lucide-chevron-right" class="size-3.5" />
            </button>
          </div>

          <!-- Customize Mode Toggle -->
          <button
            type="button"
            class="px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            :class="isCustomizing ? 'bg-[#008779] text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'"
            @click="isCustomizing = !isCustomizing"
          >
            <UIcon name="i-lucide-layout-template" class="size-3.5" />
            <span>{{ isCustomizing ? 'Done Customizing' : 'Customize Slides' }}</span>
          </button>

          <!-- Export Actions -->
          <NuxtLink
            :to="`/admin/projects/${projectId}/report`"
            class="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <UIcon name="i-lucide-file-text" class="size-3.5" />
            <span>Full Report (PFR)</span>
          </NuxtLink>

          <!-- Fullscreen Toggle -->
          <button
            type="button"
            class="bg-gray-700 hover:bg-gray-600 text-gray-200 p-1.5 rounded-md transition-colors cursor-pointer"
            title="Toggle Fullscreen"
            @click="toggleFullscreen"
          >
            <UIcon :name="isFullscreen ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" class="size-4" />
          </button>
        </div>
      </div>

      <!-- Slide Customizer Widget Palette Bar (Phase 2 Drag & Drop feature) -->
      <div
        v-if="isCustomizing"
        class="bg-teal-950/80 border-b border-teal-800/60 px-6 py-2 flex items-center justify-between text-xs text-teal-200 animate-in slide-in-from-top duration-200"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-palette" class="size-4 text-teal-400" />
          <span class="font-bold">Widget Palette:</span>
          <span class="text-teal-300">Drag or click to add custom elements into this slide:</span>
        </div>

        <div class="flex items-center gap-2">
          <button class="bg-teal-900/80 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1">
            <UIcon name="i-lucide-type" class="size-3" />
            <span>+ Text Box</span>
          </button>
          <button class="bg-teal-900/80 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1">
            <UIcon name="i-lucide-bar-chart" class="size-3" />
            <span>+ Chart Widget</span>
          </button>
          <button class="bg-teal-900/80 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1">
            <UIcon name="i-lucide-dollar-sign" class="size-3" />
            <span>+ KPI Metric</span>
          </button>
          <button class="bg-teal-900/80 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1">
            <UIcon name="i-lucide-image" class="size-3" />
            <span>+ Image / Diagram</span>
          </button>
        </div>
      </div>

      <!-- Main Slide 16:9 Presentation Canvas -->
      <div class="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-hidden relative">
        <!-- 16:9 Aspect Ratio Slide Card -->
        <div class="w-full max-w-5xl aspect-16/9 bg-white rounded-lg shadow-2xl p-8 flex flex-col justify-between text-gray-900 relative overflow-hidden border border-gray-200">
          <!-- Slide Watermark Header -->
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <div class="flex items-center gap-2">
              <div class="size-7 rounded bg-[#008779] text-white flex items-center justify-center font-bold text-xs">
                IG
              </div>
              <div>
                <span class="font-bold text-xs tracking-tight text-gray-900">INSIGHTGENIE SIX SIGMA PRESENTATION</span>
                <span class="text-[10px] text-gray-500 block">CPF Digital Transformation & Quality Excellence</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                Black Belt Certified Project
              </span>
              <span class="text-[10px] text-gray-400 font-mono">Date: Feb 2026</span>
            </div>
          </div>

          <!-- SLIDE 1 CONTENT: Executive Summary & BEG Chart -->
          <div v-if="currentSlideIndex === 0" class="grid grid-cols-2 gap-6 my-auto">
            <!-- Left Card: Project Charter Summary -->
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-file-text" class="size-4 text-[#008779]" />
                <span>Executive Project Charter</span>
              </h3>
              <div class="space-y-2 text-xs">
                <div>
                  <strong class="text-gray-700 block">Project Title:</strong>
                  <span class="font-bold text-gray-900">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
                </div>
                <div>
                  <strong class="text-gray-700 block">Plant Location:</strong>
                  <span class="text-gray-800">โรงงานแปรรูปโชคชัย (Food Business)</span>
                </div>
                <div>
                  <strong class="text-gray-700 block">Project Leader & Sponsor:</strong>
                  <span class="text-gray-800">Romteera Tadderm (BB) / Somchai Vong (Champion)</span>
                </div>
                <div class="bg-teal-50 border border-teal-200 rounded p-2 text-[11px] text-teal-950 font-medium">
                  <strong>Expected Annual Cost Savings:</strong> 4,250,000 THB / Year
                </div>
              </div>
            </div>

            <!-- Right Card: BEG Targets -->
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-target" class="size-4 text-[#008779]" />
                <span>BEG Target Metric Formulation</span>
              </h3>
              <div class="grid grid-cols-3 gap-2 text-center text-xs">
                <div class="bg-white border border-red-200 rounded p-2.5">
                  <span class="text-[10px] text-red-500 font-bold block">BASELINE</span>
                  <span class="text-base font-bold text-red-600 font-mono">83.75%</span>
                </div>
                <div class="bg-white border border-amber-200 rounded p-2.5">
                  <span class="text-[10px] text-amber-500 font-bold block">ENTITLEMENT</span>
                  <span class="text-base font-bold text-amber-600 font-mono">88.00%</span>
                </div>
                <div class="bg-white border border-purple-200 rounded p-2.5">
                  <span class="text-[10px] text-purple-600 font-bold block">GOAL LSS</span>
                  <span class="text-base font-bold text-purple-700 font-mono">87.15%</span>
                </div>
              </div>
              <div class="text-[11px] text-gray-600 bg-white border border-gray-100 rounded p-2.5">
                <strong>Goal Formulation Rule:</strong> Target set at 80% entitlement gap closure above baseline mean.
              </div>
            </div>
          </div>

          <!-- SLIDE 2 CONTENT: Process Flow & Fishbone -->
          <div v-if="currentSlideIndex === 1" class="grid grid-cols-2 gap-6 my-auto">
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-2">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-git-merge" class="size-4 text-[#008779]" />
                <span>28-Node Process Flowchart</span>
              </h3>
              <p class="text-xs text-gray-600">
                Mapped end-to-end chicken processing: Tumbling &rarr; Predust &rarr; Battering &rarr; Frying &rarr; Roasting &rarr; Freezing &rarr; Multihead Packing.
              </p>
              <div class="h-32 bg-white border border-gray-200 rounded flex items-center justify-center text-xs text-gray-400 font-mono">
                [Visual Flow Diagram Canvas Mapped]
              </div>
            </div>

            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-2">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-git-branch" class="size-4 text-[#008779]" />
                <span>FMEA Pareto 80/20 Prioritization</span>
              </h3>
              <p class="text-xs text-gray-600">
                41 brainstormed causes screened across 6 categories. Top 3 high-risk root causes identified:
              </p>
              <ul class="text-xs text-gray-800 space-y-1 pl-4 list-disc font-medium">
                <li>การ set ค่าน้ำหนักเผื่อ Multihead (RPN 490)</li>
                <li>จำนวน Drop ของเครื่อง Multihead (RPN 280)</li>
                <li>ความเร็วเครื่องเติมแป้ง Predust (RPN 64)</li>
              </ul>
            </div>
          </div>

          <!-- SLIDE 3 CONTENT: Hypothesis & DOE Optimization -->
          <div v-if="currentSlideIndex === 2" class="grid grid-cols-2 gap-6 my-auto">
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-2">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-test-tube" class="size-4 text-[#008779]" />
                <span>2-Sample T Hypothesis Testing</span>
              </h3>
              <p class="text-xs text-gray-600">
                Anderson-Darling Normality confirmed (P &gt; 0.05). 2-Sample T showed significant effect on %Giveaway (P = 0.000).
              </p>
              <div class="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs text-emerald-900 font-bold">
                ✓ Null Hypothesis Rejected: Statistical significance verified.
              </div>
            </div>

            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-2">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-box" class="size-4 text-[#008779]" />
                <span>DOE Cube Plot Optimum Settings</span>
              </h3>
              <p class="text-xs text-gray-600">
                Full Factorial 2³ Design identified optimum multihead weight setting:
              </p>
              <div class="bg-teal-50 border border-teal-200 rounded p-2.5 text-xs text-teal-950 font-bold font-mono">
                Optimum %Giveaway = 2.20000% (Weight: 10g, Drops: 1 drop)
              </div>
            </div>
          </div>

          <!-- SLIDE 4 CONTENT: Control Plan & Financial ROI -->
          <div v-if="currentSlideIndex === 3" class="grid grid-cols-2 gap-6 my-auto">
            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-2">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-shield-check" class="size-4 text-[#008779]" />
                <span>Process Control Plan Standardization</span>
              </h3>
              <ul class="text-xs text-gray-800 space-y-1.5 pl-4 list-disc font-medium">
                <li>PLC Parameter lock for Multihead 1 drop standard</li>
                <li>Shift-based Scale Calibration checklist by QA</li>
                <li>Inverter speed monitor fixed at 40 Hz</li>
              </ul>
            </div>

            <div class="bg-gray-50/70 border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UIcon name="i-lucide-trending-up" class="size-4 text-[#008779]" />
                <span>Project Financial Impact & Stability</span>
              </h3>
              <div class="grid grid-cols-2 gap-3 text-center text-xs">
                <div class="bg-emerald-50 border border-emerald-200 rounded p-2.5">
                  <span class="text-[10px] text-emerald-700 font-bold block">FINAL %YIELD</span>
                  <span class="text-base font-bold text-emerald-700 font-mono">87.70%</span>
                </div>
                <div class="bg-teal-50 border border-teal-200 rounded p-2.5">
                  <span class="text-[10px] text-teal-700 font-bold block">ANNUAL SAVINGS</span>
                  <span class="text-base font-bold text-[#008779] font-mono">4.25M THB</span>
                </div>
              </div>
              <p class="text-[11px] text-gray-600 text-center font-bold">
                Capability Cpk = 1.45 (Stable & Sustained)
              </p>
            </div>
          </div>

          <!-- Slide Footer -->
          <div class="flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] text-gray-400">
            <span>Confidential — Internal CPF Six Sigma Documentation</span>
            <span class="font-mono">Page {{ currentSlideIndex + 1 }} of {{ slides.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
