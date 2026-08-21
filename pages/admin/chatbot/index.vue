<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useProjectData } from '~/composables/useProjectData'
import { useCompanyDirectory } from '~/composables/useCompanyDirectory'

// --- 1. Project Mock Data Connection (From System Composables) ---

const availableProjects = ref([
  {
    id: 'example-total-yield',
    name: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    plant: 'โรงงานแปรรูปโชคชัย (Food Business)',
    phase: 'Improve',
    belt: 'Black Belt',
    leader: 'Romteera Tadderm'
  },
  {
    id: 'p2',
    name: 'Auto Heating Yield Monitoring Project',
    plant: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    phase: 'Measure',
    belt: 'Green Belt',
    leader: 'Nadtapong Aontawee'
  },
  {
    id: 'feed-energy-reduction',
    name: 'ลดการใช้พลังงานไฟฟ้าในกระบวนการอัดเม็ดอาหารสัตว์',
    plant: 'Feed Mill Saraburi (Feed Business)',
    phase: 'Control',
    belt: 'Green Belt',
    leader: 'Anan Petcharat'
  },
  {
    id: 'farm-fcr-improvement',
    name: 'ปรับปรุงค่า FCR ไก่เนื้อฟาร์มปิดระบบ Evap',
    plant: 'Broiler Farm Korat (Farm Business)',
    phase: 'Control',
    belt: 'Black Belt',
    leader: 'Kitti Somwong'
  }
])

const selectedProjectId = ref('example-total-yield')

// Dynamic Store Binding
const activeProjectStore = computed(() => useProjectData(selectedProjectId.value))
const currentProject = computed(() => activeProjectStore.value.project.value)
const currentSummary = computed(() => activeProjectStore.value.projectSummary.value)
const currentCapability = computed(() => activeProjectStore.value.capabilityMetrics.value)
const currentTracking = computed(() => activeProjectStore.value.trackingStats.value)
const currentRealization = computed(() => activeProjectStore.value.realizationStats.value)

// User Directory
const { users } = useCompanyDirectory()
const activeUser = computed(() => {
  const found = users.value?.find(u => u.name === currentProject.value?.leader)
  return found || users.value?.[0] || {
    id: 'u-1',
    name: 'Romteera Tadderm',
    initials: 'RT',
    email: 'romteera.t@cpf.co.th',
    belt: 'Black Belt',
    role: 'Project Owner',
    department: 'Processing Plant Line 2'
  }
})

// KM Repository Mock Records
const kmRepositoryRecords = [
  {
    id: 'PFR-CPF-2026-088',
    title: 'เพิ่ม %Total Yield สินค้าไก่ทอดแช่แข็ง',
    businessUnit: 'Processing Plant Chokchai',
    belt: 'Black Belt',
    author: 'Romteera Tadderm',
    category: 'Yield & Giveaway Reduction',
    verifiedSavings: '4,250,000 THB / Year',
    yieldGain: '+3.95%',
    tags: ['Six Sigma', 'DOE', 'Giveaway', 'Multihead', 'Yield']
  },
  {
    id: 'PFR-CPF-2025-042',
    title: 'ลดการใช้พลังงานไฟฟ้าในกระบวนการอัดเม็ดอาหารสัตว์',
    businessUnit: 'Feed Mill Saraburi',
    belt: 'Green Belt',
    author: 'Anan Petcharat',
    category: 'Energy & Utility Optimization',
    verifiedSavings: '2,800,000 THB / Year',
    yieldGain: '-12.4% kWh/Ton',
    tags: ['Energy', 'Pelleting', 'Regression']
  },
  {
    id: 'PFR-CPF-2025-019',
    title: 'ปรับปรุงค่า FCR ไก่เนื้อฟาร์มปิดระบบ Evap',
    businessUnit: 'Broiler Farm Korat',
    belt: 'Black Belt',
    author: 'Kitti Somwong',
    category: 'FCR & Biological Performance',
    verifiedSavings: '5,600,000 THB / Year',
    yieldGain: '-0.04 FCR',
    tags: ['FCR', 'Broiler', 'Evap', 'ANOVA']
  }
]

// --- 2. Multiple AI Models Engine ---

interface AiModel {
  id: string
  name: string
  tag: string
  badgeColor: string
  icon: string
  desc: string
  speed: string
  specialty: string
}

const aiModels: AiModel[] = [
  {
    id: 'genie-2.5-pro',
    name: 'Genie 2.5 Pro (Six Sigma MBB)',
    tag: '2.5 Pro',
    badgeColor: 'bg-teal-50 text-[#008779] border-teal-200',
    icon: 'i-lucide-sparkles',
    desc: 'Complex reasoning, DMAIC roadmap guidance, and stage-gate approval synthesis',
    speed: 'Standard (~0.8s)',
    specialty: 'Master Black Belt Strategy & DMAIC'
  },
  {
    id: 'genie-2.5-flash',
    name: 'Genie 2.5 Flash',
    tag: '2.5 Flash',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'i-lucide-zap',
    desc: 'Ultra-fast low latency model for quick SOP lookups and statistical calculations',
    speed: 'Ultra-fast (~0.2s)',
    specialty: 'Quick Queries & Formula Reference'
  },
  {
    id: 'genie-r1-reasoner',
    name: 'Genie-R1 Statistical Reasoner',
    tag: 'R1 Reasoner',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: 'i-lucide-brain-circuit',
    desc: 'Deep step-by-step mathematical reasoning, ANOVA P-value proofs, and Trend Forecasting',
    speed: 'Deep Thinking (~1.2s)',
    specialty: 'Advanced Analytics, Trend Forecast & ANOVA'
  },
  {
    id: 'genie-vision',
    name: 'Genie-Vision Multi-Modal',
    tag: 'Vision Pro',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'i-lucide-eye',
    desc: 'Image and chart interpretation: Minitab graphs, Pareto, Control Charts, and Bell curves',
    speed: 'High-Res (~0.9s)',
    specialty: 'Chart & Visual Data Interpretation'
  }
]

const selectedModelId = ref('genie-2.5-pro')
const selectedModel = computed<AiModel>(() => {
  const found = aiModels.find(m => m.id === selectedModelId.value)
  return found || aiModels[0]!
})

const isModelDropdownOpen = ref(false)

// Personas
interface Persona {
  id: string
  name: string
  title: string
  icon: string
  badgeColor: string
  description: string
  systemPrompt: string
}

const personas: Persona[] = [
  {
    id: 'statistician',
    name: 'Statistical Specialist',
    title: 'Data & Hypothesis Testing Expert',
    icon: 'i-lucide-bar-chart-3',
    badgeColor: 'bg-emerald-50 text-[#008779] border-emerald-200',
    description: 'ผู้เชี่ยวชาญการเลือกสถิติ ANOVA, 2-Sample T, DOE 2^k, Cpk/Ppk, Gage R&R และการสร้างกราฟวิเคราะห์แนวโน้มจากข้อมูลในระบบ',
    systemPrompt: 'You are an advanced Lean Six Sigma Statistician for industrial manufacturing.'
  },
  {
    id: 'mbb',
    name: 'Master Black Belt (MBB)',
    title: 'DMAIC Strategy & Tollgate Coach',
    icon: 'i-lucide-award',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'เน้นการทบทวน Stage Gate (PCR/PFR), ตรวจสอบสมการทางการเงิน Financial Benefit Realization และการอนุมัติข้ามเฟส',
    systemPrompt: 'You are an experienced Master Black Belt (MBB) consultant at CPF.'
  },
  {
    id: 'rca',
    name: 'Root Cause Detective',
    title: '5-Why, Fishbone & FMEA Master',
    icon: 'i-lucide-search',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'ช่วยวิเคราะห์แยกปัจจัย Controllable (C) vs Noise (N) ในผังก้างปลา และจัดลำดับความเสี่ยง RPN ใน Process FMEA',
    systemPrompt: 'You are a Root Cause Analysis and FMEA risk mitigation expert.'
  },
  {
    id: 'km-guide',
    name: 'CPF KM & Standards',
    title: 'SOP & Plant Best Practices',
    icon: 'i-lucide-book-open',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'ดึงข้อมูลมาตรฐาน SOP และค้นหาบทเรียนความสำเร็จจากคลังความรู้ GenieWisdom Six Sigma KM Repository',
    systemPrompt: 'You are the CPF Knowledge Management & Process Standards retrieval assistant.'
  }
]

const selectedPersonaId = ref('statistician')
const selectedPersona = computed<Persona>(() => {
  const found = personas.find(p => p.id === selectedPersonaId.value)
  return found || personas[0]!
})

// --- 3. Chat Sessions & Messages ---

interface ChatSession {
  id: string
  title: string
  date: string
  group: 'today' | 'yesterday' | 'older'
  preview: string
  personaId: string
  projectId: string
  modelTag: string
}

const chatSessions = ref<ChatSession[]>([
  {
    id: 'session-1',
    title: 'Yield & Trend Forecasting Analysis',
    date: '15:10 น.',
    group: 'today',
    preview: 'วิเคราะห์แนวโน้ม Yield 12 เดือน พร้อมกราฟ Trendline & ANOVA Boxplot',
    personaId: 'statistician',
    projectId: 'example-total-yield',
    modelTag: '2.5 Pro'
  },
  {
    id: 'session-2',
    title: 'Process Cpk Bell Curve & Capability',
    date: '11:20 น.',
    group: 'today',
    preview: 'พล็อตกราฟ Normal Distribution Curve และคำนวณสถิติ Cpk 1.12',
    personaId: 'statistician',
    projectId: 'example-total-yield',
    modelTag: 'R1 Reasoner'
  },
  {
    id: 'session-3',
    title: 'DOE 2^3 Factorial Parameter Tuning',
    date: 'เมื่อวานนี้',
    group: 'yesterday',
    preview: 'สมการ Response Surface & Interaction อุณหภูมิและรอบความเร็วสายพาน',
    personaId: 'statistician',
    projectId: 'example-total-yield',
    modelTag: '2.5 Pro'
  },
  {
    id: 'session-4',
    title: 'Pelleting Energy Reduction Regression',
    date: '3 วันที่แล้ว',
    group: 'older',
    preview: 'วิเคราะห์สมการ Regression ลดการใช้ไฟฟ้า Feed Mill',
    personaId: 'mbb',
    projectId: 'feed-energy-reduction',
    modelTag: '2.5 Flash'
  }
])

const activeSessionId = ref('session-1')
const searchSessionQuery = ref('')

const filteredSessions = computed(() => {
  if (!searchSessionQuery.value.trim()) return chatSessions.value
  const q = searchSessionQuery.value.toLowerCase()
  return chatSessions.value.filter(s => s.title.toLowerCase().includes(q) || s.preview.toLowerCase().includes(q))
})

const sessionsToday = computed(() => filteredSessions.value.filter(s => s.group === 'today'))
const sessionsYesterday = computed(() => filteredSessions.value.filter(s => s.group === 'yesterday'))
const sessionsOlder = computed(() => filteredSessions.value.filter(s => s.group === 'older'))

// Sidebar States
const isLeftSidebarOpen = ref(true)
const isRightSidebarOpen = ref(false)

// Messages with Rich Chart Data Payloads
export interface ChartPayload {
  type: 'trend' | 'capability' | 'boxplot' | 'pareto'
  title: string
  subtitle?: string
  trendData?: { month: string; actual: number; target: number; forecast?: number }[]
  capabilityData?: { usl: number; lsl: number; mean: number; target: number; cpk: number }
  boxplotData?: { label: string; min: number; q1: number; median: number; q3: number; max: number; pVal: string }[]
  paretoData?: { factor: string; count: number; cumulativePct: number }[]
  kpis?: { label: string; value: string; change?: string; color?: string }[]
}

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  time: string
  personaId?: string
  model?: AiModel
  suggestions?: string[]
  copied?: boolean
  feedback?: 'like' | 'dislike'
  isTable?: boolean
  tableData?: { headers: string[]; rows: string[][] }
  chart?: ChartPayload
  thought?: string
  showThought?: boolean
  sourceDataTag?: string
}

const messages = ref<Message[]>([])

// Start with empty/welcome state or preloaded conversation
const isNewConversation = computed(() => messages.value.length === 0)

// Quick Gemini-Style Suggestion Cards
const geminiPromptCards = [
  {
    title: 'วิเคราะห์แนวโน้ม Yield & Forecast',
    subtitle: 'พล็อตกราฟ Time-Series แสดงผลจริงเทียบเป้าหมาย และคาดการณ์ 6 เดือนข้างหน้า',
    prompt: 'ช่วยพล็อตกราฟวิเคราะห์แนวโน้ม Yield (Trend Analysis & Forecast) 12 เดือน พร้อมคำนวณทิศทางแนวโน้ม',
    icon: 'i-lucide-trending-up',
    iconBg: 'bg-emerald-50 text-[#008779]'
  },
  {
    title: 'กราฟ Process Capability (Bell Curve)',
    subtitle: 'แสดงกราฟ Normal Curve เปรียบเทียบค่า Mean, USL, LSL และประเมิน Cpk 1.12',
    prompt: 'ช่วยแสดงกราฟ Process Capability Bell Curve และวิเคราะห์การกระจายตัวของข้อมูลเทียบข้อกำหนด USL/LSL',
    icon: 'i-lucide-activity',
    iconBg: 'bg-indigo-50 text-indigo-600'
  },
  {
    title: 'เปรียบเทียบสถิติ ANOVA (Boxplot)',
    subtitle: 'วิเคราะห์ความเร็ว Predust 30Hz, 40Hz, 50Hz พร้อม Boxplot และผล P-Value',
    prompt: 'ช่วยพล็อตกราฟ ANOVA Boxplot เปรียบเทียบความเร็ว Predust 3 ระดับ พร้อมแปลผล P-value',
    icon: 'i-lucide-bar-chart-3',
    iconBg: 'bg-purple-50 text-purple-600'
  },
  {
    title: 'ค้นหา Best Practice & PFR ใน KM',
    subtitle: 'สืบค้นรายงาน PFR และความรู้ที่ได้รับการรับรองจากโรงงานอื่นในเครือ CPF',
    prompt: 'ค้นหาโครงการ Six Sigma ที่ประสบความสำเร็จด้าน Yield & Energy ใน GenieWisdom KM Repository',
    icon: 'i-lucide-book-open',
    iconBg: 'bg-amber-50 text-amber-600'
  }
]

// Interactive Hypothesis Decision Tree Tool (In Right Drawer)
const hypoDataType = ref<'continuous' | 'attribute'>('continuous')
const hypoGroupCount = ref<'1' | '2' | '3+'>('3+')
const hypoIsNormal = ref<'normal' | 'non-normal'>('normal')

const recommendedHypothesisTest = computed(() => {
  if (hypoDataType.value === 'continuous') {
    if (hypoGroupCount.value === '1') {
      return hypoIsNormal.value === 'normal' ? '1-Sample T-Test / Z-Test' : '1-Sample Sign / Wilcoxon Test'
    } else if (hypoGroupCount.value === '2') {
      return hypoIsNormal.value === 'normal' ? '2-Sample T-Test (Independent/Paired)' : 'Mann-Whitney U Test'
    } else {
      return hypoIsNormal.value === 'normal' ? 'One-Way ANOVA (F-Test)' : 'Kruskal-Wallis H-Test'
    }
  } else {
    if (hypoGroupCount.value === '1') {
      return '1-Proportion Test'
    } else if (hypoGroupCount.value === '2') {
      return '2-Proportion Test / Chi-Square'
    } else {
      return 'Chi-Square Test of Independence (Contingency Table)'
    }
  }
})

const userInput = ref('')
const isGenerating = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// Scroll chat to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Send Message Handler with Dynamic Intelligence from Mock Stores & Chart Generator
const handleSendMessage = (customText?: string) => {
  const text = customText || userInput.value.trim()
  if (!text || isGenerating.value) return

  // Add User Message
  messages.value.push({
    id: `m-${Date.now()}`,
    sender: 'user',
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  userInput.value = ''
  isGenerating.value = true
  scrollToBottom()

  const currentActiveModel = selectedModel.value
  const delay = currentActiveModel.id === 'genie-2.5-flash' ? 250 : currentActiveModel.id === 'genie-r1-reasoner' ? 1100 : 700

  // Generate Context-Aware AI Response with Dynamic Charts and Tables
  setTimeout(() => {
    isGenerating.value = false
    let replyText = ''
    let isTable = false
    let tableData: { headers: string[]; rows: string[][] } | undefined = undefined
    let chart: ChartPayload | undefined = undefined
    let suggestions: string[] = []
    let thoughtText = ''

    const p = currentProject.value
    const sum = currentSummary.value
    const cap = currentCapability.value

    if (text.includes('แนวโน้ม') || text.includes('Trend') || text.includes('Forecast') || text.includes('Time-Series') || text.includes('พล็อต')) {
      thoughtText = `[${currentActiveModel.name}]\n1. Query Realization and Tracking Logs from ${p.name}\n2. Compute Linear Regression Trend Slope: Beta = +0.33%/month (R2 = 0.942, P < 0.001)\n3. Compute 95% Prediction Intervals for Q3-Q4 Forecast: Projected Sustained Yield = 89.20%`
      replyText = `📈 **รายงานการวิเคราะห์แนวโน้ม (Yield Trendline & Forecasting Model):**\n\nจากการวิเคราะห์ข้อมูลกระบวนการผลิต 12 เดือนของโครงการ **${p.name}** พบว่าแนวโน้ม %Total Yield มีทิศทางเพิ่มขึ้นอย่างมีนัยสำคัญ ($P < 0.001$) โดยมีความชันเฉลี่ย **+0.33% ต่อเดือน**\n\n### สรุปสาระสำคัญของสมการแนวโน้ม:\n- **Baseline เดิม (ก่อนปรับปรุง):** ${sum.baselineYield}\n- **ยอด Yield ปัจจุบัน:** **${sum.finalYield}** (${sum.yieldImprovement} การฟื้นตัว)\n- **เป้าหมาย LSS Goal:** ${sum.goalLssYield}\n- **คาดการณ์ปลายปี (Forecast):** **89.20%** (เกินเป้าหมายท้าทาย BU Challenge)`
      
      chart = {
        type: 'trend',
        title: 'Yield (%) Time-Series Trend & 6-Month Forecasting',
        subtitle: 'เส้นทึบ: ข้อมูลจริงในระบบ | เส้นประ: การคาดการณ์ (Forecast) ด้วยโมเดลสถิติ',
        trendData: [
          { month: 'M1', actual: 80.0, target: 87.15 },
          { month: 'M2', actual: 84.0, target: 87.15 },
          { month: 'M3', actual: 84.0, target: 87.15 },
          { month: 'M4', actual: 83.0, target: 87.15 },
          { month: 'M5', actual: 82.0, target: 87.15 },
          { month: 'M6', actual: 85.0, target: 87.15 },
          { month: 'M7', actual: 88.0, target: 87.15 },
          { month: 'M8', actual: 86.5, target: 87.15, forecast: 86.5 },
          { month: 'M9', actual: 87.2, target: 87.15, forecast: 87.4 },
          { month: 'M10', actual: 87.7, target: 87.15, forecast: 88.1 },
          { month: 'M11', actual: 88.2, target: 87.15, forecast: 88.7 },
          { month: 'M12', actual: 88.8, target: 87.15, forecast: 89.2 }
        ],
        kpis: [
          { label: 'Current Yield', value: sum.finalYield || '87.70%', change: sum.yieldImprovement || '+3.95%', color: 'text-teal-700' },
          { label: 'Trend Slope', value: '+0.33%/mo', change: 'R² = 94.2%', color: 'text-indigo-600' },
          { label: 'Forecast Q4', value: '89.20%', change: '+2.05% vs Goal', color: 'text-emerald-600' },
          { label: 'Annual Savings', value: sum.verifiedAnnualSavings || '4,250,000 THB', color: 'text-amber-700' }
        ]
      }
      suggestions = [
        '📊 ดูตารางตัวเลข Tracking รายเดือน',
        '🔬 วิเคราะห์ค่า Cpk Bell Curve',
        '💾 นำผลการคาดการณ์ไปลงนามใน Stage Gate PFR'
      ]
    } else if (text.includes('Capability') || text.includes('Bell Curve') || text.includes('Cpk') || text.includes('กระจายตัว')) {
      thoughtText = `[${currentActiveModel.name}]\n1. Fetch Capability Metrics: USL = ${p.capability.usl}, LSL = ${p.capability.lsl}, Mean = ${p.capability.sampleMean}, StdDev = ${p.capability.sampleStdDev}\n2. Calculate Z-Scores: Z_USL = 3.69, Z_LSL = -0.88\n3. Calculate Capability Indices: Cpk = ${cap.cpk}, Ppk = ${cap.ppk}`
      replyText = `📊 **กราฟการแจกแจงแบบปกติ (Process Capability Normal Distribution Curve):**\n\nจากการพล็อตโค้งระฆังคว่ำเทียบกับค่าพิกัดจำเพาะ (USL/LSL) พบว่ากระบวนการมีความเบ้ไปทางขอบเขตด้านล่าง (LSL) ทำให้ค่า **Cpk = ${cap.cpk}** ซึ่งยังต่ำกว่าเป้าหมาย Six Sigma ($\\ge 1.33$)\n\n### แนวทางปรับปรุงเชิงวิศวกรรม:\n1. **ขยับจุดกึ่งกลาง (Mean Shift):** ปรับ Center จาก ${p.capability.sampleMean}% ไปที่ Target ${p.capability.targetVal}%\n2. **ลดความผันแปร (Variance Reduction):** คุมค่า Standard Deviation ให้ต่ำกว่า 0.95`

      chart = {
        type: 'capability',
        title: `Process Capability Curve (Cpk = ${cap.cpk})`,
        subtitle: `Mean = ${p.capability.sampleMean}% | StdDev = ${p.capability.sampleStdDev} | Target = ${p.capability.targetVal}%`,
        capabilityData: {
          usl: p.capability.usl,
          lsl: p.capability.lsl,
          mean: p.capability.sampleMean,
          target: p.capability.targetVal,
          cpk: Number(cap.cpk)
        },
        kpis: [
          { label: 'Process Cpk', value: cap.cpk.toString(), change: cap.isCapable ? 'Capable' : 'Action Needed', color: cap.isCapable ? 'text-emerald-600' : 'text-amber-600' },
          { label: 'Sample Mean', value: `${p.capability.sampleMean}%`, color: 'text-slate-800' },
          { label: 'USL / LSL', value: `${p.capability.usl}% / ${p.capability.lsl}%`, color: 'text-slate-600' },
          { label: 'Est. Sigma Level', value: `${(Number(cap.cpk) * 3).toFixed(1)} σ`, color: 'text-indigo-600' }
        ]
      }
      suggestions = [
        '🧪 ดูตาราง Action Items ที่ช่วยดันค่า Cpk',
        '📈 พล็อตกราฟแนวโน้ม Yield 12 เดือน',
        '📋 ตรวจสอบผล Gage R&R ของเครื่องชั่ง'
      ]
    } else if (text.includes('Boxplot') || text.includes('ANOVA') || text.includes('เปรียบเทียบ') || text.includes('30Hz')) {
      thoughtText = `[${currentActiveModel.name}]\n1. Filter Factor: ความเร็วเครื่องเติมแป้ง Predust (30Hz, 40Hz, 50Hz)\n2. One-Way ANOVA F-Test: F = 5.24, P-Value = 0.012 (P < 0.05 -> Reject H0)\n3. Tukey-Kramer Post-Hoc: 40Hz is significantly better than 30Hz and 50Hz`
      replyText = `🧪 **กราฟเปรียบเทียบ One-Way ANOVA Boxplot (ความเร็วเครื่อง Predust):**\n\nผลการทดสอบทางสถิติยืนยันว่า **ความเร็ว 40Hz** ให้น้ำหนักแป้งเคลือบสม่ำเสมอที่สุด และลด Giveaway ได้อย่างมีนัยสำคัญทางสถิติ ($P = 0.012 < 0.05$)\n\n### สรุปผลการเปรียบเทียบ 3 ระดับความเร็ว:\n- **30 Hz:** การเคลือบแป้งไม่ทั่วถึง มี Defect หลุดร่วง\n- **40 Hz (Optimal Level):** ค่าเฉลี่ยเกาะกลุ่มสม่ำเสมอ ความผันแปรต่ำสุด\n- **50 Hz:** แป้งหนาเกินมาตรฐาน เพิ่มต้นทุนวัตถุดิบ`

      chart = {
        type: 'boxplot',
        title: 'One-Way ANOVA Boxplot: Coating Weight vs Predust Speed (Hz)',
        subtitle: 'การทดสอบความแตกต่างของ 3 กลุ่มตัวอย่าง (F = 5.24, P = 0.012)',
        boxplotData: [
          { label: '30 Hz', min: 14.2, q1: 15.5, median: 16.2, q3: 17.1, max: 18.0, pVal: 'Sub-optimal' },
          { label: '40 Hz (Best)', min: 19.1, q1: 19.8, median: 20.3, q3: 20.9, max: 21.5, pVal: 'Optimal (P < 0.05)' },
          { label: '50 Hz', min: 21.8, q1: 22.9, median: 23.8, q3: 24.6, max: 25.8, pVal: 'Excessive Pickup' }
        ],
        kpis: [
          { label: 'ANOVA P-Value', value: '0.012', change: 'Significant (P < 0.05)', color: 'text-emerald-600' },
          { label: 'F-Statistic', value: '5.24', color: 'text-indigo-600' },
          { label: 'Recommended Speed', value: '40 Hz', color: 'text-[#008779]' }
        ]
      }
      suggestions = [
        '💾 บันทึก 40Hz เข้าสู่ Standard Operating Procedure (SOP)',
        '📈 ดูผลวิเคราะห์แนวโน้ม Yield โดยรวม',
        '🔍 ค้นหา Best Practice โครงการอื่นใน KM'
      ]
    } else if (text.includes('Hypothesis') || text.includes('สมมติฐาน') || text.includes('Vital Few') || text.includes('สถิติ')) {
      thoughtText = `[${currentActiveModel.name}]\n1. Query Hypothesis Tests for project: ${p.id}\n2. Compile test results and vital few significance status`
      replyText = `📊 **ตารางผลการวิเคราะห์การทดสอบสมมติฐาน (Hypothesis Testing) ในระบบสำหรับโครงการ ${p.name}:**\n\nระบบตรวจพบการทดสอบสถิติทั้งหมด **${p.hypothesisTests.length} รายการ** โดยมีปัจจัยที่พิสูจน์แล้วว่าเป็น **Vital Few ($P < 0.05$):**`
      isTable = true
      tableData = {
        headers: ['รหัส', 'ปัจจัยทดสอบ (X Factor)', 'เครื่องมือสถิติ', 'P-Value', 'การตัดสินใจทางสถิติ', 'สถานะในระบบ'],
        rows: p.hypothesisTests.map(t => [
          t.id,
          t.factor,
          t.tool,
          `P = ${t.pVal}`,
          t.decision,
          t.status
        ])
      }
      suggestions = [
        '📈 พล็อตกราฟเปรียบเทียบ One-Way ANOVA Boxplot',
        '📊 วิเคราะห์กราฟแนวโน้ม Yield 12 เดือน',
        '💾 นำปัจจัย Vital Few ไปใส่ในแผน Action Items'
      ]
    } else {
      thoughtText = `[${currentActiveModel.name}]\nวิเคราะห์คำถาม • บริบท ${p.name} (${p.plant}) ในระยะ ${p.phase} Phase`
      replyText = `🤖 **GenieWisdom (${currentActiveModel.name}) ตอบกลับสำหรับข้อคำถาม:** "${text}"\n\nระบบได้ประมวลผลร่วมกับฐานข้อมูลโครงการจริง **${p.name} (${p.plant})**:\n\n1. **สถานะปัจจุบัน:** โครงการอยู่ในเฟส **${p.phase}** มียอด Yield ปัจจุบันอยู่ที่ **${sum.finalYield}** (พัฒนาขึ้น ${sum.yieldImprovement} จาก Baseline ${sum.baselineYield})\n2. **การเชื่อมโยงสถิติ:** ตรวจพบ Vital Few ปัจจัยในระบบ ${p.hypothesisTests.filter(t => t.status.includes('Vital')).length} รายการ แนะนำให้ติดตามผลผ่าน Control Plan และ SOP อย่างสม่ำเสมอ\n3. **การแสดงผลขั้นสูง:** คุณสามารถขอให้ผม **"พล็อตกราฟแนวโน้ม Yield"**, **"แสดงกราฟ Cpk Bell Curve"**, หรือ **"เปรียบเทียบ ANOVA Boxplot"** ได้ทันทีครับ!`
      suggestions = [
        '📈 ช่วยพล็อตกราฟวิเคราะห์แนวโน้ม Yield (Trendline & Forecast)',
        '📊 แสดงกราฟ Process Capability (Cpk Bell Curve)',
        '🧪 แสดงกราฟ ANOVA Boxplot เปรียบเทียบ 30Hz vs 40Hz vs 50Hz'
      ]
    }

    messages.value.push({
      id: `m-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaId: selectedPersonaId.value,
      model: currentActiveModel,
      sourceDataTag: `Live Sync: ${p.id}`,
      thought: thoughtText,
      showThought: false,
      isTable: isTable,
      tableData: tableData,
      chart: chart,
      suggestions: suggestions
    })

    scrollToBottom()
  }, delay)
}

// Copy Message
const copyMessage = (msg: Message) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(msg.text)
    msg.copied = true
    setTimeout(() => {
      msg.copied = false
    }, 2000)
  }
}

// New Chat Session
const createNewChat = () => {
  const newId = `session-${Date.now()}`
  chatSessions.value.unshift({
    id: newId,
    title: 'New Chat',
    date: 'Just now',
    group: 'today',
    preview: 'เริ่มต้นการวิเคราะห์ใหม่ด้วย GenieWisdom AI',
    personaId: selectedPersonaId.value,
    projectId: selectedProjectId.value,
    modelTag: selectedModel.value.tag
  })
  activeSessionId.value = newId
  messages.value = []
}

// Switch Session
const selectSession = (session: ChatSession) => {
  activeSessionId.value = session.id
  if (session.personaId) {
    selectedPersonaId.value = session.personaId
  }
  if (session.projectId && availableProjects.value.some(p => p.id === session.projectId)) {
    selectedProjectId.value = session.projectId
  }
  if (messages.value.length === 0) {
    handleSendMessage('ช่วยพล็อตกราฟวิเคราะห์แนวโน้ม Yield (Trend Analysis & Forecast) 12 เดือน พร้อมคำนวณทิศทางแนวโน้ม')
  }
}

// Quick apply hypothesis from decision tree
const applyHypoToChat = () => {
  const prompt = `ช่วยแนะนำขั้นตอนการวิเคราะห์ด้วย **${recommendedHypothesisTest.value}** สำหรับข้อมูล ${hypoDataType.value} (${hypoGroupCount.value} กลุ่ม, การแจกแจงแบบ ${hypoIsNormal.value}) ในบริบท ${currentProject.value.name}`
  handleSendMessage(prompt)
}
</script>

<template>
  <!-- Full Screen Edge-to-Edge Gemini Workspace -->
  <div class="h-full w-full flex bg-[#F8FAFD] overflow-hidden select-none">
    
    <!-- ========================================================= -->
    <!-- LEFT SIDEBAR: Gemini Collapsible Chat Drawer -->
    <!-- ========================================================= -->
    <aside
      class="bg-[#F0F4F9] border-r border-slate-200/80 transition-all duration-300 flex flex-col shrink-0"
      :class="isLeftSidebarOpen ? 'w-64 sm:w-72' : 'w-0 overflow-hidden border-r-0'"
    >
      <!-- Top Actions in Sidebar -->
      <div class="p-3.5 space-y-3">
        <!-- New Chat Button -->
        <button
          type="button"
          class="w-full bg-[#E3E8EF] hover:bg-[#D8E1EC] text-slate-800 text-sm font-medium py-2.5 px-4 rounded-full flex items-center gap-3 transition-colors shadow-2xs cursor-pointer group"
          @click="createNewChat"
        >
          <UIcon name="i-lucide-plus" class="size-4 text-slate-700 group-hover:rotate-90 transition-transform" />
          <span>New chat</span>
        </button>

        <!-- Search Chat History -->
        <div class="relative">
          <UIcon name="i-lucide-search" class="size-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            v-model="searchSessionQuery"
            type="text"
            placeholder="Search recent chats..."
            class="w-full bg-white/70 border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#008779]"
          />
        </div>
      </div>

      <!-- Recent Sessions List (Scrollable) -->
      <div class="flex-1 overflow-y-auto px-2 space-y-3 scrollbar-thin">
        <!-- Today -->
        <div v-if="sessionsToday.length > 0" class="space-y-0.5">
          <div class="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400">
            Recent
          </div>
          <button
            v-for="s in sessionsToday"
            :key="s.id"
            type="button"
            class="w-full text-left px-3 py-2 rounded-full text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 group"
            :class="activeSessionId === s.id
              ? 'bg-[#D3E3FD] text-[#041E49] font-medium'
              : 'hover:bg-[#E3E8EF] text-slate-700'"
            @click="selectSession(s)"
          >
            <div class="flex items-center gap-2 truncate">
              <UIcon name="i-lucide-message-square" class="size-3.5 shrink-0" :class="activeSessionId === s.id ? 'text-[#008779]' : 'text-slate-400'" />
              <span class="truncate">{{ s.title }}</span>
            </div>
            <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-white/60 text-slate-500 font-mono shrink-0">
              {{ s.modelTag }}
            </span>
          </button>
        </div>

        <!-- Yesterday -->
        <div v-if="sessionsYesterday.length > 0" class="space-y-0.5 pt-2">
          <div class="px-3 pb-1 text-[11px] font-semibold text-slate-400">
            Yesterday
          </div>
          <button
            v-for="s in sessionsYesterday"
            :key="s.id"
            type="button"
            class="w-full text-left px-3 py-2 rounded-full text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 group"
            :class="activeSessionId === s.id
              ? 'bg-[#D3E3FD] text-[#041E49] font-medium'
              : 'hover:bg-[#E3E8EF] text-slate-700'"
            @click="selectSession(s)"
          >
            <div class="flex items-center gap-2 truncate">
              <UIcon name="i-lucide-message-square" class="size-3.5 shrink-0 text-slate-400" />
              <span class="truncate">{{ s.title }}</span>
            </div>
            <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-white/60 text-slate-500 font-mono shrink-0">
              {{ s.modelTag }}
            </span>
          </button>
        </div>

        <!-- Older -->
        <div v-if="sessionsOlder.length > 0" class="space-y-0.5 pt-2">
          <div class="px-3 pb-1 text-[11px] font-semibold text-slate-400">
            Previous 7 Days
          </div>
          <button
            v-for="s in sessionsOlder"
            :key="s.id"
            type="button"
            class="w-full text-left px-3 py-2 rounded-full text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 group"
            :class="activeSessionId === s.id
              ? 'bg-[#D3E3FD] text-[#041E49] font-medium'
              : 'hover:bg-[#E3E8EF] text-slate-700'"
            @click="selectSession(s)"
          >
            <div class="flex items-center gap-2 truncate">
              <UIcon name="i-lucide-message-square" class="size-3.5 shrink-0 text-slate-400" />
              <span class="truncate">{{ s.title }}</span>
            </div>
            <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-white/60 text-slate-500 font-mono shrink-0">
              {{ s.modelTag }}
            </span>
          </button>
        </div>
      </div>

      <!-- Bottom User & Settings Bar in Sidebar -->
      <div class="p-3 border-t border-slate-200/80 bg-[#F0F4F9] space-y-1">
        <!-- Active Model Capsule in Sidebar -->
        <div class="px-2.5 py-1.5 bg-white/80 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 truncate">
            <UIcon :name="selectedModel.icon" class="size-3.5 text-[#008779] shrink-0" />
            <span class="font-medium text-slate-700 truncate text-[11px]">{{ selectedModel.tag }}</span>
          </div>
          <span class="text-[9px] font-mono text-slate-400">{{ selectedModel.speed.split(' ')[0] }}</span>
        </div>

        <div class="flex items-center justify-between pt-1 px-1 text-xs text-slate-600">
          <div class="flex items-center gap-2">
            <div class="size-6 rounded-full bg-[#008779] text-white font-bold text-[10px] flex items-center justify-center">
              {{ activeUser.initials }}
            </div>
            <span class="font-medium text-[11px] text-slate-800">{{ activeUser.name }}</span>
          </div>
          <NuxtLink to="/admin/master-data" class="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors" title="Settings">
            <UIcon name="i-lucide-settings" class="size-3.5" />
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- ========================================================= -->
    <!-- MAIN CANVAS: Gemini AI Conversation Stream & Input -->
    <!-- ========================================================= -->
    <main class="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      
      <!-- Top Gemini Navigation Bar with Multiple Model Selector -->
      <header class="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md shrink-0 z-20">
        <!-- Left: Toggle Sidebar & Dynamic Model Dropdown -->
        <div class="flex items-center gap-3">
          <!-- Toggle Sidebar Hamburger -->
          <button
            type="button"
            class="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer"
            @click="isLeftSidebarOpen = !isLeftSidebarOpen"
            :title="isLeftSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
          >
            <UIcon name="i-lucide-menu" class="size-5" />
          </button>

          <!-- Gemini Model Selector Dropdown -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 text-base font-semibold text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              @click="isModelDropdownOpen = !isModelDropdownOpen"
            >
              <span class="bg-gradient-to-r from-[#008779] to-indigo-600 bg-clip-text text-transparent font-bold">
                {{ selectedModel.name }}
              </span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full border shadow-2xs" :class="selectedModel.badgeColor">
                {{ selectedModel.tag }}
              </span>
              <UIcon name="i-lucide-chevron-down" class="size-4 text-slate-400" />
            </button>

            <!-- Dropdown Menu for Models -->
            <div
              v-if="isModelDropdownOpen"
              class="absolute left-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              @click="isModelDropdownOpen = false"
            >
              <div class="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Six Sigma AI Engine
              </div>
              <div class="space-y-1">
                <button
                  v-for="m in aiModels"
                  :key="m.id"
                  type="button"
                  class="w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer border"
                  :class="selectedModelId === m.id
                    ? 'bg-teal-50/80 border-teal-200 text-teal-950'
                    : 'border-transparent hover:bg-slate-50 text-slate-700'"
                  @click="selectedModelId = m.id"
                >
                  <div class="p-1.5 rounded-lg shrink-0 mt-0.5" :class="m.badgeColor">
                    <UIcon :name="m.icon" class="size-4" />
                  </div>
                  <div class="overflow-hidden">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs">{{ m.name }}</span>
                      <span class="text-[10px] text-slate-400 font-mono">{{ m.speed.split(' ')[0] }}</span>
                    </div>
                    <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{{ m.desc }}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Center / Right: Project Context Pill & Smart Toolbox Toggle -->
        <div class="flex items-center gap-2.5">
          <!-- Active Project Selector Capsule -->
          <div class="hidden md:flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 rounded-full px-3 py-1 text-xs">
            <UIcon name="i-lucide-folder-kanban" class="size-3.5 text-[#008779]" />
            <select
              v-model="selectedProjectId"
              class="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[200px] lg:max-w-xs truncate"
            >
              <option v-for="opt in availableProjects" :key="opt.id" :value="opt.id">
                {{ opt.name }} ({{ opt.plant }})
              </option>
            </select>
            <span class="text-[10px] font-bold bg-[#008779] text-white px-1.5 py-0.2 rounded-full">
              {{ currentProject.phase }}
            </span>
          </div>

          <!-- Persona Switcher -->
          <div class="hidden sm:block">
            <select
              v-model="selectedPersonaId"
              class="bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 rounded-full px-2.5 py-1 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option v-for="p in personas" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <!-- Toggle Right Smart Toolbox Button -->
          <button
            type="button"
            class="p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            :class="isRightSidebarOpen ? 'bg-[#008779] text-white' : 'hover:bg-slate-100 text-slate-600'"
            @click="isRightSidebarOpen = !isRightSidebarOpen"
            :title="isRightSidebarOpen ? 'Close Six Sigma Toolbox' : 'Open Six Sigma Toolbox'"
          >
            <UIcon name="i-lucide-wrench" class="size-4" />
            <span class="hidden lg:inline">{{ isRightSidebarOpen ? 'Toolbox Open' : 'Six Sigma Tools' }}</span>
          </button>
        </div>
      </header>

      <!-- Chat Scrollable Body -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-6 scrollbar-thin">
        
        <!-- Gemini Welcome Hero State (When Empty / New Chat) -->
        <div v-if="isNewConversation" class="max-w-4xl lg:max-w-5xl mx-auto pt-8 sm:pt-14 pb-8 space-y-8 animate-in fade-in duration-300">
          <!-- Gemini Vibrant Greeting -->
          <div class="space-y-2">
            <h1 class="text-4xl sm:text-6xl font-medium tracking-tight bg-gradient-to-r from-[#008779] via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Hello, {{ activeUser.name.split(' ')[0] }}
            </h1>
            <h2 class="text-3xl sm:text-5xl font-normal text-slate-300">
              How can I assist your Six Sigma project today?
            </h2>
          </div>

          <!-- Gemini Grid Prompt Suggestion Cards (Spacious Layout) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <button
              v-for="(card, cIdx) in geminiPromptCards"
              :key="cIdx"
              type="button"
              class="bg-[#F0F4F9] hover:bg-[#E3E8EF] p-4.5 rounded-2xl text-left flex flex-col justify-between h-44 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-300/60 shadow-2xs hover:shadow-xs"
              @click="handleSendMessage(card.prompt)"
            >
              <div>
                <span class="font-semibold text-sm text-slate-800 group-hover:text-[#008779] transition-colors block leading-snug">
                  {{ card.title }}
                </span>
                <p class="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                  {{ card.subtitle }}
                </p>
              </div>

              <div class="flex justify-end pt-2">
                <div class="size-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" :class="card.iconBg">
                  <UIcon :name="card.icon" class="size-4" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Conversation Messages Stream -->
        <div v-else class="max-w-4xl lg:max-w-5xl mx-auto space-y-6">
          
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="space-y-3 animate-in fade-in duration-200"
          >
            <!-- USER MESSAGE (Gemini Style) -->
            <div v-if="msg.sender === 'user'" class="flex justify-end items-start gap-3">
              <div class="bg-[#E3E8EF] text-slate-900 rounded-3xl rounded-tr-xs px-5 py-3 text-sm max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-2xs font-normal">
                {{ msg.text }}
              </div>
              <div class="size-7 rounded-full bg-[#008779] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-1">
                {{ activeUser.initials }}
              </div>
            </div>

            <!-- AI MESSAGE (Gemini Style with Charts & Tables) -->
            <div v-else class="flex items-start gap-3.5 group">
              <!-- Gemini Sparkle Icon -->
              <div class="size-8 rounded-full bg-gradient-to-tr from-[#008779] to-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <UIcon :name="msg.model?.icon || 'i-lucide-sparkles'" class="size-4.5 text-amber-300" />
              </div>

              <!-- Message Content Area -->
              <div class="flex-1 space-y-3 min-w-0">
                <!-- Gemini Header & Model Tag -->
                <div class="flex items-center gap-2 flex-wrap text-xs">
                  <span class="font-bold text-slate-900">GenieWisdom</span>
                  <span v-if="msg.model" class="text-[10px] font-bold px-2 py-0.5 rounded-full border" :class="msg.model.badgeColor">
                    {{ msg.model.tag }}
                  </span>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full" :class="selectedPersona.badgeColor">
                    {{ selectedPersona.name }}
                  </span>
                  
                  <!-- Thought Toggle Pill (Gemini 2.0 Feature) -->
                  <button
                    v-if="msg.thought"
                    type="button"
                    class="text-[11px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                    @click="msg.showThought = !msg.showThought"
                  >
                    <UIcon name="i-lucide-brain" class="size-3 text-[#008779]" />
                    <span>{{ msg.showThought ? 'Hide thought' : 'Thought process' }}</span>
                    <UIcon :name="msg.showThought ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-3 text-slate-400" />
                  </button>
                </div>

                <!-- Expanded Thought Process Box -->
                <div v-if="msg.showThought && msg.thought" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono space-y-1">
                  <div class="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                    <UIcon name="i-lucide-cpu" class="size-3 text-[#008779]" />
                    <span>Reasoning Chain:</span>
                  </div>
                  <p class="leading-relaxed whitespace-pre-line">{{ msg.thought }}</p>
                </div>

                <!-- Markdown Formatted Text -->
                <div class="text-sm text-slate-800 leading-relaxed space-y-2.5 whitespace-pre-line font-normal">
                  {{ msg.text }}
                </div>

                <!-- ========================================================= -->
                <!-- DYNAMIC CHART COMPONENT: 1. Trendline & Forecast Chart -->
                <!-- ========================================================= -->
                <div v-if="msg.chart && msg.chart.type === 'trend'" class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 my-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <UIcon name="i-lucide-trending-up" class="size-4 text-[#008779]" />
                        <span>{{ msg.chart.title }}</span>
                      </h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ msg.chart.subtitle }}</p>
                    </div>
                    <div class="flex items-center gap-3 text-[10px] font-medium text-slate-600">
                      <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-[#008779]"></span> Actual Yield</span>
                      <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-indigo-500"></span> Forecast Projection</span>
                      <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-rose-500 border-b border-dashed"></span> LSS Goal (87.15%)</span>
                    </div>
                  </div>

                  <!-- SVG Time Series Canvas -->
                  <div class="h-56 w-full relative">
                    <svg class="w-full h-full" viewBox="0 0 760 210">
                      <!-- Grid lines -->
                      <line x1="40" y1="20" x2="740" y2="20" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="40" y1="65" x2="740" y2="65" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="40" y1="110" x2="740" y2="110" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="40" y1="155" x2="740" y2="155" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="40" y1="180" x2="740" y2="180" stroke="#e2e8f0" stroke-width="1.5" />

                      <!-- Y-Axis labels -->
                      <text x="32" y="24" fill="#94a3b8" font-size="9" text-anchor="end" font-mono>90%</text>
                      <text x="32" y="69" fill="#94a3b8" font-size="9" text-anchor="end" font-mono>87%</text>
                      <text x="32" y="114" fill="#94a3b8" font-size="9" text-anchor="end" font-mono>84%</text>
                      <text x="32" y="159" fill="#94a3b8" font-size="9" text-anchor="end" font-mono>81%</text>

                      <!-- Goal Reference Line (87.15%) -->
                      <line x1="40" y1="67" x2="740" y2="67" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" />
                      <text x="735" y="62" fill="#f43f5e" font-size="9" font-weight="bold" text-anchor="end">Target 87.15%</text>

                      <!-- Actual Trend Area Gradient & Path (M1 to M7) -->
                      <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#008779" stop-opacity="0.3" />
                          <stop offset="100%" stop-color="#008779" stop-opacity="0.0" />
                        </linearGradient>
                      </defs>

                      <polygon
                        points="60,170 120,110 180,110 240,125 300,140 360,95 420,50 420,180 60,180"
                        fill="url(#yieldGrad)"
                      />

                      <!-- Actual Line -->
                      <polyline
                        points="60,170 120,110 180,110 240,125 300,140 360,95 420,50"
                        fill="none"
                        stroke="#008779"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />

                      <!-- Forecast Line (M7 to M12) -->
                      <polyline
                        points="420,50 480,72 540,61 600,53 660,45 720,32"
                        fill="none"
                        stroke="#6366f1"
                        stroke-width="2.5"
                        stroke-dasharray="5,4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />

                      <!-- Data Points (Actual) -->
                      <circle cx="60" cy="170" r="4.5" fill="#008779" stroke="#fff" stroke-width="2" />
                      <circle cx="120" cy="110" r="4.5" fill="#008779" stroke="#fff" stroke-width="2" />
                      <circle cx="180" cy="110" r="4.5" fill="#008779" stroke="#fff" stroke-width="2" />
                      <circle cx="240" cy="125" r="4.5" fill="#008779" stroke="#fff" stroke-width="2" />
                      <circle cx="300" cy="140" r="4.5" fill="#008779" stroke="#fff" stroke-width="2" />
                      <circle cx="360" cy="95" r="4.5" fill="#008779" stroke="#fff" stroke-width="2" />
                      <circle cx="420" cy="50" r="5" fill="#008779" stroke="#fff" stroke-width="2.5" />

                      <!-- Data Points (Forecast) -->
                      <circle cx="480" cy="72" r="4" fill="#6366f1" stroke="#fff" stroke-width="1.5" />
                      <circle cx="540" cy="61" r="4" fill="#6366f1" stroke="#fff" stroke-width="1.5" />
                      <circle cx="600" cy="53" r="4" fill="#6366f1" stroke="#fff" stroke-width="1.5" />
                      <circle cx="660" cy="45" r="4" fill="#6366f1" stroke="#fff" stroke-width="1.5" />
                      <circle cx="720" cy="32" r="5" fill="#6366f1" stroke="#fff" stroke-width="2" />

                      <!-- X-Axis Month labels -->
                      <text x="60" y="198" fill="#64748b" font-size="9" text-anchor="middle">M1</text>
                      <text x="120" y="198" fill="#64748b" font-size="9" text-anchor="middle">M2</text>
                      <text x="180" y="198" fill="#64748b" font-size="9" text-anchor="middle">M3</text>
                      <text x="240" y="198" fill="#64748b" font-size="9" text-anchor="middle">M4</text>
                      <text x="300" y="198" fill="#64748b" font-size="9" text-anchor="middle">M5</text>
                      <text x="360" y="198" fill="#64748b" font-size="9" text-anchor="middle">M6</text>
                      <text x="420" y="198" fill="#008779" font-size="9" font-weight="bold" text-anchor="middle">M7 (Now)</text>
                      <text x="480" y="198" fill="#6366f1" font-size="9" text-anchor="middle">M8*</text>
                      <text x="540" y="198" fill="#6366f1" font-size="9" text-anchor="middle">M9*</text>
                      <text x="600" y="198" fill="#6366f1" font-size="9" text-anchor="middle">M10*</text>
                      <text x="660" y="198" fill="#6366f1" font-size="9" text-anchor="middle">M11*</text>
                      <text x="720" y="198" fill="#6366f1" font-size="9" font-weight="bold" text-anchor="middle">M12*</text>
                    </svg>
                  </div>

                  <!-- KPI Quick Summary Grid -->
                  <div v-if="msg.chart.kpis" class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-center">
                    <div v-for="(kpi, kIdx) in msg.chart.kpis" :key="kIdx" class="bg-slate-50 p-2 rounded-xl">
                      <span class="text-[10px] text-slate-400 font-bold block uppercase">{{ kpi.label }}</span>
                      <span class="text-sm font-mono font-bold block mt-0.5" :class="kpi.color">{{ kpi.value }}</span>
                      <span v-if="kpi.change" class="text-[9px] text-slate-500 block">{{ kpi.change }}</span>
                    </div>
                  </div>
                </div>

                <!-- ========================================================= -->
                <!-- DYNAMIC CHART COMPONENT: 2. Process Capability Curve -->
                <!-- ========================================================= -->
                <div v-if="msg.chart && msg.chart.type === 'capability'" class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 my-3">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <UIcon name="i-lucide-activity" class="size-4 text-indigo-600" />
                        <span>{{ msg.chart.title }}</span>
                      </h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ msg.chart.subtitle }}</p>
                    </div>
                    <span class="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      Cpk = 1.12 (&lt; 1.33)
                    </span>
                  </div>

                  <!-- SVG Gaussian Bell Curve Canvas -->
                  <div class="h-48 w-full relative">
                    <svg class="w-full h-full" viewBox="0 0 700 180">
                      <!-- Base Line -->
                      <line x1="40" y1="150" x2="660" y2="150" stroke="#cbd5e1" stroke-width="1.5" />

                      <!-- Spec Limits (LSL = 85.0%, USL = 89.0%, Target = 87.15%, Mean = 83.75%) -->
                      <!-- LSL Line (Red) -->
                      <line x1="220" y1="20" x2="220" y2="150" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
                      <text x="220" y="15" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">LSL 85.0%</text>

                      <!-- Mean Line (Blue) -->
                      <line x1="160" y1="20" x2="160" y2="150" stroke="#3b82f6" stroke-width="2" />
                      <text x="160" y="15" fill="#3b82f6" font-size="9" font-weight="bold" text-anchor="middle">Mean 83.75%</text>

                      <!-- Target Line (Green) -->
                      <line x1="380" y1="20" x2="380" y2="150" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" />
                      <text x="380" y="15" fill="#10b981" font-size="9" font-weight="bold" text-anchor="middle">Target 87.15%</text>

                      <!-- USL Line (Red) -->
                      <line x1="520" y1="20" x2="520" y2="150" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />
                      <text x="520" y="15" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">USL 89.0%</text>

                      <!-- Gaussian Distribution Curve centered at x=160 (Mean) -->
                      <defs>
                        <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3" />
                          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 50 150 C 100 150, 130 35, 160 35 C 190 35, 220 150, 270 150 Z"
                        fill="url(#bellGrad)"
                        stroke="#2563eb"
                        stroke-width="2.5"
                      />

                      <!-- Ideal Target Curve (Dashed Green Bell) centered at Target=380 -->
                      <path
                        d="M 280 150 C 330 150, 360 45, 380 45 C 400 45, 430 150, 480 150"
                        fill="none"
                        stroke="#10b981"
                        stroke-width="2"
                        stroke-dasharray="4,3"
                      />
                      <text x="380" y="60" fill="#10b981" font-size="8" font-weight="bold" text-anchor="middle">Target State (Cpk &ge; 1.33)</text>
                    </svg>
                  </div>

                  <!-- KPI Summary -->
                  <div v-if="msg.chart.kpis" class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-center">
                    <div v-for="(kpi, kIdx) in msg.chart.kpis" :key="kIdx" class="bg-slate-50 p-2 rounded-xl">
                      <span class="text-[10px] text-slate-400 font-bold block uppercase">{{ kpi.label }}</span>
                      <span class="text-sm font-mono font-bold block mt-0.5" :class="kpi.color">{{ kpi.value }}</span>
                    </div>
                  </div>
                </div>

                <!-- ========================================================= -->
                <!-- DYNAMIC CHART COMPONENT: 3. ANOVA Boxplot Chart -->
                <!-- ========================================================= -->
                <div v-if="msg.chart && msg.chart.type === 'boxplot'" class="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 my-3">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 class="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <UIcon name="i-lucide-bar-chart-3" class="size-4 text-purple-600" />
                        <span>{{ msg.chart.title }}</span>
                      </h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ msg.chart.subtitle }}</p>
                    </div>
                    <span class="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      P = 0.012 (Significant)
                    </span>
                  </div>

                  <!-- SVG Boxplot Graphic -->
                  <div class="h-48 w-full relative">
                    <svg class="w-full h-full" viewBox="0 0 600 170">
                      <!-- Grid lines -->
                      <line x1="50" y1="20" x2="550" y2="20" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="50" y1="70" x2="550" y2="70" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="50" y1="120" x2="550" y2="120" stroke="#f1f5f9" stroke-width="1" />
                      <line x1="50" y1="140" x2="550" y2="140" stroke="#cbd5e1" stroke-width="1.5" />

                      <!-- Y Labels -->
                      <text x="40" y="24" fill="#94a3b8" font-size="9" text-anchor="end">26%</text>
                      <text x="40" y="74" fill="#94a3b8" font-size="9" text-anchor="end">20%</text>
                      <text x="40" y="124" fill="#94a3b8" font-size="9" text-anchor="end">14%</text>

                      <!-- Box 1: 30 Hz (x=130) -->
                      <line x1="130" y1="120" x2="130" y2="40" stroke="#64748b" stroke-width="1.5" />
                      <rect x="100" y="70" width="60" height="40" rx="4" fill="#e2e8f0" stroke="#64748b" stroke-width="2" />
                      <line x1="100" y1="90" x2="160" y2="90" stroke="#0f172a" stroke-width="2.5" />
                      <text x="130" y="158" fill="#475569" font-size="10" font-weight="bold" text-anchor="middle">30 Hz</text>

                      <!-- Box 2: 40 Hz Optimal (x=300) -->
                      <line x1="300" y1="95" x2="300" y2="35" stroke="#008779" stroke-width="1.5" />
                      <rect x="270" y="55" width="60" height="30" rx="4" fill="#ccfbf1" stroke="#008779" stroke-width="2.5" />
                      <line x1="270" y1="70" x2="330" y2="70" stroke="#0f766e" stroke-width="3" />
                      <text x="300" y="158" fill="#008779" font-size="10" font-weight="bold" text-anchor="middle">40 Hz (Best)</text>

                      <!-- Box 3: 50 Hz (x=470) -->
                      <line x1="470" y1="80" x2="470" y2="20" stroke="#9333ea" stroke-width="1.5" />
                      <rect x="440" y="35" width="60" height="35" rx="4" fill="#f3e8ff" stroke="#9333ea" stroke-width="2" />
                      <line x1="440" y1="52" x2="500" y2="52" stroke="#6b21a8" stroke-width="2.5" />
                      <text x="470" y="158" fill="#9333ea" font-size="10" font-weight="bold" text-anchor="middle">50 Hz</text>
                    </svg>
                  </div>

                  <!-- KPI Boxplot Summary -->
                  <div v-if="msg.chart.kpis" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center">
                    <div v-for="(kpi, kIdx) in msg.chart.kpis" :key="kIdx" class="bg-slate-50 p-2 rounded-xl">
                      <span class="text-[10px] text-slate-400 font-bold block uppercase">{{ kpi.label }}</span>
                      <span class="text-sm font-mono font-bold block mt-0.5" :class="kpi.color">{{ kpi.value }}</span>
                    </div>
                  </div>
                </div>

                <!-- Structured Table (if applicable) -->
                <div v-if="msg.isTable && msg.tableData" class="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-2xs">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th v-for="(h, idx) in msg.tableData.headers" :key="idx" class="p-2.5 border-r border-slate-200 last:border-r-0">
                          {{ h }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      <tr v-for="(row, rIdx) in msg.tableData.rows" :key="rIdx" class="hover:bg-slate-50/70">
                        <td v-for="(cell, cIdx) in row" :key="cIdx" class="p-2.5 border-r border-slate-100 last:border-r-0 font-mono text-[11px] text-slate-700">
                          {{ cell }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Gemini Action Toolbar (Bottom of AI Message) -->
                <div class="flex items-center gap-3 pt-1 text-slate-400 text-xs">
                  <button
                    type="button"
                    class="hover:text-slate-700 flex items-center gap-1 p-1 rounded-md transition-colors cursor-pointer"
                    @click="copyMessage(msg)"
                    title="Copy text"
                  >
                    <UIcon :name="msg.copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" :class="msg.copied ? 'text-emerald-600' : ''" />
                  </button>

                  <button
                    type="button"
                    class="hover:text-emerald-600 p-1 rounded-md transition-colors cursor-pointer"
                    :class="msg.feedback === 'like' ? 'text-emerald-600 font-bold' : ''"
                    @click="msg.feedback = msg.feedback === 'like' ? undefined : 'like'"
                    title="Good response"
                  >
                    <UIcon name="i-lucide-thumbs-up" class="size-3.5" />
                  </button>

                  <button
                    type="button"
                    class="hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                    :class="msg.feedback === 'dislike' ? 'text-rose-600 font-bold' : ''"
                    @click="msg.feedback = msg.feedback === 'dislike' ? undefined : 'dislike'"
                    title="Bad response"
                  >
                    <UIcon name="i-lucide-thumbs-down" class="size-3.5" />
                  </button>

                  <button
                    type="button"
                    class="hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                    @click="handleSendMessage('ช่วยอธิบายเพิ่มเติมในรายละเอียดพร้อมพล็อตกราฟประกอบ')"
                    title="Regenerate / Elaborate"
                  >
                    <UIcon name="i-lucide-rotate-cw" class="size-3.5" />
                  </button>

                  <div class="ml-auto flex items-center gap-1 text-[11px] text-teal-700 font-medium">
                    <UIcon name="i-lucide-database" class="size-3 text-[#008779]" />
                    <span>CPF Grounding Synced</span>
                  </div>
                </div>

                <!-- Suggested Follow-up Chips -->
                <div v-if="msg.suggestions && msg.suggestions.length > 0" class="pt-2 flex flex-wrap gap-1.5">
                  <button
                    v-for="(sug, sIdx) in msg.suggestions"
                    :key="sIdx"
                    type="button"
                    class="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full px-3 py-1 text-xs font-normal transition-colors cursor-pointer border border-slate-200/60 text-left"
                    @click="handleSendMessage(sug)"
                  >
                    {{ sug }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isGenerating" class="flex items-center gap-3 pt-2">
            <div class="size-8 rounded-full bg-gradient-to-tr from-[#008779] to-indigo-600 text-white flex items-center justify-center shrink-0">
              <UIcon :name="selectedModel.icon" class="size-4.5 text-amber-300 animate-spin" />
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <UIcon name="i-lucide-loader-2" class="size-3.5 animate-spin text-[#008779]" />
              <span>{{ selectedModel.name }} is analyzing data & computing statistical models...</span>
            </div>
          </div>

        </div>

      </div>

      <!-- ========================================================= -->
      <!-- GEMINI FLOATING BOTTOM CAPSULE INPUT -->
      <!-- ========================================================= -->
      <div class="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent shrink-0">
        <div class="max-w-4xl lg:max-w-5xl mx-auto space-y-2">
          <!-- Floating Pill Container -->
          <div class="bg-[#F0F4F9] focus-within:bg-white border border-transparent focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-[#008779]/10 rounded-3xl p-3 transition-all shadow-xs flex flex-col gap-2">
            <!-- Textarea -->
            <textarea
              v-model="userInput"
              rows="2"
              placeholder="ถาม GenieWisdom เกี่ยวกับสถิติ, ขอดูกราฟแนวโน้ม Yield, Cpk, หรือพิมพ์ @..."
              class="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none outline-none leading-relaxed px-2"
              @keydown.enter.prevent="!$event.shiftKey && handleSendMessage()"
            />

            <!-- Bottom Toolbar inside Pill -->
            <div class="flex items-center justify-between px-1">
              <!-- Left Utilities inside Input -->
              <div class="flex items-center gap-1.5">
                <!-- Attach Data Button -->
                <button
                  type="button"
                  class="size-8 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Upload dataset / excel"
                  @click="handleSendMessage('ช่วยตรวจสอบชุดข้อมูลสถิติของโครงการนี้และพล็อตกราฟแนวโน้ม')"
                >
                  <UIcon name="i-lucide-plus" class="size-4" />
                </button>

                <!-- Model Badge Switcher Quick Pill -->
                <button
                  type="button"
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  :class="selectedModel.badgeColor"
                  @click="isModelDropdownOpen = !isModelDropdownOpen"
                >
                  <UIcon :name="selectedModel.icon" class="size-3" />
                  <span>{{ selectedModel.tag }}</span>
                </button>

                <!-- Active Persona Indicator -->
                <span class="text-[10px] font-medium text-slate-500 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  {{ selectedPersona.name }}
                </span>
              </div>

              <!-- Right: Mic & Submit Button -->
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="size-8 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Use microphone"
                >
                  <UIcon name="i-lucide-mic" class="size-4" />
                </button>

                <!-- Send Button (Circle with Arrow) -->
                <button
                  type="button"
                  class="size-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  :class="userInput.trim() && !isGenerating
                    ? 'bg-[#008779] text-white hover:bg-[#007366]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
                  :disabled="!userInput.trim() || isGenerating"
                  @click="handleSendMessage()"
                >
                  <UIcon name="i-lucide-arrow-up" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Micro Disclaimer -->
          <p class="text-center text-[11px] text-slate-400">
            GenieWisdom can make mistakes. Verify critical Six Sigma statistical decisions with Master Black Belt.
          </p>
        </div>
      </div>

    </main>

    <!-- ========================================================= -->
    <!-- RIGHT DRAWER: Six Sigma Smart Toolbox & Telemetry -->
    <!-- ========================================================= -->
    <aside
      v-if="isRightSidebarOpen"
      class="w-80 xl:w-96 shrink-0 border-l border-slate-200 bg-[#F0F4F9] flex flex-col h-full overflow-hidden transition-all duration-300"
    >
      <!-- Header -->
      <div class="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-wrench" class="size-4 text-[#008779]" />
          <h3 class="text-xs font-bold text-slate-900">Six Sigma Smart Toolbox</h3>
        </div>
        <button
          type="button"
          class="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
          @click="isRightSidebarOpen = false"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
        
        <!-- 1. Active Project Telemetry Card -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-slate-800 truncate" :title="currentProject.name">
              {{ currentProject.name }}
            </span>
            <span class="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              {{ currentProject.phase }} Phase
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-2.5 text-center">
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Current Yield</span>
              <span class="text-base font-mono font-bold text-teal-800 block mt-0.5">{{ currentSummary.finalYield }}</span>
              <span class="text-[10px] text-emerald-600 font-semibold block">{{ currentSummary.yieldImprovement }}</span>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Process Cpk</span>
              <span class="text-base font-mono font-bold block mt-0.5" :class="currentCapability.isCapable ? 'text-emerald-700' : 'text-amber-700'">
                {{ currentCapability.cpk }}
              </span>
              <span class="text-[10px] font-semibold block" :class="currentCapability.isCapable ? 'text-emerald-600' : 'text-amber-600'">
                {{ currentCapability.isCapable ? 'Capable (≥1.33)' : 'Target: 1.33' }}
              </span>
            </div>
          </div>

          <!-- Key Figures from Store -->
          <div class="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span>Baseline ➜ LSS Goal:</span>
              <span class="font-mono font-bold text-slate-800">{{ currentSummary.baselineYield }} ➜ {{ currentSummary.goalLssYield }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Verified Savings:</span>
              <span class="font-mono font-bold text-emerald-700">{{ currentSummary.verifiedAnnualSavings }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Project Leader:</span>
              <span class="font-bold text-slate-800">{{ currentProject.leader }}</span>
            </div>
          </div>
        </div>

        <!-- 2. Interactive Hypothesis Test Decision Helper -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <UIcon name="i-lucide-git-commit" class="size-4 text-[#008779]" />
            <span>Hypothesis Test Selector</span>
          </div>

          <!-- Step 1: Data Type -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-500 block">1. ชนิดของตัวแปร Y (Data Type)</label>
            <div class="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                class="py-1.5 px-2 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoDataType === 'continuous' ? 'bg-[#008779] text-white border-[#008779]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoDataType = 'continuous'"
              >
                Continuous (ตัวเลข)
              </button>
              <button
                type="button"
                class="py-1.5 px-2 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoDataType === 'attribute' ? 'bg-[#008779] text-white border-[#008779]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoDataType = 'attribute'"
              >
                Attribute (ของเสีย)
              </button>
            </div>
          </div>

          <!-- Step 2: Groups -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-500 block">2. จำนวนกลุ่มที่ต้องการเปรียบเทียบ (X)</label>
            <div class="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                class="py-1.5 px-1.5 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoGroupCount === '1' ? 'bg-[#008779] text-white border-[#008779]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoGroupCount = '1'"
              >
                1 กลุ่ม
              </button>
              <button
                type="button"
                class="py-1.5 px-1.5 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoGroupCount === '2' ? 'bg-[#008779] text-white border-[#008779]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoGroupCount = '2'"
              >
                2 กลุ่ม
              </button>
              <button
                type="button"
                class="py-1.5 px-1.5 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoGroupCount === '3+' ? 'bg-[#008779] text-white border-[#008779]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoGroupCount = '3+'"
              >
                3+ กลุ่ม
              </button>
            </div>
          </div>

          <!-- Step 3: Normality (If continuous) -->
          <div v-if="hypoDataType === 'continuous'" class="space-y-1">
            <label class="text-[10px] font-bold text-slate-500 block">3. การแจกแจงข้อมูล (Normality)</label>
            <div class="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                class="py-1.5 px-2 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoIsNormal === 'normal' ? 'bg-teal-800 text-white border-teal-800' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoIsNormal = 'normal'"
              >
                Normal (P > 0.05)
              </button>
              <button
                type="button"
                class="py-1.5 px-2 rounded-lg border font-medium text-center cursor-pointer transition-colors"
                :class="hypoIsNormal === 'non-normal' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                @click="hypoIsNormal = 'non-normal'"
              >
                Non-Normal (P ≤ 0.05)
              </button>
            </div>
          </div>

          <!-- Recommendation Box -->
          <div class="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1.5">
            <div class="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
              Recommended Tool:
            </div>
            <div class="font-bold text-[#008779] text-xs">
              {{ recommendedHypothesisTest }}
            </div>
            <button
              type="button"
              class="w-full mt-1 bg-white hover:bg-teal-100/60 text-[#008779] border border-teal-300 font-medium text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              @click="applyHypoToChat"
            >
              <UIcon name="i-lucide-message-square-plus" class="size-3.5" />
              <span>Ask AI to explain this test</span>
            </button>
          </div>
        </div>

        <!-- 3. Related Knowledge Base Best Practices -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1">
              <UIcon name="i-lucide-book-open" class="size-3.5 text-amber-500" />
              <span>Related KM Case Studies</span>
            </span>
            <NuxtLink to="/admin/km-repository" class="text-[10px] text-[#008779] hover:underline">
              View all
            </NuxtLink>
          </div>

          <div class="space-y-2 text-xs">
            <NuxtLink
              v-for="km in kmRepositoryRecords.slice(0, 2)"
              :key="km.id"
              to="/admin/km-repository"
              class="block p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200 transition-colors"
            >
              <span class="font-bold text-xs text-slate-800 line-clamp-1">{{ km.id }}: {{ km.title }}</span>
              <p class="text-[10px] text-slate-500 mt-0.5">{{ km.businessUnit }} • {{ km.verifiedSavings }}</p>
            </NuxtLink>
          </div>
        </div>

      </div>

    </aside>

  </div>
</template>
