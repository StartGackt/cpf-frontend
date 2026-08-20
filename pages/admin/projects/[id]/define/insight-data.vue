<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const dateEntryMode = ref<'weekly' | 'monthly' | 'free'>('monthly')
const isAddTargetModalOpen = ref(false)
const targetType = ref('quality')
const targetName = ref('')
const targetUnit = ref('')

const monthlyData = ref([
  { id: 1, month: '1/25', actual: '80', total: '100', pct: '80.00', notes: '' },
  { id: 2, month: '2/25', actual: '84', total: '100', pct: '84.00', notes: '' },
  { id: 3, month: '3/25', actual: '84', total: '100', pct: '84.00', notes: '' },
  { id: 4, month: '4/25', actual: '83', total: '100', pct: '83.00', notes: '' },
  { id: 5, month: '5/25', actual: '82', total: '100', pct: '82.00', notes: '' },
  { id: 6, month: '6/25', actual: '85', total: '100', pct: '85.00', notes: '' },
  { id: 7, month: '7/25', actual: '88', total: '100', pct: '88.00', notes: '' },
  { id: 8, month: '8/25', actual: '83', total: '100', pct: '83.00', notes: '' },
  { id: 9, month: '9/25', actual: '85', total: '100', pct: '85.00', notes: '' },
  { id: 10, month: '10/25', actual: '82', total: '100', pct: '82.00', notes: '' },
  { id: 11, month: '11/25', actual: '84', total: '100', pct: '84.00', notes: '' },
  { id: 12, month: '12/25', actual: '85', total: '100', pct: '85.00', notes: '' }
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
      <span class="text-gray-700 font-medium">Define</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Insight Data</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Define"
        active-step="Insight Data"
      />

      <!-- Main Content Area (Split Grid: Left Data Table, Right Stats Panel) -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- Collapsible Header Banner (Image 2) -->
        <div class="bg-white rounded-lg border border-gray-200/80 shadow-xs p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                Define Phase Progress
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Define improvement targets and enter measurement data
              </p>
            </div>
          </div>
          <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        <!-- Section Title & Add Target Action (Image 2) -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100 gap-4">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Insight Data
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                Define improvement targets and enter measurement data
              </p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
              @click="isAddTargetModalOpen = true"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>Add Target</span>
            </button>
          </div>

          <!-- Target Header Row (Image 5) -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-gray-900">
                % Yield
              </h2>
              <button type="button" class="text-gray-400 hover:text-gray-600">
                <UIcon name="i-lucide-edit-2" class="size-3.5" />
              </button>
              <div class="flex items-center gap-3 text-xs text-gray-500 ml-4">
                <span>Category: <strong class="text-gray-700">Quality</strong></span>
                <span>Type: <strong class="text-gray-700">Increase</strong></span>
                <span>Unit: <strong class="text-gray-700">%</strong></span>
              </div>
            </div>

            <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              12 points
            </span>
          </div>

          <!-- Action Bar -->
          <div class="flex flex-wrap items-center justify-between text-xs gap-3">
            <button type="button" class="text-red-500 hover:text-red-700 font-medium text-xs">
              Delete Target
            </button>

            <div class="text-gray-500 font-medium">
              Date range: <strong class="text-gray-700">Jan 1 - Dec 1, 2025</strong> &nbsp;&nbsp; Average: <strong class="text-gray-700 font-mono">83.75</strong>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <!-- Mode Tabs -->
              <div class="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50 p-0.5 text-xs">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-sm font-medium transition-colors"
                  :class="dateEntryMode === 'weekly' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'"
                  @click="dateEntryMode = 'weekly'"
                >
                  Weekly
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-sm font-medium transition-colors"
                  :class="dateEntryMode === 'monthly' ? 'bg-[#008779] text-white font-bold' : 'text-gray-600 hover:text-gray-900'"
                  @click="dateEntryMode = 'monthly'"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-sm font-medium transition-colors"
                  :class="dateEntryMode === 'free' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-600 hover:text-gray-900'"
                  @click="dateEntryMode = 'free'"
                >
                  Free Text
                </button>
              </div>

              <button
                type="button"
                class="border border-gray-200 hover:bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
                <span>Add Row</span>
              </button>

              <button
                type="button"
                class="border border-gray-200 hover:bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium"
              >
                <UIcon name="i-lucide-file-spreadsheet" class="size-3.5" />
                <span>Import Excel</span>
              </button>

              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white px-3 py-1 rounded-md font-semibold flex items-center gap-1 shadow-xs"
              >
                <UIcon name="i-lucide-save" class="size-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Body: 2-Column Split -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <!-- LEFT: 12-Row Data Table (7 Cols) -->
          <div class="xl:col-span-7 bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
            <div class="overflow-x-auto border border-gray-200 rounded-lg">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
                    <th class="py-2.5 px-3 w-10 text-center">#</th>
                    <th class="py-2.5 px-4 w-28">MONTH (MM/YY)</th>
                    <th class="py-2.5 px-3 w-20 text-center">ACTUAL</th>
                    <th class="py-2.5 px-3 w-20 text-center">TOTAL</th>
                    <th class="py-2.5 px-3 w-20 text-center">%</th>
                    <th class="py-2.5 px-4">NOTES</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="row in monthlyData" :key="row.id" class="hover:bg-gray-50/50">
                    <td class="py-2 px-3 text-center text-gray-500 font-mono">{{ row.id }}</td>
                    <td class="py-2 px-4 font-medium text-gray-800">{{ row.month }}</td>
                    <td class="py-1 px-3 text-center">
                      <input
                        v-model="row.actual"
                        type="text"
                        class="w-14 bg-transparent border border-gray-200 rounded px-1.5 py-0.5 text-center text-xs font-mono text-gray-900"
                      />
                    </td>
                    <td class="py-1 px-3 text-center">
                      <input
                        v-model="row.total"
                        type="text"
                        class="w-14 bg-transparent border border-gray-200 rounded px-1.5 py-0.5 text-center text-xs font-mono text-gray-900"
                      />
                    </td>
                    <td class="py-2 px-3 text-center font-bold text-gray-900 font-mono">
                      {{ row.pct }}
                    </td>
                    <td class="py-1 px-4">
                      <input
                        v-model="row.notes"
                        type="text"
                        placeholder="-"
                        class="w-full bg-transparent border-0 px-1 py-0.5 text-xs text-gray-600"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer Stats -->
            <div class="flex items-center justify-between text-xs text-gray-600 bg-gray-50/60 p-3 rounded-md border border-gray-100 font-mono">
              <div>Mean: <strong class="text-gray-900">83.75</strong></div>
              <div>Median: <strong class="text-gray-900">84.00</strong></div>
              <div>Std Dev: <strong class="text-gray-900">2.01</strong></div>
            </div>
          </div>

          <!-- RIGHT: Statistical Analysis Panel (5 Cols) -->
          <div class="xl:col-span-5 space-y-6">
            <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
              <!-- Header & Export Buttons -->
              <div class="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 class="text-xs font-bold text-gray-900">
                  Statistical Analysis
                </h3>
                <div class="flex items-center gap-1.5">
                  <button type="button" class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] font-medium px-2 py-1 rounded">
                    Export Excel
                  </button>
                  <button type="button" class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-semibold px-2 py-1 rounded">
                    Export PDF
                  </button>
                </div>
              </div>

              <!-- Two Column Metrics Grid -->
              <div class="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div class="space-y-1 text-gray-600">
                  <div class="flex justify-between"><span>P-Value:</span> <span class="font-bold text-emerald-700">0.417</span></div>
                  <div class="flex justify-between"><span>Mean:</span> <span class="text-gray-900 font-semibold">83.750</span></div>
                  <div class="flex justify-between"><span>Std Dev:</span> <span class="text-gray-900 font-semibold">2.006</span></div>
                  <div class="flex justify-between"><span>Variance:</span> <span class="text-gray-900 font-semibold">4.023</span></div>
                  <div class="flex justify-between"><span>Skewness:</span> <span class="text-gray-900 font-semibold">0.24845</span></div>
                  <div class="flex justify-between"><span>Kurtosis:</span> <span class="text-gray-900 font-semibold">1.32945</span></div>
                </div>

                <div class="space-y-1 text-gray-600">
                  <div class="flex justify-between"><span>1st Quartile:</span> <span class="text-gray-900 font-semibold">82.250</span></div>
                  <div class="flex justify-between"><span>Median:</span> <span class="text-gray-900 font-semibold">84.000</span></div>
                  <div class="flex justify-between"><span>3rd Quartile:</span> <span class="text-gray-900 font-semibold">85.000</span></div>
                  <div class="flex justify-between"><span>Maximum:</span> <span class="text-gray-900 font-semibold">88.000</span></div>
                  <div class="flex justify-between"><span>Count:</span> <span class="text-gray-900 font-semibold">12</span></div>
                  <div class="flex justify-between"><span>Outliers:</span> <span class="text-gray-900 font-semibold">0</span></div>
                </div>
              </div>

              <!-- 95% Confidence Intervals text -->
              <div class="pt-2 border-t border-gray-100 text-[10px] space-y-0.5">
                <span class="font-bold text-gray-800 block text-[11px]">95% Confidence Intervals</span>
                <div class="flex justify-between text-gray-600"><span>Mean CI:</span> <span class="font-mono text-gray-900">82.476 - 85.024</span></div>
                <div class="flex justify-between text-gray-600"><span>Median CI:</span> <span class="font-mono text-gray-900">82.263 - 85.000</span></div>
                <div class="flex justify-between text-gray-600"><span>Std Dev CI:</span> <span class="font-mono text-gray-900">1.421 - 3.405</span></div>
              </div>

              <!-- Distribution of % Yield (Histogram + Normal Curve) -->
              <div class="space-y-1 pt-2 border-t border-gray-100">
                <span class="text-[11px] font-bold text-gray-800 block text-center">Distribution of % Yield</span>
                <div class="h-36 border border-gray-100 rounded p-1 flex items-center justify-center">
                  <svg class="w-full h-full" viewBox="0 0 200 100">
                    <line x1="20" y1="10" x2="20" y2="85" stroke="#cbd5e1" stroke-width="1" />
                    <line x1="20" y1="85" x2="190" y2="85" stroke="#cbd5e1" stroke-width="1" />

                    <!-- Histogram Bars -->
                    <rect x="35" y="70" width="20" height="15" fill="#60a5fa" stroke="#3b82f6" />
                    <rect x="60" y="45" width="20" height="40" fill="#60a5fa" stroke="#3b82f6" />
                    <rect x="85" y="25" width="20" height="60" fill="#60a5fa" stroke="#3b82f6" />
                    <rect x="110" y="55" width="20" height="30" fill="#60a5fa" stroke="#3b82f6" />
                    <rect x="135" y="70" width="20" height="15" fill="#60a5fa" stroke="#3b82f6" />

                    <!-- Red Normal Curve -->
                    <path d="M 30,80 Q 95,20 160,80" fill="none" stroke="#ef4444" stroke-width="1.5" />

                    <text x="35" y="93" font-size="6" fill="#64748b">80</text>
                    <text x="60" y="93" font-size="6" fill="#64748b">82</text>
                    <text x="85" y="93" font-size="6" fill="#64748b">84</text>
                    <text x="110" y="93" font-size="6" fill="#64748b">86</text>
                    <text x="135" y="93" font-size="6" fill="#64748b">88</text>
                  </svg>
                </div>
              </div>

              <!-- 95% Confidence Intervals graphic -->
              <div class="space-y-1 pt-2 border-t border-gray-100">
                <span class="text-[10px] font-bold text-gray-700 block text-center">95% Confidence Intervals</span>
                <div class="h-16 border border-gray-100 rounded p-1 flex items-center justify-center">
                  <svg class="w-full h-full" viewBox="0 0 200 40">
                    <line x1="20" y1="30" x2="180" y2="30" stroke="#cbd5e1" stroke-width="1" />
                    <text x="25" y="38" font-size="5" fill="#64748b">78</text>
                    <text x="65" y="38" font-size="5" fill="#64748b">80</text>
                    <text x="105" y="38" font-size="5" fill="#64748b">84</text>
                    <text x="145" y="38" font-size="5" fill="#64748b">86</text>
                    <text x="175" y="38" font-size="5" fill="#64748b">88</text>

                    <!-- Mean CI error bar -->
                    <line x1="80" y1="12" x2="135" y2="12" stroke="#0284c7" stroke-width="1.2" />
                    <circle cx="107" cy="12" r="2.5" fill="#0284c7" />

                    <!-- Median CI error bar -->
                    <line x1="75" y1="22" x2="135" y2="22" stroke="#6366f1" stroke-width="1.2" />
                    <circle cx="108" cy="22" r="2.5" fill="#6366f1" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- สรุปผล Card (Bottom of Right Panel matching Image 5) -->
            <div class="bg-emerald-50/40 border border-emerald-200 rounded-lg p-4 space-y-1.5 text-xs text-gray-800">
              <h4 class="font-bold text-gray-900 text-xs">
                สรุปผล
              </h4>
              <p>1. ข้อมูลมีการกระจายตัวแบบปกติ (Normal Distribution)</p>
              <p>2. มีค่าเฉลี่ย (Mean) อยู่ที่ <strong>83.750</strong></p>
              <p>3. มีค่าเบี่ยงเบนมาตรฐาน อยู่ที่ <strong>2.006</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD TARGET MODAL (Image 1) -->
    <div
      v-if="isAddTargetModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">
            Add Target
          </h3>
          <button
            type="button"
            class="text-teal-600 hover:text-teal-800 p-1 border border-teal-200 rounded-md"
            @click="isAddTargetModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4 text-xs">
          <!-- Radio: What do you want to improve? -->
          <div class="space-y-2">
            <label class="font-semibold text-gray-700 block">What do you want to improve? *</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center gap-2 border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-50">
                <input v-model="targetType" type="radio" value="quality" name="ttype" class="text-[#008779] focus:ring-[#008779]" />
                <span class="text-xs font-medium text-gray-800">Quality</span>
                <UIcon name="i-lucide-info" class="size-3 text-gray-400 ml-auto" />
              </label>

              <label class="flex items-center gap-2 border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-50">
                <input v-model="targetType" type="radio" value="speed" name="ttype" class="text-[#008779] focus:ring-[#008779]" />
                <span class="text-xs font-medium text-gray-800">Speed</span>
                <UIcon name="i-lucide-info" class="size-3 text-gray-400 ml-auto" />
              </label>
            </div>
          </div>

          <!-- Target -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Target *</label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md flex items-center gap-1 shrink-0 font-medium"
              >
                <UIcon name="i-lucide-list" class="size-3.5 text-gray-500" />
                <span>Select</span>
              </button>
              <input
                v-model="targetName"
                type="text"
                placeholder="Specify what you want to improve"
                class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
              />
            </div>
          </div>

          <!-- Unit of Measurement -->
          <div class="space-y-1">
            <label class="font-semibold text-gray-700 block">Unit of Measurement *</label>
            <input
              v-model="targetUnit"
              type="text"
              placeholder="e.g., %, seconds, mm"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isAddTargetModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="isAddTargetModalOpen = false"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
