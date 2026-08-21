// Company Directory & Admin Auto-Provisioning Service
import { ref, computed } from 'vue'

export interface CompanyUser {
  id: string
  employeeId: string
  name: string
  initials: string
  email: string
  department: string
  business: string
  bu: string
  location: string
  role: string
  belt: string
  status: 'Active' | 'Inactive' | 'Pending Activation'
  avatarUrl?: string
}

export interface ProvisioningRequest {
  id: string
  projectId: string
  projectName: string
  name: string
  email: string
  requestedRole: string
  requestedBelt: string
  department: string
  location: string
  requestedBy: string
  requestedAt: string
  status: 'Pending Admin Approval' | 'Approved & Invited' | 'Rejected'
  inviteToken?: string
  activationLink?: string
  notes?: string
}

const STORAGE_USERS_KEY = 'cpf_company_directory_users'
const STORAGE_PROVISIONING_KEY = 'cpf_provisioning_requests'

const initialUsers: CompanyUser[] = [
  {
    id: 'u-1',
    employeeId: 'CPF-08912',
    name: 'Romteera Tadderm',
    initials: 'RT',
    email: 'romteera.t@cpf.co.th',
    department: 'Processing Plant Line 2',
    business: 'Food',
    bu: 'Chicken Processing',
    location: 'โรงงานแปรรูปโชคชัย (Nakhon Ratchasima)',
    role: 'Project Owner',
    belt: 'Black Belt',
    status: 'Active'
  },
  {
    id: 'u-2',
    employeeId: 'CPF-07441',
    name: 'Nadtapong Aontawee',
    initials: 'NA',
    email: 'nadtapong.a@cpf.co.th',
    department: 'Thermal & Cooking Division',
    business: 'Food',
    bu: 'Chicken Processing',
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    role: 'Project Owner',
    belt: 'Green Belt',
    status: 'Active'
  },
  {
    id: 'u-3',
    employeeId: 'CPF-01129',
    name: 'Dr. Prasert Chareon',
    initials: 'PC',
    email: 'prasert.c@cpf.co.th',
    department: 'Corporate Quality Excellence',
    business: 'Corporate',
    bu: 'Quality Excellence & CI',
    location: 'Corporate HQ (Bangkok)',
    role: 'Master Black Belt (MBB)',
    belt: 'Master Black Belt',
    status: 'Active'
  },
  {
    id: 'u-4',
    employeeId: 'CPF-02058',
    name: 'Somchai Vong',
    initials: 'SV',
    email: 'somchai.v@cpf.co.th',
    department: 'Plant Operations Management',
    business: 'Food',
    bu: 'Food Processing Division',
    location: 'Saraburi Plant',
    role: 'Champion / Sponsor',
    belt: 'Champion',
    status: 'Active'
  },
  {
    id: 'u-5',
    employeeId: 'CPF-00001',
    name: 'System Admin',
    initials: 'SA',
    email: 'admin.insight@cpf.co.th',
    department: 'Digital Transformation & PMO',
    business: 'Corporate',
    bu: 'Digital Transformation',
    location: 'Corporate HQ (Bangkok)',
    role: 'System Admin',
    belt: 'None',
    status: 'Active'
  },
  {
    id: 'u-6',
    employeeId: 'CPF-06782',
    name: 'Kittisak P.',
    initials: 'KP',
    email: 'kittisak.p@cpf.co.th',
    department: 'Feedmill Production',
    business: 'Feed',
    bu: 'Feedmill Division',
    location: 'Lopburi Feedmill',
    role: 'Member / Viewer',
    belt: 'Yellow Belt',
    status: 'Active'
  }
]

const initialProvisioningRequests: ProvisioningRequest[] = [
  {
    id: 'req-1',
    projectId: 'example-total-yield',
    projectName: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด',
    name: 'Kittipong Somboon',
    email: 'kittipong.s@partner-sensor.com',
    requestedRole: 'External IoT & Scale Consultant',
    requestedBelt: 'None',
    department: 'Smart Factory Automation Partner',
    location: 'โรงงานแปรรูปโชคชัย',
    requestedBy: 'Romteera Tadderm',
    requestedAt: '2026-02-24 09:15',
    status: 'Pending Admin Approval',
    notes: 'Requested as external auditor and data engineer for Multihead packing scale.'
  },
  {
    id: 'req-2',
    projectId: 'p2',
    projectName: 'Auto Heating Yield Monitoring Project',
    name: 'Wanna Raksasri',
    email: 'wanna.r@cpf.co.th',
    requestedRole: 'QA Line Inspector',
    requestedBelt: 'Yellow Belt',
    department: 'Quality Assurance Line 1',
    location: 'โรงงานแปรรูปอาหาร 2 (นครราชสีมา)',
    requestedBy: 'Nadtapong Aontawee',
    requestedAt: '2026-02-24 11:30',
    status: 'Pending Admin Approval',
    notes: 'New QA supervisor assigned to verify oven thermal logs.'
  }
]

// Global reactive states
const usersState = ref<CompanyUser[]>([])
const provisioningRequestsState = ref<ProvisioningRequest[]>([])
let isInitialized = false

function initStorage() {
  if (isInitialized || typeof window === 'undefined') return
  try {
    const savedUsers = localStorage.getItem(STORAGE_USERS_KEY)
    if (savedUsers) {
      usersState.value = JSON.parse(savedUsers)
    } else {
      usersState.value = [...initialUsers]
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialUsers))
    }

    const savedReqs = localStorage.getItem(STORAGE_PROVISIONING_KEY)
    if (savedReqs) {
      provisioningRequestsState.value = JSON.parse(savedReqs)
    } else {
      provisioningRequestsState.value = [...initialProvisioningRequests]
      localStorage.setItem(STORAGE_PROVISIONING_KEY, JSON.stringify(initialProvisioningRequests))
    }
  } catch (e) {
    usersState.value = [...initialUsers]
    provisioningRequestsState.value = [...initialProvisioningRequests]
  }
  isInitialized = true
}

export function useCompanyDirectory() {
  initStorage()

  const saveUsers = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usersState.value))
    }
  }

  const saveRequests = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_PROVISIONING_KEY, JSON.stringify(provisioningRequestsState.value))
    }
  }

  // 1. Search company master directory
  const searchDirectory = (query: string): CompanyUser[] => {
    if (!query.trim()) return usersState.value
    const q = query.toLowerCase().trim()
    return usersState.value.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.employeeId.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    )
  }

  // 2. Check if user email or name exists in system
  const checkUserExists = (emailOrName: string): CompanyUser | undefined => {
    const term = emailOrName.toLowerCase().trim()
    return usersState.value.find(u =>
      u.email.toLowerCase() === term ||
      u.name.toLowerCase() === term
    )
  }

  // 3. Request auto-provisioning for unlisted user
  const requestProvisioning = (data: {
    projectId: string
    projectName: string
    name: string
    email: string
    requestedRole: string
    requestedBelt?: string
    department?: string
    location?: string
    requestedBy: string
    notes?: string
  }): ProvisioningRequest => {
    const newReq: ProvisioningRequest = {
      id: `req-${Date.now()}`,
      projectId: data.projectId,
      projectName: data.projectName,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      requestedRole: data.requestedRole,
      requestedBelt: data.requestedBelt || 'None',
      department: data.department || 'General Operations',
      location: data.location || 'CPF Plant Facility',
      requestedBy: data.requestedBy,
      requestedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Pending Admin Approval',
      notes: data.notes || 'Added from Project Member / Approval list'
    }

    provisioningRequestsState.value.unshift(newReq)
    saveRequests()
    return newReq
  }

  // 4. Admin approves account provisioning & triggers automated invite email
  const approveProvisioningRequest = (requestId: string): { success: boolean; user?: CompanyUser; message: string } => {
    const req = provisioningRequestsState.value.find(r => r.id === requestId)
    if (!req) return { success: false, message: 'Request not found' }

    // Generate credentials & invite token
    const token = `CPF-INVITE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const initials = req.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP'

    req.status = 'Approved & Invited'
    req.inviteToken = token
    req.activationLink = `https://insightgenie.cpf.co.th/activate?token=${token}&email=${encodeURIComponent(req.email)}`

    // Create user in master directory
    const newUser: CompanyUser = {
      id: `u-${Date.now()}`,
      employeeId: `CPF-${Math.floor(10000 + Math.random() * 90000)}`,
      name: req.name,
      initials,
      email: req.email,
      department: req.department,
      business: 'Food',
      bu: 'Processing Division',
      location: req.location,
      role: req.requestedRole,
      belt: req.requestedBelt,
      status: 'Active'
    }

    // Add user if not already in directory
    if (!usersState.value.some(u => u.email === newUser.email)) {
      usersState.value.push(newUser)
      saveUsers()
    }

    saveRequests()

    return {
      success: true,
      user: newUser,
      message: `Account for ${newUser.name} provisioned! Automated welcome email with activation link sent to ${newUser.email}`
    }
  }

  // 5. Admin rejects request
  const rejectProvisioningRequest = (requestId: string, reason?: string) => {
    const req = provisioningRequestsState.value.find(r => r.id === requestId)
    if (req) {
      req.status = 'Rejected'
      req.notes = reason ? `Rejected: ${reason}` : 'Rejected by Admin'
      saveRequests()
    }
  }

  const pendingRequestsCount = computed(() =>
    provisioningRequestsState.value.filter(r => r.status === 'Pending Admin Approval').length
  )

  return {
    users: usersState,
    provisioningRequests: provisioningRequestsState,
    pendingRequestsCount,
    searchDirectory,
    checkUserExists,
    requestProvisioning,
    approveProvisioningRequest,
    rejectProvisioningRequest
  }
}
