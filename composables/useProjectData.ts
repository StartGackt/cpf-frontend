import { ref, computed, watch } from 'vue'

export interface InsightRow {
  id: number
  period: string
  actual: number
  total: number
  pct: number
  isOutlier: boolean
  outlierCause: string
  notes?: string
}

export interface CounterbalanceTarget {
  id: number
  name: string
  current: string
  limit: string
  status: string
}

export interface PcrVersion {
  version: string
  approvedBy: string
  approvedAt: string
  status: string
  baseline: string
  goal: string
  comment: string
}

export interface CapabilityData {
  usl: number
  targetVal: number
  lsl: number
  sampleMean: number
  sampleStdDev: number
}

export interface MsaStudy {
  id: string
  equipmentName: string
  characteristic: string
  operators: number
  parts: number
  trials: number
  studyVarPct: number
  ndc: number
  status: string
  recommendation: string
}

export interface HypothesisTest {
  id: string
  factor: string
  tool: string
  sampleSize: number
  pVal: string
  decision: string
  aiSummary: string
  status: string
}

export interface CounterbalanceTest {
  id: string
  metric: string
  tool: string
  sampleSize: number
  baselineP: string
  afterP: string
  pVal: string
  result: string
  status: string
}

export interface ActionItem {
  id: string
  factor: string
  beforeCondition: string
  afterCondition: string
  responsible: string
  targetDate: string
  status: string
  savingsImpact: string
  savingsAmountThb?: number
}

export interface SimulationScenario {
  name: string
  weight: number
  drops: number
  speed: number
  temp?: number
  yieldVal: string
  giveaway: string
  savings: string
}

export interface ControlPlanItem {
  id: string
  process: string
  factor: string
  standard: string
  frequency: string
  responsible: string
  controlMethod: string
  reactionPlan: string
}

export interface TrackingLog {
  id: string
  date: string
  shift: string
  yieldVal: number
  giveaway: number
  flourPct: number
  status: string
}

export interface RealizationLog {
  id: string
  month: string
  targetYield: number
  actualYield: number
  giveaway: number
  savingsThb: number
  status: string
}

export interface ProjectFullData {
  id: string
  name: string
  leader: string
  plant: string
  year: string
  lastUpdated: string
  phase: string
  status: string
  // Define
  insightRows: InsightRow[]
  begGoals: {
    goalBu: string
    goalChallenge: string
  }
  counterbalanceTargets: CounterbalanceTarget[]
  pcrVersions: PcrVersion[]
  // Measure
  capability: CapabilityData
  msaStudies: MsaStudy[]
  // Analyze
  hypothesisTests: HypothesisTest[]
  counterbalanceTests: CounterbalanceTest[]
  sampleSizeConfig: {
    deltaDifference: number
    estStdDev: number
    power: number
    alpha: number
    calculatedSampleSize: number
  }
  regression: {
    responseVariable: string
    activePredictors: string[]
  }
  // Improve
  actionItems: ActionItem[]
  simulationState: {
    weightOffset: number
    dropCount: number
    predustSpeed: number
    fryingTemp: number
  }
  simulationScenarios: SimulationScenario[]
  // Control
  controlPlanItems: ControlPlanItem[]
  trackingLogs: TrackingLog[]
  realizationLogs: RealizationLog[]
}

const defaultProjectState = (projectId: string): ProjectFullData => ({
  id: projectId,
  name: projectId === 'example-total-yield' ? 'Example เพิ่ม %Total Yield สินค้าไก่ทอด' : `Project ${projectId}`,
  leader: 'Romteera Tadderm (Black Belt)',
  plant: 'โรงงานแปรรูปโชคชัย (Food Business)',
  year: '2025',
  lastUpdated: 'Feb 24, 2026',
  phase: 'Improve',
  status: 'Active',
  // Define Phase Default Data
  insightRows: [
    { id: 1, period: '1', actual: 80, total: 100, pct: 80.0, isOutlier: true, outlierCause: 'เครื่องจักรสะดุดช่วงเปลี่ยน Shift', notes: 'Outlier with cause' },
    { id: 2, period: '2', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 3, period: '3', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 4, period: '4', actual: 83, total: 100, pct: 83.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 5, period: '5', actual: 82, total: 100, pct: 82.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 6, period: '6', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 7, period: '7', actual: 88, total: 100, pct: 88.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 8, period: '8', actual: 83, total: 100, pct: 83.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 9, period: '9', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 10, period: '10', actual: 82, total: 100, pct: 82.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 11, period: '11', actual: 84, total: 100, pct: 84.0, isOutlier: false, outlierCause: '', notes: '' },
    { id: 12, period: '12', actual: 85, total: 100, pct: 85.0, isOutlier: false, outlierCause: '', notes: '' }
  ],
  begGoals: {
    goalBu: '86.50',
    goalChallenge: '89.00'
  },
  counterbalanceTargets: [
    { id: 1, name: 'Product Quality Defect Rate (%)', current: '0.45%', limit: '< 0.50%', status: 'Within Limit' },
    { id: 2, name: 'Energy Consumption (kWh/ton)', current: '112.4', limit: '< 120.0', status: 'Within Limit' },
    { id: 3, name: 'Customer Complaint PPM', current: '12 ppm', limit: '< 15 ppm', status: 'Within Limit' }
  ],
  pcrVersions: [
    {
      version: 'V2.0 (Active)',
      approvedBy: 'Dr. Prasert Chareon (MBB)',
      approvedAt: '24/02/2026',
      status: 'Active',
      baseline: '83.75%',
      goal: '87.15%',
      comment: 'Updated goal calculation with 80% entitlement gap closure.'
    },
    {
      version: 'V1.0',
      approvedBy: 'Somchai Vong (Champion)',
      approvedAt: '15/01/2026',
      status: 'Archived',
      baseline: '82.50%',
      goal: '86.00%',
      comment: 'Initial charter draft.'
    }
  ],
  // Measure Phase Default Data
  capability: {
    usl: 89.0,
    targetVal: 87.15,
    lsl: 85.0,
    sampleMean: 83.75,
    sampleStdDev: 1.42
  },
  msaStudies: [
    {
      id: 'MSA-01',
      equipmentName: 'Multihead Weigher Scale A',
      characteristic: 'Finished Pack Weight (g)',
      operators: 3,
      parts: 10,
      trials: 3,
      studyVarPct: 8.4,
      ndc: 12,
      status: 'Acceptable',
      recommendation: 'Gage is capable of detecting process shifts.'
    },
    {
      id: 'MSA-02',
      equipmentName: 'Predust Viscosity Tester',
      characteristic: 'Viscosity (cP)',
      operators: 3,
      parts: 10,
      trials: 2,
      studyVarPct: 34.2,
      ndc: 2,
      status: 'Unacceptable (> 30%)',
      recommendation: 'High operator measurement variation. Requires gauge calibration and operator retraining.'
    }
  ],
  // Analyze Phase Default Data
  hypothesisTests: [
    {
      id: 'T1',
      factor: 'การ set ค่าน้ำหนักเผื่อ Multihead (10g vs 15g)',
      tool: '2-Sample T Test',
      sampleSize: 64,
      pVal: '0.000',
      decision: 'Reject H0 (Significant)',
      aiSummary: 'Significant effect on %Giveaway (P < 0.001). Setting 10g saves approx 2.05% product giveaway.',
      status: 'Confirmed Vital Few'
    },
    {
      id: 'T2',
      factor: 'จำนวน Drop เครื่อง Multihead (1 drop vs 2 drops)',
      tool: '2-Sample T Test',
      sampleSize: 64,
      pVal: '0.000',
      decision: 'Reject H0 (Significant)',
      aiSummary: '1 Drop significantly stabilizes packaging weight distribution.',
      status: 'Confirmed Vital Few'
    },
    {
      id: 'T3',
      factor: 'ความเร็วเครื่องเติมแป้ง Predust (30Hz vs 40Hz vs 50Hz)',
      tool: 'One-Way ANOVA',
      sampleSize: 45,
      pVal: '0.012',
      decision: 'Reject H0 (Significant)',
      aiSummary: 'ANOVA indicates 40Hz provides uniform predust pickup without clumping.',
      status: 'Confirmed Vital Few'
    },
    {
      id: 'T4',
      factor: 'รอบเวลาการทอด Frying Time (Shift 1 vs Shift 2)',
      tool: 'Mann-Whitney (Non-Parametric for 2)',
      sampleSize: 30,
      pVal: '0.428',
      decision: 'Fail to Reject H0 (Insignificant)',
      aiSummary: 'No statistically significant shift difference in frying time.',
      status: 'Insignificant'
    }
  ],
  counterbalanceTests: [
    {
      id: 'CB-01',
      metric: 'Crumb Adhesion Defect Rate (%)',
      tool: '2-Proportion Test',
      sampleSize: 200,
      baselineP: '1.20%',
      afterP: '0.40%',
      pVal: '0.024',
      result: 'Defect rate did NOT increase (Improved from 1.2% to 0.4%)',
      status: 'Passed'
    },
    {
      id: 'CB-02',
      metric: 'Sensory Crispiness Score (1-10)',
      tool: "Mood's Median (Non-Parametric)",
      sampleSize: 30,
      baselineP: '8.2',
      afterP: '8.5',
      pVal: '0.312',
      result: 'No degradation in organoleptic sensory score.',
      status: 'Passed'
    }
  ],
  sampleSizeConfig: {
    deltaDifference: 0.5,
    estStdDev: 1.2,
    power: 0.80,
    alpha: 0.05,
    calculatedSampleSize: 46
  },
  regression: {
    responseVariable: 'Percent_Giveaway',
    activePredictors: ['Multihead_Weight_Offset', 'Drop_Count']
  },
  // Improve Phase Default Data
  actionItems: [
    {
      id: 'ACT-01',
      factor: 'การ set ค่าน้ำหนักเผื่อของเครื่อง Multihead',
      beforeCondition: 'ตั้งค่าน้ำหนักเผื่อ 15g (Giveaway 4.25%)',
      afterCondition: 'ปรับตั้งค่ามาตรฐานใหม่เป็น 10g พร้อมล็อก PLC Code (Giveaway 2.20%)',
      responsible: 'Romteera Tadderm (BB) / Line Leader',
      targetDate: '15/02/2026',
      status: 'Implemented & Standardized',
      savingsImpact: '2,800,000 THB / Year',
      savingsAmountThb: 2800000
    },
    {
      id: 'ACT-02',
      factor: 'จำนวน Drop ของเครื่อง Multihead',
      beforeCondition: 'ปล่อยอิสระ 1-3 drops ตามเซ็นเซอร์สวิง',
      afterCondition: 'ติดตั้งโปรแกรมบังคับ 1 drop คงที่ และทำความสะอาดหัวพ่นลมทุกกะ',
      responsible: 'Somchai Maintenance / Production',
      targetDate: '18/02/2026',
      status: 'Implemented & Standardized',
      savingsImpact: '1,450,000 THB / Year',
      savingsAmountThb: 1450000
    },
    {
      id: 'ACT-03',
      factor: 'ความเร็วเครื่องเติมแป้ง Predust',
      beforeCondition: 'ความเร็วไม่สม่ำเสมอ (30 - 50 Hz)',
      afterCondition: 'ล็อกความเร็ว Inverter ที่ 40 Hz คงที่',
      responsible: 'QC Supervisor',
      targetDate: '20/02/2026',
      status: 'Implemented & Standardized',
      savingsImpact: 'Yield Stability Gain',
      savingsAmountThb: 0
    }
  ],
  simulationState: {
    weightOffset: 10.0,
    dropCount: 1,
    predustSpeed: 40,
    fryingTemp: 175
  },
  simulationScenarios: [
    { name: 'Baseline Condition (Before)', weight: 15.0, drops: 2, speed: 45, yieldVal: '83.75%', giveaway: '4.25%', savings: '0 THB' },
    { name: 'DOE Recommended Optimum', weight: 10.0, drops: 1, speed: 40, yieldVal: '87.70%', giveaway: '2.20%', savings: '4,356,250 THB' },
    { name: 'Aggressive Lean Trial', weight: 8.0, drops: 1, speed: 42, yieldVal: '87.90%', giveaway: '1.99%', savings: '4,802,500 THB' }
  ],
  // Control Phase Default Data
  controlPlanItems: [
    {
      id: 'CP-01',
      process: 'Packing',
      factor: 'การ set ค่าน้ำหนักเผื่อของเครื่อง Multihead',
      standard: '10 กรัม',
      frequency: 'ทุกกะ (Shift)',
      responsible: 'Operator / QA',
      controlMethod: 'Checklist & Scale Verification',
      reactionPlan: 'ปรับตั้งค่าหัวชั่งใหม่ทันทีเมื่อคลาดเคลื่อน'
    },
    {
      id: 'CP-02',
      process: 'Packing',
      factor: 'จำนวน Drop ของเครื่อง Multihead',
      standard: '1 drop',
      frequency: 'เริ่มกะการผลิต',
      responsible: 'Technician',
      controlMethod: 'PLC Parameter Lock',
      reactionPlan: 'แจ้งหัวหน้าช่างเพื่อตรวจสอบโปรแกรม'
    },
    {
      id: 'CP-03',
      process: 'Predusting',
      factor: 'ความเร็วรอบเครื่อง DB4',
      standard: '40 Hz',
      frequency: 'ต่อเนื่อง',
      responsible: 'Operator',
      controlMethod: 'Inverter Display Monitor',
      reactionPlan: 'ปรับความถี่ให้อยู่ในย่าน 40 Hz'
    },
    {
      id: 'CP-04',
      process: 'Predusting',
      factor: 'ความเร็วเครื่องเติมแป้ง Predust',
      standard: '2 Hz',
      frequency: 'ต่อเนื่อง',
      responsible: 'Operator',
      controlMethod: 'Feeder Control Panel',
      reactionPlan: 'ตรวจสอบระดับแป้งและปรับความเร็ว'
    },
    {
      id: 'CP-05',
      process: 'Predusting',
      factor: 'ระดับความสูงแผงเครื่องเติมแป้ง Predust',
      standard: '1 cm',
      frequency: 'ก่อนเริ่มงาน',
      responsible: 'Leader / QA',
      controlMethod: 'Feeler Gauge Measurement',
      reactionPlan: 'ตั้งระดับแผงกั้นใหม่ให้ได้ 1 cm'
    }
  ],
  trackingLogs: [
    { id: 'TRK-1', date: '2026-01-05', shift: 'Shift A', yieldVal: 87.2, giveaway: 2.18, flourPct: 18.5, status: 'In Control' },
    { id: 'TRK-2', date: '2026-01-12', shift: 'Shift B', yieldVal: 87.5, giveaway: 2.20, flourPct: 18.4, status: 'In Control' },
    { id: 'TRK-3', date: '2026-01-19', shift: 'Shift A', yieldVal: 87.8, giveaway: 2.19, flourPct: 18.2, status: 'In Control' },
    { id: 'TRK-4', date: '2026-01-26', shift: 'Shift B', yieldVal: 87.4, giveaway: 2.21, flourPct: 18.6, status: 'In Control' },
    { id: 'TRK-5', date: '2026-02-02', shift: 'Shift A', yieldVal: 88.1, giveaway: 2.17, flourPct: 18.3, status: 'In Control' },
    { id: 'TRK-6', date: '2026-02-09', shift: 'Shift B', yieldVal: 88.0, giveaway: 2.18, flourPct: 18.1, status: 'In Control' },
    { id: 'TRK-7', date: '2026-02-16', shift: 'Shift A', yieldVal: 87.9, giveaway: 2.20, flourPct: 18.5, status: 'In Control' }
  ],
  realizationLogs: [
    { id: 'M1', month: 'M1 (Mar 25)', targetYield: 87.15, actualYield: 87.50, giveaway: 2.25, savingsThb: 354000, status: 'Audited' },
    { id: 'M2', month: 'M2 (Apr 25)', targetYield: 87.15, actualYield: 87.65, giveaway: 2.18, savingsThb: 362000, status: 'Audited' },
    { id: 'M3', month: 'M3 (May 25)', targetYield: 87.15, actualYield: 87.80, giveaway: 2.10, savingsThb: 375000, status: 'Audited' },
    { id: 'M4', month: 'M4 (Jun 25)', targetYield: 87.15, actualYield: 87.70, giveaway: 2.15, savingsThb: 368000, status: 'Audited' },
    { id: 'M5', month: 'M5 (Jul 25)', targetYield: 87.15, actualYield: 87.90, giveaway: 2.05, savingsThb: 382000, status: 'Audited' },
    { id: 'M6', month: 'M6 (Aug 25)', targetYield: 87.15, actualYield: 87.85, giveaway: 2.12, savingsThb: 371000, status: 'Audited' },
    { id: 'M7', month: 'M7 (Sep 25)', targetYield: 87.15, actualYield: 87.75, giveaway: 2.19, savingsThb: 365000, status: 'Audited' },
    { id: 'M8', month: 'M8 (Oct 25)', targetYield: 87.15, actualYield: 87.80, giveaway: 2.14, savingsThb: 370000, status: 'Audited' },
    { id: 'M9', month: 'M9 (Nov 25)', targetYield: 87.15, actualYield: 87.60, giveaway: 2.22, savingsThb: 358000, status: 'Audited' },
    { id: 'M10', month: 'M10 (Dec 25)', targetYield: 87.15, actualYield: 87.95, giveaway: 2.00, savingsThb: 389000, status: 'Audited' },
    { id: 'M11', month: 'M11 (Jan 26)', targetYield: 87.15, actualYield: 87.70, giveaway: 2.16, savingsThb: 367000, status: 'Audited' },
    { id: 'M12', month: 'M12 (Feb 26)', targetYield: 87.15, actualYield: 87.75, giveaway: 2.15, savingsThb: 369000, status: 'Audited' }
  ]
})

// In-memory global store to share reactively across components during SPA navigation
const globalProjectStores = new Map<string, ReturnType<typeof createProjectStore>>()

function createProjectStore(projectId: string) {
  const STORAGE_KEY = `cpf_project_data_v2_${projectId}`
  const project = ref<ProjectFullData>(defaultProjectState(projectId))

  // Load from LocalStorage if available
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Deep merge with default to ensure any new keys exist
        project.value = { ...defaultProjectState(projectId), ...parsed }
      } else {
        // Also check if old legacy insight data existed
        const legacyInsight = localStorage.getItem(`cpf_insight_data_${projectId}`)
        if (legacyInsight) {
          project.value.insightRows = JSON.parse(legacyInsight)
        }
      }
    } catch (e) {
      console.warn('Error reading project data from localStorage:', e)
    }

    // Auto-save on change
    watch(
      project,
      (newVal) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
          // Backward compatibility for legacy keys
          localStorage.setItem(`cpf_insight_data_${projectId}`, JSON.stringify(newVal.insightRows))
        } catch (e) {
          console.error('Failed to save project data:', e)
        }
      },
      { deep: true }
    )
  }

  // --- Dynamic Computed Metrics ---

  // Define: Baseline, Entitlement, Goal LSS
  const validInsightRows = computed(() => project.value.insightRows.filter(r => !r.isOutlier))

  const baselineYield = computed(() => {
    if (validInsightRows.value.length === 0) return 83.75
    const sum = validInsightRows.value.reduce((acc, r) => acc + (r.pct || 0), 0)
    return Number((sum / validInsightRows.value.length).toFixed(2))
  })

  const entitlementYield = computed(() => {
    if (validInsightRows.value.length === 0) return 88.00
    const maxVal = Math.max(...validInsightRows.value.map(r => r.pct || 0))
    return Number(maxVal.toFixed(2))
  })

  const goalLssYield = computed(() => {
    const base = baselineYield.value
    const ent = entitlementYield.value
    // 80% Entitlement Gap closure formula
    const goal = base + (ent - base) * 0.8
    return Number(goal.toFixed(2))
  })

  // Measure: Capability Calculations (Cp, Cpk, Pp, Ppk, PPM)
  const capabilityMetrics = computed(() => {
    const { usl, lsl, sampleMean, sampleStdDev } = project.value.capability
    const sd = Math.max(0.01, sampleStdDev)
    const cpVal = Number(((usl - lsl) / (6 * sd)).toFixed(2))
    const cpu = (usl - sampleMean) / (3 * sd)
    const cpl = (sampleMean - lsl) / (3 * sd)
    const cpkVal = Number(Math.min(cpu, cpl).toFixed(2))

    const ppVal = Number(((usl - lsl) / (6 * (sd * 1.05))).toFixed(2))
    const ppkVal = Number((cpkVal * 0.93).toFixed(2))

    // Estimate PPM Defect Total
    const zUsl = (usl - sampleMean) / sd
    const zLsl = (sampleMean - lsl) / sd
    const ppmVal = Math.round(
      Math.max(10, (1 - 0.5 * (1 + Math.tanh(0.797885 * (zLsl + 0.044715 * Math.pow(zLsl, 3))))) * 1000000)
    )

    return {
      cp: cpVal,
      cpk: cpkVal,
      pp: ppVal,
      ppk: ppkVal,
      ppmTotal: ppmVal,
      isCapable: cpkVal >= 1.33,
      isWarning: cpkVal < 1.0
    }
  })

  // Improve: Simulation & Transfer Function
  const simulatedGiveaway = computed(() => {
    const { weightOffset, dropCount, predustSpeed } = project.value.simulationState
    const base = 1.140 + 0.1060 * weightOffset + 0.954 * dropCount - 0.005 * (predustSpeed - 40)
    return Number(Math.max(0.5, base).toFixed(2))
  })

  const simulatedYield = computed(() => {
    return Number((90.0 - simulatedGiveaway.value - 0.10).toFixed(2))
  })

  const simulatedAnnualSavingsThb = computed(() => {
    const baselineGiveaway = 4.25
    const annualVolumeTons = 2500
    const costPerKgThb = 85.0
    const giveawayReductionPct = Math.max(0, baselineGiveaway - simulatedGiveaway.value)
    const savingsThb = (giveawayReductionPct / 100) * annualVolumeTons * 1000 * costPerKgThb
    return Math.round(savingsThb)
  })

  // Control: Weekly Tracking Statistics & Run Chart Limits
  const trackingStats = computed(() => {
    const logs = project.value.trackingLogs
    if (logs.length === 0) {
      return { avgYield: 87.70, avgGiveaway: 2.19, ucl: 88.5, cl: 87.7, lcl: 86.9, count: 0 }
    }
    const sumYield = logs.reduce((acc, row) => acc + (row.yieldVal || 0), 0)
    const sumGiveaway = logs.reduce((acc, row) => acc + (row.giveaway || 0), 0)
    const mean = sumYield / logs.length

    // Calculate approximate standard deviation & 3-sigma control limits
    const variance = logs.reduce((acc, row) => acc + Math.pow((row.yieldVal || mean) - mean, 2), 0) / logs.length
    const sd = Math.sqrt(variance) || 0.35

    return {
      avgYield: Number(mean.toFixed(2)),
      avgGiveaway: Number((sumGiveaway / logs.length).toFixed(2)),
      ucl: Number((mean + 3 * sd).toFixed(2)),
      cl: Number(mean.toFixed(2)),
      lcl: Number((mean - 3 * sd).toFixed(2)),
      count: logs.length
    }
  })

  // Control: 12-Month Realization Summary
  const realizationStats = computed(() => {
    const logs = project.value.realizationLogs
    if (logs.length === 0) {
      return { totalSavingsThb: 4450000, avgSustainedYield: 87.75, count: 0 }
    }
    const sumSavings = logs.reduce((acc, row) => acc + (row.savingsThb || 0), 0)
    const sumYield = logs.reduce((acc, row) => acc + (row.actualYield || 0), 0)
    return {
      totalSavingsThb: sumSavings,
      totalSavingsFormatted: sumSavings.toLocaleString() + ' THB',
      avgSustainedYield: Number((sumYield / logs.length).toFixed(2)),
      count: logs.length
    }
  })

  // Improve Actions Total Financial Benefit
  const totalActionSavings = computed(() => {
    const sum = project.value.actionItems.reduce((acc, act) => acc + (act.savingsAmountThb || 0), 0)
    return sum > 0 ? sum.toLocaleString() + ' THB / Year' : '4,250,000 THB / Year'
  })

  // Consolidated Project Summary (Bound to Live Phase Results)
  const projectSummary = computed(() => {
    const base = baselineYield.value
    const finalY = realizationStats.value.avgSustainedYield || trackingStats.value.avgYield || 87.70
    const diff = Number((finalY - base).toFixed(2))
    const diffSign = diff >= 0 ? `+${diff}%` : `${diff}%`

    return {
      name: project.value.name,
      leader: project.value.leader,
      plant: project.value.plant,
      baselineYield: `${base}%`,
      goalLssYield: `${goalLssYield.value}%`,
      entitlementYield: `${entitlementYield.value}%`,
      finalYield: `${finalY}%`,
      yieldImprovement: diffSign,
      baselineGiveaway: '4.25%',
      finalGiveaway: `${trackingStats.value.avgGiveaway}%`,
      verifiedAnnualSavings: realizationStats.value.totalSavingsFormatted,
      cpk: `${capabilityMetrics.value.cpk} (${capabilityMetrics.value.isCapable ? 'Capable' : 'Critical'})`,
      pfrDocId: `PFR-CPF-${project.value.year}-088`
    }
  })

  // --- Mutator Helper Functions ---

  const syncBaselineToCapability = () => {
    project.value.capability.sampleMean = baselineYield.value
  }

  const applySimulationToProject = () => {
    // Update capability target and last target
    project.value.capability.targetVal = simulatedYield.value
    // Update BEG Goal BU if empty
    project.value.begGoals.goalBu = simulatedYield.value.toString()
  }

  const resetAllToDefaults = () => {
    project.value = defaultProjectState(projectId)
  }

  return {
    project,
    // Define
    validInsightRows,
    baselineYield,
    entitlementYield,
    goalLssYield,
    // Measure
    capabilityMetrics,
    syncBaselineToCapability,
    // Improve
    simulatedGiveaway,
    simulatedYield,
    simulatedAnnualSavingsThb,
    totalActionSavings,
    applySimulationToProject,
    // Control
    trackingStats,
    realizationStats,
    // Consolidated
    projectSummary,
    resetAllToDefaults
  }
}

export function useProjectData(projectId = 'example-total-yield') {
  if (!globalProjectStores.has(projectId)) {
    globalProjectStores.set(projectId, createProjectStore(projectId))
  }
  return globalProjectStores.get(projectId)!
}
