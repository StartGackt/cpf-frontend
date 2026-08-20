<script setup lang="ts">
import { ref } from 'vue'

const isUploadModalOpen = ref(false)
const uploadProgress = ref(100)
const isUploaded = ref(true)

const migrationLogs = ref([
  {
    id: 'MIG-2026-001',
    fileName: 'CPF_Historical_LSS_Projects_2020-2025.xlsx',
    uploadedBy: 'Romteera Tadderm',
    uploadedAt: '2026-02-24 11:20',
    totalRecords: 142,
    successCount: 142,
    failedCount: 0,
    status: 'Completed',
    importedTo: 'Project Dashboard & Historical DB'
  },
  {
    id: 'MIG-2026-002',
    fileName: 'Saraburi_Chicken_DMAIC_Archive.xlsx',
    uploadedBy: 'Nadtapong Aontawee',
    uploadedAt: '2026-02-20 14:15',
    totalRecords: 58,
    successCount: 56,
    failedCount: 2,
    status: 'Completed with Warnings',
    importedTo: 'Project Dashboard'
  }
])

const previewColumns = [
  { excelCol: 'Col A: Project_Title', mappedField: 'Project Name', sample: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด' },
  { excelCol: 'Col B: Plant_Code', mappedField: 'Location (Plant)', sample: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)' },
  { excelCol: 'Col C: Project_Year', mappedField: 'Fiscal Year', sample: '2025' },
  { excelCol: 'Col D: Belt_Level', mappedField: 'Project Belt Type', sample: 'Black Belt (BB)' },
  { excelCol: 'Col E: Baseline_Val', mappedField: 'Baseline Metric', sample: '83.75%' },
  { excelCol: 'Col F: Target_Goal', mappedField: 'Goal LSS Target', sample: '87.15%' },
  { excelCol: 'Col G: Annual_Savings_THB', mappedField: 'Financial Impact', sample: '4,250,000 THB' },
  { excelCol: 'Col H: Leader_Name', mappedField: 'Project Owner', sample: 'Romteera Tadderm' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Data Migration & Historical Import
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          Import legacy project records from Excel spreadsheets directly into the database without re-keying forms
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UIcon name="i-lucide-download" class="size-3.5 text-gray-500" />
          <span>Download Excel Template</span>
        </button>

        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          @click="isUploadModalOpen = true"
        >
          <UIcon name="i-lucide-upload" class="size-3.5" />
          <span>Import Historical Excel</span>
        </button>
      </div>
    </div>

    <!-- 3 Stat Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
        <span class="text-xs text-gray-500 font-medium">Total Migrated Historical Projects</span>
        <p class="text-2xl font-bold text-[#008779] font-mono">200</p>
        <span class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
          <UIcon name="i-lucide-check-circle-2" class="size-3" />
          <span>Available on Dashboard Analytics</span>
        </span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
        <span class="text-xs text-gray-500 font-medium">Auto Field Mapping Accuracy</span>
        <p class="text-2xl font-bold text-gray-900 font-mono">99.0%</p>
        <span class="text-[11px] text-gray-500">
          Mapped against CPF Master Data Hierarchy
        </span>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-1">
        <span class="text-xs text-gray-500 font-medium">Cumulative Savings Preserved</span>
        <p class="text-2xl font-bold text-gray-900 font-mono">145.8M THB</p>
        <span class="text-[11px] text-teal-600 font-semibold">
          Years 2020 - 2025 Archive
        </span>
      </div>
    </div>

    <!-- Excel Column Auto-Mapping Preview -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 class="text-sm font-bold text-gray-900">
            Excel Column Auto-Mapping Schema
          </h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Auto-translates legacy Excel headers into InsightGenie V2.0 DMAIC data structures
          </p>
        </div>
        <span class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
          8 Core Fields Validated
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="(col, idx) in previewColumns"
          :key="idx"
          class="border border-gray-200 rounded-lg p-3 space-y-1 bg-gray-50/50"
        >
          <span class="text-[10px] text-gray-400 font-mono font-bold block">{{ col.excelCol }}</span>
          <span class="text-xs font-bold text-gray-900 block">{{ col.mappedField }}</span>
          <span class="text-[11px] text-[#008779] font-mono truncate block">Ex: {{ col.sample }}</span>
        </div>
      </div>
    </div>

    <!-- Migration Batch History Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 class="text-sm font-bold text-gray-900">
          Historical Migration Batch History
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3 px-4 font-semibold">BATCH ID</th>
              <th class="py-3 px-4 font-semibold">FILE NAME</th>
              <th class="py-3 px-4 font-semibold">IMPORTED BY</th>
              <th class="py-3 px-4 font-semibold">TIMESTAMP</th>
              <th class="py-3 px-3 font-semibold text-center">RECORDS</th>
              <th class="py-3 px-3 font-semibold text-center">SUCCESS</th>
              <th class="py-3 px-4 font-semibold text-center">STATUS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="log in migrationLogs" :key="log.id" class="hover:bg-gray-50/50">
              <td class="py-3.5 px-4 font-bold text-gray-900 font-mono">{{ log.id }}</td>
              <td class="py-3.5 px-4 font-medium text-teal-700 flex items-center gap-1.5">
                <UIcon name="i-lucide-file-spreadsheet" class="size-4 text-teal-600" />
                <span>{{ log.fileName }}</span>
              </td>
              <td class="py-3.5 px-4 text-gray-800">{{ log.uploadedBy }}</td>
              <td class="py-3.5 px-4 text-gray-500 font-mono">{{ log.uploadedAt }}</td>
              <td class="py-3.5 px-3 text-center font-bold text-gray-900 font-mono">{{ log.totalRecords }}</td>
              <td class="py-3.5 px-3 text-center font-bold text-emerald-700 font-mono">{{ log.successCount }}</td>
              <td class="py-3.5 px-4 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  :class="log.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ log.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- UPLOAD EXCEL MODAL -->
    <div
      v-if="isUploadModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900">
            Import Historical Projects (.xlsx / .csv)
          </h3>
          <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="isUploadModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs">
          <!-- Drag & Drop Zone -->
          <div class="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center bg-teal-50/20 hover:bg-teal-50/40 transition-colors cursor-pointer space-y-2">
            <div class="size-12 rounded-full bg-teal-100 text-[#008779] flex items-center justify-center mx-auto">
              <UIcon name="i-lucide-file-spreadsheet" class="size-6" />
            </div>
            <p class="font-bold text-gray-900">Drag & drop your Excel file here</p>
            <p class="text-gray-500 text-[11px]">Supports .xlsx, .xls, .csv files up to 50MB</p>
            <button
              type="button"
              class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs"
            >
              Browse Local Files
            </button>
          </div>

          <!-- Notice -->
          <div class="bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-900 leading-relaxed space-y-1">
            <strong class="font-bold block text-blue-950">Zero Re-keying Guarantee:</strong>
            <p>The system will automatically extract project titles, baseline metrics, entitlement, belt levels, and calculate historical trends for the Executive Dashboard.</p>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            @click="isUploadModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="isUploadModalOpen = false"
          >
            Start Migration Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
