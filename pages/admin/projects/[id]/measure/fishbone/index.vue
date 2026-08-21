<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

// Toast notification state
const toastMessage = ref('')
const showToast = ref(false)
const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
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
  topBone: boolean // true = upper bone, false = lower bone
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
        whys: ['วัตถุดิบเนื้อไก่สดจากฟาร์มมีช่วงน้ำหนักหลากหลาย', 'การคัดไซส์ต้นทางมีความแปรปรวนตามฤดูกาล', 'ความแตกต่างของสายพันธุ์']
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
        whys: ['เศษแป้งไหม้สะสมในระบบทอด', 'ไม่ได้ถ่ายตะกอนตามรอบเวลามาตรฐาน', 'พนักงานรอเปลี่ยนกะจึงไม่ได้ทำความสะอาดทันที']
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
        whys: ['ตาชั่งหน้าไลน์ Calibrate เพียง 1 ครั้ง/วัน', 'ไม่มีตุ้มน้ำหนักมาตรฐานประจำจุดตรวจสอบย่อย', 'ยังไม่ได้อัปเดตระบบ e-Calibration Logbook']
      },
      {
        id: 'mea-2',
        name: 'Predust Viscosity Measurement Bias',
        type: 'C',
        isKey: false,
        whys: ['ถ้วยวัดความหนืด Ford Cup มีรอยขีดข่วนสะสม', 'การจับเวลาด้วยมือถือมีความคลาดเคลื่อนระหว่างผู้ตรวจ', 'ขาดเครื่องวัดความหนืดแบบดิจิทัล']
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
        whys: ['พนักงานใหม่ขาดการฝึกอบรม On-Job Training (OJT)', 'ไม่มี Visual Work Instruction หน้าเครื่อง', 'ขาดการประเมิน Skill Matrix รายไตรมาส']
      },
      {
        id: 'man-2',
        name: 'การสลับหน้าที่พนักงานคุม Multihead บ่อยครั้ง',
        type: 'C',
        isKey: false,
        whys: ['พนักงานประจำลาหยุดกะทันหัน', 'การจัดสรรกำลังคนสำรองไม่มีระบบ Cross-Training ที่ผ่านการรับรอง', 'ไม่มีเกณฑ์การผ่านงานก่อนคุมเครื่องจักรหลัก']
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
        whys: ['สภาพอากาศภายนอกโรงงานมีฝนตกชุกต่อเนื่อง', 'ม่านอากาศหน้าประตูทางเข้าเปิดบ่อยระหว่างขนย้ายวัตถุดิบ', 'ระบบปรับอากาศ HVAC ปรับชดเชยความชื้นไม่ทัน']
      },
      {
        id: 'env-2',
        name: 'อุณหภูมิบริเวณจุดพักสินค้าก่อนชั่งสูงเกินเกณฑ์',
        type: 'C',
        isKey: false,
        whys: ['พัดลมระบายอากาศเสีย 1 ตัว', 'รออะไหล่สำรองจัดซื้อ', 'ไม่มีเซนเซอร์เตือนอุณหภูมิเกินแบบอัตโนมัติ']
      }
    ]
  }
]

// State for active categories data
const categories = ref<FishboneCategory[]>(JSON.parse(JSON.stringify(defaultCategoriesData)))

// Phase 2 Auto-feed Inbox for Capability & MSA failed factors
const incomingUnassignedFactors = ref([
  { id: 'in-1', source: 'Capability Analysis (Cpk 0.29 < 1.0)', factorName: 'High Variation in Finished Weight', suggestedCategory: 'machine', type: 'C' as const },
  { id: 'in-2', source: 'MSA Study (%StudyVar 34.2% > 30%)', factorName: 'Predust Viscosity Measurement Bias', suggestedCategory: 'measurement', type: 'C' as const }
])

// Total counts summary
const totalCausesCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.causes.length, 0)
})

const controlCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.causes.filter(c => c.type === 'C').length, 0)
})

const noiseCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.causes.filter(c => c.type === 'N').length, 0)
})

const keyCausesCount = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.causes.filter(c => c.isKey).length, 0)
})

// View mode: 'board' or 'table'
const matrixViewMode = ref<'board' | 'table'>('board')

// Tab filter for cause table
const activeCategoryFilter = ref<string>('all')

const filteredCategories = computed(() => {
  if (activeCategoryFilter.value === 'all') return categories.value
  return categories.value.filter(c => c.key === activeCategoryFilter.value)
})

// ================= ON-DIAGRAM INLINE ADD & EDIT POPOVER ("เพิ่มในก้างปลาโดยตรง") =================
const onDiagramAddState = ref<{
  isOpen: boolean
  categoryKey: string
  name: string
  type: 'C' | 'N'
  isKey: boolean
}>({
  isOpen: false,
  categoryKey: 'material',
  name: '',
  type: 'C',
  isKey: false
})

const onDiagramInputRef = ref<HTMLInputElement | null>(null)

const openOnDiagramAdd = (categoryKey: string) => {
  onDiagramAddState.value = {
    isOpen: true,
    categoryKey,
    name: '',
    type: 'C',
    isKey: false
  }
  nextTick(() => {
    onDiagramInputRef.value?.focus()
  })
}

const saveOnDiagramAdd = () => {
  if (!onDiagramAddState.value.name.trim()) {
    alert('กรุณากรอกชื่อสาเหตุในก้างปลา')
    return
  }

  const targetCategory = categories.value.find(c => c.key === onDiagramAddState.value.categoryKey)
  if (!targetCategory) return

  targetCategory.causes.push({
    id: `bone-${Date.now()}`,
    name: onDiagramAddState.value.name.trim(),
    type: onDiagramAddState.value.type,
    isKey: onDiagramAddState.value.isKey,
    whys: [onDiagramAddState.value.name.trim(), '', '']
  })

  triggerToast(`เพิ่มสาเหตุ "${onDiagramAddState.value.name.trim()}" ลงบนก้างปลา ${targetCategory.name} สำเร็จ ✨`)
  onDiagramAddState.value.name = ''
  onDiagramAddState.value.isOpen = false
}

// ================= QUICK INLINE ADD PER CATEGORY IN BOARD =================
const quickInputs = ref<Record<string, { name: string; type: 'C' | 'N'; isKey: boolean }>>({
  material: { name: '', type: 'C', isKey: false },
  machine: { name: '', type: 'C', isKey: false },
  method: { name: '', type: 'C', isKey: false },
  measurement: { name: '', type: 'C', isKey: false },
  man: { name: '', type: 'C', isKey: false },
  environment: { name: '', type: 'C', isKey: false }
})

const getQuickInput = (key: string) => {
  if (!quickInputs.value[key]) {
    quickInputs.value[key] = { name: '', type: 'C', isKey: false }
  }
  return quickInputs.value[key]!
}

const addQuickCause = (categoryKey: string) => {
  const input = getQuickInput(categoryKey)
  if (!input || !input.name.trim()) return

  const targetCategory = categories.value.find(c => c.key === categoryKey)
  if (!targetCategory) return

  targetCategory.causes.push({
    id: `quick-${Date.now()}`,
    name: input.name.trim(),
    type: input.type,
    isKey: input.isKey,
    whys: [input.name.trim(), '', '']
  })

  triggerToast(`เพิ่ม "${input.name.trim()}" ใน ${targetCategory.name} เรียบร้อย`)
  input.name = ''
  input.isKey = false
}

const addIncomingFactorDirectly = (item: typeof incomingUnassignedFactors.value[0]) => {
  const targetCategory = categories.value.find(c => c.key === item.suggestedCategory)
  if (!targetCategory) return
  targetCategory.causes.push({
    id: `inbox-${Date.now()}`,
    name: item.factorName,
    type: item.type,
    isKey: true,
    whys: [`ตรวจพบจาก ${item.source}`, item.factorName, '']
  })
  incomingUnassignedFactors.value = incomingUnassignedFactors.value.filter(i => i.id !== item.id)
  triggerToast(`เพิ่ม "${item.factorName}" เข้าหมวด ${targetCategory.name} สำเร็จ`)
}

// ================= DRAG AND DROP HANDLERS (ลากแล้ววาง) =================
interface DragPayload {
  sourceType: 'cause' | 'inbox'
  causeId?: string
  sourceCategoryKey?: string
  inboxItem?: typeof incomingUnassignedFactors.value[0]
}

const draggedPayload = ref<DragPayload | null>(null)
const dragOverCategoryKey = ref<string | null>(null)
const dragOverBoneKey = ref<string | null>(null)

const onDragStartCause = (event: DragEvent, cause: FishboneCause, categoryKey: string) => {
  draggedPayload.value = {
    sourceType: 'cause',
    causeId: cause.id,
    sourceCategoryKey: categoryKey
  }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', cause.id)
  }
}

const onDragStartInbox = (event: DragEvent, item: typeof incomingUnassignedFactors.value[0]) => {
  draggedPayload.value = {
    sourceType: 'inbox',
    inboxItem: item
  }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copyMove'
    event.dataTransfer.setData('text/plain', item.id)
  }
}

const onDragOverCategory = (event: DragEvent, categoryKey: string) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverCategoryKey.value = categoryKey
}

const onDragLeaveCategory = (categoryKey: string) => {
  if (dragOverCategoryKey.value === categoryKey) {
    dragOverCategoryKey.value = null
  }
}

const onDragOverBone = (event: DragEvent, categoryKey: string) => {
  event.preventDefault()
  dragOverBoneKey.value = categoryKey
}

const onDragLeaveBone = (categoryKey: string) => {
  if (dragOverBoneKey.value === categoryKey) {
    dragOverBoneKey.value = null
  }
}

const onDropOnCategory = (event: DragEvent, targetCategoryKey: string) => {
  event.preventDefault()
  dragOverCategoryKey.value = null
  dragOverBoneKey.value = null

  if (!draggedPayload.value) return
  const targetCategory = categories.value.find(c => c.key === targetCategoryKey)
  if (!targetCategory) return

  if (draggedPayload.value.sourceType === 'inbox' && draggedPayload.value.inboxItem) {
    const item = draggedPayload.value.inboxItem
    targetCategory.causes.push({
      id: `inbox-${Date.now()}`,
      name: item.factorName,
      type: item.type,
      isKey: true,
      whys: [`ตรวจพบจาก ${item.source}`, item.factorName, '']
    })
    incomingUnassignedFactors.value = incomingUnassignedFactors.value.filter(i => i.id !== item.id)
    triggerToast(`ลากวาง "${item.factorName}" เข้าหมวด ${targetCategory.name} สำเร็จ`)
  } else if (draggedPayload.value.sourceType === 'cause' && draggedPayload.value.causeId && draggedPayload.value.sourceCategoryKey) {
    const sourceCategory = categories.value.find(c => c.key === draggedPayload.value?.sourceCategoryKey)
    if (!sourceCategory) return

    const causeIndex = sourceCategory.causes.findIndex(c => c.id === draggedPayload.value?.causeId)
    if (causeIndex === -1) return

    const [movedCause] = sourceCategory.causes.splice(causeIndex, 1)
    if (movedCause) {
      targetCategory.causes.push(movedCause)

      if (sourceCategory.key !== targetCategory.key) {
        triggerToast(`ย้าย "${movedCause.name}" จาก ${sourceCategory.name} → ${targetCategory.name} สำเร็จ`)
      } else {
        triggerToast(`จัดลำดับ "${movedCause.name}" ใน ${targetCategory.name} เรียบร้อย`)
      }
    }
  }

  draggedPayload.value = null
}

const onDragEnd = () => {
  draggedPayload.value = null
  dragOverCategoryKey.value = null
  dragOverBoneKey.value = null
}

// ================= MODAL STATES =================
// 1. Edit/Add Cause Modal
const isCauseModalOpen = ref(false)
const isEditingCause = ref(false)
const selectedCategoryKey = ref('machine')
const editingCause = ref<FishboneCause>({
  id: '',
  name: '',
  type: 'C',
  isKey: false,
  whys: ['', '', '']
})

const openAddCauseModal = (categoryKey = 'machine') => {
  isEditingCause.value = false
  selectedCategoryKey.value = categoryKey
  editingCause.value = {
    id: `cause-${Date.now()}`,
    name: '',
    type: 'C',
    isKey: false,
    whys: ['', '', '']
  }
  isCauseModalOpen.value = true
}

const openEditCauseModal = (cause: FishboneCause, categoryKey: string) => {
  isEditingCause.value = true
  selectedCategoryKey.value = categoryKey
  editingCause.value = {
    ...JSON.parse(JSON.stringify(cause)),
    whys: cause.whys && cause.whys.length ? [...cause.whys] : ['', '', '']
  }
  isCauseModalOpen.value = true
}

const addWhyLevel = () => {
  if (editingCause.value.whys.length < 5) {
    editingCause.value.whys.push('')
  }
}

const removeWhyLevel = (index: number) => {
  if (editingCause.value.whys.length > 1) {
    editingCause.value.whys.splice(index, 1)
  }
}

const saveCauseModal = () => {
  if (!editingCause.value.name.trim()) {
    alert('กรุณากรอกชื่อสาเหตุ / ปัญหา (Cause Name)')
    return
  }

  const targetCategory = categories.value.find(c => c.key === selectedCategoryKey.value)
  if (!targetCategory) return

  const cleanedWhys = editingCause.value.whys.filter(w => w.trim() !== '')

  if (isEditingCause.value) {
    let originalCategoryIndex = -1
    let originalCauseIndex = -1

    categories.value.forEach((cat, cIdx) => {
      const idx = cat.causes.findIndex(c => c.id === editingCause.value.id)
      if (idx !== -1) {
        originalCategoryIndex = cIdx
        originalCauseIndex = idx
      }
    })

    const origCat = originalCategoryIndex !== -1 ? categories.value[originalCategoryIndex] : undefined
    if (origCat && origCat.key !== selectedCategoryKey.value) {
      origCat.causes.splice(originalCauseIndex, 1)
      targetCategory.causes.push({
        ...editingCause.value,
        whys: cleanedWhys.length ? cleanedWhys : [editingCause.value.name]
      })
    } else if (originalCategoryIndex !== -1 && targetCategory.causes[originalCauseIndex]) {
      targetCategory.causes[originalCauseIndex] = {
        ...editingCause.value,
        whys: cleanedWhys.length ? cleanedWhys : [editingCause.value.name]
      }
    }
    triggerToast(`แก้ไขสาเหตุ "${editingCause.value.name}" เรียบร้อยแล้ว`)
  } else {
    targetCategory.causes.push({
      ...editingCause.value,
      whys: cleanedWhys.length ? cleanedWhys : [editingCause.value.name]
    })
    triggerToast(`เพิ่มสาเหตุใหม่ในกลุ่ม ${targetCategory.name} สำเร็จ`)
  }

  isCauseModalOpen.value = false
}

const deleteCause = (causeId: string, categoryKey: string) => {
  const cat = categories.value.find(c => c.key === categoryKey)
  if (!cat) return
  const idx = cat.causes.findIndex(c => c.id === causeId)
  if (idx !== -1) {
    const deletedCause = cat.causes[idx]
    if (deletedCause) {
      const deletedName = deletedCause.name
      cat.causes.splice(idx, 1)
      triggerToast(`ลบสาเหตุ "${deletedName}" สำเร็จ`)
    }
  }
}

const toggleCauseType = (cause: FishboneCause) => {
  cause.type = cause.type === 'C' ? 'N' : 'C'
  triggerToast(`เปลี่ยนประเภทเป็น [ ${cause.type} ] ${cause.type === 'C' ? 'Control' : 'Noise'}`)
}

const toggleKeyCause = (cause: FishboneCause) => {
  cause.isKey = !cause.isKey
  triggerToast(cause.isKey ? 'ตั้งเป็น Key Root Cause (ส่งต่อ FMEA)' : 'ยกเลิกการเน้น Key Root Cause')
}

// 2. Edit Problem Statement Modal
const isEffectModalOpen = ref(false)
const editingProblemStatement = ref({ ...problemStatement.value })

const openEffectModal = () => {
  editingProblemStatement.value = { ...problemStatement.value }
  isEffectModalOpen.value = true
}

const saveEffectModal = () => {
  problemStatement.value = { ...editingProblemStatement.value }
  isEffectModalOpen.value = false
  triggerToast('บันทึกหัวข้อปัญหา (Problem Statement) เรียบร้อย')
}

// Reset data to defaults
const resetToDefaults = () => {
  if (confirm('คุณต้องการรีเซ็ตข้อมูล Fishbone กลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
    categories.value = JSON.parse(JSON.stringify(defaultCategoriesData))
    triggerToast('รีเซ็ตข้อมูล Fishbone Diagram สำเร็จ')
  }
}
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Toast Notification Banner -->
    <div
      v-if="showToast"
      class="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs border border-gray-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <UIcon name="i-lucide-check" class="size-4 text-emerald-400" />
      <span class="font-medium">{{ toastMessage }}</span>
      <button type="button" class="text-gray-400 hover:text-white ml-2" @click="showToast = false">
        <UIcon name="i-lucide-x" class="size-3.5" />
      </button>
    </div>

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
      <span class="text-gray-900 font-bold">Fishbone Diagram</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Fishbone Diagram"
      />

      <div class="flex-1 space-y-4 min-w-0">
        <!-- Phase 2: Incoming Auto-Feed Inbox Banner (Draggable Items) -->
        <div v-if="incomingUnassignedFactors.length > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-xs shadow-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 font-bold text-amber-900">
              <UIcon name="i-lucide-inbox" class="size-4 text-amber-600" />
              <span>Auto-Feed Factors from Capability & MSA ({{ incomingUnassignedFactors.length }} รายการ - ลากไปปล่อยบนก้างปลาได้เลย)</span>
            </div>
            <span class="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-grip-vertical" class="size-3" />
              <span>Drag & Drop Enabled</span>
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div
              v-for="item in incomingUnassignedFactors"
              :key="item.id"
              draggable="true"
              class="bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-md p-2.5 flex items-center justify-between text-xs cursor-grab active:cursor-grabbing hover:shadow-sm transition-all"
              @dragstart="onDragStartInbox($event, item)"
              @dragend="onDragEnd"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-grip-vertical" class="size-4 text-amber-400" />
                <div>
                  <span class="font-bold text-gray-900 block">{{ item.factorName }}</span>
                  <span class="text-[10px] text-gray-500">{{ item.source }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="bg-[#008779] hover:bg-[#007366] text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                  @click="addIncomingFactorDirectly(item)"
                >
                  <UIcon name="i-lucide-plus" class="size-3" />
                  <span>เพิ่มทันที</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Fishbone Container Card -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <!-- Card Header & Action Toolbar -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-bold text-gray-900">
                  Ishikawa Fishbone Diagram (ผังก้างปลา 5M1E)
                </h2>
                <span class="bg-teal-50 text-[#008779] border border-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <UIcon name="i-lucide-plus-circle" class="size-3.5 text-[#008779]" />
                  <span>กดปุ่ม "+ เพิ่มในก้างปลา" บนรูปได้โดยตรง</span>
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                คลิกปุ่ม <strong>[+ เพิ่มสาเหตุ]</strong> บนก้างปลาแต่ละเส้น เพื่อเพิ่มก้างย่อยได้ทันทีบนรูป หรือคลิกที่สาเหตุเพื่อแก้ไข
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                @click="openEffectModal"
              >
                <UIcon name="i-lucide-edit-3" class="size-3.5 text-gray-500" />
                <span>แก้ไขหัวข้อเป้าหมาย</span>
              </button>

              <NuxtLink
                :to="`/admin/projects/${projectId}/measure/fmea`"
                class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <UIcon name="i-lucide-arrow-right" class="size-3.5" />
                <span>ส่งต่อไปยัง FMEA ({{ controlCount }} Control)</span>
              </NuxtLink>

              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100 transition-colors"
                title="รีเซ็ตเป็นค่าเริ่มต้น"
                @click="resetToDefaults"
              >
                <UIcon name="i-lucide-rotate-ccw" class="size-4" />
              </button>
            </div>
          </div>

          <!-- Summary Badges Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center justify-between">
              <span class="text-gray-600 font-medium">สาเหตุทั้งหมด:</span>
              <span class="font-bold text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded text-xs">
                {{ totalCausesCount }}
              </span>
            </div>
            <div class="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
              <span class="text-emerald-800 font-medium">[ C ] Control:</span>
              <span class="font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded text-xs">
                {{ controlCount }}
              </span>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
              <span class="text-slate-700 font-medium">[ N ] Noise:</span>
              <span class="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs">
                {{ noiseCount }}
              </span>
            </div>
            <div class="bg-rose-50/60 border border-rose-200 rounded-lg p-2.5 flex items-center justify-between">
              <span class="text-rose-800 font-medium">⭐ Key Causes:</span>
              <span class="font-bold text-rose-700 bg-white border border-rose-200 px-2 py-0.5 rounded text-xs">
                {{ keyCausesCount }}
              </span>
            </div>
            <div class="col-span-2 bg-teal-50/50 border border-teal-200 rounded-lg p-2.5 flex items-center justify-between">
              <span class="text-teal-900 font-medium truncate">เป้าหมาย: {{ problemStatement.targetMetric }}</span>
              <span class="font-bold text-teal-800 text-[11px]">
                {{ problemStatement.currentValue }} → {{ problemStatement.goalValue }}
              </span>
            </div>
          </div>

          <!-- ================= ON-DIAGRAM INLINE ADD FLOATING BAR ================= -->
          <div
            v-if="onDiagramAddState.isOpen"
            class="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-[#008779] rounded-xl p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-plus-circle" class="size-4 text-[#008779]" />
                <span class="font-bold text-xs text-gray-900">
                  เพิ่มสาเหตุใหม่ลงในก้างปลาหมวด:
                  <span class="text-[#008779] font-black uppercase underline">
                    {{ categories.find(c => c.key === onDiagramAddState.categoryKey)?.name }}
                    ({{ categories.find(c => c.key === onDiagramAddState.categoryKey)?.labelTh }})
                  </span>
                </span>
              </div>
              <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="onDiagramAddState.isOpen = false">
                <UIcon name="i-lucide-x" class="size-4" />
              </button>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-2">
              <input
                ref="onDiagramInputRef"
                v-model="onDiagramAddState.name"
                type="text"
                placeholder="พิมพ์ชื่อสาเหตุที่ต้องการเพิ่มลงในก้างปลานี้ แล้วกด Enter หรือปุ่มเพิ่ม..."
                class="w-full bg-white border border-teal-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008779]"
                @keydown.enter="saveOnDiagramAdd"
              />

              <!-- Type toggle [C] vs [N] -->
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  class="px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                  :class="onDiagramAddState.type === 'C' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'"
                  @click="onDiagramAddState.type = 'C'"
                >
                  [ C ] Control
                </button>
                <button
                  type="button"
                  class="px-2.5 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                  :class="onDiagramAddState.type === 'N' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-300'"
                  @click="onDiagramAddState.type = 'N'"
                >
                  [ N ] Noise
                </button>

                <label class="flex items-center gap-1.5 px-2.5 py-2 bg-white rounded-lg border border-rose-200 cursor-pointer text-xs text-rose-800 font-semibold">
                  <input v-model="onDiagramAddState.isKey" type="checkbox" class="accent-rose-600 size-3.5" />
                  <span>⭐ Key Cause</span>
                </label>

                <button
                  type="button"
                  class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  @click="saveOnDiagramAdd"
                >
                  <UIcon name="i-lucide-plus" class="size-4" />
                  <span>เพิ่มลงก้างปลา</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ISHIKAWA FISHBONE DIAGRAM (SVG Canvas with On-Bone "+ เพิ่มสาเหตุ" Buttons) -->
          <div class="w-full overflow-x-auto bg-gradient-to-b from-gray-50/60 to-white border border-gray-200/90 rounded-xl p-4 shadow-inner relative">
            <div class="min-w-[1000px] flex flex-col items-center">
              <svg class="w-full h-[540px]" viewBox="0 0 1000 540">
                <defs>
                  <filter id="boneShadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.15" />
                  </filter>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0f172a" />
                  </marker>
                </defs>

                <!-- Center Backbone Horizontal Line -->
                <line x1="50" y1="270" x2="770" y2="270" stroke="#0f172a" stroke-width="3.5" marker-end="url(#arrow)" />

                <!-- Central Target Box (Effect / Head) -->
                <g class="cursor-pointer group" @click="openEffectModal">
                  <rect
                    x="785"
                    y="235"
                    width="195"
                    height="70"
                    rx="8"
                    fill="#0f172a"
                    class="transition-all duration-150 group-hover:fill-teal-950 group-hover:stroke-teal-400 group-hover:stroke-2"
                    filter="url(#boneShadow)"
                  />
                  <text x="882" y="258" font-size="12" fill="#ffffff" font-weight="bold" text-anchor="middle">
                    {{ problemStatement.title }}
                  </text>
                  <text x="882" y="275" font-size="9.5" fill="#94a3b8" text-anchor="middle">
                    {{ problemStatement.subtitle.length > 26 ? problemStatement.subtitle.slice(0, 26) + '...' : problemStatement.subtitle }}
                  </text>
                  <text x="882" y="291" font-size="9" fill="#38bdf8" font-weight="semibold" text-anchor="middle">
                    (คลิกแก้ไขเป้าหมาย ✎)
                  </text>
                </g>

                <!-- ================= TOP BONES (Material, Machine, Method) ================= -->
                <template v-for="cat in categories.filter(c => c.topBone)" :key="cat.key">
                  <!-- Category Header Box with "+ เพิ่ม" badge -->
                  <g
                    class="cursor-pointer group"
                    @click="openOnDiagramAdd(cat.key)"
                    @dragover="onDragOverBone($event, cat.key)"
                    @dragleave="onDragLeaveBone(cat.key)"
                    @drop="onDropOnCategory($event, cat.key)"
                  >
                    <rect
                      :x="cat.boneX - 55"
                      y="35"
                      width="110"
                      height="28"
                      rx="4"
                      :fill="dragOverBoneKey === cat.key ? '#008779' : cat.accentColor"
                      class="transition-all group-hover:opacity-90"
                      :stroke="dragOverBoneKey === cat.key ? '#ffffff' : 'none'"
                      stroke-width="2"
                      filter="url(#boneShadow)"
                    />
                    <text
                      :x="cat.boneX"
                      y="53"
                      font-size="11"
                      fill="#ffffff"
                      font-weight="bold"
                      text-anchor="middle"
                    >
                      {{ cat.name }} ({{ cat.causes.length }})
                    </text>
                  </g>

                  <!-- Diagonal Main Bone (angles down-right into spine at y = 270) -->
                  <line
                    :x1="cat.boneX"
                    y1="63"
                    :x2="cat.boneX + 95"
                    y2="270"
                    :stroke="dragOverBoneKey === cat.key ? '#008779' : '#1e293b'"
                    :stroke-width="dragOverBoneKey === cat.key ? '4' : '2.5'"
                  />

                  <!-- Dynamic Sub-bones / Causes for Top Category -->
                  <template v-for="(cause, cIdx) in cat.causes" :key="cause.id">
                    <g
                      class="cursor-pointer group"
                      @click="openEditCauseModal(cause, cat.key)"
                    >
                      <!-- Sub-bone line -->
                      <line
                        :x1="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 85"
                        :y1="75 + (cIdx + 1) * (180 / (cat.causes.length + 1.5))"
                        :x2="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5))"
                        :y2="75 + (cIdx + 1) * (180 / (cat.causes.length + 1.5))"
                        :stroke="cause.isKey ? '#dc2626' : '#64748b'"
                        :stroke-width="cause.isKey ? '1.8' : '1.2'"
                      />

                      <!-- Cause Pill Background -->
                      <rect
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 185"
                        :y="62 + (cIdx + 1) * (180 / (cat.causes.length + 1.5))"
                        width="180"
                        height="22"
                        rx="4"
                        :fill="cause.isKey ? '#fef2f2' : '#ffffff'"
                        :stroke="cause.isKey ? '#fca5a5' : '#e2e8f0'"
                        stroke-width="1"
                        class="transition-all group-hover:stroke-[#008779] group-hover:stroke-2 shadow-xs"
                      />

                      <!-- Cause Text -->
                      <text
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 32"
                        :y="77 + (cIdx + 1) * (180 / (cat.causes.length + 1.5))"
                        font-size="9"
                        :fill="cause.isKey ? '#b91c1c' : '#1e293b'"
                        :font-weight="cause.isKey ? 'bold' : 'normal'"
                        text-anchor="end"
                      >
                        {{ cause.name.length > 22 ? cause.name.slice(0, 22) + '...' : cause.name }}
                      </text>

                      <!-- [ C ] / [ N ] Badge in SVG -->
                      <rect
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 28"
                        :y="65 + (cIdx + 1) * (180 / (cat.causes.length + 1.5))"
                        width="24"
                        height="15"
                        rx="2"
                        :fill="cause.type === 'C' ? '#059669' : '#64748b'"
                      />
                      <text
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 16"
                        :y="76 + (cIdx + 1) * (180 / (cat.causes.length + 1.5))"
                        font-size="8.5"
                        fill="#ffffff"
                        font-weight="bold"
                        text-anchor="middle"
                      >
                        {{ cause.type }}
                      </text>

                      <title>{{ cause.name }} ({{ cause.type === 'C' ? 'Control' : 'Noise' }}) - คลิกแก้ไข/วิเคราะห์ 5-Why</title>
                    </g>
                  </template>

                  <!-- Direct "+ เพิ่มสาเหตุในก้างนี้" Button Slot on Top Bone -->
                  <g
                    class="cursor-pointer group/add"
                    @click="openOnDiagramAdd(cat.key)"
                  >
                    <!-- Small dashed sub-line -->
                    <line
                      :x1="cat.boneX + 90 - 75"
                      :y1="245"
                      :x2="cat.boneX + 85"
                      :y2="245"
                      stroke="#008779"
                      stroke-width="1.2"
                      stroke-dasharray="3,3"
                    />
                    <!-- Add Button Pill -->
                    <rect
                      :x="cat.boneX + 90 - 160"
                      y="235"
                      width="120"
                      height="20"
                      rx="10"
                      fill="#f0fdfa"
                      stroke="#008779"
                      stroke-width="1.2"
                      stroke-dasharray="3,2"
                      class="transition-all group-hover/add:fill-[#008779] group-hover/add:stroke-[#008779]"
                    />
                    <text
                      :x="cat.boneX + 90 - 100"
                      y="249"
                      font-size="9"
                      fill="#008779"
                      font-weight="bold"
                      text-anchor="middle"
                      class="group-hover/add:fill-white transition-colors"
                    >
                      + เพิ่มใน {{ cat.name }}
                    </text>
                  </g>
                </template>

                <!-- ================= BOTTOM BONES (Measurement, Man, Environment) ================= -->
                <template v-for="cat in categories.filter(c => !c.topBone)" :key="cat.key">
                  <!-- Category Header Box with "+ เพิ่ม" badge -->
                  <g
                    class="cursor-pointer group"
                    @click="openOnDiagramAdd(cat.key)"
                    @dragover="onDragOverBone($event, cat.key)"
                    @dragleave="onDragLeaveBone(cat.key)"
                    @drop="onDropOnCategory($event, cat.key)"
                  >
                    <rect
                      :x="cat.boneX - 60"
                      y="475"
                      width="120"
                      height="28"
                      rx="4"
                      :fill="dragOverBoneKey === cat.key ? '#008779' : cat.accentColor"
                      class="transition-all group-hover:opacity-90"
                      :stroke="dragOverBoneKey === cat.key ? '#ffffff' : 'none'"
                      stroke-width="2"
                      filter="url(#boneShadow)"
                    />
                    <text
                      :x="cat.boneX"
                      y="493"
                      font-size="11"
                      fill="#ffffff"
                      font-weight="bold"
                      text-anchor="middle"
                    >
                      {{ cat.name }} ({{ cat.causes.length }})
                    </text>
                  </g>

                  <!-- Diagonal Main Bone (angles up-right into spine at y = 270) -->
                  <line
                    :x1="cat.boneX"
                    y1="475"
                    :x2="cat.boneX + 95"
                    y2="270"
                    :stroke="dragOverBoneKey === cat.key ? '#008779' : '#1e293b'"
                    :stroke-width="dragOverBoneKey === cat.key ? '4' : '2.5'"
                  />

                  <!-- Dynamic Sub-bones / Causes for Bottom Category -->
                  <template v-for="(cause, cIdx) in cat.causes" :key="cause.id">
                    <g
                      class="cursor-pointer group"
                      @click="openEditCauseModal(cause, cat.key)"
                    >
                      <line
                        :x1="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 85"
                        :y1="460 - (cIdx + 1) * (175 / (cat.causes.length + 1.5))"
                        :x2="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5))"
                        :y2="460 - (cIdx + 1) * (175 / (cat.causes.length + 1.5))"
                        :stroke="cause.isKey ? '#dc2626' : '#64748b'"
                        :stroke-width="cause.isKey ? '1.8' : '1.2'"
                      />

                      <rect
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 185"
                        :y="447 - (cIdx + 1) * (175 / (cat.causes.length + 1.5))"
                        width="180"
                        height="22"
                        rx="4"
                        :fill="cause.isKey ? '#fef2f2' : '#ffffff'"
                        :stroke="cause.isKey ? '#fca5a5' : '#e2e8f0'"
                        stroke-width="1"
                        class="transition-all group-hover:stroke-[#008779] group-hover:stroke-2 shadow-xs"
                      />

                      <text
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 32"
                        :y="462 - (cIdx + 1) * (175 / (cat.causes.length + 1.5))"
                        font-size="9"
                        :fill="cause.isKey ? '#b91c1c' : '#1e293b'"
                        :font-weight="cause.isKey ? 'bold' : 'normal'"
                        text-anchor="end"
                      >
                        {{ cause.name.length > 22 ? cause.name.slice(0, 22) + '...' : cause.name }}
                      </text>

                      <rect
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 28"
                        :y="450 - (cIdx + 1) * (175 / (cat.causes.length + 1.5))"
                        width="24"
                        height="15"
                        rx="2"
                        :fill="cause.type === 'C' ? '#059669' : '#64748b'"
                      />
                      <text
                        :x="cat.boneX + (cIdx + 1) * (85 / (cat.causes.length + 1.5)) - 16"
                        :y="461 - (cIdx + 1) * (175 / (cat.causes.length + 1.5))"
                        font-size="8.5"
                        fill="#ffffff"
                        font-weight="bold"
                        text-anchor="middle"
                      >
                        {{ cause.type }}
                      </text>
                      <title>{{ cause.name }} ({{ cause.type === 'C' ? 'Control' : 'Noise' }}) - คลิกแก้ไข/วิเคราะห์ 5-Why</title>
                    </g>
                  </template>

                  <!-- Direct "+ เพิ่มสาเหตุในก้างนี้" Button Slot on Bottom Bone -->
                  <g
                    class="cursor-pointer group/add"
                    @click="openOnDiagramAdd(cat.key)"
                  >
                    <line
                      :x1="cat.boneX + 90 - 75"
                      :y1="295"
                      :x2="cat.boneX + 85"
                      :y2="295"
                      stroke="#008779"
                      stroke-width="1.2"
                      stroke-dasharray="3,3"
                    />
                    <rect
                      :x="cat.boneX + 90 - 160"
                      y="285"
                      width="120"
                      height="20"
                      rx="10"
                      fill="#f0fdfa"
                      stroke="#008779"
                      stroke-width="1.2"
                      stroke-dasharray="3,2"
                      class="transition-all group-hover/add:fill-[#008779] group-hover/add:stroke-[#008779]"
                    />
                    <text
                      :x="cat.boneX + 90 - 100"
                      y="299"
                      font-size="9"
                      fill="#008779"
                      font-weight="bold"
                      text-anchor="middle"
                      class="group-hover/add:fill-white transition-colors"
                    >
                      + เพิ่มใน {{ cat.name }}
                    </text>
                  </g>
                </template>
              </svg>
            </div>

            <!-- Legend & Instructions below SVG -->
            <div class="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-200/60 mt-2 px-2 flex-wrap gap-2">
              <div class="flex items-center gap-4 flex-wrap">
                <span class="flex items-center gap-1.5 font-semibold text-gray-700">
                  <span class="size-2.5 rounded-full bg-[#059669]"></span>
                  <span>[ C ] Control (ปัจจัยควบคุมได้)</span>
                </span>
                <span class="flex items-center gap-1.5 font-semibold text-gray-700">
                  <span class="size-2.5 rounded-full bg-[#64748b]"></span>
                  <span>[ N ] Noise (ปัจจัยควบคุมไม่ได้)</span>
                </span>
                <span class="flex items-center gap-1.5 font-semibold text-rose-700">
                  <span class="size-2.5 rounded-full bg-[#dc2626]"></span>
                  <span>⭐ เส้นสีแดง = Key Root Cause</span>
                </span>
              </div>
              <span class="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                ✨ กดที่ปุ่ม "+ เพิ่มใน [หมวดหมู่]" บนก้างปลา หรือคลิกที่หัวหมวดหมู่เพื่อพิมพ์เพิ่มได้ทันที
              </span>
            </div>
          </div>
        </div>

        <!-- ================= INTERACTIVE 5M1E CAUSES BOARD & QUICK ADD ================= -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <UIcon name="i-lucide-layers" class="size-4 text-[#008779]" />
                <span>กระดานจัดการ 5M1E & เพิ่มสาเหตุแบบรวดเร็ว (Drag & Drop + Quick Add)</span>
              </h3>
              <p class="text-xs text-gray-500">
                ลากการ์ดเพื่อย้ายหมวดหมู่ หรือพิมพ์ข้อความในช่อง "เพิ่มสาเหตุเร็ว" แล้วกด Enter ได้ทันที
              </p>
            </div>

            <!-- View Switcher & Filters -->
            <div class="flex items-center gap-2">
              <div class="bg-gray-100 p-0.5 rounded-lg flex items-center text-xs">
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  :class="matrixViewMode === 'board' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                  @click="matrixViewMode = 'board'"
                >
                  <UIcon name="i-lucide-layout-grid" class="size-3.5" />
                  <span>Board (6 คอลัมน์)</span>
                </button>
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  :class="matrixViewMode === 'table' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'"
                  @click="matrixViewMode = 'table'"
                >
                  <UIcon name="i-lucide-list" class="size-3.5" />
                  <span>List / Matrix</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ================= 1. KANBAN BOARD VIEW (6 Columns with Drag & Drop + Inline Add) ================= -->
          <div v-if="matrixViewMode === 'board'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div
              v-for="cat in categories"
              :key="cat.key"
              class="flex flex-col bg-gray-50/70 border rounded-lg overflow-hidden transition-all duration-150"
              :class="[
                dragOverCategoryKey === cat.key ? 'border-[#008779] ring-2 ring-teal-500/20 bg-teal-50/40' : 'border-gray-200'
              ]"
              @dragover="onDragOverCategory($event, cat.key)"
              @dragleave="onDragLeaveCategory(cat.key)"
              @drop="onDropOnCategory($event, cat.key)"
            >
              <!-- Column Header -->
              <div class="p-2.5 border-b border-gray-200 bg-white flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="size-2.5 rounded-full" :style="{ backgroundColor: cat.accentColor }"></span>
                  <span class="font-bold text-xs text-gray-900">{{ cat.name }}</span>
                </div>
                <span class="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded-full">
                  {{ cat.causes.length }}
                </span>
              </div>

              <!-- Quick Inline Add Input ("พิมพ์แล้วเพิ่มได้เลย") -->
              <div class="p-2 bg-white border-b border-gray-100 space-y-1.5 shadow-xs">
                <div class="flex items-center gap-1">
                  <input
                    v-model="getQuickInput(cat.key).name"
                    type="text"
                    :placeholder="`+ พิมพ์สาเหตุใน ${cat.name}...`"
                    class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[11px] text-gray-900 focus:outline-none focus:bg-white focus:border-[#008779]"
                    @keydown.enter="addQuickCause(cat.key)"
                  />
                  <button
                    type="button"
                    class="bg-[#008779] hover:bg-[#007366] text-white p-1 rounded transition-colors cursor-pointer shrink-0"
                    title="เพิ่มทันที (Enter)"
                    @click="addQuickCause(cat.key)"
                  >
                    <UIcon name="i-lucide-plus" class="size-3.5" />
                  </button>
                </div>

                <!-- Quick toggles: C/N and Key Cause -->
                <div class="flex items-center justify-between text-[10px]">
                  <button
                    type="button"
                    class="px-1.5 py-0.5 rounded font-bold border transition-colors cursor-pointer"
                    :class="getQuickInput(cat.key).type === 'C' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'"
                    @click="getQuickInput(cat.key).type = getQuickInput(cat.key).type === 'C' ? 'N' : 'C'"
                  >
                    [{{ getQuickInput(cat.key).type }}] {{ getQuickInput(cat.key).type === 'C' ? 'Control' : 'Noise' }}
                  </button>
                  <label class="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-rose-600">
                    <input v-model="getQuickInput(cat.key).isKey" type="checkbox" class="accent-rose-600 size-3" />
                    <span>⭐ Key</span>
                  </label>
                </div>
              </div>

              <!-- Draggable Cause Cards Container -->
              <div class="p-2 space-y-2 flex-1 min-h-[140px] max-h-[360px] overflow-y-auto">
                <div
                  v-for="cause in cat.causes"
                  :key="cause.id"
                  draggable="true"
                  class="bg-white border rounded-md p-2 shadow-xs cursor-grab active:cursor-grabbing hover:border-[#008779] transition-all space-y-1.5 group select-none"
                  :class="cause.isKey ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200'"
                  @dragstart="onDragStartCause($event, cause, cat.key)"
                  @dragend="onDragEnd"
                >
                  <div class="flex items-start justify-between gap-1">
                    <span class="text-xs font-semibold text-gray-900 leading-tight block flex-1" :class="cause.isKey ? 'text-rose-800' : ''">
                      {{ cause.name }}
                    </span>
                    <UIcon name="i-lucide-grip-vertical" class="size-3 text-gray-300 group-hover:text-gray-600 shrink-0 mt-0.5" />
                  </div>

                  <!-- Bottom Pill info & Controls -->
                  <div class="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        class="px-1 py-0.2 rounded font-bold cursor-pointer"
                        :class="cause.type === 'C' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'"
                        @click.stop="toggleCauseType(cause)"
                        title="คลิกสลับ C/N"
                      >
                        {{ cause.type }}
                      </button>
                      <button
                        type="button"
                        class="cursor-pointer"
                        :class="cause.isKey ? 'text-rose-600' : 'text-gray-300 hover:text-amber-500'"
                        @click.stop="toggleKeyCause(cause)"
                        title="ตั้งเป็น Key Root Cause"
                      >
                        <UIcon name="i-lucide-star" class="size-3" />
                      </button>
                    </div>

                    <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        class="text-gray-500 hover:text-[#008779] p-0.5 cursor-pointer"
                        title="5-Why / แก้ไข"
                        @click="openEditCauseModal(cause, cat.key)"
                      >
                        <UIcon name="i-lucide-edit-3" class="size-3" />
                      </button>
                      <button
                        type="button"
                        class="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                        title="ลบ"
                        @click="deleteCause(cause.id, cat.key)"
                      >
                        <UIcon name="i-lucide-trash-2" class="size-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Drop indicator if empty or dragging -->
                <div
                  v-if="cat.causes.length === 0"
                  class="border-2 border-dashed border-gray-200 rounded-md p-3 text-center text-[10px] text-gray-400"
                >
                  ลากสาเหตุมาวางที่นี่ หรือพิมพ์เพิ่มด้านบน
                </div>
              </div>
            </div>
          </div>

          <!-- ================= 2. TABLE / MATRIX VIEW ================= -->
          <div v-else class="space-y-4">
            <div
              v-for="cat in filteredCategories"
              :key="cat.key"
              class="border border-gray-200 rounded-lg overflow-hidden"
              @dragover="onDragOverCategory($event, cat.key)"
              @dragleave="onDragLeaveCategory(cat.key)"
              @drop="onDropOnCategory($event, cat.key)"
            >
              <div class="bg-gray-50/80 px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <span class="size-3 rounded-full" :style="{ backgroundColor: cat.accentColor }"></span>
                  <span class="font-bold text-xs text-gray-900">{{ cat.name }} ({{ cat.labelTh }})</span>
                  <span class="text-[10px] text-gray-500 font-medium">({{ cat.causes.length }} สาเหตุ)</span>
                </div>
                <button
                  type="button"
                  class="bg-white hover:bg-gray-50 text-[#008779] border border-teal-200 text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  @click="openAddCauseModal(cat.key)"
                >
                  <UIcon name="i-lucide-plus" class="size-3" />
                  <span>เพิ่มสาเหตุใน {{ cat.name }}</span>
                </button>
              </div>

              <!-- Causes Rows -->
              <div v-if="cat.causes.length > 0" class="divide-y divide-gray-100 text-xs">
                <div
                  v-for="(cause, cIdx) in cat.causes"
                  :key="cause.id"
                  draggable="true"
                  class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-teal-50/20 transition-colors cursor-grab active:cursor-grabbing"
                  :class="cause.isKey ? 'bg-rose-50/20' : ''"
                  @dragstart="onDragStartCause($event, cause, cat.key)"
                  @dragend="onDragEnd"
                >
                  <div class="space-y-1.5 flex-1 min-w-0 flex items-start gap-2">
                    <UIcon name="i-lucide-grip-vertical" class="size-4 text-gray-300 hover:text-gray-600 shrink-0 mt-0.5" />
                    <div class="space-y-1 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-gray-400 font-mono text-[11px]">#{{ cIdx + 1 }}</span>
                        <span class="font-bold text-gray-900 text-xs" :class="cause.isKey ? 'text-rose-800' : ''">
                          {{ cause.name }}
                        </span>
                        <span
                          v-if="cause.isKey"
                          class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200"
                        >
                          ⭐ Key Cause
                        </span>
                      </div>

                      <div v-if="cause.whys && cause.whys.length > 0" class="flex items-center gap-1.5 text-[11px] text-gray-500 overflow-x-auto">
                        <span class="font-semibold text-gray-400 text-[10px] uppercase">5-Why:</span>
                        <template v-for="(why, wIdx) in cause.whys" :key="wIdx">
                          <span v-if="why" class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[200px]">
                            {{ wIdx + 1 }}. {{ why }}
                          </span>
                          <span v-if="wIdx < cause.whys.length - 1 && cause.whys[wIdx+1]" class="text-gray-300">→</span>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      class="px-2 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer"
                      :class="cause.type === 'C' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'"
                      @click="toggleCauseType(cause)"
                    >
                      [{{ cause.type }}] {{ cause.type === 'C' ? 'Control' : 'Noise' }}
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded text-xs border transition-colors cursor-pointer"
                      :class="cause.isKey ? 'bg-rose-50 text-rose-600 border-rose-300' : 'text-gray-400 border-gray-200 hover:text-amber-500 hover:bg-amber-50'"
                      @click="toggleKeyCause(cause)"
                    >
                      <UIcon name="i-lucide-star" class="size-3.5" />
                    </button>
                    <button
                      type="button"
                      class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      @click="openEditCauseModal(cause, cat.key)"
                    >
                      <UIcon name="i-lucide-git-branch" class="size-3.5 text-teal-600" />
                      <span>5-Why / แก้ไข</span>
                    </button>
                    <button
                      type="button"
                      class="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      @click="deleteCause(cause.id, cat.key)"
                    >
                      <UIcon name="i-lucide-trash-2" class="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="p-6 text-center text-xs text-gray-400 bg-gray-50/30">
                ยังไม่มีสาเหตุในหมวดหมู่นี้ ลากการ์ดมาวางหรือกดปุ่มเพื่อเพิ่มข้อมูล
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL 1: CAUSE & 5-WHY EDITOR ================= -->
    <div
      v-if="isCauseModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <UIcon name="i-lucide-git-branch" class="size-4 text-[#008779]" />
              <span>{{ isEditingCause ? 'แก้ไขสาเหตุ & วิเคราะห์ 5-Why Root Cause' : 'เพิ่มสาเหตุใหม่ในก้างปลา (Add Cause)' }}</span>
            </h3>
            <p class="text-[11px] text-gray-500">
              กำหนดชื่อสาเหตุ, ประเภท Control/Noise และวิเคราะห์หาสาเหตุรากเหง้าทีละชั้น
            </p>
          </div>
          <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="isCauseModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-4 text-xs max-h-[72vh] overflow-y-auto">
          <div class="space-y-1">
            <label class="text-[11px] text-gray-700 font-bold block">
              ชื่อสาเหตุ / ปัญหาที่สังเกตเห็น (Cause Statement) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editingCause.name"
              type="text"
              placeholder="เช่น การ set ค่าน้ำหนักเผื่อ Multihead เกินสเปก"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779] focus:ring-1 focus:ring-[#008779]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-[11px] text-gray-700 font-bold block">หมวดหมู่ก้างปลา (5M1E)</label>
              <select
                v-model="selectedCategoryKey"
                class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
              >
                <option v-for="cat in categories" :key="cat.key" :value="cat.key">
                  {{ cat.name }} ({{ cat.labelTh }})
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] text-gray-700 font-bold block">ประเภทสาเหตุ (Root Cause Type)</label>
              <div class="flex items-center gap-3 pt-1">
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input v-model="editingCause.type" type="radio" value="C" class="accent-emerald-600" />
                  <span class="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                    [ C ] Control (ควบคุมได้)
                  </span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer">
                  <input v-model="editingCause.type" type="radio" value="N" class="accent-slate-600" />
                  <span class="font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px]">
                    [ N ] Noise (ควบคุมไม่ได้)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div class="bg-rose-50/50 border border-rose-200 rounded-md p-3 flex items-center justify-between">
            <div>
              <span class="font-bold text-rose-900 block text-xs">⭐ กำหนดเป็น Key Root Cause (สาเหตุวิกฤต)</span>
              <span class="text-[10px] text-rose-700">สาเหตุนี้จะถูกไฮไลต์เส้นสีแดงบนก้างปลา และเตรียมส่งต่อไปทำ FMEA ลำดับแรก</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="editingCause.isKey" type="checkbox" class="sr-only peer" />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          <div class="space-y-2.5 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <UIcon name="i-lucide-git-branch" class="size-3.5 text-[#008779]" />
                <span>5-Why Analysis Chain (การวิเคราะห์หาสาเหตุรากเหง้า)</span>
              </span>
              <button
                v-if="editingCause.whys.length < 5"
                type="button"
                class="text-[11px] text-[#008779] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                @click="addWhyLevel"
              >
                <UIcon name="i-lucide-plus" class="size-3" />
                <span>+ เพิ่มชั้น Why (สูงสุด 5 ระดับ)</span>
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(why, wIdx) in editingCause.whys"
                :key="wIdx"
                class="space-y-1"
                :class="wIdx > 0 ? `pl-${Math.min(wIdx * 3, 6)} border-l-2 border-teal-${200 + wIdx * 100}` : ''"
              >
                <div class="flex items-center justify-between text-[10px] text-gray-500 font-bold">
                  <span>Why {{ wIdx + 1 }} {{ wIdx === 0 ? '(ปรากฏการณ์ที่พบ)' : wIdx === editingCause.whys.length - 1 ? '(สาเหตุรากเหง้า / Root Cause)' : '(สาเหตุโดยตรง)' }}:</span>
                  <button
                    v-if="editingCause.whys.length > 1"
                    type="button"
                    class="text-gray-400 hover:text-red-500 cursor-pointer"
                    @click="removeWhyLevel(wIdx)"
                  >
                    ลบชั้นนี้
                  </button>
                </div>
                <input
                  v-model="editingCause.whys[wIdx]"
                  type="text"
                  :placeholder="`ระบุเหตุผลระดับที่ ${wIdx + 1}...`"
                  class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <button
              v-if="isEditingCause"
              type="button"
              class="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              @click="deleteCause(editingCause.id, selectedCategoryKey); isCauseModalOpen = false"
            >
              <UIcon name="i-lucide-trash-2" class="size-3.5" />
              <span>ลบสาเหตุนี้</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
              @click="isCauseModalOpen = false"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              @click="saveCauseModal"
            >
              <UIcon name="i-lucide-save" class="size-3.5" />
              <span>บันทึก & อัปเดตก้างปลา</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL 2: EDIT PROBLEM STATEMENT (EFFECT) ================= -->
    <div
      v-if="isEffectModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-sm font-bold text-gray-900">
              แก้ไขหัวข้อปัญหาและเป้าหมาย (Effect / Problem Statement)
            </h3>
            <p class="text-[11px] text-gray-500">ข้อความนี้จะแสดงในกล่องหัวปลา (Fishbone Target Box)</p>
          </div>
          <button type="button" class="text-gray-400 hover:text-gray-600 p-1" @click="isEffectModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="text-[11px] text-gray-700 font-bold block">ชื่อปัญหาหลัก (Title)</label>
            <input
              v-model="editingProblemStatement.title"
              type="text"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[11px] text-gray-700 font-bold block">คำอธิบายรายละเอียด (Subtitle / Detail)</label>
            <textarea
              v-model="editingProblemStatement.subtitle"
              rows="2"
              class="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779]"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div class="space-y-1">
              <label class="text-[10px] text-gray-500 font-bold">ค่าปัจจุบัน (Current)</label>
              <input
                v-model="editingProblemStatement.currentValue"
                type="text"
                class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] text-gray-500 font-bold">ค่าเป้าหมาย (Goal)</label>
              <input
                v-model="editingProblemStatement.goalValue"
                type="text"
                class="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900"
              />
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
          <button
            type="button"
            class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
            @click="isEffectModalOpen = false"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer shadow-xs"
            @click="saveEffectModal"
          >
            บันทึกหัวข้อปัญหา
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
