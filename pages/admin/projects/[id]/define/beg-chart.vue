<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const hoveredPoint = ref<number | null>(6) // July default hovered

const monthlyPoints = [
  { month: 'Jan 2025', val: 80.0, label: '80.00' },
  { month: 'Feb 2025', val: 84.0, label: '84.00' },
  { month: 'Mar 2025', val: 84.0, label: '84.00' },
  { month: 'Apr 2025', val: 83.0, label: '83.00' },
  { month: 'May 2025', val: 82.0, label: '82.00' },
  { month: 'Jun 2025', val: 85.0, label: '85.00' },
  { month: 'Jul 2025', val: 88.0, label: '88.00' },
  { month: 'Aug 2025', val: 83.0, label: '83.00' },
  { month: 'Sep 2025', val: 85.0, label: '85.00' },
  { month: 'Oct 2025', val: 82.0, label: '82.00' },
  { month: 'Nov 2025', val: 84.0, label: '84.00' },
  { month: 'Dec 2025', val: 85.0, label: '85.00' }
]

const goalBu = ref('')
const goalStandard = ref('')
const goalIndustry = ref('')
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
      <span class="text-gray-700 font-medium">Define</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">BEG Chart</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="BEG Chart"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Collapsible Header Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                BEG Chart Configuration
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Configure Baseline, Entitlement, Goal LSS, and Goal BU values for improvement targets
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-6 space-y-6">
          <div>
            <h2 class="text-base font-bold text-gray-900">
              BEG Analysis for Improvement Targets
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Configure baseline, entitlement, and goal values for your improvement targets
            </p>
          </div>

          <!-- Section: %Yield Indicator Accordion Box (Images 2, 3, 4) -->
          <div class="border border-gray-200 rounded-lg p-5 space-y-6 bg-white">
            <!-- Indicator Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-chevron-down" class="size-4 text-gray-400" />
                <div>
                  <h3 class="text-base font-bold text-gray-900">
                    %Yield
                  </h3>
                  <div class="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>Category: <strong class="text-gray-700">Quality</strong></span>
                    <span>Type: <strong class="text-gray-700">Increase</strong></span>
                    <span>Unit: <strong class="text-gray-700">%</strong></span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  12 points
                </span>
                <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Goals Pending
                </span>
              </div>
            </div>

            <!-- BEG Analysis Chart Title -->
            <div>
              <h4 class="text-xs font-bold text-gray-900">
                %Yield - BEG Analysis Chart
              </h4>
            </div>

            <!-- Interactive BEG Time Series SVG Chart -->
            <div class="h-80 w-full relative border border-gray-100 rounded-lg p-2 bg-white">
              <svg class="w-full h-full" viewBox="0 0 880 260">
                <!-- Grid Lines horizontal -->
                <line x1="60" y1="20" x2="800" y2="20" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="45" x2="800" y2="45" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="70" x2="800" y2="70" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="95" x2="800" y2="95" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="120" x2="800" y2="120" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="145" x2="800" y2="145" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="170" x2="800" y2="170" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="195" x2="800" y2="195" stroke="#f1f5f9" stroke-dasharray="3 3" />
                <line x1="60" y1="220" x2="800" y2="220" stroke="#f1f5f9" stroke-dasharray="3 3" />

                <!-- Left Y-Axis -->
                <line x1="60" y1="20" x2="60" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
                <text x="18" y="120" font-size="9" fill="#475569" text-anchor="middle" transform="rotate(-90 18 120)" font-weight="600">
                  Value (%)
                </text>
                <text x="52" y="24" font-size="8" fill="#64748b" text-anchor="end">96</text>
                <text x="52" y="49" font-size="8" fill="#64748b" text-anchor="end">94</text>
                <text x="52" y="74" font-size="8" fill="#64748b" text-anchor="end">92</text>
                <text x="52" y="99" font-size="8" fill="#64748b" text-anchor="end">90</text>
                <text x="52" y="124" font-size="8" fill="#64748b" text-anchor="end">88</text>
                <text x="52" y="149" font-size="8" fill="#64748b" text-anchor="end">86</text>
                <text x="52" y="174" font-size="8" fill="#64748b" text-anchor="end">84</text>
                <text x="52" y="199" font-size="8" fill="#64748b" text-anchor="end">82</text>
                <text x="52" y="224" font-size="8" fill="#64748b" text-anchor="end">80</text>

                <!-- Bottom X-Axis -->
                <line x1="60" y1="220" x2="800" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
                <text x="430" y="255" font-size="9" fill="#475569" text-anchor="middle" font-weight="600">Time Period</text>

                <!-- Month labels on X-Axis (rotated) -->
                <text x="70" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 70 235)">Jan 2025</text>
                <text x="135" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 135 235)">Feb 2025</text>
                <text x="200" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 200 235)">Mar 2025</text>
                <text x="265" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 265 235)">Apr 2025</text>
                <text x="330" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 330 235)">May 2025</text>
                <text x="395" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 395 235)">Jun 2025</text>
                <text x="460" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 460 235)">Jul 2025</text>
                <text x="525" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 525 235)">Aug 2025</text>
                <text x="590" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 590 235)">Sep 2025</text>
                <text x="655" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 655 235)">Oct 2025</text>
                <text x="720" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 720 235)">Nov 2025</text>
                <text x="785" y="235" font-size="7.5" fill="#64748b" transform="rotate(-45 785 235)">Dec 2025</text>

                <!-- REFERENCE LINES (Images 2, 3, 4) -->
                <!-- 1. Entitlement 88.00 (Orange Dashed Line at y=120) -->
                <line x1="60" y1="120" x2="800" y2="120" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" />
                <text x="805" y="123" font-size="7.5" fill="#d97706" font-weight="bold">Entitlement: 88.00</text>

                <!-- 2. Goal 87.15 (Purple Solid Line at y=129) -->
                <line x1="60" y1="129" x2="800" y2="129" stroke="#8b5cf6" stroke-width="2" />
                <text x="805" y="132" font-size="7.5" fill="#7c3aed" font-weight="bold">Goal: 87.15</text>

                <!-- 3. Baseline 83.75 (Red Dashed Line at y=168) -->
                <line x1="60" y1="168" x2="800" y2="168" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 3" />
                <text x="805" y="171" font-size="7.5" fill="#dc2626" font-weight="bold">Baseline: 83.75</text>

                <!-- Data Polyline (Blue with Circles) -->
                <!-- Points: Jan 80 (220), Feb 84 (170), Mar 84 (170), Apr 83 (182), May 82 (195), Jun 85 (157), Jul 88 (120), Aug 83 (182), Sep 85 (157), Oct 82 (195), Nov 84 (170), Dec 85 (157) -->
                <polyline
                  points="70,220 135,170 200,170 265,182 330,195 395,157 460,120 525,182 590,157 655,195 720,170 785,157"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="2"
                />

                <circle cx="70" cy="220" r="3" fill="#3b82f6" />
                <circle cx="135" cy="170" r="3" fill="#3b82f6" />
                <circle cx="200" cy="170" r="3" fill="#3b82f6" />
                <circle cx="265" cy="182" r="3" fill="#3b82f6" />
                <circle cx="330" cy="195" r="3" fill="#3b82f6" />
                <circle cx="395" cy="157" r="3" fill="#3b82f6" />
                <circle cx="460" cy="120" r="4" fill="#1d4ed8" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="525" cy="182" r="3" fill="#3b82f6" />
                <circle cx="590" cy="157" r="3" fill="#3b82f6" />
                <circle cx="655" cy="195" r="3" fill="#3b82f6" />
                <circle cx="720" cy="170" r="3" fill="#3b82f6" />
                <circle cx="785" cy="157" r="3" fill="#3b82f6" />

                <!-- Tooltip on Point 7 (Jul 2025, 88.00) matching Image 3 -->
                <g transform="translate(460, 95)">
                  <rect x="0" y="0" width="75" height="42" rx="4" fill="#0f172a" opacity="0.9" />
                  <text x="8" y="14" font-size="7.5" fill="#ffffff" font-weight="bold">Value: 88.00 %</text>
                  <text x="8" y="26" font-size="7" fill="#cbd5e1">Date: Jul 01, 2025</text>
                  <text x="8" y="36" font-size="7" fill="#94a3b8">Point #7</text>
                </g>
              </svg>
            </div>

            <!-- BEG Values Configuration Table (Images 2 & 4) -->
            <div class="space-y-3 pt-4 border-t border-gray-100">
              <h4 class="text-xs font-bold text-gray-900">
                BEG Values Configuration
              </h4>

              <div class="overflow-x-auto border border-gray-200 rounded-lg">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                      <th class="py-3 px-3 font-semibold">TARGET INDICATORS</th>
                      <th class="py-3 px-3 font-semibold text-center w-16">UNIT</th>
                      <th class="py-3 px-3 font-semibold text-center w-24">BASELINE</th>
                      <th class="py-3 px-3 font-semibold text-center w-28">ENTITLEMENT</th>
                      <th class="py-3 px-3 font-semibold text-center w-24">GOAL LSS</th>
                      <th class="py-3 px-3 font-semibold text-center w-36">GOAL BU</th>
                      <th class="py-3 px-3 font-semibold text-center w-36">GOAL STANDARD</th>
                      <th class="py-3 px-3 font-semibold text-center w-36">GOAL INDUSTRY</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr>
                      <td class="py-3 px-3 font-bold text-gray-900">
                        % Yield
                      </td>
                      <td class="py-3 px-3 text-center text-gray-600">
                        %
                      </td>
                      <td class="py-3 px-3 text-center font-bold text-red-600 font-mono">
                        83.75
                      </td>
                      <td class="py-3 px-3 text-center font-bold text-amber-600 font-mono">
                        88.00
                      </td>
                      <td class="py-3 px-3 text-center font-bold text-purple-700 font-mono">
                        87.15
                      </td>

                      <!-- Goal BU -->
                      <td class="py-2 px-2">
                        <div class="flex items-center gap-1">
                          <input
                            v-model="goalBu"
                            type="text"
                            placeholder="Enter val"
                            class="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800"
                          />
                          <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium transition-colors">
                            Save
                          </button>
                        </div>
                      </td>

                      <!-- Goal Standard -->
                      <td class="py-2 px-2">
                        <div class="flex items-center gap-1">
                          <input
                            v-model="goalStandard"
                            type="text"
                            placeholder="Enter val"
                            class="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800"
                          />
                          <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium transition-colors">
                            Save
                          </button>
                        </div>
                      </td>

                      <!-- Goal Industry -->
                      <td class="py-2 px-2">
                        <div class="flex items-center gap-1">
                          <input
                            v-model="goalIndustry"
                            type="text"
                            placeholder="Enter val"
                            class="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800"
                          />
                          <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium transition-colors">
                            Save
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Calculation Method Box (Matching Images 2 & 4) -->
            <div class="bg-blue-50/50 border border-blue-200/80 rounded-lg p-4 text-xs text-blue-900 space-y-1.5 font-sans">
              <span class="font-bold block text-blue-950">Calculation Method:</span>
              <p><strong class="text-blue-900">Baseline:</strong> Mean of all data points</p>
              <p><strong class="text-blue-900">Entitlement:</strong> Maximum value in dataset</p>
              <p><strong class="text-blue-900">Goal LSS:</strong> Baseline + (|Entitlement - Baseline| × 0.8)</p>
              <p><strong class="text-blue-900">Goal BU/Standard/Industry:</strong> User input, must be ≥ Goal LSS</p>
            </div>
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
