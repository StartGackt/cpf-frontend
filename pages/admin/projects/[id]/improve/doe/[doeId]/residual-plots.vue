<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const doeId = (route.params.doeId as string) || 'doe-1'
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Top Header -->
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink
          :to="`/admin/projects/${projectId}/improve/doe/${doeId}/analysis`"
          class="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#008779] font-medium transition-colors mb-2"
        >
          <UIcon name="i-lucide-arrow-left" class="size-3.5" />
          <span>Back to Analysis Results</span>
        </NuxtLink>

        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Residual Diagnostic Plots
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Export Plots</span>
        </button>
      </div>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Improve"
        active-step="DOE"
      />

      <!-- Content 2x2 Plots Grid -->
      <div class="flex-1 space-y-6 min-w-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 1. Normal Probability Plot -->
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 space-y-3">
            <h3 class="text-xs font-bold text-gray-900">
              Normal Probability Plot
            </h3>

            <!-- Chart SVG -->
            <div class="h-64 relative border border-gray-100 rounded-md p-4 flex items-center justify-center">
              <svg class="w-full h-full" viewBox="0 0 320 200">
                <!-- Axes -->
                <line x1="40" y1="20" x2="40" y2="170" stroke="#94a3b8" stroke-width="1.5" />
                <line x1="40" y1="170" x2="300" y2="170" stroke="#94a3b8" stroke-width="1.5" />

                <!-- Gridlines -->
                <line x1="40" y1="50" x2="300" y2="50" stroke="#f1f5f9" stroke-width="1" />
                <line x1="40" y1="95" x2="300" y2="95" stroke="#f1f5f9" stroke-width="1" />
                <line x1="40" y1="135" x2="300" y2="135" stroke="#f1f5f9" stroke-width="1" />

                <!-- Labels Y -->
                <text x="32" y="30" font-size="9" fill="#64748b" text-anchor="end">100%</text>
                <text x="32" y="65" font-size="9" fill="#64748b" text-anchor="end">80%</text>
                <text x="32" y="100" font-size="9" fill="#64748b" text-anchor="end">50%</text>
                <text x="32" y="140" font-size="9" fill="#64748b" text-anchor="end">20%</text>
                <text x="32" y="172" font-size="9" fill="#64748b" text-anchor="end">0%</text>

                <!-- Labels X -->
                <text x="50" y="185" font-size="9" fill="#64748b" text-anchor="middle">-0.04</text>
                <text x="110" y="185" font-size="9" fill="#64748b" text-anchor="middle">-0.02</text>
                <text x="170" y="185" font-size="9" fill="#64748b" text-anchor="middle">0.00</text>
                <text x="230" y="185" font-size="9" fill="#64748b" text-anchor="middle">0.02</text>
                <text x="290" y="185" font-size="9" fill="#64748b" text-anchor="middle">0.04</text>

                <!-- Titles -->
                <text x="170" y="198" font-size="9" fill="#475569" text-anchor="middle" font-weight="600">Residuals</text>
                <text x="12" y="100" font-size="9" fill="#475569" text-anchor="middle" transform="rotate(-90 12 100)" font-weight="600">Percent (%)</text>

                <!-- Fit line (Red diagonal) -->
                <line x1="50" y1="160" x2="280" y2="35" stroke="#ef4444" stroke-width="1.8" />

                <!-- Scatter points (Blue dots) -->
                <circle cx="65" cy="150" r="3.5" fill="#3b82f6" />
                <circle cx="85" cy="140" r="3.5" fill="#3b82f6" />
                <circle cx="110" cy="115" r="3.5" fill="#3b82f6" />
                <circle cx="170" cy="98" r="3.5" fill="#3b82f6" />
                <circle cx="230" cy="88" r="3.5" fill="#3b82f6" />
                <circle cx="250" cy="65" r="3.5" fill="#3b82f6" />
                <circle cx="265" cy="50" r="3.5" fill="#3b82f6" />
                <circle cx="275" cy="30" r="3.5" fill="#3b82f6" />
              </svg>
            </div>
          </div>

          <!-- 2. Residuals vs Fitted Values -->
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 space-y-3">
            <h3 class="text-xs font-bold text-gray-900">
              Residuals vs Fitted Values
            </h3>

            <div class="h-64 relative border border-gray-100 rounded-md p-4 flex items-center justify-center">
              <svg class="w-full h-full" viewBox="0 0 320 200">
                <!-- Axes -->
                <line x1="45" y1="20" x2="45" y2="170" stroke="#94a3b8" stroke-width="1.5" />
                <line x1="45" y1="170" x2="300" y2="170" stroke="#94a3b8" stroke-width="1.5" />

                <!-- Center 0.00 Dashed Reference Line -->
                <line x1="45" y1="95" x2="300" y2="95" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3" />

                <!-- Labels Y -->
                <text x="38" y="35" font-size="9" fill="#64748b" text-anchor="end">0.04</text>
                <text x="38" y="65" font-size="9" fill="#64748b" text-anchor="end">0.02</text>
                <text x="38" y="98" font-size="9" fill="#64748b" text-anchor="end">0.00</text>
                <text x="38" y="130" font-size="9" fill="#64748b" text-anchor="end">-0.02</text>
                <text x="38" y="160" font-size="9" fill="#64748b" text-anchor="end">-0.04</text>

                <!-- Labels X -->
                <text x="60" y="185" font-size="9" fill="#64748b" text-anchor="middle">2.2</text>
                <text x="100" y="185" font-size="9" fill="#64748b" text-anchor="middle">2.6</text>
                <text x="150" y="185" font-size="9" fill="#64748b" text-anchor="middle">3.0</text>
                <text x="210" y="185" font-size="9" fill="#64748b" text-anchor="middle">3.4</text>
                <text x="280" y="185" font-size="9" fill="#64748b" text-anchor="middle">3.8</text>

                <!-- Titles -->
                <text x="170" y="198" font-size="9" fill="#475569" text-anchor="middle" font-weight="600">Fitted Values</text>
                <text x="12" y="95" font-size="9" fill="#475569" text-anchor="middle" transform="rotate(-90 12 95)" font-weight="600">Residuals</text>

                <!-- Scatter Points -->
                <circle cx="55" cy="65" r="3.5" fill="#3b82f6" />
                <circle cx="58" cy="130" r="3.5" fill="#3b82f6" />
                <circle cx="160" cy="50" r="3.5" fill="#3b82f6" />
                <circle cx="165" cy="140" r="3.5" fill="#3b82f6" />
                <circle cx="230" cy="40" r="3.5" fill="#3b82f6" />
                <circle cx="232" cy="155" r="3.5" fill="#3b82f6" />
                <circle cx="270" cy="35" r="3.5" fill="#3b82f6" />
                <circle cx="275" cy="165" r="3.5" fill="#3b82f6" />
              </svg>
            </div>
          </div>

          <!-- 3. Histogram of Residuals -->
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 space-y-3">
            <h3 class="text-xs font-bold text-gray-900">
              Histogram of Residuals
            </h3>

            <div class="h-64 relative border border-gray-100 rounded-md p-4 flex items-center justify-center">
              <svg class="w-full h-full" viewBox="0 0 320 200">
                <!-- Axes -->
                <line x1="45" y1="20" x2="45" y2="170" stroke="#94a3b8" stroke-width="1.5" />
                <line x1="45" y1="170" x2="300" y2="170" stroke="#94a3b8" stroke-width="1.5" />

                <!-- Labels Y -->
                <text x="38" y="35" font-size="9" fill="#64748b" text-anchor="end">3.0</text>
                <text x="38" y="70" font-size="9" fill="#64748b" text-anchor="end">2.0</text>
                <text x="38" y="115" font-size="9" fill="#64748b" text-anchor="end">1.0</text>
                <text x="38" y="170" font-size="9" fill="#64748b" text-anchor="end">0.0</text>

                <!-- Labels X -->
                <text x="60" y="185" font-size="9" fill="#64748b" text-anchor="middle">-0.10</text>
                <text x="115" y="185" font-size="9" fill="#64748b" text-anchor="middle">-0.05</text>
                <text x="170" y="185" font-size="9" fill="#64748b" text-anchor="middle">0.00</text>
                <text x="225" y="185" font-size="9" fill="#64748b" text-anchor="middle">0.05</text>
                <text x="280" y="185" font-size="9" fill="#64748b" text-anchor="middle">0.10</text>

                <!-- Titles -->
                <text x="170" y="198" font-size="9" fill="#475569" text-anchor="middle" font-weight="600">Residuals</text>
                <text x="12" y="95" font-size="9" fill="#475569" text-anchor="middle" transform="rotate(-90 12 95)" font-weight="600">Frequency</text>

                <!-- Histogram Bars (Blue) -->
                <rect x="95" y="125" width="22" height="45" fill="#60a5fa" stroke="#3b82f6" />
                <rect x="120" y="35" width="22" height="135" fill="#60a5fa" stroke="#3b82f6" />
                <rect x="195" y="35" width="22" height="135" fill="#60a5fa" stroke="#3b82f6" />
                <rect x="220" y="125" width="22" height="45" fill="#60a5fa" stroke="#3b82f6" />
              </svg>
            </div>
          </div>

          <!-- 4. Residuals vs Run Order -->
          <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-5 space-y-3">
            <h3 class="text-xs font-bold text-gray-900">
              Residuals vs Run Order
            </h3>

            <div class="h-64 relative border border-gray-100 rounded-md p-4 flex items-center justify-center">
              <svg class="w-full h-full" viewBox="0 0 320 200">
                <!-- Axes -->
                <line x1="45" y1="20" x2="45" y2="170" stroke="#94a3b8" stroke-width="1.5" />
                <line x1="45" y1="170" x2="300" y2="170" stroke="#94a3b8" stroke-width="1.5" />

                <!-- Center 0.00 Reference Line -->
                <line x1="45" y1="95" x2="300" y2="95" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 3" />

                <!-- Labels Y -->
                <text x="38" y="35" font-size="9" fill="#64748b" text-anchor="end">0.04</text>
                <text x="38" y="65" font-size="9" fill="#64748b" text-anchor="end">0.02</text>
                <text x="38" y="98" font-size="9" fill="#64748b" text-anchor="end">0.00</text>
                <text x="38" y="130" font-size="9" fill="#64748b" text-anchor="end">-0.02</text>
                <text x="38" y="160" font-size="9" fill="#64748b" text-anchor="end">-0.04</text>

                <!-- Labels X -->
                <text x="65" y="185" font-size="9" fill="#64748b" text-anchor="middle">1</text>
                <text x="95" y="185" font-size="9" fill="#64748b" text-anchor="middle">2</text>
                <text x="130" y="185" font-size="9" fill="#64748b" text-anchor="middle">3</text>
                <text x="165" y="185" font-size="9" fill="#64748b" text-anchor="middle">4</text>
                <text x="200" y="185" font-size="9" fill="#64748b" text-anchor="middle">5</text>
                <text x="235" y="185" font-size="9" fill="#64748b" text-anchor="middle">6</text>
                <text x="265" y="185" font-size="9" fill="#64748b" text-anchor="middle">7</text>
                <text x="290" y="185" font-size="9" fill="#64748b" text-anchor="middle">8</text>

                <!-- Titles -->
                <text x="170" y="198" font-size="9" fill="#475569" text-anchor="middle" font-weight="600">Run Order</text>
                <text x="12" y="95" font-size="9" fill="#475569" text-anchor="middle" transform="rotate(-90 12 95)" font-weight="600">Residuals</text>

                <!-- Connected Line Chart -->
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  stroke-width="1.2"
                  points="65,130 95,50 130,155 165,30 200,60 235,35 265,145 290,165"
                />

                <!-- Data Dots -->
                <circle cx="65" cy="130" r="3" fill="#3b82f6" />
                <circle cx="95" cy="50" r="3" fill="#3b82f6" />
                <circle cx="130" cy="155" r="3" fill="#3b82f6" />
                <circle cx="165" cy="30" r="3" fill="#3b82f6" />
                <circle cx="200" cy="60" r="3" fill="#3b82f6" />
                <circle cx="235" cy="35" r="3" fill="#3b82f6" />
                <circle cx="265" cy="145" r="3" fill="#3b82f6" />
                <circle cx="290" cy="165" r="3" fill="#3b82f6" />
              </svg>
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
