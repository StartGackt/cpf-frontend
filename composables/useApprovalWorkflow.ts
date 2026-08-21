// Enterprise Approval Workflow & E-Signature Engine for CPF Six Sigma (PCR & PFR)
import { ref, computed } from 'vue'

export type ApprovalType = 'PCR' | 'PFR'
export type ApprovalStatus = 'Draft' | 'Under Review' | 'Approved' | 'Needs Revision' | 'Rejected'

export interface ESignatureData {
  signatureUrl: string // Data URL from canvas, typed SVG, or uploaded image
  signatureType: 'draw' | 'type' | 'upload'
  certificateId: string
  signerName: string
  signerEmail: string
  signerRole: string
  signedAt: string
  ipAddress: string
  deviceHash: string
  verificationToken: string
}

export interface ApprovalStep {
  id: string
  stepNumber: number
  role: string
  approverName: string
  approverEmail: string
  designation: string
  status: 'Approved' | 'Pending' | 'Waiting' | 'Needs Revision' | 'Rejected'
  signedAt?: string
  comments?: string
  signature?: ESignatureData
  emailToken?: string
  isExternal?: boolean
}

export interface ApprovalWorkflow {
  id: string
  projectId: string
  projectName: string
  location: string
  business: string
  reportType: ApprovalType
  reportTitle: string
  status: ApprovalStatus
  submittedBy: string
  submittedAt: string
  targetCompletionDate: string
  currentStepNumber: number
  steps: ApprovalStep[]
  metricsSummary: {
    baseline: string
    entitlement: string
    targetGoal: string
    financialSavings: string
    cpk?: string
    pfrDocId?: string
  }
  auditLog: Array<{
    id: string
    action: string
    performedBy: string
    timestamp: string
    details: string
    certificateId?: string
  }>
}

const STORAGE_APPROVALS_KEY = 'cpf_sixsigma_approval_workflows'

const initialWorkflows: ApprovalWorkflow[] = [
  {
    id: 'appr-pcr-001',
    projectId: 'p2',
    projectName: 'Auto Heating Yield Monitoring Project',
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    business: 'Food Business › Chicken Processing',
    reportType: 'PCR',
    reportTitle: 'Project Charter Report (PCR) — ขออนุมัติเปิดโครงการ',
    status: 'Under Review',
    submittedBy: 'Nadtapong Aontawee (Green Belt)',
    submittedAt: '2026-02-24 09:30',
    targetCompletionDate: '2026-06-30',
    currentStepNumber: 2,
    metricsSummary: {
      baseline: '81.20%',
      entitlement: '86.50%',
      targetGoal: '85.44%',
      financialSavings: '2,800,000 THB / Year',
      pfrDocId: 'PCR-CPF-2026-092'
    },
    steps: [
      {
        id: 'step-pcr-1',
        stepNumber: 1,
        role: 'Project Leader (Proposer)',
        approverName: 'Nadtapong Aontawee',
        approverEmail: 'nadtapong.a@cpf.co.th',
        designation: 'Thermal & Cooking Division Engineer',
        status: 'Approved',
        signedAt: '2026-02-24 09:30',
        comments: 'Submitted project charter targets and scope formulation.',
        signature: {
          signatureUrl: '',
          signatureType: 'type',
          certificateId: 'CPF-ESIGN-2026-88102',
          signerName: 'Nadtapong Aontawee',
          signerEmail: 'nadtapong.a@cpf.co.th',
          signerRole: 'Project Leader (Green Belt)',
          signedAt: '2026-02-24 09:30',
          ipAddress: '10.240.12.45 (CPF Internal)',
          deviceHash: 'SHA256-4c91a0...',
          verificationToken: 'CPF-AUTH-PCR-092-1'
        },
        emailToken: 'tok-pcr-step1'
      },
      {
        id: 'step-pcr-2',
        stepNumber: 2,
        role: 'Project Champion / Department Head',
        approverName: 'Somchai Vong',
        approverEmail: 'somchai.v@cpf.co.th',
        designation: 'Plant Operations Manager',
        status: 'Pending',
        emailToken: 'tok-pcr-step2'
      },
      {
        id: 'step-pcr-3',
        stepNumber: 3,
        role: 'Master Black Belt (MBB) Reviewer',
        approverName: 'Dr. Prasert Chareon',
        approverEmail: 'prasert.c@cpf.co.th',
        designation: 'Corporate CI & Quality Excellence',
        status: 'Waiting',
        emailToken: 'tok-pcr-step3'
      },
      {
        id: 'step-pcr-4',
        stepNumber: 4,
        role: 'Corporate PMO & Steering Committee',
        approverName: 'Quality Excellence Committee',
        approverEmail: 'pmo.quality@cpf.co.th',
        designation: 'PMO Corporate Governance HQ',
        status: 'Waiting',
        emailToken: 'tok-pcr-step4'
      }
    ],
    auditLog: [
      {
        id: 'log-1',
        action: 'PCR Submitted & Initiated',
        performedBy: 'Nadtapong Aontawee',
        timestamp: '2026-02-24 09:30',
        details: 'Project charter submitted for operational & MBB sign-off.',
        certificateId: 'CPF-ESIGN-2026-88102'
      },
      {
        id: 'log-2',
        action: 'Email Notification Dispatched',
        performedBy: 'CPF System Mailer API',
        timestamp: '2026-02-24 09:31',
        details: 'Automated email with 1-Click Approval link sent to Somchai Vong (somchai.v@cpf.co.th).'
      }
    ]
  },
  {
    id: 'appr-pfr-002',
    projectId: 'example-total-yield',
    projectName: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    business: 'Food Business › Chicken Processing',
    reportType: 'PFR',
    reportTitle: 'Project Final Report (PFR) — ขออนุมัติปิดโครงการ',
    status: 'Approved',
    submittedBy: 'Romteera Tadderm (Black Belt)',
    submittedAt: '2026-02-20 14:00',
    targetCompletionDate: '2026-02-24',
    currentStepNumber: 4,
    metricsSummary: {
      baseline: '83.75%',
      entitlement: '88.00%',
      targetGoal: '87.15%',
      financialSavings: '4,250,000 THB / Year',
      cpk: '1.45 (Stable & Sustained)',
      pfrDocId: 'PFR-CPF-2026-088'
    },
    steps: [
      {
        id: 'step-pfr-1',
        stepNumber: 1,
        role: 'Project Leader (Black Belt)',
        approverName: 'Romteera Tadderm',
        approverEmail: 'romteera.t@cpf.co.th',
        designation: 'Black Belt Certified Project Leader',
        status: 'Approved',
        signedAt: '2026-02-20 14:15',
        comments: 'Yield increased from 83.75% to 87.70% with verified savings 4.25M THB.',
        signature: {
          signatureUrl: '',
          signatureType: 'draw',
          certificateId: 'CPF-ESIGN-2026-94811',
          signerName: 'Romteera Tadderm',
          signerEmail: 'romteera.t@cpf.co.th',
          signerRole: 'Black Belt Leader',
          signedAt: '2026-02-20 14:15',
          ipAddress: '10.240.55.19',
          deviceHash: 'SHA256-78e2...',
          verificationToken: 'CPF-AUTH-PFR-088-1'
        },
        emailToken: 'tok-pfr-step1'
      },
      {
        id: 'step-pfr-2',
        stepNumber: 2,
        role: 'Master Black Belt (MBB)',
        approverName: 'Dr. Prasert Chareon',
        approverEmail: 'prasert.c@cpf.co.th',
        designation: 'Master Black Belt Technical Advisor',
        status: 'Approved',
        signedAt: '2026-02-22 10:45',
        comments: 'Statistical DOE and 2-Sample T hypothesis testing verified. Cpk sustained at 1.45.',
        signature: {
          signatureUrl: '',
          signatureType: 'type',
          certificateId: 'CPF-ESIGN-2026-94812',
          signerName: 'Dr. Prasert Chareon',
          signerEmail: 'prasert.c@cpf.co.th',
          signerRole: 'MBB Advisor',
          signedAt: '2026-02-22 10:45',
          ipAddress: '10.240.10.82',
          deviceHash: 'SHA256-11f4...',
          verificationToken: 'CPF-AUTH-PFR-088-2'
        },
        emailToken: 'tok-pfr-step2'
      },
      {
        id: 'step-pfr-3',
        stepNumber: 3,
        role: 'Plant Champion / GM',
        approverName: 'Somchai Vong',
        approverEmail: 'somchai.v@cpf.co.th',
        designation: 'Plant General Manager',
        status: 'Approved',
        signedAt: '2026-02-24 11:20',
        comments: 'Financial savings and SOP control plans confirmed for production line.',
        signature: {
          signatureUrl: '',
          signatureType: 'draw',
          certificateId: 'CPF-ESIGN-2026-94813',
          signerName: 'Somchai Vong',
          signerEmail: 'somchai.v@cpf.co.th',
          signerRole: 'Plant Champion',
          signedAt: '2026-02-24 11:20',
          ipAddress: '10.240.55.01',
          deviceHash: 'SHA256-99b3...',
          verificationToken: 'CPF-AUTH-PFR-088-3'
        },
        emailToken: 'tok-pfr-step3'
      },
      {
        id: 'step-pfr-4',
        stepNumber: 4,
        role: 'Corporate PMO & KM Repository',
        approverName: 'Quality Excellence Committee',
        approverEmail: 'pmo.quality@cpf.co.th',
        designation: 'Corporate PMO Headquarters',
        status: 'Approved',
        signedAt: '2026-02-24 11:30',
        comments: 'Certified and auto-archived into CPF KM Repository.',
        signature: {
          signatureUrl: '',
          signatureType: 'type',
          certificateId: 'CPF-ESIGN-2026-94814',
          signerName: 'Quality Excellence Committee',
          signerEmail: 'pmo.quality@cpf.co.th',
          signerRole: 'Corporate PMO',
          signedAt: '2026-02-24 11:30',
          ipAddress: '10.240.01.05',
          deviceHash: 'SHA256-44aa...',
          verificationToken: 'CPF-AUTH-PFR-088-4'
        },
        emailToken: 'tok-pfr-step4'
      }
    ],
    auditLog: [
      {
        id: 'log-pfr-1',
        action: 'PFR Submitted',
        performedBy: 'Romteera Tadderm',
        timestamp: '2026-02-20 14:15',
        details: 'Submitted final project report with audited yield and cost savings.',
        certificateId: 'CPF-ESIGN-2026-94811'
      },
      {
        id: 'log-pfr-2',
        action: 'MBB Sign-off Completed',
        performedBy: 'Dr. Prasert Chareon',
        timestamp: '2026-02-22 10:45',
        details: 'Approved via Secure Email Link. Statistical DOE verified.',
        certificateId: 'CPF-ESIGN-2026-94812'
      },
      {
        id: 'log-pfr-3',
        action: 'Champion Sign-off Completed',
        performedBy: 'Somchai Vong',
        timestamp: '2026-02-24 11:20',
        details: 'E-Signed via Portal. Standard Operating Procedures locked.',
        certificateId: 'CPF-ESIGN-2026-94813'
      },
      {
        id: 'log-pfr-4',
        action: 'Corporate PMO Certified & Synced to KM',
        performedBy: 'Quality Excellence Committee',
        timestamp: '2026-02-24 11:30',
        details: 'Final sign-off completed. Auto-pushed to CPF KM Repository.',
        certificateId: 'CPF-ESIGN-2026-94814'
      }
    ]
  }
]

const workflowsState = ref<ApprovalWorkflow[]>([])
let isInitialized = false

function initStorage() {
  if (isInitialized || typeof window === 'undefined') return
  try {
    const saved = localStorage.getItem(STORAGE_APPROVALS_KEY)
    if (saved) {
      workflowsState.value = JSON.parse(saved)
    } else {
      workflowsState.value = [...initialWorkflows]
      localStorage.setItem(STORAGE_APPROVALS_KEY, JSON.stringify(initialWorkflows))
    }
  } catch (e) {
    workflowsState.value = [...initialWorkflows]
  }
  isInitialized = true
}

export function useApprovalWorkflow() {
  initStorage()

  const saveWorkflows = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_APPROVALS_KEY, JSON.stringify(workflowsState.value))
    }
  }

  // 1. Get workflow by project ID & type
  const getProjectWorkflow = (projectId: string, type: ApprovalType): ApprovalWorkflow | undefined => {
    return workflowsState.value.find(w => w.projectId === projectId && w.reportType === type)
  }

  // 2. Submit new PCR or PFR workflow
  const submitWorkflow = (params: {
    projectId: string
    projectName: string
    location: string
    business: string
    reportType: ApprovalType
    submittedBy: string
    approverList: Array<{ name: string; email: string; role: string; designation: string }>
    metrics: ApprovalWorkflow['metricsSummary']
  }): ApprovalWorkflow => {
    const newSteps: ApprovalStep[] = params.approverList.map((appr, idx) => ({
      id: `step-${Date.now()}-${idx + 1}`,
      stepNumber: idx + 1,
      role: appr.role,
      approverName: appr.name,
      approverEmail: appr.email,
      designation: appr.designation,
      status: idx === 0 ? 'Pending' : 'Waiting',
      emailToken: `token-${Date.now()}-${idx + 1}`
    }))

    const newWorkflow: ApprovalWorkflow = {
      id: `appr-${params.reportType.toLowerCase()}-${Date.now()}`,
      projectId: params.projectId,
      projectName: params.projectName,
      location: params.location,
      business: params.business,
      reportType: params.reportType,
      reportTitle: params.reportType === 'PCR'
        ? 'Project Charter Report (PCR) — ขออนุมัติเปิดโครงการ'
        : 'Project Final Report (PFR) — ขออนุมัติปิดโครงการ',
      status: 'Under Review',
      submittedBy: params.submittedBy,
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      targetCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      currentStepNumber: 1,
      metricsSummary: params.metrics,
      steps: newSteps,
      auditLog: [
        {
          id: `log-${Date.now()}`,
          action: `${params.reportType} Sign-off Initiated`,
          performedBy: params.submittedBy,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          details: `Workflow started with ${newSteps.length} sequential approval steps.`
        }
      ]
    }

    workflowsState.value.unshift(newWorkflow)
    saveWorkflows()
    return newWorkflow
  }

  // 3. Approve a Step with E-Signature
  const approveStep = (
    workflowId: string,
    stepId: string,
    signature: ESignatureData,
    comments?: string
  ): { success: boolean; message: string; workflow?: ApprovalWorkflow } => {
    const wf = workflowsState.value.find(w => w.id === workflowId)
    if (!wf) return { success: false, message: 'Workflow not found' }

    const stepIdx = wf.steps.findIndex(s => s.id === stepId)
    if (stepIdx === -1) return { success: false, message: 'Step not found' }

    const step = wf.steps[stepIdx]
    if (!step) return { success: false, message: 'Invalid step' }

    step.status = 'Approved'
    step.signedAt = new Date().toISOString().slice(0, 16).replace('T', ' ')
    step.comments = comments || 'Approved & Signed via E-Signature.'
    step.signature = signature

    // Add to audit trail
    wf.auditLog.unshift({
      id: `log-${Date.now()}`,
      action: `${step.role} Sign-off Approved`,
      performedBy: `${step.approverName} (${step.approverEmail})`,
      timestamp: step.signedAt,
      details: comments ? `Comment: ${comments}` : 'Approved with verified E-Signature.',
      certificateId: signature.certificateId
    })

    // Advance to next step or complete workflow
    if (stepIdx < wf.steps.length - 1) {
      const nextStep = wf.steps[stepIdx + 1]
      if (nextStep) {
        nextStep.status = 'Pending'
        wf.currentStepNumber = nextStep.stepNumber

        // Dispatched email event in audit log
        wf.auditLog.unshift({
          id: `log-${Date.now() + 1}`,
          action: 'Next Sign-off Email Dispatched',
          performedBy: 'CPF System Mailer API',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          details: `Sent approval notification with secure link to ${nextStep.approverName} (${nextStep.approverEmail}).`
        })
      }
    } else {
      // All steps approved!
      wf.status = 'Approved'
      wf.auditLog.unshift({
        id: `log-${Date.now() + 2}`,
        action: `${wf.reportType} Fully Approved & Certified`,
        performedBy: 'CPF Enterprise PMO System',
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        details: `All ${wf.steps.length} sequential approvals completed. Document certified and registered.`
      })
    }

    saveWorkflows()
    return {
      success: true,
      message: `Step ${step.stepNumber} (${step.role}) approved successfully!`,
      workflow: wf
    }
  }

  // 4. Request Revision
  const requestRevision = (
    workflowId: string,
    stepId: string,
    comments: string,
    reviewerName: string
  ): { success: boolean; message: string } => {
    const wf = workflowsState.value.find(w => w.id === workflowId)
    if (!wf) return { success: false, message: 'Workflow not found' }

    const step = wf.steps.find(s => s.id === stepId)
    if (!step) return { success: false, message: 'Step not found' }

    step.status = 'Needs Revision'
    step.comments = comments
    wf.status = 'Needs Revision'

    wf.auditLog.unshift({
      id: `log-${Date.now()}`,
      action: 'Revision Requested',
      performedBy: reviewerName || step.approverName,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      details: `Revision required: "${comments}". Notification sent to project leader.`
    })

    saveWorkflows()
    return { success: true, message: 'Revision request recorded and project team notified.' }
  }

  // 5. Simulate Email Quick Approval via token link
  const simulateEmailLinkApproval = (
    emailToken: string,
    action: 'approve' | 'revise' | 'reject',
    comments?: string
  ): { success: boolean; message: string; workflow?: ApprovalWorkflow } => {
    for (const wf of workflowsState.value) {
      const step = wf.steps.find(s => s.emailToken === emailToken)
      if (step) {
        if (action === 'approve') {
          const fakeSignature: ESignatureData = {
            signatureUrl: '',
            signatureType: 'type',
            certificateId: `CPF-ESIGN-EMAIL-${Math.floor(10000 + Math.random() * 90000)}`,
            signerName: step.approverName,
            signerEmail: step.approverEmail,
            signerRole: step.role,
            signedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            ipAddress: '10.240.88.12 (Email Token Direct API)',
            deviceHash: 'SHA256-EMAIL-AUTH-SECURE',
            verificationToken: `TOKEN-VERIFIED-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
          }
          return approveStep(wf.id, step.id, fakeSignature, comments || 'Approved via 1-Click Email Secure Link')
        } else if (action === 'revise') {
          return requestRevision(wf.id, step.id, comments || 'Revisions requested via email link', step.approverName)
        } else {
          step.status = 'Rejected'
          wf.status = 'Rejected'
          wf.auditLog.unshift({
            id: `log-${Date.now()}`,
            action: 'Rejected via Email Link',
            performedBy: step.approverName,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            details: comments || 'Rejected by approver via email link.'
          })
          saveWorkflows()
          return { success: true, message: 'Workflow rejected via email link' }
        }
      }
    }
    return { success: false, message: 'Invalid or expired email token' }
  }

  // 6. Send reminder email notification
  const sendReminder = (workflowId: string, stepId: string): { success: boolean; message: string } => {
    const wf = workflowsState.value.find(w => w.id === workflowId)
    if (!wf) return { success: false, message: 'Workflow not found' }
    const step = wf.steps.find(s => s.id === stepId)
    if (!step) return { success: false, message: 'Step not found' }

    wf.auditLog.unshift({
      id: `log-${Date.now()}`,
      action: 'Reminder Notification Sent',
      performedBy: 'User Action / PMO',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      details: `Urgent sign-off reminder email sent to ${step.approverName} (${step.approverEmail}).`
    })
    saveWorkflows()
    return { success: true, message: `Reminder email dispatched to ${step.approverName}!` }
  }

  return {
    workflows: workflowsState,
    getProjectWorkflow,
    submitWorkflow,
    approveStep,
    requestRevision,
    simulateEmailLinkApproval,
    sendReminder
  }
}
