<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const zoomLevel = ref(100)

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
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-[640px]">
      <!-- 1. Top Editor Toolbar (Image 4) -->
      <div class="p-3 border-b border-gray-200 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
        <!-- Left: Add Shapes -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 font-medium mr-1">Add Shape:</span>
          <button
            type="button"
            class="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
          >
            <span class="w-3 h-2 bg-blue-400 rounded-xs"></span>
            <span>Process</span>
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
          >
            <span class="size-2.5 bg-amber-400 rotate-45 rounded-xs"></span>
            <span>Decision</span>
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-sky-100 transition-colors"
          >
            <span class="size-2.5 rounded-full bg-sky-400"></span>
            <span>Inspect</span>
          </button>

          <button
            type="button"
            class="px-2 py-1 rounded border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-100 flex items-center gap-1"
          >
            <UIcon name="i-lucide-shapes" class="size-3.5" />
            <span>More</span>
            <UIcon name="i-lucide-chevron-down" class="size-3 text-gray-400" />
          </button>
        </div>

        <!-- Center Title -->
        <div class="text-xs font-bold text-gray-800">
          Process Map สินค้าไก่ทอด
        </div>

        <!-- Right Tools & Actions -->
        <div class="flex items-center gap-2">
          <div class="flex items-center border border-gray-200 rounded-md bg-white">
            <button
              type="button"
              class="p-1.5 text-gray-500 hover:text-gray-900 border-r border-gray-200"
              title="Zoom Out"
              @click="zoomOut"
            >
              <UIcon name="i-lucide-zoom-out" class="size-3.5" />
            </button>
            <span class="px-2 text-[11px] font-mono text-gray-600 font-semibold">{{ zoomLevel }}%</span>
            <button
              type="button"
              class="p-1.5 text-gray-500 hover:text-gray-900"
              title="Zoom In"
              @click="zoomIn"
            >
              <UIcon name="i-lucide-zoom-in" class="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            class="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 bg-white"
            title="Fit to Screen"
          >
            <UIcon name="i-lucide-maximize-2" class="size-3.5" />
          </button>

          <button
            type="button"
            class="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 bg-white"
            title="Export"
          >
            <UIcon name="i-lucide-download" class="size-3.5" />
          </button>

          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
          >
            <UIcon name="i-lucide-save" class="size-3.5" />
            <span>Save</span>
          </button>

          <NuxtLink
            :to="`/admin/projects/${projectId}/measure/process-map`"
            class="p-1.5 text-gray-400 hover:text-gray-700"
            title="Close"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- 2. Main Visual Canvas Area (SVG Flowchart Layout) -->
      <div class="flex-1 relative overflow-auto p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] min-h-[480px]">
        <div
          class="transition-transform duration-200 origin-top-left"
          :style="{ transform: `scale(${zoomLevel / 100})` }"
        >
          <svg class="w-[980px] h-[440px]" viewBox="0 0 980 440">
            <!-- ================= ROW 1 (Left to Right) ================= -->
            <!-- Step 1: Prepare RM&Ingredients -->
            <rect x="30" y="40" width="100" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="80" y="58" font-size="7.5" fill="#1e40af" font-weight="600" text-anchor="middle">Prepare RM&Ingredients</text>

            <!-- Line 1 -> 2 -->
            <line x1="130" y1="56" x2="160" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="160,56 155,53 155,59" fill="#94a3b8" />

            <!-- Step 2: Inspect Weight (Circle) -->
            <circle cx="185" cy="56" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="185" y="54" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="185" y="63" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">Weight</text>

            <!-- Line 2 -> 3 -->
            <line x1="207" y1="56" x2="235" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="235,56 230,53 230,59" fill="#94a3b8" />

            <!-- Step 3: Decision (Diamond) -->
            <polygon points="260,36 290,56 260,76 230,56" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="260" y="59" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 3 -> 4 -->
            <line x1="290" y1="56" x2="320" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="320,56 315,53 315,59" fill="#94a3b8" />

            <!-- Step 4: Tumbling -->
            <rect x="320" y="40" width="70" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="355" y="58" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Tumbling</text>

            <!-- Line 4 -> 5 -->
            <line x1="390" y1="56" x2="420" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="420,56 415,53 415,59" fill="#94a3b8" />

            <!-- Step 5: Inspect %Absorb -->
            <circle cx="442" cy="56" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="442" y="54" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="442" y="63" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">%Absorb</text>

            <!-- Line 5 -> 6 -->
            <line x1="464" y1="56" x2="495" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="495,56 490,53 490,59" fill="#94a3b8" />

            <!-- Step 6: Decision -->
            <polygon points="520,36 550,56 520,76 490,56" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="520" y="59" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 6 -> 7 -->
            <line x1="550" y1="56" x2="580" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="580,56 575,53 575,59" fill="#94a3b8" />

            <!-- Step 7: Predusting -->
            <rect x="580" y="40" width="70" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="615" y="58" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Predusting</text>

            <!-- Line 7 -> 8 -->
            <line x1="650" y1="56" x2="680" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="680,56 675,53 675,59" fill="#94a3b8" />

            <!-- Step 8: Inspect %Pick up -->
            <circle cx="702" cy="56" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="702" y="54" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="702" y="63" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">%Pick up</text>

            <!-- Line 8 -> 9 -->
            <line x1="724" y1="56" x2="755" y2="56" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="755,56 750,53 750,59" fill="#94a3b8" />

            <!-- Step 9: Decision -->
            <polygon points="780,36 810,56 780,76 750,56" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="780" y="59" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Dropdown Line from Row 1 Decision to Row 2 Battering -->
            <line x1="780" y1="76" x2="780" y2="185" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="780,185 777,180 783,180" fill="#94a3b8" />

            <!-- ================= ROW 2 (Right to Left) ================= -->
            <!-- Step 10: Battering -->
            <rect x="745" y="185" width="70" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="780" y="203" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Battering</text>

            <!-- Line 10 -> 11 -->
            <line x1="745" y1="201" x2="715" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="715,201 720,198 720,204" fill="#94a3b8" />

            <!-- Step 11: Inspect %Pick up -->
            <circle cx="693" cy="201" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="693" y="199" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="693" y="208" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">%Pick up</text>

            <!-- Line 11 -> 12 -->
            <line x1="671" y1="201" x2="640" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="640,201 645,198 645,204" fill="#94a3b8" />

            <!-- Step 12: Decision -->
            <polygon points="615,181 645,201 615,221 585,201" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="615" y="204" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 12 -> 13 -->
            <line x1="585" y1="201" x2="555" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="555,201 560,198 560,204" fill="#94a3b8" />

            <!-- Step 13: Breading -->
            <rect x="495" y="185" width="60" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="525" y="203" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Breading</text>

            <!-- Line 13 -> 14 -->
            <line x1="495" y1="201" x2="465" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="465,201 470,198 470,204" fill="#94a3b8" />

            <!-- Step 14: Frying -->
            <rect x="415" y="185" width="50" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="440" y="203" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Frying</text>

            <!-- Line 14 -> 15 -->
            <line x1="415" y1="201" x2="385" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="385,201 390,198 390,204" fill="#94a3b8" />

            <!-- Step 15: Inspect Reject -->
            <circle cx="363" cy="201" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="363" y="199" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="363" y="208" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">Reject</text>

            <!-- Line 15 -> 16 -->
            <line x1="341" y1="201" x2="310" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="310,201 315,198 315,204" fill="#94a3b8" />

            <!-- Step 16: Decision -->
            <polygon points="285,181 315,201 285,221 255,201" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="285" y="204" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 16 -> 17 -->
            <line x1="255" y1="201" x2="225" y2="201" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="225,201 230,198 230,204" fill="#94a3b8" />

            <!-- Step 17: Roasting -->
            <rect x="175" y="185" width="50" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="200" y="203" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Roasting</text>

            <!-- Dropdown Line from Row 2 Roasting to Row 3 Inspect Reject -->
            <line x1="200" y1="217" x2="200" y2="310" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="200,310 197,305 203,305" fill="#94a3b8" />

            <!-- ================= ROW 3 (Left to Right) ================= -->
            <!-- Step 18: Inspect Reject -->
            <circle cx="200" cy="330" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="200" y="328" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="200" y="337" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">Reject</text>

            <!-- Line 18 -> 19 -->
            <line x1="222" y1="330" x2="250" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="250,330 245,327 245,333" fill="#94a3b8" />

            <!-- Step 19: Decision -->
            <polygon points="275,310 305,330 275,350 245,330" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="275" y="333" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 19 -> 20 -->
            <line x1="305" y1="330" x2="335" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="335,330 330,327 330,333" fill="#94a3b8" />

            <!-- Step 20: Freezing -->
            <rect x="335" y="314" width="55" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="362" y="332" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Freezing</text>

            <!-- Line 20 -> 21 -->
            <line x1="390" y1="330" x2="415" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="415,330 410,327 410,333" fill="#94a3b8" />

            <!-- Step 21: Inspect Reject -->
            <circle cx="435" cy="330" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="435" y="328" font-size="7" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="435" y="337" font-size="7" fill="#1e40af" font-weight="600" text-anchor="middle">Reject</text>

            <!-- Line 21 -> 22 -->
            <line x1="457" y1="330" x2="485" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="485,330 480,327 480,333" fill="#94a3b8" />

            <!-- Step 22: Decision -->
            <polygon points="510,310 540,330 510,350 480,330" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="510" y="333" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 22 -> 23 -->
            <line x1="540" y1="330" x2="565" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="565,330 560,327 560,333" fill="#94a3b8" />

            <!-- Step 23: Packing -->
            <rect x="565" y="314" width="50" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="590" y="332" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Packing</text>

            <!-- Line 23 -> 24 -->
            <line x1="615" y1="330" x2="640" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="640,330 635,327 635,333" fill="#94a3b8" />

            <!-- Step 24: Inspect Weight Seal -->
            <circle cx="662" cy="330" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="662" y="328" font-size="6.5" fill="#1e40af" text-anchor="middle">Inspect</text>
            <text x="662" y="337" font-size="6.5" fill="#1e40af" font-weight="600" text-anchor="middle">Weight Seal</text>

            <!-- Line 24 -> 25 -->
            <line x1="684" y1="330" x2="710" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="710,330 705,327 705,333" fill="#94a3b8" />

            <!-- Step 25: Decision -->
            <polygon points="735,310 765,330 735,350 705,330" fill="#fefce8" stroke="#eab308" stroke-width="1.2" />
            <text x="735" y="333" font-size="7" fill="#854d0e" font-weight="600" text-anchor="middle">Decision</text>

            <!-- Line 25 -> 26 -->
            <line x1="765" y1="330" x2="795" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="795,330 790,327 790,333" fill="#94a3b8" />

            <!-- Step 26: Cartoning -->
            <rect x="795" y="314" width="55" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2" />
            <text x="822" y="332" font-size="8" fill="#1e40af" font-weight="600" text-anchor="middle">Cartoning</text>

            <!-- Line 26 -> 27 -->
            <line x1="850" y1="330" x2="880" y2="330" stroke="#94a3b8" stroke-width="1.2" />
            <polygon points="880,330 875,327 875,333" fill="#94a3b8" />

            <!-- Step 27: Cold Storage (Triangle) -->
            <polygon points="915,310 945,350 885,350" fill="#fdf4ff" stroke="#c084fc" stroke-width="1.2" />
            <text x="915" y="333" font-size="6.5" fill="#7e22ce" font-weight="600" text-anchor="middle">Cold</text>
            <text x="915" y="342" font-size="6.5" fill="#7e22ce" text-anchor="middle">Storage</text>
          </svg>
        </div>

        <!-- Floating Mini-Map on bottom right (Matching Image 4) -->
        <div class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-gray-200 shadow-md rounded-lg p-2.5 w-36 pointer-events-none hidden sm:block">
          <span class="text-[9px] font-bold text-gray-400 block mb-1">MINI MAP</span>
          <div class="h-16 bg-gray-50 rounded border border-gray-100 p-1 flex flex-col justify-between">
            <div class="h-2 bg-blue-200/70 rounded-xs w-full"></div>
            <div class="h-2 bg-amber-200/70 rounded-xs w-4/5 self-end"></div>
            <div class="h-2 bg-blue-200/70 rounded-xs w-full"></div>
          </div>
        </div>
      </div>

      <!-- 3. Bottom Status Bar (Image 4) -->
      <div class="p-3 border-t border-gray-200 bg-white flex flex-wrap items-center justify-between text-xs text-gray-600 gap-4">
        <!-- Node Shape Counters -->
        <div class="flex items-center gap-4 text-xs font-mono">
          <span class="flex items-center gap-1"><span class="w-3 h-2 bg-blue-300 rounded-xs"></span> 10</span>
          <span class="flex items-center gap-1"><span class="size-2.5 bg-amber-300 rotate-45 rounded-xs"></span> 8</span>
          <span class="flex items-center gap-1"><span class="size-2.5 rounded-full bg-sky-300"></span> 9</span>
          <span class="flex items-center gap-1"><span class="w-2.5 h-2 bg-purple-300"></span> 1</span>
        </div>

        <!-- Total Stats -->
        <div class="flex items-center gap-3 text-xs font-medium">
          <span>Total: <strong class="text-gray-900 font-mono">28</strong></span>
          <span class="text-gray-300">|</span>
          <span>Active: <strong class="text-[#008779] font-mono">28</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>
