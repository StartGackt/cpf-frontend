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
  <div class="space-y-6 animate-in fade-in duration-200 select-none">
    
    <!-- ========================================================= -->
    <!-- HERO HEADER: Data Migration & Historical Import -->
    <!-- ========================================================= -->
    <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="space-y-2 relative z-10 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <div class="size-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
            <UIcon name="i-lucide-file-spreadsheet" class="size-5 text-amber-300" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Data Migration & Historical Archive
            </h1>
            <span class="text-xs text-teal-200">Bulk Excel Upload & Automated Six Sigma Field Mapping</span>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-teal-100/90 leading-relaxed pt-1">
          นำเข้าข้อมูลโครงงาน Six Sigma ย้อนหลังและฐานข้อมูลเดิมผ่านไฟล์ Excel เข้าสู่ฐานข้อมูลระบบ InsightGenie โดยอัตโนมัติ
        </p>
      </div>

      <div class="flex items-center gap-2.5 relative z-10 shrink-0">
        <button
          type="button"
          class="bg-white hover:bg-teal-50 text-[#008779] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer group"
          @click="isUploadModalOpen = true"
        >
          <UIcon name="i-lucide-upload-cloud" class="size-4 text-[#008779]" />
          <span>Upload Excel Batch</span>
        </button>
      </div>
    </div>

    <!-- Mapping Template Guide Box -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UIcon name="i-lucide-table" class="size-4 text-[#008779]" />
            <span>Excel Schema & Column Auto-Mapping</span>
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Standard header names automatically recognized during batch import
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="col in previewColumns"
          :key="col.excelCol"
          class="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-1 shadow-2xs"
        >
          <span class="text-[10px] text-teal-700 font-bold font-mono block">{{ col.excelCol }}</span>
          <span class="text-xs font-bold text-slate-900 block">&rarr; {{ col.mappedField }}</span>
          <span class="text-[10px] text-slate-400 block truncate">e.g. {{ col.sample }}</span>
        </div>
      </div>
    </div>

    <!-- Migration Logs Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div class="p-5 border-b border-slate-100">
        <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <UIcon name="i-lucide-history" class="size-4 text-[#008779]" />
          <span>Historical Import & Batch Audit Trail</span>
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <th class="py-3.5 px-4 font-semibold">BATCH ID & FILE NAME</th>
              <th class="py-3.5 px-4 font-semibold">UPLOADED BY</th>
              <th class="py-3.5 px-4 font-semibold">DATE & TIME</th>
              <th class="py-3.5 px-3 font-semibold text-center">TOTAL</th>
              <th class="py-3.5 px-3 font-semibold text-center">SUCCESS</th>
              <th class="py-3.5 px-3 font-semibold text-center">STATUS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="log in migrationLogs" :key="log.id" class="hover:bg-slate-50/70">
              <td class="py-4 px-4 font-mono">
                <span class="font-bold text-slate-900 block text-xs">{{ log.fileName }}</span>
                <span class="text-[10px] text-[#008779] block">{{ log.id }}</span>
              </td>
              <td class="py-4 px-4 font-medium text-slate-800">{{ log.uploadedBy }}</td>
              <td class="py-4 px-4 text-slate-500 font-mono">{{ log.uploadedAt }}</td>
              <td class="py-4 px-3 text-center font-bold font-mono text-slate-900">{{ log.totalRecords }}</td>
              <td class="py-4 px-3 text-center font-bold font-mono text-emerald-600">{{ log.successCount }}</td>
              <td class="py-4 px-3 text-center">
                <span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                  {{ log.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
