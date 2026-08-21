// Default slides data and templates for Six Sigma presentation builder

import type { PresentationSlide, SlideWidget } from './pptxExport'

export function getDefaultSlides(): PresentationSlide[] {
  return [
    {
      id: 1,
      title: '1. Executive Summary & Project Charter (PCR/PFR)',
      subtitle: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด — โรงงานแปรรูปโชคชัย',
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
              { label: 'Project Title', value: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด' },
              { label: 'Plant Location', value: 'โรงงานแปรรูปโชคชัย (Food Business)' },
              { label: 'Project Leader & Sponsor', value: 'Romteera Tadderm (BB) / Somchai Vong (Champion)' },
              { label: 'Expected Annual Cost Savings', value: '4,250,000 THB / Year', isHighlight: true }
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
              { label: 'BASELINE', value: '83.75%', color: 'red', desc: 'Pre-Project Mean' },
              { label: 'ENTITLEMENT', value: '88.00%', color: 'amber', desc: 'Process Potential' },
              { label: 'GOAL LSS', value: '87.15%', color: 'purple', desc: 'Target 80% Gap' }
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
            formula: 'Optimum %Giveaway = 2.20000% (Weight: 10g, Drops: 1 drop)',
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
              { label: 'FINAL %YIELD', value: '87.70%', color: 'emerald' },
              { label: 'ANNUAL SAVINGS', value: '4.25M THB', color: 'teal' }
            ],
            note: 'Capability Cpk = 1.45 (Stable & Sustained)'
          }
        }
      ]
    }
  ]
}

export const SLIDE_TEMPLATES: Array<{ name: string; desc: string; icon: string; slide: () => PresentationSlide }> = [
  {
    name: 'Executive Charter & BEG',
    desc: 'Project overview, team, and baseline / goal metrics',
    icon: 'i-lucide-file-text',
    slide: () => ({
      id: Date.now(),
      title: 'Executive Summary & Project Charter',
      subtitle: 'Project Title — Location & Department',
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
              { label: 'Project Title', value: 'เพิ่มประสิทธิภาพกระบวนการแปรรูป' },
              { label: 'Plant Location', value: 'โรงงานแปรรูปโชคชัย' },
              { label: 'Project Leader', value: 'Romteera Tadderm (BB)' },
              { label: 'Expected Cost Savings', value: '3,500,000 THB / Year', isHighlight: true }
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
              { label: 'BASELINE', value: '82.50%', color: 'red', desc: 'Pre-Project Mean' },
              { label: 'ENTITLEMENT', value: '88.00%', color: 'amber', desc: 'Process Potential' },
              { label: 'GOAL LSS', value: '86.90%', color: 'purple', desc: 'Target Gap' }
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
          title: 'Top Prioritized Causes (FMEA)',
          icon: 'i-lucide-table',
          type: 'fmea-table',
          data: {
            description: 'Top critical failure modes ranked by RPN:',
            rows: [
              { rank: '#1', cause: 'การ set ค่าน้ำหนักเผื่อเครื่องชั่ง', s: 8, o: 9, d: 7, rpn: 504 },
              { rank: '#2', cause: 'ความเร็วสายพานไม่สม่ำเสมอ', s: 6, o: 6, d: 5, rpn: 180 }
            ]
          }
        }
      ]
    })
  },
  {
    name: 'Control Plan & Financial ROI',
    desc: 'Standardization checklist and key financial ROI stats',
    icon: 'i-lucide-trending-up',
    slide: () => ({
      id: Date.now(),
      title: 'Control & Financial Results',
      subtitle: 'Process Control Plan & Sustained Financial Impact',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Black Belt Certified Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: `w-${Date.now()}-1`,
          title: 'Standard Operating Procedures (SOP)',
          icon: 'i-lucide-shield-check',
          type: 'control-plan',
          data: {
            description: 'Standardized controls implemented in line:',
            items: [
              { title: 'PLC Parameter locking on weighing machines' },
              { title: 'Daily QA Scale Calibration Verification' },
              { title: 'SPC Control Chart tracking hourly yield' }
            ]
          }
        },
        {
          id: `w-${Date.now()}-2`,
          title: 'Financial & Quality ROI',
          icon: 'i-lucide-trending-up',
          type: 'stat-cards',
          data: {
            stats: [
              { label: 'TOTAL COST SAVINGS', value: '4.25M THB', color: 'teal' },
              { label: '%YIELD IMPROVEMENT', value: '+3.95%', color: 'emerald' }
            ],
            note: 'Cpk capability improved from 0.92 to 1.45'
          }
        }
      ]
    })
  },
  {
    name: 'Blank Custom Slide',
    desc: 'Empty slide with customizable card blocks',
    icon: 'i-lucide-layout-grid',
    slide: () => ({
      id: Date.now(),
      title: 'Custom Title Slide',
      subtitle: 'Add your custom description here',
      headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
      headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
      badge: 'Six Sigma DMAIC Project',
      date: 'Feb 2026',
      footerText: 'Confidential — Internal CPF Six Sigma Documentation',
      layout: '2-col',
      widgets: [
        {
          id: `w-${Date.now()}-1`,
          title: 'Custom Section 1',
          icon: 'i-lucide-file-text',
          type: 'text-bullets',
          data: {
            description: 'Enter your custom notes or findings:',
            bullets: ['Key Finding 1', 'Key Finding 2', 'Key Finding 3']
          }
        },
        {
          id: `w-${Date.now()}-2`,
          title: 'Custom KPI Section 2',
          icon: 'i-lucide-target',
          type: 'kpi-grid',
          data: {
            kpis: [
              { label: 'BEFORE', value: '80%', color: 'red' },
              { label: 'AFTER', value: '95%', color: 'emerald' }
            ],
            rule: 'Process optimized successfully.'
          }
        }
      ]
    })
  }
]
