<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project, setFishboneComplete } = useProjectData(projectId)

const isProcessMapComplete = computed(() => project.value.isProcessMapCompleted !== false)
const isFishboneCompleted = computed({
  get: () => project.value.isFishboneCompleted !== false,
  set: (val: boolean) => setFishboneComplete(val)
})

// View Mode: 'list' (Table matching Image 5) vs 'diagram' (Interactive Ishikawa Canvas) vs 'matrix'
const currentViewMode = ref<'list' | 'diagram' | 'matrix'>('list')

// Toast notification state
const toastMessage = ref('')
const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

const toggleFishboneCompletion = () => {
  isFishboneCompleted.value = !isFishboneCompleted.value
  showToast(isFishboneCompleted.value ? '✓ Fishbone stage marked as Complete! FMEA unlocked.' : 'Fishbone stage marked as Incomplete.')
}

// Problem Statement (Fish Effect / Head)
const problemStatement = ref({
  title: '%Total Yield',
  subtitle: 'สินค้าไก่ทอดต่ำกว่าเกณฑ์เป้าหมาย (STD 85.0%)',
  targetMetric: 'Total Yield %',
  currentValue: '78.5%',
  goalValue: '85.0%'
})

// 5M1E Categories Definition
export interface FishboneCause {
  id: string
  name: string
  type: 'C' | 'N' // C = Control, N = Noise
  isKey: boolean // Key Root Cause highlight (red/priority)
  whys: string[] // 5-Why steps: [Why1, Why2, Why3, ...]
  status?: string
}

export interface FishboneCategory {
  key: string
  name: string
  labelTh: string
  color: string
  badgeClass: string
  borderClass: string
  accentColor: string
  topBone: boolean
  boneX: number
  causes: FishboneCause[]
}

const defaultCategoriesData: FishboneCategory[] = [
  {
    key: 'material',
    name: 'Material',
    labelTh: 'วัตถุดิบ',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    borderClass: 'border-blue-300',
    accentColor: '#2563eb',
    topBone: true,
    boneX: 200,
    causes: [
      {
        id: 'mat-1',
        name: 'ความหนืด Batter ต่ำกว่า STD',
        type: 'C',
        isKey: false,
        whys: ['การผสมแป้งใช้น้ำอุณหภูมิสูงเกินไป', 'ระบบ Chiller น้ำหล่อเย็นตัดการทำงาน', 'วาล์วระบายความร้อนตัน']
      },
      {
        id: 'mat-2',
        name: 'Coating ไม่เกาะทั่วชิ้นเนื้อไก่',
        type: 'C',
        isKey: false,
        whys: ['ผิวเนื้อไก่มีความชื้นสูงเกินไปก่อนเข้า Predust', 'แรงเป่าลมไล่น้ำก่อนเข้าเครื่องเบาไป', 'หัวฉีดลมเป่าอุดตัน']
      },
      {
        id: 'mat-3',
        name: 'ขนาดชิ้นเนื้อไก่ (Cut Size) ไม่สม่ำเสมอ',
        type: 'N',
        isKey: false,
        whys: ['วัตถุดิบเนื้อไก่สดจากฟาร์มมีช่วงน้ำหนักหลากหลาย', 'การคัดไซส์ต้นทางมีความแปรปรวนตามฤดูกาล']
      }
    ]
  },
  {
    key: 'machine',
    name: 'Machine',
    labelTh: 'เครื่องจักร',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderClass: 'border-emerald-300',
    accentColor: '#059669',
    topBone: true,
    boneX: 410,
    causes: [
      {
        id: 'mac-1',
        name: 'Set ค่าน้ำหนักเผื่อ Multihead เกิน STD',
        type: 'C',
        isKey: true,
        whys: ['การ set ค่าน้ำหนักเผื่อ Multihead เกินสเปก', 'ผู้ปฏิบัติงานตั้งค่าตามความเคยชินเพื่อกันน้ำหนักขาด', 'ไม่มีการล็อก PLC Parameter สำหรับแต่ละสูตรการผลิต']
      },
      {
        id: 'mac-2',
        name: 'จำนวน Drop เครื่อง Multihead สวิง',
        type: 'C',
        isKey: true,
        whys: ['จำนวน Drop ของเครื่อง Multihead สวิง', 'Sensor ตรวจจับการตกของสินค้ามีคราบแป้งเกาะ', 'หัวฉีดลมเป่าทำความสะอาดแรงดันตก']
      },
      {
        id: 'mac-3',
        name: 'ความเร็วเครื่องเติมแป้ง Predust ไม่นิ่ง',
        type: 'C',
        isKey: false,
        whys: ['รอบมอเตอร์สายพาน Predust แกว่ง', 'โซ่ขับมอเตอร์หย่อน', 'ขาดรอบการบำรุงรักษาเชิงป้องกันประจำเดือน']
      }
    ]
  },
  {
    key: 'method',
    name: 'Method',
    labelTh: 'วิธีการ',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    borderClass: 'border-amber-300',
    accentColor: '#d97706',
    topBone: true,
    boneX: 620,
    causes: [
      {
        id: 'met-1',
        name: 'รอบเวลา Frying ไม่คงที่ตามสูตร',
        type: 'C',
        isKey: false,
        whys: ['ความเร็วสายพานทอดถูกปรับเปลี่ยนระหว่างกะ', 'ไม่มีระบบบันทึก Log การเปลี่ยน Speed สายพาน', 'คู่มือ SOP ไม่ได้ระบุความเร็วมาตรฐานที่ชัดเจน']
      },
      {
        id: 'met-2',
        name: 'ขั้นตอนการทำความสะอาด Filter น้ำมันทอดล่าช้า',
        type: 'C',
        isKey: false,
        whys: ['เศษแป้งไหม้สะสมในระบบทอด', 'ไม่ได้ถ่ายตะกอนตามรอบเวลามาตรฐาน']
      }
    ]
  },
  {
    key: 'measurement',
    name: 'Measurement',
    labelTh: 'การวัด',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderClass: 'border-indigo-300',
    accentColor: '#4f46e5',
    topBone: false,
    boneX: 200,
    causes: [
      {
        id: 'mea-1',
        name: 'ความถี่การ Calibrate ตาชั่งไม่ครอบคลุม',
        type: 'C',
        isKey: false,
        whys: ['ตาชั่งหน้าไลน์ Calibrate เพียง 1 ครั้ง/วัน', 'ไม่มีตุ้มน้ำหนักมาตรฐานประจำจุดตรวจสอบย่อย']
      },
      {
        id: 'mea-2',
        name: 'Predust Viscosity Measurement Bias',
        type: 'C',
        isKey: false,
        whys: ['ถ้วยวัดความหนืด Ford Cup มีรอยขีดข่วนสะสม', 'การจับเวลาด้วยมือถือมีความคลาดเคลื่อนระหว่างผู้ตรวจ']
      }
    ]
  },
  {
    key: 'man',
    name: 'Man',
    labelTh: 'คน/ผู้ปฏิบัติงาน',
    color: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    borderClass: 'border-rose-300',
    accentColor: '#e11d48',
    topBone: false,
    boneX: 410,
    causes: [
      {
        id: 'man-1',
        name: 'ทักษะการเติม Batter ไม่สม่ำเสมอระหว่างกะ',
        type: 'C',
        isKey: false,
        whys: ['พนักงานใหม่ขาดการฝึกอบรม On-Job Training (OJT)', 'ไม่มี Visual Work Instruction หน้าเครื่อง']
      },
      {
        id: 'man-2',
        name: 'การสลับหน้าที่พนักงานคุม Multihead บ่อยครั้ง',
        type: 'C',
        isKey: false,
        whys: ['พนักงานประจำลาหยุดกะทันหัน', 'การจัดสรรกำลังคนสำรองไม่มีระบบ Cross-Training ที่ผ่านการรับรอง']
      }
    ]
  },
  {
    key: 'environment',
    name: 'Environment',
    labelTh: 'สภาพแวดล้อม',
    color: 'bg-teal-50 text-teal-800 border-teal-200',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    borderClass: 'border-teal-300',
    accentColor: '#0d9488',
    topBone: false,
    boneX: 620,
    causes: [
      {
        id: 'env-1',
        name: 'ความชื้นสัมพัทธ์ในห้องแปรรูปแกว่งสูง',
        type: 'N',
        isKey: false,
        whys: ['สภาพอากาศภายนอกโรงงานมีฝนตกชุกต่อเนื่อง', 'ม่านอากาศหน้าประตูทางเข้าเปิดบ่อยระหว่างขนย้ายวัตถุดิบ']
      },
      {
        id: 'env-2',
        name: 'อุณหภูมิบริเวณจุดพักสินค้าก่อนชั่งสูงเกินเกณฑ์',
        type: 'C',
        isKey: false,
        whys: ['พัดลมระบายอากาศเสีย 1 ตัว', 'ไม่มีเซนเซอร์เตือนอุณหภูมิเกินแบบอัตโนมัติ']
      }
    ]
  }
]

const categories = ref<FishboneCategory[]>(JSON.parse(JSON.stringify(defaultCategoriesData)))

// Table summary computed
const totalFactorsCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.causes.length, 0)
})

const categoriesSummaryString = computed(() => {
  return categories.value.map(c => `${c.name}: ${c.causes.length}`).join(' • ')
})

// SLIDE-OVER DRAWER STATE (Requirement Image 5 Action 1)
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

const openDrawer = (catKey = 'machine') => {
  drawerActiveCategory.value = catKey
  isDrawerOpen.value = true
}

const addCauseInDrawer = () => {
  if (!drawerNewCause.value.name.trim()) {
    alert('Please enter a cause name.')
    return
  }

  const targetCat = categories.value.find(c => c.key === drawerActiveCategory.value)
  if (targetCat) {
    const whys = [drawerNewCause.value.why1, drawerNewCause.value.why2, drawerNewCause.value.why3].filter(w => w && w.trim())
    targetCat.causes.push({
      id: `cause-${Date.now()}`,
      name: drawerNewCause.value.name.trim(),
      type: drawerNewCause.value.type,
      isKey: drawerNewCause.value.isKey,
      whys: whys.length > 0 ? whys : ['สาเหตุเริ่มต้นที่ระบุในที่ประชุมระดมสมอง']
    })

    drawerNewCause.value = {
      name: '',
      type: 'C',
      isKey: false,
      why1: '',
      why2: '',
      why3: ''
    }

    showToast(`✓ Added cause to ${targetCat.name} successfully!`)
  }
}

const deleteCause = (catKey: string, causeId: string) => {
  const cat = categories.value.find(c => c.key === catKey)
  if (cat) {
    cat.causes = cat.causes.filter(c => c.id !== causeId)
    showToast('Cause removed')
  }
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
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-slate-500 pb-1">
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
        {{ project.name }}
      </NuxtLink>
      <span>›</span>
      <span class="text-slate-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-slate-900 font-bold">Fishbone Diagram</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Fishbone Diagram"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-5 min-w-0 w-full">
        
        <!-- STAGE GATE WARNING IF PROCESS MAP INCOMPLETE -->
        <div
          v-if="!isProcessMapComplete"
          class="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-2xs"
        >
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-lock" class="size-5 text-amber-600 shrink-0" />
            <div>
              <span class="font-bold block">🔒 ขั้นตอน Fishbone ถูกล็อกการทำงาน (Strict Gating Active)</span>
              <p class="text-[11px] text-amber-800 mt-0.5">
                ระบบล็อกไว้ว่าให้ทำตามขั้นตอน ไม่สามารถข้ามได้ และต้องทำ Process Map ให้เสร็จก่อนจึงจะปลดล็อก Fishbone Diagram
              </p>
            </div>
          </div>
          <NuxtLink
            :to="`/admin/projects/${projectId}/measure/process-map`"
            class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl transition-colors shrink-0"
          >
            ไปยังหน้า Process Map
          </NuxtLink>
        </div>

        <!-- Header Banner: Stage Completion (Matching Image 5) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <h1 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Stage Completion</span>
            </h1>
            <p class="text-xs text-slate-500">
              All fishbone diagrams have been created and documented. Mark this stage as complete to contribute to the Measure phase progress.
            </p>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              :class="isFishboneCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-200'"
              @click="toggleFishboneCompletion"
            >
              <UIcon :name="isFishboneCompleted ? 'i-lucide-check-circle-2' : 'i-lucide-circle'" class="size-4" :class="isFishboneCompleted ? 'text-emerald-600' : 'text-slate-400'" />
              <span>{{ isFishboneCompleted ? 'Completed (FMEA Unlocked)' : 'Mark as Completed' }}</span>
            </button>

            <div class="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center gap-0.5 text-xs">
              <button
                type="button"
                class="px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                :class="currentViewMode === 'list' ? 'bg-white text-[#008779] shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                @click="currentViewMode = 'list'"
              >
                Table List
              </button>
              <button
                type="button"
                class="px-3 py-1 rounded-lg font-bold transition-all cursor-pointer"
                :class="currentViewMode === 'diagram' ? 'bg-white text-[#008779] shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                @click="currentViewMode = 'diagram'"
              >
                Interactive Diagram
              </button>
            </div>
          </div>
        </div>

        <!-- 1. TABLE LIST VIEW (Matching Image 5) -->
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

          <!-- Table of Fishbone Diagrams (Matching Image 5) -->
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
                  <!-- Problem Statement -->
                  <td class="py-3.5 px-4 font-bold text-slate-900">
                    {{ problemStatement.title }} {{ problemStatement.subtitle }}
                  </td>

                  <!-- Categories summary -->
                  <td class="py-3.5 px-4 text-slate-600 text-[11px]">
                    {{ categoriesSummaryString }}
                  </td>

                  <!-- Linked Process Map -->
                  <td class="py-3.5 px-4 text-[#008779] font-medium hover:underline cursor-pointer">
                    <NuxtLink :to="`/admin/projects/${projectId}/measure/process-map`">
                      Process Map สินค้าไก่ทอด
                    </NuxtLink>
                  </td>

                  <!-- Total Factors -->
                  <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                    {{ totalFactorsCount }}
                  </td>

                  <!-- Created Date -->
                  <td class="py-3.5 px-4 text-slate-600">
                    <span class="font-mono text-slate-900 block">Dec 26, 2025</span>
                    <span class="text-[11px] text-slate-400">Romteera Tadderm</span>
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <!-- Chat icon -->
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-[#008779] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="AI Analysis"
                      >
                        <UIcon name="i-lucide-message-square" class="size-3.5" />
                      </button>

                      <!-- Action Button 1 (Circled in Image 5): Open Slide-over Drawer -->
                      <button
                        type="button"
                        class="p-1.5 rounded-lg bg-teal-50 text-[#008779] hover:bg-[#008779] hover:text-white border border-teal-200 transition-colors cursor-pointer shadow-2xs"
                        title="เปิดหน้ากรอกข้อมูลเพื่อสร้าง/แก้ไข ก้างปลา (1)"
                        @click="openDrawer('machine')"
                      >
                        <UIcon name="i-lucide-pencil" class="size-3.5" />
                      </button>

                      <!-- Diagram Switch action -->
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
        <div v-else class="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 class="text-sm font-bold text-slate-900">Ishikawa Fishbone Diagram (Visual Canvas)</h2>
              <p class="text-xs text-slate-500">วิเคราะห์สาเหตุและผลกระทบตามโครงสร้าง 5M1E พร้อมระบบเจาะลึก 5-Why Analysis</p>
            </div>

            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              @click="openDrawer('machine')"
            >
              <UIcon name="i-lucide-pencil" class="size-3.5" />
              <span>เปิด Drawer แก้ไขปัจจัย</span>
            </button>
          </div>

          <!-- 6 Category Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="border rounded-2xl p-4 space-y-3 bg-slate-50/50"
              :class="cat.borderClass"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 flex items-center gap-1.5">
                  <span class="size-2.5 rounded-full" :style="`background-color: ${cat.accentColor}`"></span>
                  <span>{{ cat.name }} ({{ cat.labelTh }})</span>
                </span>
                <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full" :class="cat.badgeClass">
                  {{ cat.causes.length }} causes
                </span>
              </div>

              <div class="space-y-2">
                <div
                  v-for="c in cat.causes"
                  :key="c.id"
                  class="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5 shadow-2xs"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span v-if="c.isKey" class="text-rose-600 font-bold" title="Key Root Cause">★</span>
                      <span>{{ c.name }}</span>
                    </span>
                    <span
                      class="text-[9px] font-bold px-1.5 py-0.2 rounded"
                      :class="c.type === 'C' ? 'bg-teal-50 text-[#008779] border border-teal-200' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ c.type === 'C' ? 'Control' : 'Noise' }}
                    </span>
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

    <!-- SLIDE-OVER DRAWER (Matching Interview Decision: Open Slide-over on right for Data Entry) -->
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
                @click="isDrawerOpen = false; showToast('✓ Fishbone diagram changes saved and synced!')"
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
