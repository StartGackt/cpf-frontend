<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const projectId = computed(() => (route.params.id as string) || 'example-total-yield')

const {
  project
} = useProjectData(projectId.value)

// Navigation Tabs
const activeTab = ref('fishbone')
const tabs = [
  { id: 'maps', label: 'Process Maps', icon: 'i-lucide-map' },
  { id: 'sipoc', label: 'SIPOC', icon: 'i-lucide-layers' },
  { id: 'swimlane', label: 'Swimlane', icon: 'i-lucide-git-commit' },
  { id: 'fishbone', label: 'Fishbone Diagram', icon: 'i-lucide-git-branch' },
  { id: 'fmea', label: 'FMEA', icon: 'i-lucide-table-properties' }
]

// Current View Mode: Default to visual 'diagram' as requested by user
const currentViewMode = ref<'diagram' | 'list'>('diagram')

// Problem Statement (Fish Head) State
const problemStatement = ref({
  title: '%Total Yield',
  subtitle: 'สินค้าไก่ทอดต่ำกว่าเกณฑ์เป้าหมาย',
  currentValue: '78.5%',
  goalValue: '85.0%',
  metric: 'Total Yield (%)'
})

// 5M1E Structure with initial realistic CPF manufacturing data
export interface FishboneCause {
  id: string
  name: string
  type: 'C' | 'N' // C: Controllable, N: Noise
  isKey?: boolean
  whys?: string[]
}

export interface FishboneCategory {
  key: string
  name: string
  labelTh: string
  accentColor: string
  borderClass: string
  badgeClass: string
  causes: FishboneCause[]
}

const categories = ref<FishboneCategory[]>([
  {
    key: 'material',
    name: 'Material',
    labelTh: 'วัตถุดิบ',
    accentColor: '#2563EB',
    borderClass: 'border-blue-200 bg-blue-50/20',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    causes: [
      {
        id: 'c-mat-1',
        name: 'ขนาดชิ้นเนื้อไก่ไม่สม่ำเสมอ (Standard Size)',
        type: 'C',
        isKey: true,
        whys: ['ใบมีดตัดชิ้นเนื้อทื่อ', 'รอบเปลี่ยนใบมีดยังไม่ถึงแต่เนื้อเหนียวผิดปกติ', 'ไม่ได้ตรวจความคมมีดก่อนเริ่มกะ']
      },
      {
        id: 'c-mat-2',
        name: 'อุณหภูมิเนื้อไก่ก่อนคลุกแป้งสูงเกิน 4°C',
        type: 'C',
        isKey: false,
        whys: ['เนื้อไก่วางพักในห้องรอนานเกิน 15 นาที', 'ปริมาณการเบิกเนื้อไก่ออกมาเกินความเร็วสายพาน']
      },
      {
        id: 'c-mat-3',
        name: 'ความชื้นในแป้งชุบทอดมีความแปรปรวนจากซัพพลายเออร์',
        type: 'N',
        isKey: false,
        whys: ['สภาพอากาศในฤดูฝนระหว่างการจัดส่ง', 'ไม่มีห้องควบคุมความชื้นขณะเก็บวัตถุดิบ']
      }
    ]
  },
  {
    key: 'method',
    name: 'Method',
    labelTh: 'วิธีการ',
    accentColor: '#D97706',
    borderClass: 'border-amber-200 bg-amber-50/20',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    causes: [
      {
        id: 'c-met-1',
        name: 'เวลาในการชุบแป้งสั้นกว่ามาตรฐาน WI (ต่ำกว่า 8 วิ)',
        type: 'C',
        isKey: true,
        whys: ['พนักงานเร่งจังหวะให้ทันยอดผลิตต่อชั่วโมง', 'ไม่มีเสียงสัญญาณเตือนจับเวลาบนหน้าเครื่อง']
      },
      {
        id: 'c-met-2',
        name: 'ลำดับการเรียงชิ้นไก่บนตะแกรงทอดซ้อนทับกัน',
        type: 'C',
        isKey: false,
        whys: ['พื้นที่ตะแกรงวางไม่พอเมื่อเทียบกับ Batch size', 'ไม่มี Layout กำกับตำแหน่งวางชิ้นไก่']
      }
    ]
  },
  {
    key: 'man',
    name: 'Man',
    labelTh: 'บุคลากร',
    accentColor: '#E11D48',
    borderClass: 'border-rose-200 bg-rose-50/20',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    causes: [
      {
        id: 'c-man-1',
        name: 'พนักงานใหม่ขาดการอบรม OJT เรื่องการตรวจสอบเศษแป้งเกรียม',
        type: 'C',
        isKey: true,
        whys: ['พนักงานเพิ่งเริ่มงานกะแรกแทนคนลา', 'ไม่มีหัวหน้ากะประกบสอนงานหน้าไลน์']
      },
      {
        id: 'c-man-2',
        name: 'ความเหนื่อยล้าของพนักงานในช่วงกะดึก (02:00 - 05:00 น.)',
        type: 'N',
        isKey: false,
        whys: ['การหมุนเวียนกะพักเบรกยังไม่สอดคล้องกับชีวภาพร่างกาย']
      }
    ]
  },
  {
    key: 'machine',
    name: 'Machine',
    labelTh: 'เครื่องจักร',
    accentColor: '#059669',
    borderClass: 'border-emerald-200 bg-emerald-50/20',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    causes: [
      {
        id: 'c-mac-1',
        name: 'อุณหภูมิน้ำมันในกระทะทอดไม่คงที่ (Flulctuate ±7°C)',
        type: 'C',
        isKey: true,
        whys: ['ฮีตเตอร์โซน 2 มีคราบคาร์บอนเกาะหนา', 'ระบบกรองน้ำมันอัตโนมัติตัน', 'ขาดการทำ Preventive Maintenance ประจำสัปดาห์']
      },
      {
        id: 'c-mac-2',
        name: 'สายพานลำเลียงสั่นสะเทือนทำให้เกล็ดแป้งหลุด',
        type: 'C',
        isKey: false,
        whys: ['ตลับลูกปืน (Bearing) สายพานสึกหรอ', 'ความตึงสายพานไม่ได้ระยะมาตรฐาน']
      },
      {
        id: 'c-mac-3',
        name: 'หัวฉีดน้ำมันทอดแรงดันตกขณะเดินเครื่องเต็มกำลัง',
        type: 'C',
        isKey: false,
        whys: ['ปั๊มแรงดันมีเศษแป้งอุดตันบริเวณวาล์วบายพาส']
      }
    ]
  },
  {
    key: 'measurement',
    name: 'Measurement',
    labelTh: 'การวัดผล',
    accentColor: '#4F46E5',
    borderClass: 'border-indigo-200 bg-indigo-50/20',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    causes: [
      {
        id: 'c-mea-1',
        name: 'เครื่องวัดค่าความชื้น NIR ขาดการ Calibrate ประจำเดือน',
        type: 'C',
        isKey: false,
        whys: ['เลยรอบการสอบเทียบจากแผนกมาตรวิทยา', 'ไม่มีป้ายเตือนสถานะ Calibration บนตัวเครื่อง']
      },
      {
        id: 'c-mea-2',
        name: 'การสุ่มตัวอย่างตรวจชิ้นงานไม่กระจายตัวตามช่วงเวลา',
        type: 'C',
        isKey: true,
        whys: ['สุ่มเฉพาะต้นกะและท้ายกะ ขาดช่วงกลางกะ', 'ไม่มีระบบบันทึกเวลาสุ่มตรวจอัตโนมัติบนแท็บเล็ต']
      }
    ]
  },
  {
    key: 'environment',
    name: 'Environment',
    labelTh: 'สภาพแวดล้อม',
    accentColor: '#0D9488',
    borderClass: 'border-teal-200 bg-teal-50/20',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    causes: [
      {
        id: 'c-env-1',
        name: 'ความชื้นสัมพัทธ์ในห้องบรรจุสูงเกิน 65% RH ในวันที่ฝนตก',
        type: 'N',
        isKey: false,
        whys: ['ประตูทางเข้าห้องชุบแป้งเปิดค้างบ่อยขณะขนถ่ายพาเลท', 'ม่านลมหน้าประตูทำงานไม่เต็มประสิทธิภาพ']
      },
      {
        id: 'c-env-2',
        name: 'แสงสว่างบริเวณจุดตรวจสอบสายตามีเงาสะท้อนผิวน้ำมัน',
        type: 'C',
        isKey: false,
        whys: ['มุมติดตั้งโคมไฟ LED ส่องตรงข้ามกับแนวมองของพนักงาน QC']
      }
    ]
  }
])

// Computed Counts & Summaries
const totalFactorsCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.causes.length, 0)
})

const categoriesSummaryString = computed(() => {
  return categories.value.map(c => `${c.name}: ${c.causes.length}`).join(' • ')
})

// Toast feedback helper
const toastMessage = ref('')
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Slide-Over Drawer State
const isDrawerOpen = ref(false)
const drawerActiveCategory = ref('machine')
const drawerNewCause = ref({
  name: '',
  type: 'C' as 'C' | 'N',
  isKey: false,
  why1: '',
  why2: '',
  why3: ''
})

const openDrawer = (catKey: string = 'machine') => {
  drawerActiveCategory.value = catKey
  drawerNewCause.value = {
    name: '',
    type: 'C',
    isKey: false,
    why1: '',
    why2: '',
    why3: ''
  }
  isDrawerOpen.value = true
}

const addCauseInDrawer = () => {
  if (!drawerNewCause.value.name.trim()) {
    showToast('กรุณากรอกชื่อปัจจัย/สาเหตุ')
    return
  }

  const targetCat = categories.value.find(c => c.key === drawerActiveCategory.value)
  if (targetCat) {
    const whysList: string[] = []
    if (drawerNewCause.value.why1.trim()) whysList.push(drawerNewCause.value.why1.trim())
    if (drawerNewCause.value.why2.trim()) whysList.push(drawerNewCause.value.why2.trim())
    if (drawerNewCause.value.why3.trim()) whysList.push(drawerNewCause.value.why3.trim())

    targetCat.causes.push({
      id: `cause-${Date.now()}`,
      name: drawerNewCause.value.name.trim(),
      type: drawerNewCause.value.type,
      isKey: drawerNewCause.value.isKey,
      whys: whysList
    })

    drawerNewCause.value = {
      name: '',
      type: 'C',
      isKey: false,
      why1: '',
      why2: '',
      why3: ''
    }

    showToast(`✓ เพิ่มสาเหตุในหมวด ${targetCat.name} สำเร็จ!`)
  }
}

const deleteCause = (catKey: string, causeId: string) => {
  const cat = categories.value.find(c => c.key === catKey)
  if (cat) {
    cat.causes = cat.causes.filter(c => c.id !== causeId)
    showToast('ลบสาเหตุออกจากผังก้างปลาแล้ว')
  }
}

// 5-Why Drilldown Modal
const selectedCauseForWhy = ref<{
  categoryName: string
  cause: FishboneCause
} | null>(null)

const openWhyModal = (catName: string, cause: FishboneCause) => {
  selectedCauseForWhy.value = {
    categoryName: catName,
    cause: JSON.parse(JSON.stringify(cause))
  }
}

const saveWhyModal = () => {
  if (selectedCauseForWhy.value) {
    for (const cat of categories.value) {
      const target = cat.causes.find(c => c.id === selectedCauseForWhy.value?.cause.id)
      if (target) {
        target.name = selectedCauseForWhy.value.cause.name
        target.type = selectedCauseForWhy.value.cause.type
        target.isKey = selectedCauseForWhy.value.cause.isKey
        target.whys = (selectedCauseForWhy.value.cause.whys || []).filter(w => w && w.trim())
        showToast('✓ บันทึกการวิเคราะห์ 5-Why สำเร็จ')
        break
      }
    }
  }
  selectedCauseForWhy.value = null
}

const addWhyStep = () => {
  if (selectedCauseForWhy.value) {
    if (!selectedCauseForWhy.value.cause.whys) {
      selectedCauseForWhy.value.cause.whys = []
    }
    if (selectedCauseForWhy.value.cause.whys.length < 5) {
      selectedCauseForWhy.value.cause.whys.push('')
    }
  }
}

const toggleCauseType = (catKey: string, causeId: string) => {
  const cat = categories.value.find(c => c.key === catKey)
  if (cat) {
    const c = cat.causes.find(item => item.id === causeId)
    if (c) {
      c.type = c.type === 'C' ? 'N' : 'C'
      showToast(`เปลี่ยนประเภทเป็น [${c.type === 'C' ? 'Control' : 'Noise'}]`)
    }
  }
}

const toggleKeyCause = (catKey: string, causeId: string) => {
  const cat = categories.value.find(c => c.key === catKey)
  if (cat) {
    const c = cat.causes.find(item => item.id === causeId)
    if (c) {
      c.isKey = !c.isKey
      showToast(c.isKey ? `★ ทำเครื่องหมายเป็น Key Root Cause` : `ยกเลิก Key Root Cause`)
    }
  }
}

// Problem Statement Modal
const isProblemModalOpen = ref(false)
const tempProblemStatement = ref({ ...problemStatement.value })
const openProblemModal = () => {
  tempProblemStatement.value = { ...problemStatement.value }
  isProblemModalOpen.value = true
}
const saveProblemStatement = () => {
  problemStatement.value = { ...tempProblemStatement.value }
  isProblemModalOpen.value = false
  showToast('✓ แก้ไข Problem Statement สำเร็จ')
}

// AI Suggestions Modal
const isAiSuggestModalOpen = ref(false)
const aiSuggestedCauses = ref([
  { catKey: 'machine', name: 'ความร้อนกระทะทอดไม่สม่ำเสมอตามแนวยาว', type: 'C' as const, whys: ['หัวเบิร์นเนอร์โซน 3 อุดตัน', 'ไม่ได้ล้างระบบฉีดแก๊สตามรอบ'] },
  { catKey: 'material', name: 'ความชื้นในเกล็ดขนมปัง (Breadcrumbs) เกินมาตรฐาน', type: 'C' as const, whys: ['การเก็บถุงเกล็ดขนมปังในห้องความชื้นสูง', 'ไม่ได้ซีลปากถุงหลังเปิดใช้งาน'] },
  { catKey: 'method', name: 'ระยะห่างระหว่างชิ้นไก่บนสายพานทอดชิดเกินไป', type: 'C' as const, whys: ['พนักงานวางชิ้นไก่เร็วเกินไปเพื่อเร่งยอด', 'ไม่มี Guide Lane กำกับระยะห่าง'] },
  { catKey: 'measurement', name: 'จุดวัดอุณหภูมิแกนกลางชิ้นเนื้อไก่ไม่ตรงตำแหน่ง', type: 'C' as const, whys: ['ปลายโพรบวัดเสียบลึกเกินไปถึงกระดูก', 'ขาดมาตรฐาน Work Instruction การวัด Temp'] }
])

const applyAiSuggestions = () => {
  for (const item of aiSuggestedCauses.value) {
    const cat = categories.value.find(c => c.key === item.catKey)
    if (cat) {
      cat.causes.push({
        id: `cause-ai-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: item.name,
        type: item.type,
        isKey: true,
        whys: item.whys
      })
    }
  }
  isAiSuggestModalOpen.value = false
  showToast('✓ นำข้อเสนอแนะ AI เข้าสู่ผังก้างปลาเรียบร้อยแล้ว!')
}

// Sync to FMEA
const syncToFmea = () => {
  const controllableCount = categories.value.reduce((sum, cat) => sum + cat.causes.filter(c => c.type === 'C').length, 0)
  showToast(`✓ ซิงค์ ${controllableCount} ปัจจัย [C] ไปยังตาราง FMEA สำเร็จแล้ว!`)
}

// Export Diagram
const exportFishboneDiagram = () => {
  showToast('📥 กำลังเตรียมส่งออก Fishbone Diagram (PNG/PDF)...')
  setTimeout(() => {
    window.print()
  }, 500)
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
    <!-- Toast Feedback Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <span class="size-2 rounded-full bg-teal-400 animate-ping"></span>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Top Breadcrumb & Workflow Header -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <NuxtLink to="/admin/projects" class="hover:text-slate-800 transition-colors">Projects</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="size-3.5 text-slate-400" />
        <span class="text-slate-700 font-semibold truncate max-w-xs">{{ project.name }}</span>
        <UIcon name="i-lucide-chevron-right" class="size-3.5 text-slate-400" />
        <span class="text-[#008779] font-bold">Measure Phase</span>
        <UIcon name="i-lucide-chevron-right" class="size-3.5 text-slate-400" />
        <span class="text-slate-900 font-bold">Fishbone Diagram</span>
      </div>

      <!-- Main DMAIC Phase Header & Navigation Tabs -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="size-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#008779] shadow-2xs">
              <UIcon name="i-lucide-git-branch" class="size-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-slate-900">Fishbone Diagram (Ishikawa Analysis)</h1>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-100 text-[#008779] border border-teal-200">
                  Measure Phase
                </span>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  5M1E Model
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                วิเคราะห์สาเหตุและผลกระทบ (Cause & Effect) สู่รากเหง้าปัญหา 5M1E พร้อมระบบซักถาม 5-Why Analysis
              </p>
            </div>
          </div>

          <!-- Phase Action Buttons -->
          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/admin/projects/${projectId}/measure/process-map`"
              class="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-arrow-left" class="size-3.5" />
              <span>Process Map</span>
            </NuxtLink>
            <NuxtLink
              :to="`/admin/projects/${projectId}/measure/fmea`"
              class="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#008779] hover:bg-[#007366] text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>FMEA Studio</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Measure Phase Tab Navigation -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <NuxtLink
            v-for="t in tabs"
            :key="t.id"
            :to="`/admin/projects/${projectId}/measure/${t.id === 'fmea' ? 'fmea' : (t.id === 'fishbone' ? 'fishbone' : 'process-map')}`"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            :class="t.id === 'fishbone' ? 'bg-[#008779] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <UIcon :name="t.icon" class="size-3.5" />
            <span>{{ t.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Workspace Container -->
    <div class="space-y-4">
      <div class="space-y-4">
        
        <!-- View Switcher & Actions Bar -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-800">Problem Focus:</span>
            <div
              class="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer hover:border-[#008779] transition-all"
              @click="openProblemModal"
            >
              <span class="size-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span class="font-bold text-xs text-slate-900">{{ problemStatement.title }} ({{ problemStatement.subtitle }})</span>
              <span class="text-[11px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                Target: {{ problemStatement.goalValue }}
              </span>
              <UIcon name="i-lucide-pencil" class="size-3 text-slate-400 ml-1" />
            </div>
          </div>

          <!-- View Mode Toggle (Visual Ishikawa Diagram vs Table List) -->
          <div class="flex items-center gap-3">
            <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
              <button
                type="button"
                class="px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                :class="currentViewMode === 'diagram' ? 'bg-white text-[#008779] shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                @click="currentViewMode = 'diagram'"
              >
                Interactive Diagram
              </button>
              <button
                type="button"
                class="px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                :class="currentViewMode === 'list' ? 'bg-white text-[#008779] shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                @click="currentViewMode = 'list'"
              >
                Table List
              </button>
            </div>
          </div>
        </div>

        <!-- 1. TABLE LIST VIEW -->
        <div v-if="currentViewMode === 'list'" class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">Fishbone Diagrams</h2>
              <p class="text-xs text-slate-500">Create cause and effect diagrams using the 5M 1E methodology</p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              @click="openDrawer('machine')"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>+ Create Fishbone Diagram</span>
            </button>
          </div>

          <!-- Table of Fishbone Diagrams -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">PROBLEM STATEMENT</th>
                  <th class="py-3 px-4">CATEGORIES</th>
                  <th class="py-3 px-4">PROCESS MAP</th>
                  <th class="py-3 px-4 text-center">TOTAL FACTORS</th>
                  <th class="py-3 px-4">CREATED DATE</th>
                  <th class="py-3 px-4 text-center w-36">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-800">
                <tr class="hover:bg-slate-50/70 transition-colors">
                  <td class="py-3.5 px-4 font-bold text-slate-900">
                    {{ problemStatement.title }} {{ problemStatement.subtitle }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-600 text-[11px]">
                    {{ categoriesSummaryString }}
                  </td>
                  <td class="py-3.5 px-4 text-[#008779] font-medium hover:underline cursor-pointer">
                    <NuxtLink :to="`/admin/projects/${projectId}/measure/process-map`">
                      Process Map สินค้าไก่ทอด
                    </NuxtLink>
                  </td>
                  <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                    {{ totalFactorsCount }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-600">
                    <span class="font-mono text-slate-900 block">Dec 26, 2025</span>
                    <span class="text-[11px] text-slate-400">Romteera Tadderm</span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-[#008779] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="AI Analysis"
                        @click="isAiSuggestModalOpen = true"
                      >
                        <UIcon name="i-lucide-message-square" class="size-3.5" />
                      </button>
                      <button
                        type="button"
                        class="p-1.5 rounded-lg bg-teal-50 text-[#008779] hover:bg-[#008779] hover:text-white border border-teal-200 transition-colors cursor-pointer shadow-2xs"
                        title="เปิดหน้ากรอกข้อมูลเพื่อสร้าง/แก้ไข ก้างปลา"
                        @click="openDrawer('machine')"
                      >
                        <UIcon name="i-lucide-pencil" class="size-3.5" />
                      </button>
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="ดูแผนผังก้างปลา (Visual Chart)"
                        @click="currentViewMode = 'diagram'"
                      >
                        <UIcon name="i-lucide-git-branch" class="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. INTERACTIVE DIAGRAM VIEW (Ishikawa Visual Studio) -->
        <div v-else class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-5">
          <!-- Header and Category Summary Chips -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-900">Fishbone Diagram Analysis (Interactive Studio)</span>
                <span class="text-[10px] bg-teal-100 text-[#008779] font-bold px-2 py-0.5 rounded-full">Interactive Ishikawa</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">คลิกที่ก้างปลาเพื่อดู 5-Why, ปรับ [C]/[N], แก้ไขหัวข้อ หรือคลิกหัวปลาเพื่อเปลี่ยน Problem Statement</p>
            </div>

            <!-- Action Buttons Toolbar -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- AI Suggest Causes Button -->
              <button
                type="button"
                class="bg-gradient-to-r from-teal-50 to-indigo-50 hover:from-teal-100 hover:to-indigo-100 border border-teal-200/80 text-[#008779] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                @click="isAiSuggestModalOpen = true"
              >
                <UIcon name="i-lucide-sparkles" class="size-3.5 text-amber-500" />
                <span>AI Suggest Factors</span>
              </button>

              <!-- Sync to FMEA Button -->
              <button
                type="button"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                @click="syncToFmea"
              >
                <UIcon name="i-lucide-refresh-cw" class="size-3.5 text-slate-500" />
                <span>Sync to FMEA</span>
              </button>

              <!-- Export Button -->
              <button
                type="button"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                @click="exportFishboneDiagram"
              >
                <UIcon name="i-lucide-download" class="size-3.5 text-slate-500" />
                <span>Export Diagram</span>
              </button>

              <!-- Create / Add Cause Drawer Button -->
              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                @click="openDrawer('machine')"
              >
                <UIcon name="i-lucide-plus" class="size-3.5" />
                <span>+ Add Factor</span>
              </button>
            </div>
          </div>

          <!-- Category Count Badges Bar (Matching Screenshot) -->
          <div class="flex flex-wrap items-center gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            <span
              v-for="cat in categories"
              :key="cat.key"
              class="px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-2xs"
              :class="cat.badgeClass"
              @click="openDrawer(cat.key)"
            >
              <span class="size-2 rounded-full" :style="`background-color: ${cat.accentColor}`"></span>
              <span>{{ cat.name }}: {{ cat.causes.length }}</span>
            </span>
            <span class="px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-white border border-slate-700 ml-auto shadow-2xs">
              Total: {{ totalFactorsCount }}
            </span>
          </div>

          <!-- SVG Visual Fishbone Skeleton Canvas -->
          <div class="relative w-full bg-white border border-slate-200 rounded-3xl p-4 overflow-x-auto shadow-inner">
            <svg
              viewBox="0 0 1200 660"
              class="w-full min-w-[980px] h-auto select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <!-- Marker for main spine arrow -->
                <marker
                  id="spineArrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0f172a" />
                </marker>
              </defs>

              <!-- Main Central Horizontal Spine Line -->
              <line
                x1="40"
                y1="330"
                x2="940"
                y2="330"
                stroke="#0f172a"
                stroke-width="3.5"
                stroke-linecap="round"
                marker-end="url(#spineArrow)"
              />

              <!-- Effect / Problem Statement Box (Fish Head) - CLICKABLE TO EDIT -->
              <g transform="translate(950, 280)" class="cursor-pointer group" @click="openProblemModal">
                <rect
                  x="0"
                  y="0"
                  width="220"
                  height="100"
                  rx="14"
                  fill="#071E3D"
                  stroke="#008779"
                  stroke-width="2.5"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                  class="group-hover:stroke-teal-400 group-hover:fill-slate-900 transition-all"
                />
                <text
                  x="110"
                  y="38"
                  text-anchor="middle"
                  fill="#FFFFFF"
                  font-size="15"
                  font-weight="800"
                  font-family="sans-serif"
                >
                  {{ problemStatement.title }}
                </text>
                <text
                  x="110"
                  y="62"
                  text-anchor="middle"
                  fill="#99F6E4"
                  font-size="11"
                  font-weight="600"
                  font-family="sans-serif"
                >
                  {{ problemStatement.subtitle }}
                </text>
                <text
                  x="110"
                  y="82"
                  text-anchor="middle"
                  fill="#94A3B8"
                  font-size="9"
                  font-family="sans-serif"
                >
                  STD: {{ problemStatement.goalValue }} • Actual: {{ problemStatement.currentValue }} ✏️
                </text>
              </g>

              <!-- 3 Top Category Bones: Material, Method, Man -->
              <!-- 1. Top Bone: Material -->
              <g>
                <!-- Category Label Box - Clickable -->
                <g class="cursor-pointer group" @click="openDrawer('material')">
                  <rect x="230" y="25" width="130" height="34" rx="8" fill="#1E293B" class="group-hover:fill-[#2563eb] transition-colors" />
                  <text x="295" y="47" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Material +</text>
                </g>
                <!-- Main Bone Line -->
                <line x1="295" y1="59" x2="420" y2="330" stroke="#1E293B" stroke-width="2.5" />
                
                <!-- Sub-branches for Material causes -->
                <g v-for="(cause, cIdx) in categories.find(c => c.key === 'material')?.causes || []" :key="cause.id" class="cursor-pointer group">
                  <line
                    :x1="295 + (cIdx + 1) * 30"
                    :y1="59 + (cIdx + 1) * 65"
                    :x2="130"
                    :y2="59 + (cIdx + 1) * 65"
                    stroke="#64748B"
                    stroke-width="1.8"
                    class="group-hover:stroke-[#2563eb]"
                  />
                  <!-- Cause label box -->
                  <g @click="openWhyModal('Material', cause)">
                    <rect
                      :x="125"
                      :y="42 + (cIdx + 1) * 65"
                      :width="cause.name.length * 7.2 + 48"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      stroke-width="1"
                      class="group-hover:stroke-[#2563eb] group-hover:fill-blue-50/40 shadow-xs"
                    />
                    <text
                      :x="133"
                      :y="57 + (cIdx + 1) * 65"
                      fill="#0F172A"
                      font-size="10.5"
                      font-weight="600"
                    >
                      <tspan v-if="cause.isKey" fill="#DC2626" font-weight="bold">★ </tspan>
                      {{ cause.name }}
                    </text>
                  </g>
                  <!-- [C]/[N] Tag Badge - Clickable to toggle -->
                  <g @click.stop="toggleCauseType('material', cause.id)" class="cursor-pointer">
                    <rect
                      :x="125 + cause.name.length * 7.2 + (cause.isKey ? 22 : 12)"
                      :y="44 + (cIdx + 1) * 65"
                      width="18"
                      height="18"
                      rx="4"
                      :fill="cause.type === 'C' ? '#CCFBF1' : '#F1F5F9'"
                      stroke="#94A3B8"
                      stroke-width="0.5"
                    />
                    <text
                      :x="125 + cause.name.length * 7.2 + (cause.isKey ? 31 : 21)"
                      :y="57 + (cIdx + 1) * 65"
                      text-anchor="middle"
                      :fill="cause.type === 'C' ? '#0F766E' : '#64748B'"
                      font-size="9.5"
                      font-weight="bold"
                    >
                      {{ cause.type }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- 2. Top Bone: Method -->
              <g>
                <!-- Category Label Box - Clickable -->
                <g class="cursor-pointer group" @click="openDrawer('method')">
                  <rect x="490" y="25" width="130" height="34" rx="8" fill="#1E293B" class="group-hover:fill-[#d97706] transition-colors" />
                  <text x="555" y="47" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Method +</text>
                </g>
                <!-- Main Bone Line -->
                <line x1="555" y1="59" x2="680" y2="330" stroke="#1E293B" stroke-width="2.5" />
                
                <!-- Sub-branches for Method causes -->
                <g v-for="(cause, cIdx) in categories.find(c => c.key === 'method')?.causes || []" :key="cause.id" class="cursor-pointer group">
                  <line
                    :x1="555 + (cIdx + 1) * 40"
                    :y1="59 + (cIdx + 1) * 85"
                    :x2="390"
                    :y2="59 + (cIdx + 1) * 85"
                    stroke="#64748B"
                    stroke-width="1.8"
                    class="group-hover:stroke-[#d97706]"
                  />
                  <!-- Cause label text -->
                  <g @click="openWhyModal('Method', cause)">
                    <rect
                      :x="385"
                      :y="42 + (cIdx + 1) * 85"
                      :width="cause.name.length * 7.2 + 48"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      stroke-width="1"
                      class="group-hover:stroke-[#d97706] group-hover:fill-amber-50/40 shadow-xs"
                    />
                    <text
                      :x="393"
                      :y="57 + (cIdx + 1) * 85"
                      fill="#0F172A"
                      font-size="10.5"
                      font-weight="600"
                    >
                      <tspan v-if="cause.isKey" fill="#DC2626" font-weight="bold">★ </tspan>
                      {{ cause.name }}
                    </text>
                  </g>
                  <!-- [C]/[N] Tag Badge - Clickable to toggle -->
                  <g @click.stop="toggleCauseType('method', cause.id)" class="cursor-pointer">
                    <rect
                      :x="385 + cause.name.length * 7.2 + (cause.isKey ? 22 : 12)"
                      :y="44 + (cIdx + 1) * 85"
                      width="18"
                      height="18"
                      rx="4"
                      :fill="cause.type === 'C' ? '#CCFBF1' : '#F1F5F9'"
                      stroke="#94A3B8"
                      stroke-width="0.5"
                    />
                    <text
                      :x="385 + cause.name.length * 7.2 + (cause.isKey ? 31 : 21)"
                      :y="57 + (cIdx + 1) * 85"
                      text-anchor="middle"
                      :fill="cause.type === 'C' ? '#0F766E' : '#64748B'"
                      font-size="9.5"
                      font-weight="bold"
                    >
                      {{ cause.type }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- 3. Top Bone: Man -->
              <g>
                <!-- Category Label Box - Clickable -->
                <g class="cursor-pointer group" @click="openDrawer('man')">
                  <rect x="740" y="25" width="130" height="34" rx="8" fill="#1E293B" class="group-hover:fill-[#e11d48] transition-colors" />
                  <text x="805" y="47" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Man +</text>
                </g>
                <!-- Main Bone Line -->
                <line x1="805" y1="59" x2="910" y2="330" stroke="#1E293B" stroke-width="2.5" />
                
                <!-- Sub-branches for Man causes -->
                <g v-for="(cause, cIdx) in categories.find(c => c.key === 'man')?.causes || []" :key="cause.id" class="cursor-pointer group">
                  <line
                    :x1="805 + (cIdx + 1) * 35"
                    :y1="59 + (cIdx + 1) * 85"
                    :x2="650"
                    :y2="59 + (cIdx + 1) * 85"
                    stroke="#64748B"
                    stroke-width="1.8"
                    class="group-hover:stroke-[#e11d48]"
                  />
                  <!-- Cause label text -->
                  <g @click="openWhyModal('Man', cause)">
                    <rect
                      :x="645"
                      :y="42 + (cIdx + 1) * 85"
                      :width="cause.name.length * 7.2 + 48"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      stroke-width="1"
                      class="group-hover:stroke-[#e11d48] group-hover:fill-rose-50/40 shadow-xs"
                    />
                    <text
                      :x="653"
                      :y="57 + (cIdx + 1) * 85"
                      fill="#0F172A"
                      font-size="10.5"
                      font-weight="600"
                    >
                      <tspan v-if="cause.isKey" fill="#DC2626" font-weight="bold">★ </tspan>
                      {{ cause.name }}
                    </text>
                  </g>
                  <!-- [C]/[N] Tag Badge - Clickable to toggle -->
                  <g @click.stop="toggleCauseType('man', cause.id)" class="cursor-pointer">
                    <rect
                      :x="645 + cause.name.length * 7.2 + (cause.isKey ? 22 : 12)"
                      :y="44 + (cIdx + 1) * 85"
                      width="18"
                      height="18"
                      rx="4"
                      :fill="cause.type === 'C' ? '#CCFBF1' : '#F1F5F9'"
                      stroke="#94A3B8"
                      stroke-width="0.5"
                    />
                    <text
                      :x="645 + cause.name.length * 7.2 + (cause.isKey ? 31 : 21)"
                      :y="57 + (cIdx + 1) * 85"
                      text-anchor="middle"
                      :fill="cause.type === 'C' ? '#0F766E' : '#64748B'"
                      font-size="9.5"
                      font-weight="bold"
                    >
                      {{ cause.type }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- 3 Bottom Category Bones: Machine, Measurement, Environment -->
              <!-- 4. Bottom Bone: Machine -->
              <g>
                <!-- Category Label Box - Clickable -->
                <g class="cursor-pointer group" @click="openDrawer('machine')">
                  <rect x="230" y="595" width="130" height="34" rx="8" fill="#1E293B" class="group-hover:fill-[#059669] transition-colors" />
                  <text x="295" y="617" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Machine +</text>
                </g>
                <!-- Main Bone Line -->
                <line x1="295" y1="595" x2="420" y2="330" stroke="#1E293B" stroke-width="2.5" />
                
                <!-- Sub-branches for Machine causes -->
                <g v-for="(cause, cIdx) in categories.find(c => c.key === 'machine')?.causes || []" :key="cause.id" class="cursor-pointer group">
                  <line
                    :x1="295 + (cIdx + 1) * 30"
                    :y1="595 - (cIdx + 1) * 65"
                    :x2="130"
                    :y2="595 - (cIdx + 1) * 65"
                    stroke="#64748B"
                    stroke-width="1.8"
                    class="group-hover:stroke-[#059669]"
                  />
                  <!-- Cause label text -->
                  <g @click="openWhyModal('Machine', cause)">
                    <rect
                      :x="125"
                      :y="578 - (cIdx + 1) * 65"
                      :width="cause.name.length * 7.2 + 48"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      stroke-width="1"
                      class="group-hover:stroke-[#059669] group-hover:fill-emerald-50/40 shadow-xs"
                    />
                    <text
                      :x="133"
                      :y="593 - (cIdx + 1) * 65"
                      fill="#0F172A"
                      font-size="10.5"
                      font-weight="600"
                    >
                      <tspan v-if="cause.isKey" fill="#DC2626" font-weight="bold">★ </tspan>
                      {{ cause.name }}
                    </text>
                  </g>
                  <!-- [C]/[N] Tag Badge - Clickable to toggle -->
                  <g @click.stop="toggleCauseType('machine', cause.id)" class="cursor-pointer">
                    <rect
                      :x="125 + cause.name.length * 7.2 + (cause.isKey ? 22 : 12)"
                      :y="580 - (cIdx + 1) * 65"
                      width="18"
                      height="18"
                      rx="4"
                      :fill="cause.type === 'C' ? '#CCFBF1' : '#F1F5F9'"
                      stroke="#94A3B8"
                      stroke-width="0.5"
                    />
                    <text
                      :x="125 + cause.name.length * 7.2 + (cause.isKey ? 31 : 21)"
                      :y="593 - (cIdx + 1) * 85"
                      text-anchor="middle"
                      :fill="cause.type === 'C' ? '#0F766E' : '#64748B'"
                      font-size="9.5"
                      font-weight="bold"
                    >
                      {{ cause.type }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- 5. Bottom Bone: Measurement -->
              <g>
                <!-- Category Label Box - Clickable -->
                <g class="cursor-pointer group" @click="openDrawer('measurement')">
                  <rect x="490" y="595" width="130" height="34" rx="8" fill="#1E293B" class="group-hover:fill-[#4f46e5] transition-colors" />
                  <text x="555" y="617" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Measurement +</text>
                </g>
                <!-- Main Bone Line -->
                <line x1="555" y1="595" x2="680" y2="330" stroke="#1E293B" stroke-width="2.5" />
                
                <!-- Sub-branches for Measurement causes -->
                <g v-for="(cause, cIdx) in categories.find(c => c.key === 'measurement')?.causes || []" :key="cause.id" class="cursor-pointer group">
                  <line
                    :x1="555 + (cIdx + 1) * 40"
                    :y1="595 - (cIdx + 1) * 85"
                    :x2="390"
                    :y2="595 - (cIdx + 1) * 85"
                    stroke="#64748B"
                    stroke-width="1.8"
                    class="group-hover:stroke-[#4f46e5]"
                  />
                  <!-- Cause label text -->
                  <g @click="openWhyModal('Measurement', cause)">
                    <rect
                      :x="385"
                      :y="578 - (cIdx + 1) * 85"
                      :width="cause.name.length * 7.2 + 48"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      stroke-width="1"
                      class="group-hover:stroke-[#4f46e5] group-hover:fill-indigo-50/40 shadow-xs"
                    />
                    <text
                      :x="393"
                      :y="593 - (cIdx + 1) * 85"
                      fill="#0F172A"
                      font-size="10.5"
                      font-weight="600"
                    >
                      <tspan v-if="cause.isKey" fill="#DC2626" font-weight="bold">★ </tspan>
                      {{ cause.name }}
                    </text>
                  </g>
                  <!-- [C]/[N] Tag Badge - Clickable to toggle -->
                  <g @click.stop="toggleCauseType('measurement', cause.id)" class="cursor-pointer">
                    <rect
                      :x="385 + cause.name.length * 7.2 + (cause.isKey ? 22 : 12)"
                      :y="580 - (cIdx + 1) * 85"
                      width="18"
                      height="18"
                      rx="4"
                      :fill="cause.type === 'C' ? '#CCFBF1' : '#F1F5F9'"
                      stroke="#94A3B8"
                      stroke-width="0.5"
                    />
                    <text
                      :x="385 + cause.name.length * 7.2 + (cause.isKey ? 31 : 21)"
                      :y="593 - (cIdx + 1) * 85"
                      text-anchor="middle"
                      :fill="cause.type === 'C' ? '#0F766E' : '#64748B'"
                      font-size="9.5"
                      font-weight="bold"
                    >
                      {{ cause.type }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- 6. Bottom Bone: Environment -->
              <g>
                <!-- Category Label Box - Clickable -->
                <g class="cursor-pointer group" @click="openDrawer('environment')">
                  <rect x="740" y="595" width="130" height="34" rx="8" fill="#1E293B" class="group-hover:fill-[#0d9488] transition-colors" />
                  <text x="805" y="617" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Environment +</text>
                </g>
                <!-- Main Bone Line -->
                <line x1="805" y1="595" x2="910" y2="330" stroke="#1E293B" stroke-width="2.5" />
                
                <!-- Sub-branches for Environment causes -->
                <g v-for="(cause, cIdx) in categories.find(c => c.key === 'environment')?.causes || []" :key="cause.id" class="cursor-pointer group">
                  <line
                    :x1="805 + (cIdx + 1) * 35"
                    :y1="595 - (cIdx + 1) * 85"
                    :x2="650"
                    :y2="595 - (cIdx + 1) * 85"
                    stroke="#64748B"
                    stroke-width="1.8"
                    class="group-hover:stroke-[#0d9488]"
                  />
                  <!-- Cause label text -->
                  <g @click="openWhyModal('Environment', cause)">
                    <rect
                      :x="645"
                      :y="578 - (cIdx + 1) * 85"
                      :width="cause.name.length * 7.2 + 48"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      stroke-width="1"
                      class="group-hover:stroke-[#0d9488] group-hover:fill-teal-50/40 shadow-xs"
                    />
                    <text
                      :x="653"
                      :y="593 - (cIdx + 1) * 85"
                      fill="#0F172A"
                      font-size="10.5"
                      font-weight="600"
                    >
                      <tspan v-if="cause.isKey" fill="#DC2626" font-weight="bold">★ </tspan>
                      {{ cause.name }}
                    </text>
                  </g>
                  <!-- [C]/[N] Tag Badge - Clickable to toggle -->
                  <g @click.stop="toggleCauseType('environment', cause.id)" class="cursor-pointer">
                    <rect
                      :x="645 + cause.name.length * 7.2 + (cause.isKey ? 22 : 12)"
                      :y="580 - (cIdx + 1) * 85"
                      width="18"
                      height="18"
                      rx="4"
                      :fill="cause.type === 'C' ? '#CCFBF1' : '#F1F5F9'"
                      stroke="#94A3B8"
                      stroke-width="0.5"
                    />
                    <text
                      :x="645 + cause.name.length * 7.2 + (cause.isKey ? 31 : 21)"
                      :y="593 - (cIdx + 1) * 85"
                      text-anchor="middle"
                      :fill="cause.type === 'C' ? '#0F766E' : '#64748B'"
                      font-size="9.5"
                      font-weight="bold"
                    >
                      {{ cause.type }}
                    </text>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          <!-- 6 Category Cards Grid for Quick Drilldown & Editing -->
          <div class="space-y-2 pt-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800">5M1E Factor Cards (คลิกเพื่อแก้ไข 5-Why หรือเพิ่มสาเหตุย่อย)</span>
              <span class="text-[11px] text-slate-500">คลิกที่การ์ดเพื่อเปิด Drawer จัดการ</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div
                v-for="cat in categories"
                :key="cat.key"
                class="border rounded-2xl p-4 space-y-3 bg-slate-50/50"
                :class="cat.borderClass"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 flex items-center gap-1.5 cursor-pointer hover:underline" @click="openDrawer(cat.key)">
                    <span class="size-2.5 rounded-full" :style="`background-color: ${cat.accentColor}`"></span>
                    <span>{{ cat.name }} ({{ cat.labelTh }})</span>
                  </span>
                  <button
                    type="button"
                    class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full hover:opacity-80 cursor-pointer shadow-2xs"
                    :class="cat.badgeClass"
                    @click="openDrawer(cat.key)"
                  >
                    + {{ cat.causes.length }} causes
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                    v-for="c in cat.causes"
                    :key="c.id"
                    class="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5 shadow-2xs hover:border-[#008779] transition-all cursor-pointer group"
                    @click="openWhyModal(cat.name, c)"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-semibold text-slate-900 flex items-center gap-1.5">
                        <button
                          type="button"
                          class="cursor-pointer text-xs"
                          :class="c.isKey ? 'text-rose-600 font-bold' : 'text-slate-300 hover:text-amber-400'"
                          title="Toggle Key Root Cause"
                          @click.stop="toggleKeyCause(cat.key, c.id)"
                        >
                          ★
                        </button>
                        <span>{{ c.name }}</span>
                      </span>
                      <div class="flex items-center gap-1.5">
                        <button
                          type="button"
                          class="text-[9px] font-bold px-1.5 py-0.2 rounded cursor-pointer transition-colors"
                          :class="c.type === 'C' ? 'bg-teal-50 text-[#008779] border border-teal-200 hover:bg-teal-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                          title="Click to toggle [C]/[N]"
                          @click.stop="toggleCauseType(cat.key, c.id)"
                        >
                          {{ c.type === 'C' ? 'Control' : 'Noise' }}
                        </button>
                        <button
                          type="button"
                          class="text-slate-300 hover:text-rose-600 p-0.5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete cause"
                          @click.stop="deleteCause(cat.key, c.id)"
                        >
                          <UIcon name="i-lucide-trash-2" class="size-3" />
                        </button>
                      </div>
                    </div>

                    <!-- 5-Why Steps Drilldown -->
                    <div v-if="c.whys && c.whys.length > 0" class="pl-2 border-l-2 border-teal-200 space-y-0.5 text-[11px] text-slate-600">
                      <div v-for="(why, wIdx) in c.whys" :key="wIdx" class="truncate">
                        <span class="text-slate-400 font-bold">Why {{ wIdx + 1 }}:</span> {{ why }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 1. 5-WHY DRILLDOWN MODAL -->
    <Teleport to="body">
      <div
        v-if="selectedCauseForWhy"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="size-8 rounded-full bg-teal-50 text-[#008779] flex items-center justify-center font-bold">
                5W
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900">5-Why Root Cause Analysis</h3>
                <p class="text-[11px] text-slate-500">หมวด {{ selectedCauseForWhy.categoryName }}</p>
              </div>
            </div>
            <button
              type="button"
              class="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              @click="selectedCauseForWhy = null"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <!-- Cause info -->
          <div class="space-y-3">
            <div>
              <label class="font-bold text-xs text-slate-700 block mb-1">ชื่อปัจจัย/ปัญหา</label>
              <input
                v-model="selectedCauseForWhy.cause.name"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white focus:border-[#008779] outline-none"
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <label class="font-bold text-xs text-slate-700">ประเภท:</label>
                <label class="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input v-model="selectedCauseForWhy.cause.type" type="radio" value="C" />
                  <span class="font-semibold text-teal-700">[C] Control</span>
                </label>
                <label class="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input v-model="selectedCauseForWhy.cause.type" type="radio" value="N" />
                  <span class="font-semibold text-slate-600">[N] Noise</span>
                </label>
              </div>

              <label class="flex items-center gap-1.5 text-xs cursor-pointer text-rose-700 font-bold">
                <input v-model="selectedCauseForWhy.cause.isKey" type="checkbox" class="accent-[#008779]" />
                <span>★ Key Root Cause</span>
              </label>
            </div>

            <!-- 5-Why Chain -->
            <div class="space-y-2 pt-2 border-t border-slate-100">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-800">ลำดับการซักถาม 5-Why (ทำไมจึงเกิดปัญหานี้?):</span>
                <button
                  v-if="(selectedCauseForWhy.cause.whys || []).length < 5"
                  type="button"
                  class="text-[11px] font-bold text-[#008779] hover:underline cursor-pointer"
                  @click="addWhyStep"
                >
                  + เพิ่ม Why ถัดไป
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(w, idx) in selectedCauseForWhy.cause.whys || []"
                  :key="idx"
                  class="flex items-center gap-2"
                >
                  <span class="size-6 rounded-full bg-teal-50 text-[#008779] font-bold text-[10px] flex items-center justify-center shrink-0 border border-teal-200">
                    W{{ idx + 1 }}
                  </span>
                  <input
                    v-model="selectedCauseForWhy.cause.whys![idx]"
                    type="text"
                    :placeholder="`ทำไมขั้นที่ ${idx + 1}...`"
                    class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:bg-white focus:border-[#008779] outline-none"
                  />
                  <button
                    type="button"
                    class="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                    @click="selectedCauseForWhy.cause.whys!.splice(idx, 1)"
                  >
                    <UIcon name="i-lucide-trash-2" class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              @click="selectedCauseForWhy = null"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold bg-[#008779] hover:bg-[#007366] text-white cursor-pointer shadow-xs"
              @click="saveWhyModal"
            >
              บันทึก 5-Why
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 2. PROBLEM STATEMENT EDIT MODAL -->
    <Teleport to="body">
      <div
        v-if="isProblemModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      >
        <div class="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="size-8 rounded-full bg-teal-50 text-[#008779] flex items-center justify-center font-bold">
                🎯
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900">แก้ไข Problem Statement (หัวปลา)</h3>
                <p class="text-[11px] text-slate-500">กำหนดเป้าหมายหลักและปัญหาที่ต้องการแก้ไข</p>
              </div>
            </div>
            <button
              type="button"
              class="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              @click="isProblemModalOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">หัวข้อตัวชี้วัด (Title)</label>
              <input
                v-model="tempProblemStatement.title"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#008779] outline-none font-bold"
              />
            </div>

            <div>
              <label class="font-bold text-slate-700 block mb-1">รายละเอียดปัญหา (Subtitle)</label>
              <input
                v-model="tempProblemStatement.subtitle"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#008779] outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold text-slate-700 block mb-1">ค่าเป้าหมาย (STD Target)</label>
                <input
                  v-model="tempProblemStatement.goalValue"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#008779] outline-none"
                />
              </div>
              <div>
                <label class="font-semibold text-slate-700 block mb-1">ค่าปัจจุบัน (Current)</label>
                <input
                  v-model="tempProblemStatement.currentValue"
                  type="text"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#008779] outline-none"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              @click="isProblemModalOpen = false"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold bg-[#008779] hover:bg-[#007366] text-white cursor-pointer shadow-xs"
              @click="saveProblemStatement"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 3. AI SUGGEST CAUSES MODAL -->
    <Teleport to="body">
      <div
        v-if="isAiSuggestModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="size-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                ✨
              </div>
              <div>
                <h3 class="font-bold text-sm text-slate-900">AI Root Cause Generator (GenieWisdom)</h3>
                <p class="text-[11px] text-slate-500">วิเคราะห์และเสนอแนะสาเหตุ 5M1E จากประวัติและมาตรฐานกระบวนการผลิต</p>
              </div>
            </div>
            <button
              type="button"
              class="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              @click="isAiSuggestModalOpen = false"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-3.5 space-y-1">
              <span class="font-bold text-indigo-950 block">💡 ข้อเสนอแนะจาก AI สำหรับโปรเจกต์ {{ project.name }}:</span>
              <p class="text-[11px] text-indigo-800">
                AI ตรวจพบปัจจัยเสี่ยงที่อาจกระทบต่อ %Total Yield และจัดโครงสร้าง 5-Why มาให้พร้อมนำเข้าสู่ก้างปลา:
              </p>
            </div>

            <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
              <div
                v-for="(item, idx) in aiSuggestedCauses"
                :key="idx"
                class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 flex items-center gap-1.5">
                    <span class="text-amber-500 font-bold">★</span>
                    <span>{{ item.name }}</span>
                  </span>
                  <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-[#008779]">
                    หมวด {{ item.catKey }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-500 pl-2 border-l-2 border-indigo-300 space-y-0.5">
                  <div v-for="(why, wIdx) in item.whys" :key="wIdx">
                    Why {{ wIdx + 1 }}: {{ why }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              @click="isAiSuggestModalOpen = false"
            >
              ปิด
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold bg-[#008779] hover:bg-[#007366] text-white cursor-pointer shadow-xs flex items-center gap-1.5"
              @click="applyAiSuggestions"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
              <span>นำปัจจัยเข้าผังก้างปลาทั้งหมด</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 4. SLIDE-OVER DRAWER (Matching Interview Decision: Open Slide-over on right for Data Entry) -->
    <Teleport to="body">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
      >
        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
            
            <!-- Drawer Header -->
            <div class="p-5 bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 text-white flex items-center justify-between">
              <div class="space-y-0.5">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <UIcon name="i-lucide-git-branch" class="size-4 text-teal-300" />
                  <span>กรอกข้อมูลสร้าง / แก้ไข ก้างปลา (Fishbone Studio)</span>
                </h3>
                <p class="text-[11px] text-teal-200">บันทึกปัจจัยและสาเหตุย่อย 5-Why ตามหลัก 5M1E</p>
              </div>
              <button
                type="button"
                class="size-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
                @click="isDrawerOpen = false"
              >
                <UIcon name="i-lucide-x" class="size-4" />
              </button>
            </div>

            <!-- Drawer Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              
              <!-- 5M1E Category Selection Tabs -->
              <div class="space-y-1.5">
                <label class="font-bold text-slate-800 block">เลือกหมวดหมู่ 5M1E *</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="cat in categories"
                    :key="cat.key"
                    type="button"
                    class="p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer"
                    :class="drawerActiveCategory === cat.key ? 'border-[#008779] bg-teal-50 text-[#008779] shadow-2xs' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'"
                    @click="drawerActiveCategory = cat.key"
                  >
                    {{ cat.name }}
                  </button>
                </div>
              </div>

              <!-- Add New Cause Form in Active Category -->
              <div class="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-4 space-y-3">
                <span class="font-bold text-slate-900 block">
                  + เพิ่มปัจจัยใหม่ในหมวด {{ categories.find(c => c.key === drawerActiveCategory)?.name }}
                </span>

                <div class="space-y-1">
                  <label class="font-semibold text-slate-700 block">ชื่อปัจจัย/สาเหตุ (Cause Name) *</label>
                  <input
                    v-model="drawerNewCause.name"
                    type="text"
                    placeholder="เช่น เซนเซอร์ตรวจจับการตกของสินค้ามีคราบแป้งเกาะ"
                    class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="font-semibold text-slate-700 block mb-1">ประเภทปัจจัย</label>
                    <select
                      v-model="drawerNewCause.type"
                      class="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#008779]"
                    >
                      <option value="C">Control Factor (ควบคุมได้)</option>
                      <option value="N">Noise Factor (ควบคุมไม่ได้)</option>
                    </select>
                  </div>

                  <div class="flex items-center gap-2 pt-5">
                    <input
                      id="drawerKeyRoot"
                      v-model="drawerNewCause.isKey"
                      type="checkbox"
                      class="accent-[#008779] size-4 cursor-pointer"
                    />
                    <label for="drawerKeyRoot" class="font-bold text-rose-700 cursor-pointer">
                      ★ Key Root Cause
                    </label>
                  </div>
                </div>

                <!-- 5-Why Drilldowns -->
                <div class="space-y-2 pt-2 border-t border-teal-200/60">
                  <label class="font-bold text-slate-800 block text-[11px]">5-Why Analysis Drilldown:</label>
                  <input
                    v-model="drawerNewCause.why1"
                    type="text"
                    placeholder="Why 1: ทำไมจึงเกิดปัญหานี้?"
                    class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#008779] focus:outline-none"
                  />
                  <input
                    v-model="drawerNewCause.why2"
                    type="text"
                    placeholder="Why 2: ทำไมจึงเป็นเช่นนั้น?"
                    class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#008779] focus:outline-none"
                  />
                  <input
                    v-model="drawerNewCause.why3"
                    type="text"
                    placeholder="Why 3: สาเหตุรากเหง้า (Root Cause) คืออะไร?"
                    class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#008779] focus:outline-none"
                  />
                </div>

                <div class="flex justify-end pt-1">
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    @click="addCauseInDrawer"
                  >
                    <UIcon name="i-lucide-plus" class="size-3.5" />
                    <span>เพิ่มเข้าก้างปลา</span>
                  </button>
                </div>
              </div>

              <!-- List of Existing Causes in Current Category -->
              <div class="space-y-2">
                <span class="font-bold text-slate-800 block">
                  รายการปัจจัยที่มีอยู่ ({{ categories.find(c => c.key === drawerActiveCategory)?.causes.length }} รายการ):
                </span>

                <div
                  v-for="c in categories.find(c => c.key === drawerActiveCategory)?.causes"
                  :key="c.id"
                  class="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 flex items-center gap-1.5">
                      <span v-if="c.isKey" class="text-rose-600 font-bold">★</span>
                      <span>{{ c.name }}</span>
                    </span>
                    <button
                      type="button"
                      class="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      @click="deleteCause(drawerActiveCategory, c.id)"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-3.5" />
                    </button>
                  </div>
                  <div v-if="c.whys && c.whys.length > 0" class="pl-2 border-l-2 border-teal-300 text-[11px] text-slate-600 space-y-0.5">
                    <div v-for="(why, wIdx) in c.whys" :key="wIdx">
                      • {{ why }}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Drawer Footer -->
            <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                class="bg-[#008779] hover:bg-[#007366] text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                @click="isDrawerOpen = false; showToast('✓ บันทึกและซิงค์ข้อมูลผังก้างปลาสำเร็จ!')"
              >
                เสร็จสิ้น / บันทึกข้อมูล
              </button>
            </div>

          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
