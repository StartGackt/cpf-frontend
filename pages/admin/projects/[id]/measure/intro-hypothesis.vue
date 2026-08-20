<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
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
      <span class="text-gray-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Introduction to Hypothesis Testing</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Introduction to Hypothesis Testing"
      />

      <!-- Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Banner -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Introduction to Hypothesis Testing
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Understand the fundamental principles of statistical hypothesis testing before formulating root cause tests
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
                Hypothesis Testing Concepts & Workflow
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Overview of Statistical Testing Types (1-Sample T, 2-Sample T, ANOVA, Normality & Variance Tests)
              </p>
            </div>

            <NuxtLink
              :to="`/admin/projects/${projectId}/analyze/selected-tools`"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Proceed to Selected Tools</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </div>

          <!-- 3 Concept Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-teal-50/40 border border-teal-200/70 rounded-lg p-4 space-y-2">
              <div class="size-8 rounded-lg bg-teal-100 text-[#008779] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 class="text-xs font-bold text-gray-900">1. Formulate Hypotheses</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                Define the Null Hypothesis (H₀: μ₁ = μ₂) and Alternative Hypothesis (H₁: μ₁ ≠ μ₂) for prioritized factors from FMEA.
              </p>
            </div>

            <div class="bg-blue-50/40 border border-blue-200/70 rounded-lg p-4 space-y-2">
              <div class="size-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 class="text-xs font-bold text-gray-900">2. Validate Assumptions</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                Check for data normality using the Anderson-Darling test (P-Value &gt; 0.05) and equal variance assumptions.
              </p>
            </div>

            <div class="bg-emerald-50/40 border border-emerald-200/70 rounded-lg p-4 space-y-2">
              <div class="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 class="text-xs font-bold text-gray-900">3. Evaluate Significance</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                Analyze T-Value, degrees of freedom, and P-Value (P &lt; 0.05 = Significant) to identify factors requiring DOE.
              </p>
            </div>
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
