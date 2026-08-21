// Default slides data and templates for Six Sigma presentation builder

import type { PresentationSlide, SlideWidget } from './pptxExport'

export interface DynamicSlideMetrics {
  projectName?: string
  plant?: string
  leader?: string
  baseline?: string
  entitlement?: string
  goalLss?: string
  finalYield?: string
  annualSavings?: string
  cpk?: string
}

export function getDefaultSlides(metrics?: DynamicSlideMetrics): PresentationSlide[] {
  const m = {
    projectName: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    plant: 'โรงงานแปรรูปโชคชัย (Food Business)',
    leader: 'Romteera Tadderm (BB) / Somchai Vong (Champion)',
    baseline: '83.75%',
    entitlement: '88.00%',
    goalLss: '87.15%',
    finalYield: '87.70%',
    annualSavings: '4,250,000 THB / Year',
    cpk: '1.45 (Stable & Sustained)',
    ...metrics
  }

  return [
    {
      id: 1,
      title: '1. Executive Summary & Project Charter (PCR/PFR)',
      subtitle: `${m.projectName} — ${m.plant}`,
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: 'w-charter-1',
          title: 'Executive Project Charter',
          icon: 'i-lucide-file-text',
          type: 'key-value',
          data: {
            items: [
              { label: 'Project Title', value: m.projectName },
              { label: 'Plant Location', value: m.plant },
              { label: 'Project Leader & Sponsor', value: m.leader },
              { label: 'Expected Annual Cost Savings', value: m.annualSavings, isHighlight: true }
            ]
          }
        },
        {
          id: 'w-beg-1',
          title: 'BEG Target Metric Formulation',
          icon: 'i-lucide-target',
          type: 'kpi-grid',
          data: {
            kpis: [
              { label: 'BASELINE', value: m.baseline, color: 'red', desc: 'Pre-Project Mean' },
              { label: 'ENTITLEMENT', value: m.entitlement, color: 'amber', desc: 'Process Potential' },
              { label: 'GOAL LSS', value: m.goalLss, color: 'purple', desc: 'Target 80% Gap' }
            ],
            rule: 'Target set at 80% entitlement gap closure above baseline mean.'
          }
        }
      ]
    },
    {
      id: 2,
      title: '2. Measure Phase: Process Flow & Fishbone Root Causes',
      subtitle: '28-Node Process Flowchart & 41 Causes Ishikawa Diagram',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: 'w-process-2',
          title: '28-Node Process Flowchart',
          icon: 'i-lucide-git-merge',
          type: 'process-map',
          data: {
            description: 'Mapped end-to-end chicken processing: Tumbling → Predust → Battering → Frying → Roasting → Freezing → Multihead Packing.',
            stages: [
              { name: 'Raw Material', active: false },
              { name: 'Tumbling', active: false },
              { name: 'Predust', active: true },
              { name: 'Battering', active: false },
              { name: 'Frying', active: false },
              { name: 'Freezing', active: false },
              { name: 'Multihead Packing', active: true }
            ],
            note: '2 Key Critical Variation Steps identified in Predust & Packing.'
          }
        },
        {
          id: 'w-fmea-2',
          title: 'FMEA Pareto 80/20 Prioritization',
          icon: 'i-lucide-git-branch',
          type: 'fmea-table',
          data: {
            description: '41 brainstormed causes screened across 6 categories. Top high-risk root causes identified:',
            rows: [
              { rank: '#1', cause: 'การ set ค่าน้ำหนักเผื่อ Multihead', s: 7, o: 10, d: 7, rpn: 490 },
              { rank: '#2', cause: 'จำนวน Drop ของเครื่อง Multihead', s: 7, o: 4, d: 10, rpn: 280 },
              { rank: '#3', cause: 'ความเร็วเครื่องเติมแป้ง Predust', s: 4, o: 4, d: 4, rpn: 64 }
            ]
          }
        }
      ]
    },
    {
      id: 3,
      title: '3. Analyze & Improve: Hypothesis Validation & DOE Optimization',
      subtitle: 'Anderson-Darling Normality, 2-Sample T & Response Surface Cube Plot',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: 'w-hypo-3',
          title: '2-Sample T Hypothesis Testing',
          icon: 'i-lucide-test-tube',
          type: 'hypothesis',
          data: {
            description: 'Anderson-Darling Normality confirmed (P > 0.05). 2-Sample T showed significant effect on %Giveaway (P = 0.000).',
            pValueText: 'P-Value = 0.000 (Alpha = 0.05)',
            conclusion: '✓ Null Hypothesis Rejected: Statistical significance verified.',
            isSignificant: true
          }
        },
        {
          id: 'w-doe-3',
          title: 'DOE Cube Plot Optimum Settings',
          icon: 'i-lucide-box',
          type: 'doe-settings',
          data: {
            description: 'Full Factorial 2³ Design identified optimum multihead weight setting:',
            formula: 'Optimum %Giveaway = 2.20% (Weight: 10g, Drops: 1 drop)',
            parameters: [
              { name: 'Target Overweight', val: '10g' },
              { name: 'Drop Count', val: '1 Drop' },
              { name: 'Predust Speed', val: '40 Hz' }
            ]
          }
        }
      ]
    },
    {
      id: 4,
      title: '4. Control & Financial Benefits: Sustaining Yield Gains',
      subtitle: 'Control Plan Standardization & Cumulative Financial Impact',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: 'w-ctrl-4',
          title: 'Process Control Plan Standardization',
          icon: 'i-lucide-shield-check',
          type: 'control-plan',
          data: {
            description: 'Standard Operating Procedures locked to sustain yield gains:',
            items: [
              { title: 'PLC Parameter lock for Multihead 1 drop standard' },
              { title: 'Shift-based Scale Calibration checklist by QA' },
              { title: 'Inverter speed monitor fixed at 40 Hz' }
            ]
          }
        },
        {
          id: 'w-stat-4',
          title: 'Project Financial Impact & Stability',
          icon: 'i-lucide-trending-up',
          type: 'stat-cards',
          data: {
            stats: [
              { label: 'FINAL %YIELD', value: m.finalYield, color: 'emerald' },
              { label: 'ANNUAL SAVINGS', value: m.annualSavings, color: 'teal' }
            ],
            note: `Capability Cpk = ${m.cpk}`
          }
        }
      ]
    }
  ]
}

export const SLIDE_TEMPLATES: Array<{ name: string; desc: string; icon: string; slide: (metrics?: DynamicSlideMetrics) => PresentationSlide }> = [
  {
    name: 'Executive Charter & BEG',
    desc: 'Project overview, team, and baseline / goal metrics',
    icon: 'i-lucide-file-text',
    slide: (metrics) => ({
      id: Date.now(),
      title: 'Executive Summary & Project Charter',
      subtitle: `${metrics?.projectName || 'เพิ่มประสิทธิภาพกระบวนการแปรรูป'} — ${metrics?.plant || 'โรงงานแปรรูปโชคชัย'}`,
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: `w-${Date.now()}-1`,
          title: 'Executive Project Charter',
          icon: 'i-lucide-file-text',
          type: 'key-value',
          data: {
            items: [
              { label: 'Project Title', value: metrics?.projectName || 'เพิ่มประสิทธิภาพกระบวนการแปรรูป' },
              { label: 'Plant Location', value: metrics?.plant || 'โรงงานแปรรูปโชคชัย' },
              { label: 'Project Leader', value: metrics?.leader || 'Romteera Tadderm (BB)' },
              { label: 'Expected Cost Savings', value: metrics?.annualSavings || '4,250,000 THB / Year', isHighlight: true }
            ]
          }
        },
        {
          id: `w-${Date.now()}-2`,
          title: 'BEG Target Formulation',
          icon: 'i-lucide-target',
          type: 'kpi-grid',
          data: {
            kpis: [
              { label: 'BASELINE', value: metrics?.baseline || '83.75%', color: 'red', desc: 'Pre-Project Mean' },
              { label: 'ENTITLEMENT', value: metrics?.entitlement || '88.00%', color: 'amber', desc: 'Process Potential' },
              { label: 'GOAL LSS', value: metrics?.goalLss || '87.15%', color: 'purple', desc: 'Target Gap' }
            ],
            rule: 'Target set at 80% entitlement gap closure above baseline mean.'
          }
        }
      ]
    })
  },
  {
    name: 'FMEA & Root Causes',
    desc: 'Process flow and FMEA RPN ranking table',
    icon: 'i-lucide-git-branch',
    slide: () => ({
      id: Date.now(),
      title: 'Measure & Analyze: Critical Root Causes',
      subtitle: 'Process Flow and Risk Priority Number (RPN) Prioritization',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: `w-${Date.now()}-1`,
          title: 'Process Mapping Summary',
          icon: 'i-lucide-git-merge',
          type: 'text-bullets',
          data: {
            description: 'Critical process checkpoints mapped end-to-end:',
            bullets: [
              'ขั้นตอนการเตรียมวัตถุดิบและหมัก (Tumbling)',
              'ขั้นตอนชุบแป้งและทอด (Battering & Frying)',
              'ขั้นตอนการบรรจุและชั่งน้ำหนัก (Multihead Packing)'
            ]
          }
        },
        {
          id: `w-${Date.now()}-2`,
          title: 'Top Failure Modes by RPN',
          icon: 'i-lucide-git-branch',
          type: 'fmea-table',
          data: {
            description: 'Causes prioritized for statistical hypothesis testing:',
            rows: [
              { rank: '#1', cause: 'การ set ค่าน้ำหนักเผื่อ Multihead', s: 7, o: 10, d: 7, rpn: 490 },
              { rank: '#2', cause: 'จำนวน Drop ของเครื่อง Multihead', s: 7, o: 4, d: 10, rpn: 280 }
            ]
          }
        }
      ]
    })
  },
  {
    name: 'Hypothesis & DOE Result',
    desc: 'Statistical test verification and DOE optimization settings',
    icon: 'i-lucide-flask-conical',
    slide: () => ({
      id: Date.now(),
      title: 'Analyze & Improve: Validated Improvements',
      subtitle: 'Statistical Hypothesis Testing and Optimization Matrix',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: `w-${Date.now()}-1`,
          title: 'Hypothesis Testing Validation',
          icon: 'i-lucide-test-tube',
          type: 'hypothesis',
          data: {
            description: '2-Sample T Test on Critical Overweight Setting:',
            pValueText: 'P-Value = 0.000 (Alpha = 0.05)',
            conclusion: 'Significant impact confirmed. Overweight reduced from 15g to 10g.',
            isSignificant: true
          }
        },
        {
          id: `w-${Date.now()}-2`,
          title: 'DOE Standardized Countermeasures',
          icon: 'i-lucide-box',
          type: 'doe-settings',
          data: {
            description: 'Optimal parameters deployed to line PLC:',
            formula: 'Giveaway reduced by 2.05% with zero quality degradation.',
            parameters: [
              { name: 'Multihead Offset', val: '10g' },
              { name: 'Drop Count', val: '1 Drop' }
            ]
          }
        }
      ]
    })
  },
  {
    name: 'Control Plan & Financial Impact',
    desc: 'SOP controls and financial realization results',
    icon: 'i-lucide-award',
    slide: (metrics) => ({
      id: Date.now(),
      title: 'Control & Financial Realization',
      subtitle: 'Standard Operating Procedures & Sustained Cost Savings',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: `w-${Date.now()}-1`,
          title: 'Control Plan Highlights',
          icon: 'i-lucide-shield-check',
          type: 'control-plan',
          data: {
            description: 'Continuous monitoring protocols:',
            items: [
              { title: 'Shift QA checklist for scale zero-point accuracy' },
              { title: 'PLC software lock on Multihead drop programming' },
              { title: 'Monthly finance audit on raw material yield' }
            ]
          }
        },
        {
          id: `w-${Date.now()}-2`,
          title: 'Verified Financial & Quality KPIs',
          icon: 'i-lucide-trending-up',
          type: 'stat-cards',
          data: {
            stats: [
              { label: 'SUSTAINED YIELD', value: metrics?.finalYield || '87.70%', color: 'emerald' },
              { label: 'AUDITED SAVINGS', value: metrics?.annualSavings || '4,250,000 THB', color: 'teal' }
            ],
            note: `Cpk = ${metrics?.cpk || '1.45 (Six Sigma Capable)'}`
          }
        }
      ]
    })
  }
]
