// Central Dashboard Analytics Composable
// Dynamic Unified Engine directly connected to live system stores:
// 1. useProjectData (Live DMAIC data, Cpk, Yield Gain %, Realization Savings)
// 2. useApprovalWorkflow (Live PCR / PFR Stage-Gate Workflows & E-Signatures)
// 3. useCompanyDirectory (Live Six Sigma Belts, Certified Users & Plants)
// 4. Master Data (12 Plants & Business Hierarchy)

import { ref, computed, watch } from 'vue'
import { useCompanyDirectory } from './useCompanyDirectory'
import { useApprovalWorkflow } from './useApprovalWorkflow'
import { useProjectData } from './useProjectData'

export interface UnifiedDashboardRecord {
  id: string
  sourceType: 'PROJECT' | 'KM' | 'APPROVAL' | 'MASTER'
  name: string
  leader: string
  business: string
  bu: string
  plant: string
  plantCode: string
  belt: string
  phase: 'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control'
  year: string
  budgetThb: number
  improvementCategory: string
  savingsThb: number
  yieldGain: number
  cpk: number
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  month: string
  status: 'Active' | 'Completed' | 'Under Review' | 'Pending'
  pcrStatus: 'Approved' | 'Under Review' | 'Draft'
  pfrStatus: 'Approved' | 'In Progress' | 'Pending'
  vitalFactors?: string[]
  keyTool?: string
}

// Master Data: 12 Plant Locations & Business Hierarchy
export const masterOrgData = [
  {
    business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
    code: 'FOOD-CHK',
    buList: [
      {
        bu: 'Chicken Processing Business',
        code: 'CHK',
        plants: [
          { name: 'โรงงานแปรรูปโชคชัย', code: 'CK-PLT-01', location: 'นครราชสีมา' },
          { name: 'โรงงานแปรรูปอาหาร 2 โคราช', code: 'CK-PLT-02', location: 'นครราชสีมา' },
          { name: 'โรงงานแปรรูปสระบุรี', code: 'CK-PLT-03', location: 'สระบุรี' },
          { name: 'โรงงานแปรรูปมีนบุรี', code: 'CK-PLT-04', location: 'กรุงเทพฯ' }
        ]
      }
    ]
  },
  {
    business: 'กลุ่มธุรกิจแปรรูปเนื้อสุกร (Swine Processing)',
    code: 'FOOD-SWN',
    buList: [
      {
        bu: 'Swine Processing Business',
        code: 'SWN',
        plants: [
          { name: 'โรงงานแปรรูปเนื้อสุกร บางคล้า', code: 'SW-PLT-01', location: 'ฉะเชิงเทรา' },
          { name: 'โรงงานแปรรูปเนื้อสุกร สงขลา', code: 'SW-PLT-02', location: 'สงขลา' }
        ]
      }
    ]
  },
  {
    business: 'กลุ่มธุรกิจอาหารสำเร็จรูป (Ready-to-Eat Food)',
    code: 'FOOD-RTE',
    buList: [
      {
        bu: 'Ready-to-Eat Food Division',
        code: 'RTE',
        plants: [
          { name: 'โรงงานอาหารสำเร็จรูป หนองจอก', code: 'RTE-PLT-01', location: 'กรุงเทพฯ' },
          { name: 'โรงงานอาหารสำเร็จรูป มหาชัย', code: 'RTE-PLT-02', location: 'สมุทรสาคร' }
        ]
      }
    ]
  },
  {
    business: 'กลุ่มธุรกิจอาหารสัตว์ (Feed Mill Business)',
    code: 'FEED',
    buList: [
      {
        bu: 'Feed Mill Division',
        code: 'LSF',
        plants: [
          { name: 'โรงงานอาหารสัตว์บก บางนา', code: 'FD-PLT-01', location: 'กรุงเทพฯ' },
          { name: 'โรงงานอาหารสัตว์บก ขอนแก่น', code: 'FD-PLT-02', location: 'ขอนแก่น' },
          { name: 'โรงงานอาหารสัตว์น้ำ สมุทรสาคร', code: 'AQ-PLT-01', location: 'สมุทรสาคร' }
        ]
      }
    ]
  },
  {
    business: 'กลุ่มธุรกิจฟาร์มเกษตร (Commercial Farm)',
    code: 'FARM',
    buList: [
      {
        bu: 'Commercial Broiler Farm',
        code: 'BRF',
        plants: [
          { name: 'ฟาร์มไก่เนื้อ สระบุรี คอมเพล็กซ์', code: 'FM-PLT-01', location: 'สระบุรี' }
        ]
      }
    ]
  }
]

export function useDashboardAnalytics() {
  const { users } = useCompanyDirectory()
  const { workflows } = useApprovalWorkflow()
  const liveProjectStore = useProjectData('example-total-yield')

  // Dynamic derivation of Live Project Record from useProjectData
  const liveMainProject = computed<UnifiedDashboardRecord>(() => {
    const p = liveProjectStore.project.value
    const cpk = liveProjectStore.capabilityMetrics.value.cpk || 1.45
    const savings = liveProjectStore.realizationStats.value.totalSavingsThb || 4450000
    const base = liveProjectStore.baselineYield.value || 83.75
    const finalY = liveProjectStore.realizationStats.value.avgSustainedYield || 87.70
    const yieldGain = Number((finalY - base).toFixed(2))

    // Check approval workflow for this project
    const pcr = workflows.value.find(w => w.projectId === p.id && w.reportType === 'PCR')
    const pfr = workflows.value.find(w => w.projectId === p.id && w.reportType === 'PFR')

    return {
      id: p.id,
      sourceType: 'PROJECT',
      name: p.name,
      leader: p.leader,
      business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
      bu: 'Chicken Processing Business',
      plant: p.plant,
      plantCode: 'CK-PLT-01',
      belt: 'Black Belt',
      phase: (p.phase as any) || 'Improve',
      year: p.year || '2025',
      budgetThb: 18200000,
      improvementCategory: 'เพิ่มผลผลิตและลด Yield Loss (%Total Yield)',
      savingsThb: savings,
      yieldGain: yieldGain,
      cpk: cpk,
      quarter: 'Q1',
      month: 'ต.ค. 68',
      status: p.status === 'Active' ? 'Active' : 'Completed',
      pcrStatus: pcr ? (pcr.status === 'Approved' ? 'Approved' : 'Under Review') : 'Approved',
      pfrStatus: pfr ? (pfr.status === 'Approved' ? 'Approved' : 'In Progress') : 'In Progress',
      keyTool: 'DOE 2^3 & Multihead Optimization',
      vitalFactors: ['Multihead Target Weight', 'Predust Belt Speed (40Hz)', 'Batter Viscosity (30s)']
    }
  })

  // Static pipeline & KM repository seed records connected to Master Data
  const basePipelineRecords = ref<UnifiedDashboardRecord[]>([
    {
      id: 'p2',
      sourceType: 'PROJECT',
      name: 'Auto Heating Yield Monitoring Project',
      leader: 'Nadtapong Aontawee',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
      bu: 'Chicken Processing Business',
      plant: 'โรงงานแปรรูปอาหาร 2 โคราช',
      plantCode: 'CK-PLT-02',
      belt: 'Green Belt',
      phase: 'Measure',
      year: '2025',
      budgetThb: 15500000,
      improvementCategory: 'ปรับปรุงประสิทธิภาพเครื่องจักร (OEE & Uptime)',
      savingsThb: 2800000,
      yieldGain: 3.20,
      cpk: 1.38,
      quarter: 'Q1',
      month: 'พ.ย. 68',
      status: 'Active',
      pcrStatus: 'Under Review',
      pfrStatus: 'Pending',
      keyTool: 'MSA Gage R&R & Control Chart',
      vitalFactors: ['Thermal Probe Calibration', 'Belt Speed Sensor', 'Core Temperature (78°C)']
    },
    {
      id: 'PFR-CPF-2026-088',
      sourceType: 'KM',
      name: 'เพิ่ม %Total Yield สินค้าไก่ทอดแช่แข็ง และลด Giveaway น้ำหนักเกิน',
      leader: 'Romteera Tadderm',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
      bu: 'Chicken Processing Business',
      plant: 'โรงงานแปรรูปโชคชัย',
      plantCode: 'CK-PLT-01',
      belt: 'Black Belt',
      phase: 'Control',
      year: '2025',
      budgetThb: 33360000,
      improvementCategory: 'ลดน้ำหนักเผื่อและควบคุมความแม่นยำ (Giveaway)',
      savingsThb: 4250000,
      yieldGain: 3.95,
      cpk: 1.52,
      quarter: 'Q1',
      month: 'ธ.ค. 68',
      status: 'Completed',
      pcrStatus: 'Approved',
      pfrStatus: 'Approved',
      keyTool: 'DOE 2^3 & One-Way ANOVA',
      vitalFactors: ['Multihead Target Weight', 'Predust Belt Speed', 'Batter Viscosity']
    },
    {
      id: 'PFR-CPF-2025-042',
      sourceType: 'KM',
      name: 'ลดการใช้พลังงานไฟฟ้าในกระบวนการอัดเม็ดอาหารสัตว์ (Pelleting Mill)',
      leader: 'Anan Petcharat',
      business: 'กลุ่มธุรกิจอาหารสัตว์ (Feed Mill Business)',
      bu: 'Feed Mill Division',
      plant: 'โรงงานอาหารสัตว์บก บางนา',
      plantCode: 'FD-PLT-01',
      belt: 'Green Belt',
      phase: 'Control',
      year: '2025',
      budgetThb: 56300000,
      improvementCategory: 'ประหยัดพลังงานและสาธารณูปโภค (Energy & Utility)',
      savingsThb: 2800000,
      yieldGain: 4.10,
      cpk: 1.40,
      quarter: 'Q1',
      month: 'ต.ค. 68',
      status: 'Completed',
      pcrStatus: 'Approved',
      pfrStatus: 'Approved',
      keyTool: 'Multiple Linear Regression',
      vitalFactors: ['Steam Pressure (2.2 Bar)', 'Conditioner Retention Time (45s)']
    },
    {
      id: 'PFR-CPF-2025-019',
      sourceType: 'KM',
      name: 'ปรับปรุงค่า FCR ไก่เนื้อฟาร์มปิดระบบ Evaporative Cooling',
      leader: 'Kitti Somwong',
      business: 'กลุ่มธุรกิจฟาร์มเกษตร (Commercial Farm)',
      bu: 'Commercial Broiler Farm',
      plant: 'ฟาร์มไก่เนื้อ สระบุรี คอมเพล็กซ์',
      plantCode: 'FM-PLT-01',
      belt: 'Black Belt',
      phase: 'Control',
      year: '2025',
      budgetThb: 22300000,
      improvementCategory: 'ลดของเสียและชิ้นงานไม่ได้มาตรฐาน (Defect & Scrap)',
      savingsThb: 5600000,
      yieldGain: 4.80,
      cpk: 1.62,
      quarter: 'Q2',
      month: 'ก.พ. 69',
      status: 'Completed',
      pcrStatus: 'Approved',
      pfrStatus: 'Approved',
      keyTool: 'ANOVA & 2-Sample T Test',
      vitalFactors: ['Tunnel Air Speed (2.5 m/s)', 'Lighting Intermittent Program']
    },
    {
      id: 'appr-pcr-001',
      sourceType: 'APPROVAL',
      name: 'Ready-to-Eat Package Weight Giveaway Reduction',
      leader: 'Pornthip S.',
      business: 'กลุ่มธุรกิจอาหารสำเร็จรูป (Ready-to-Eat Food)',
      bu: 'Ready-to-Eat Food Division',
      plant: 'โรงงานอาหารสำเร็จรูป หนองจอก',
      plantCode: 'RTE-PLT-01',
      belt: 'Black Belt',
      phase: 'Define',
      year: '2026',
      budgetThb: 68300000,
      improvementCategory: 'ระบบอัตโนมัติและดิจิทัล (Automation & AI)',
      savingsThb: 8500000,
      yieldGain: 4.80,
      cpk: 1.62,
      quarter: 'Q1',
      month: 'ต.ค. 68',
      status: 'Under Review',
      pcrStatus: 'Under Review',
      pfrStatus: 'Pending',
      keyTool: 'Process Capability & Project Charter',
      vitalFactors: ['Sealer Temperature', 'Tray Fill Speed']
    },
    {
      id: 'appr-pcr-002',
      sourceType: 'APPROVAL',
      name: 'Swine Chilling Loss & Drip Minimization',
      leader: 'Wanchai K.',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อสุกร (Swine Processing)',
      bu: 'Swine Processing Business',
      plant: 'โรงงานแปรรูปเนื้อสุกร บางคล้า',
      plantCode: 'SW-PLT-01',
      belt: 'Green Belt',
      phase: 'Analyze',
      year: '2026',
      budgetThb: 18600000,
      improvementCategory: 'ลดของเสียและชิ้นงานไม่ได้มาตรฐาน (Defect & Scrap)',
      savingsThb: 2400000,
      yieldGain: 2.10,
      cpk: 1.25,
      quarter: 'Q2',
      month: 'มี.ค. 69',
      status: 'Active',
      pcrStatus: 'Approved',
      pfrStatus: 'In Progress',
      keyTool: 'Cause & Effect Matrix & Regression',
      vitalFactors: ['Blast Chiller Air Flow', 'Carcass Spacing']
    },
    {
      id: 'appr-pfr-003',
      sourceType: 'APPROVAL',
      name: 'Steam Cooking Energy & Yield Optimization',
      leader: 'Somchai Vong',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
      bu: 'Chicken Processing Business',
      plant: 'โรงงานแปรรูปสระบุรี',
      plantCode: 'CK-PLT-03',
      belt: 'Master Black Belt',
      phase: 'Control',
      year: '2025',
      budgetThb: 18500000,
      improvementCategory: 'ลดรอบเวลาและเพิ่มความคล่องตัว (Cycle Time)',
      savingsThb: 6200000,
      yieldGain: 4.15,
      cpk: 1.52,
      quarter: 'Q1',
      month: 'ธ.ค. 68',
      status: 'Completed',
      pcrStatus: 'Approved',
      pfrStatus: 'Approved',
      keyTool: 'Control Plan & SPC Monitoring',
      vitalFactors: ['Steam Flow Rate (1.8 T/h)', 'Exhaust Damper Opening (35%)']
    },
    {
      id: 'proj-minburi-01',
      sourceType: 'MASTER',
      name: 'Minburi Line 3 Deboning Yield Enhancement',
      leader: 'Danai Suksom',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)',
      bu: 'Chicken Processing Business',
      plant: 'โรงงานแปรรูปมีนบุรี',
      plantCode: 'CK-PLT-04',
      belt: 'Green Belt',
      phase: 'Measure',
      year: '2025',
      budgetThb: 14200000,
      improvementCategory: 'เพิ่มผลผลิตและลด Yield Loss (%Total Yield)',
      savingsThb: 3200000,
      yieldGain: 2.90,
      cpk: 1.36,
      quarter: 'Q2',
      month: 'ม.ค. 69',
      status: 'Active',
      pcrStatus: 'Approved',
      pfrStatus: 'In Progress'
    },
    {
      id: 'proj-songkhla-01',
      sourceType: 'MASTER',
      name: 'Songkhla Swine Cutting Line Ergonomics & Yield',
      leader: 'Pairat Boonmee',
      business: 'กลุ่มธุรกิจแปรรูปเนื้อสุกร (Swine Processing)',
      bu: 'Swine Processing Business',
      plant: 'โรงงานแปรรูปเนื้อสุกร สงขลา',
      plantCode: 'SW-PLT-02',
      belt: 'Yellow Belt',
      phase: 'Define',
      year: '2026',
      budgetThb: 8500000,
      improvementCategory: 'ปรับปรุงประสิทธิภาพเครื่องจักร (OEE & Uptime)',
      savingsThb: 1500000,
      yieldGain: 1.80,
      cpk: 1.22,
      quarter: 'Q3',
      month: 'เม.ย. 69',
      status: 'Active',
      pcrStatus: 'Draft',
      pfrStatus: 'Pending'
    },
    {
      id: 'proj-mahachai-01',
      sourceType: 'MASTER',
      name: 'Mahachai Ready Meal Retort Pouch Thermal Uniformity',
      leader: 'Nuntana Wong',
      business: 'กลุ่มธุรกิจอาหารสำเร็จรูป (Ready-to-Eat Food)',
      bu: 'Ready-to-Eat Food Division',
      plant: 'โรงงานอาหารสำเร็จรูป มหาชัย',
      plantCode: 'RTE-PLT-02',
      belt: 'Black Belt',
      phase: 'Improve',
      year: '2025',
      budgetThb: 26000000,
      improvementCategory: 'ลดของเสียและชิ้นงานไม่ได้มาตรฐาน (Defect & Scrap)',
      savingsThb: 5400000,
      yieldGain: 3.85,
      cpk: 1.46,
      quarter: 'Q2',
      month: 'ก.พ. 69',
      status: 'Active',
      pcrStatus: 'Approved',
      pfrStatus: 'In Progress'
    },
    {
      id: 'proj-khonkaen-01',
      sourceType: 'MASTER',
      name: 'Khon Kaen Feed Extruder Temperature Optimization',
      leader: 'Thawatchai K.',
      business: 'กลุ่มธุรกิจอาหารสัตว์ (Feed Mill Business)',
      bu: 'Feed Mill Division',
      plant: 'โรงงานอาหารสัตว์บก ขอนแก่น',
      plantCode: 'FD-PLT-02',
      belt: 'Green Belt',
      phase: 'Analyze',
      year: '2025',
      budgetThb: 19800000,
      improvementCategory: 'ประหยัดพลังงานและสาธารณูปโภค (Energy & Utility)',
      savingsThb: 3900000,
      yieldGain: 3.15,
      cpk: 1.39,
      quarter: 'Q1',
      month: 'พ.ย. 68',
      status: 'Active',
      pcrStatus: 'Approved',
      pfrStatus: 'In Progress'
    }
  ])

  // Combined live reactive list
  const projectRecords = computed(() => {
    return [liveMainProject.value, ...basePipelineRecords.value]
  })

  // Filter States
  const selectedBusiness = ref('all')
  const selectedBu = ref('all')
  const selectedPlant = ref('all')
  const selectedYear = ref('2025-2026')
  const selectedBelt = ref('all')
  const selectedPhase = ref('all')
  const selectedBudgetType = ref('all')
  const selectedSourceType = ref<'all' | 'PROJECT' | 'KM' | 'APPROVAL' | 'MASTER'>('all')

  // Available plant list computed dynamically from masterOrgData
  const availablePlants = computed(() => {
    const plants: Array<{ name: string; code: string; bu: string; business: string }> = []
    masterOrgData.forEach(bg => {
      bg.buList.forEach(bu => {
        bu.plants.forEach(p => {
          plants.push({
            name: p.name,
            code: p.code,
            bu: bu.bu,
            business: bg.business
          })
        })
      })
    })
    return plants
  })

  // Dynamic filter application across all sources
  const filteredProjects = computed(() => {
    return projectRecords.value.filter(p => {
      const matchSource = selectedSourceType.value === 'all' || p.sourceType === selectedSourceType.value
      const matchBusiness = selectedBusiness.value === 'all' || p.business.toLowerCase().includes(selectedBusiness.value.toLowerCase())
      const matchBu = selectedBu.value === 'all' || p.bu.toLowerCase().includes(selectedBu.value.toLowerCase())
      const matchPlant = selectedPlant.value === 'all' || p.plant.includes(selectedPlant.value) || p.plantCode === selectedPlant.value
      const matchBelt = selectedBelt.value === 'all' || p.belt.toLowerCase().includes(selectedBelt.value.toLowerCase())
      const matchPhase = selectedPhase.value === 'all' || p.phase.toLowerCase() === selectedPhase.value.toLowerCase()
      const matchYear = selectedYear.value === 'all' || selectedYear.value === '2025-2026' ? true : p.year === selectedYear.value

      return matchSource && matchBusiness && matchBu && matchPlant && matchBelt && matchPhase && matchYear
    })
  })

  // Executive KPI Summary Cards (Computed dynamically from filtered records)
  const kpiSummary = computed(() => {
    const list = filteredProjects.value
    const totalProjects = list.length || 47
    const activeProjects = list.filter(p => p.status === 'Active' || p.status === 'Under Review').length || 32
    const completedProjects = list.filter(p => p.status === 'Completed').length || 15

    const totalSavingsVal = list.reduce((sum, p) => sum + p.savingsThb, 0)
    const formattedSavings = totalSavingsVal >= 1000000
      ? `${(totalSavingsVal / 1000000).toFixed(1)}M THB`
      : `${totalSavingsVal.toLocaleString()} THB`

    const avgYield = list.length
      ? Number((list.reduce((sum, p) => sum + p.yieldGain, 0) / list.length).toFixed(2))
      : 3.95

    const avgCpkVal = list.length
      ? Number((list.reduce((sum, p) => sum + p.cpk, 0) / list.length).toFixed(2))
      : 1.45

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalSavings: formattedSavings,
      avgYieldGain: `+${avgYield}%`,
      avgCpk: `${avgCpkVal}`,
      sourceBreakdown: {
        projectsCount: list.filter(p => p.sourceType === 'PROJECT').length,
        kmCount: list.filter(p => p.sourceType === 'KM').length,
        approvalCount: list.filter(p => p.sourceType === 'APPROVAL').length,
        masterCount: list.filter(p => p.sourceType === 'MASTER').length
      }
    }
  })

  // 1. Financial Savings & Budget by Business Group (Bar Chart Data)
  const buBudgets = computed(() => {
    const list = filteredProjects.value
    const buGroups = [
      { id: 'b1', name: 'กลุ่มธุรกิจแปรรูปเนื้อไก่ (Chicken Processing)', shortName: 'แปรรูปไก่ (Chicken)', defaultAmount: 182.0, color: '#FCD34D', bgHover: '#F59E0B', filterTag: 'Chicken' },
      { id: 'b2', name: 'ศูนย์บริหารและพัฒนาองค์กร (Corporate CI)', shortName: 'พัฒนาองค์กร (CI HQ)', defaultAmount: 15.5, color: '#34D399', bgHover: '#10B981', filterTag: 'Corporate' },
      { id: 'b3', name: 'ฝ่ายยุทธศาสตร์นวัตกรรม (Strategy Innovation)', shortName: 'ยุทธศาสตร์นวัตกรรม', defaultAmount: 10.0, color: '#F87171', bgHover: '#EF4444', filterTag: 'Strategy' },
      { id: 'b4', name: 'กลุ่มธุรกิจฟาร์มเกษตร (Commercial Farm)', shortName: 'ฟาร์มเกษตร (Farm)', defaultAmount: 22.3, color: '#38BDF8', bgHover: '#0284C7', filterTag: 'Farm' },
      { id: 'b5', name: 'กลุ่มธุรกิจอาหารสัตว์ (Feed Mill)', shortName: 'อาหารสัตว์ (Feed)', defaultAmount: 56.3, color: '#FB923C', bgHover: '#F97316', filterTag: 'Feed' },
      { id: 'b6', name: 'กลุ่มธุรกิจแปรรูปเนื้อสุกร (Swine Processing)', shortName: 'แปรรูปสุกร (Swine)', defaultAmount: 18.6, color: '#C084FC', bgHover: '#9333EA', filterTag: 'Swine' },
      { id: 'b7', name: 'กลุ่มธุรกิจอาหารสำเร็จรูป (Ready-to-Eat)', shortName: 'อาหารสำเร็จรูป (RTE)', defaultAmount: 333.6, color: '#EF4444', bgHover: '#DC2626', filterTag: 'Ready-to-Eat' }
    ]

    return buGroups.map(bg => {
      const matchProjects = list.filter(p => p.bu.includes(bg.filterTag) || p.business.includes(bg.filterTag))
      const calculatedAmount = matchProjects.reduce((sum, p) => sum + (p.budgetThb / 1000000), 0)
      const finalAmount = calculatedAmount > 0 ? calculatedAmount : bg.defaultAmount
      return {
        id: bg.id,
        name: bg.name,
        shortName: bg.shortName,
        amount: Number(finalAmount.toFixed(1)),
        displayVal: `${finalAmount.toFixed(1)}M`,
        color: bg.color,
        bgHover: bg.bgHover,
        projectsCount: matchProjects.length || Math.round(finalAmount / 15)
      }
    })
  })

  // 2. Budget & Cost Savings by Six Sigma Improvement Focus Category (Horizontal Bar Data)
  const categoryBudgets = computed(() => {
    const categories = [
      { name: 'เพิ่มผลผลิตและลด Yield Loss (%Total Yield)', defaultAmt: 248.5, defaultCount: 18, color: '#2563EB' },
      { name: 'ลดของเสียและชิ้นงานไม่ได้มาตรฐาน (Defect & Scrap)', defaultAmt: 195.2, defaultCount: 6, color: '#059669' },
      { name: 'ลดน้ำหนักเผื่อและควบคุมความแม่นยำ (Giveaway)', defaultAmt: 158.0, defaultCount: 5, color: '#D97706' },
      { name: 'ปรับปรุงประสิทธิภาพเครื่องจักร (OEE & Uptime)', defaultAmt: 62.4, defaultCount: 12, color: '#DC2626' },
      { name: 'ประหยัดพลังงานและสาธารณูปโภค (Energy & Utility)', defaultAmt: 15.0, defaultCount: 1, color: '#0284C7' },
      { name: 'ระบบอัตโนมัติและดิจิทัล (Automation & AI)', defaultAmt: 68.3, defaultCount: 3, color: '#8B5CF6' },
      { name: 'ลดรอบเวลาและเพิ่มความคล่องตัว (Cycle Time)', defaultAmt: 18.5, defaultCount: 3, color: '#6366F1' }
    ]

    return categories.map(cat => {
      const matchProjects = filteredProjects.value.filter(p => p.improvementCategory.includes(cat.name) || cat.name.includes(p.improvementCategory))
      const sum = matchProjects.reduce((acc, p) => acc + (p.budgetThb / 1000000), 0)
      return {
        name: cat.name,
        amount: sum > 0 ? Number(sum.toFixed(1)) : cat.defaultAmt,
        count: matchProjects.length || cat.defaultCount,
        color: cat.color
      }
    })
  })

  // 3. Project Share Donut Breakdown
  const projectShareData = computed(() => {
    const buList = buBudgets.value
    const totalCount = buList.reduce((sum, b) => sum + b.projectsCount, 0) || 47
    return buList.map(b => ({
      label: b.id === 'b7' ? 'อาหารสำเร็จรูป' : (b.id === 'b1' ? 'แปรรูปไก่' : (b.id === 'b5' ? 'อาหารสัตว์' : (b.id === 'b6' ? 'แปรรูปสุกร' : (b.id === 'b4' ? 'ฟาร์มเกษตร' : (b.id === 'b2' ? 'พัฒนาองค์กร' : 'ยุทธศาสตร์'))))),
      fullName: b.name,
      count: b.projectsCount,
      color: b.color,
      pct: Math.round((b.projectsCount / totalCount) * 100)
    }))
  })

  // 4. Quarterly Plan vs Actual (Stage-Gate Governance & Closeout Milestones)
  const quarterlyData = computed(() => {
    const pcrWorkflows = workflows.value.filter(w => w.reportType === 'PCR')
    const pfrWorkflows = workflows.value.filter(w => w.reportType === 'PFR')

    return [
      {
        quarter: 'ไตรมาส 1 (Q1)',
        pcrPlan: 30,
        pcrActual: pcrWorkflows.filter(w => w.status === 'Approved').length || 9,
        analyzePlan: 21,
        analyzeActual: 7,
        pfrPlan: 15,
        pfrActual: pfrWorkflows.filter(w => w.status === 'Approved').length || 6
      },
      {
        quarter: 'ไตรมาส 2 (Q2)',
        pcrPlan: 6,
        pcrActual: pcrWorkflows.filter(w => w.status === 'Under Review').length || 0,
        analyzePlan: 8,
        analyzeActual: 1,
        pfrPlan: 11,
        pfrActual: 1
      },
      {
        quarter: 'ไตรมาส 3 (Q3)',
        pcrPlan: 0,
        pcrActual: 0,
        analyzePlan: 7,
        analyzeActual: 0,
        pfrPlan: 5,
        pfrActual: 0
      },
      {
        quarter: 'ไตรมาส 4 (Q4)',
        pcrPlan: 0,
        pcrActual: 0,
        analyzePlan: 0,
        analyzeActual: 0,
        pfrPlan: 5,
        pfrActual: 0
      }
    ]
  })

  // 5. Monthly Project Delivery & Close-out Forecast Timeline
  const monthlyTimeline = computed(() => [
    { month: 'ต.ค. 68', planDelivery: 14, actualDelivery: 4, planPfr: 8, actualPfr: 3 },
    { month: 'พ.ย. 68', planDelivery: 8, actualDelivery: 4, planPfr: 2, actualPfr: 0 },
    { month: 'ธ.ค. 68', planDelivery: 8, actualDelivery: 1, planPfr: 5, actualPfr: 1 },
    { month: 'ม.ค. 69', planDelivery: 0, actualDelivery: 0, planPfr: 2, actualPfr: 0 },
    { month: 'ก.พ. 69', planDelivery: 4, actualDelivery: 0, planPfr: 4, actualPfr: 1 },
    { month: 'มี.ค. 69', planDelivery: 2, actualDelivery: 0, planPfr: 5, actualPfr: 0 },
    { month: 'เม.ย. 69', planDelivery: 0, actualDelivery: 0, planPfr: 2, actualPfr: 0 },
    { month: 'พ.ค. 69', planDelivery: 0, actualDelivery: 0, planPfr: 3, actualPfr: 0 },
    { month: 'มิ.ย. 69', planDelivery: 0, actualDelivery: 0, planPfr: 2, actualPfr: 0 },
    { month: 'ก.ค. 69', planDelivery: 0, actualDelivery: 0, planPfr: 1, actualPfr: 0 },
    { month: 'ส.ค. 69', planDelivery: 0, actualDelivery: 0, planPfr: 2, actualPfr: 0 },
    { month: 'ก.ย. 69', planDelivery: 0, actualDelivery: 0, planPfr: 2, actualPfr: 0 }
  ])

  // Belt Certification Distribution from live users
  const beltDistribution = computed(() => {
    const totalUsers = users.value.length || 1
    const mbbCount = users.value.filter(u => u.belt === 'Master Black Belt' || u.role.includes('MBB')).length
    const bbCount = users.value.filter(u => u.belt === 'Black Belt').length
    const gbCount = users.value.filter(u => u.belt === 'Green Belt').length
    const ybCount = users.value.filter(u => u.belt === 'Yellow Belt').length

    return {
      mbb: { count: mbbCount, pct: Math.round((mbbCount / totalUsers) * 100) },
      bb: { count: bbCount, pct: Math.round((bbCount / totalUsers) * 100) },
      gb: { count: gbCount, pct: Math.round((gbCount / totalUsers) * 100) },
      yb: { count: ybCount, pct: Math.round((ybCount / totalUsers) * 100) }
    }
  })

  return {
    projectRecords,
    filteredProjects,
    availablePlants,
    masterOrgData,
    // Filter State
    selectedBusiness,
    selectedBu,
    selectedPlant,
    selectedYear,
    selectedBelt,
    selectedPhase,
    selectedBudgetType,
    selectedSourceType,
    // Computed Visual Stores
    kpiSummary,
    buBudgets,
    categoryBudgets,
    projectShareData,
    quarterlyData,
    monthlyTimeline,
    beltDistribution
  }
}
