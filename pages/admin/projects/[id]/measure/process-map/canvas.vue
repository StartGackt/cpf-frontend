<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const router = useRouter()
const projectId = computed(() => (route.params.id as string) || 'example-total-yield')

const { project } = useProjectData(projectId.value)

// Zoom state
const zoomLevel = ref(100)
const zoomIn = () => {
  if (zoomLevel.value < 150) zoomLevel.value += 10
}
const zoomOut = () => {
  if (zoomLevel.value > 50) zoomLevel.value -= 10
}
const resetZoom = () => {
  zoomLevel.value = 100
}

// Toast notification state
const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3500)
}

// Node interface
interface ProcessNode {
  id: string
  name: string
  type: 'process' | 'decision' | 'inspect' | 'storage' | 'delay' | 'document' | 'data' | 'io' | 'prep' | 'terminator' | 'text'
  row: number
  x: number // percentage or pixel
  y: number
  width?: number
  height?: number
  details?: string
  critical?: boolean
}

// Initial 28 Nodes Matching the exact image
const nodes = ref<ProcessNode[]>([
  // --- ROW 1 (Left to Right) ---
  { id: 'n1', name: 'Prepare RM&Ingredients', type: 'process', row: 1, x: 28, y: 70, width: 140, height: 38 },
  { id: 'n2', name: 'Inspect\nWeight', type: 'inspect', row: 1, x: 198, y: 55, width: 62, height: 62 },
  { id: 'n3', name: 'Decision', type: 'decision', row: 1, x: 288, y: 56, width: 60, height: 60 },
  { id: 'n4', name: 'Tumbling', type: 'process', row: 1, x: 378, y: 70, width: 90, height: 38 },
  { id: 'n5', name: 'Inspect\n%Absorb', type: 'inspect', row: 1, x: 494, y: 55, width: 62, height: 62 },
  { id: 'n6', name: 'Decision', type: 'decision', row: 1, x: 584, y: 56, width: 60, height: 60 },
  { id: 'n7', name: 'Predusting', type: 'process', row: 1, x: 674, y: 70, width: 90, height: 38 },
  { id: 'n8', name: 'Inspect\n%Pick up', type: 'inspect', row: 1, x: 790, y: 55, width: 62, height: 62 },
  { id: 'n9', name: 'Decision', type: 'decision', row: 1, x: 880, y: 56, width: 60, height: 60 },

  // --- ROW 2 (Right to Left) ---
  { id: 'n10', name: 'Battering', type: 'process', row: 2, x: 880, y: 220, width: 90, height: 38 },
  { id: 'n11', name: 'Inspect\n%Pick up', type: 'inspect', row: 2, x: 790, y: 205, width: 62, height: 62 },
  { id: 'n12', name: 'Decision', type: 'decision', row: 2, x: 700, y: 206, width: 60, height: 60 },
  { id: 'n13', name: 'Breading', type: 'process', row: 2, x: 590, y: 220, width: 85, height: 38 },
  { id: 'n14', name: 'Frying', type: 'process', row: 2, x: 480, y: 220, width: 85, height: 38 },
  { id: 'n15', name: 'Inspect\nReject', type: 'inspect', row: 2, x: 390, y: 205, width: 62, height: 62 },
  { id: 'n16', name: 'Decision', type: 'decision', row: 2, x: 300, y: 206, width: 60, height: 60 },
  { id: 'n17', name: 'Roasting', type: 'process', row: 2, x: 190, y: 220, width: 85, height: 38 },

  // --- ROW 3 (Left to Right) ---
  { id: 'n18', name: 'Inspect\nReject', type: 'inspect', row: 3, x: 190, y: 365, width: 62, height: 62 },
  { id: 'n19', name: 'Decision', type: 'decision', row: 3, x: 280, y: 366, width: 60, height: 60 },
  { id: 'n20', name: 'Freezing', type: 'process', row: 3, x: 370, y: 380, width: 85, height: 38 },
  { id: 'n21', name: 'Inspect\nReject', type: 'inspect', row: 3, x: 480, y: 365, width: 62, height: 62 },
  { id: 'n22', name: 'Decision', type: 'decision', row: 3, x: 570, y: 366, width: 60, height: 60 },
  { id: 'n23', name: 'Packing', type: 'process', row: 3, x: 660, y: 380, width: 85, height: 38 },
  { id: 'n24', name: 'Inspect\nWeight Seal', type: 'inspect', row: 3, x: 770, y: 360, width: 66, height: 66 },
  { id: 'n25', name: 'Decision', type: 'decision', row: 3, x: 866, y: 366, width: 60, height: 60 },
  { id: 'n26', name: 'Cartoning', type: 'process', row: 3, x: 956, y: 380, width: 90, height: 38 },
  { id: 'n27', name: 'Cold\nStorage', type: 'storage', row: 3, x: 1080, y: 365, width: 66, height: 58 }
])

// Selected node for inspection/editing
const selectedNode = ref<ProcessNode | null>(null)
const isEditModalOpen = ref(false)

const selectNode = (node: ProcessNode) => {
  selectedNode.value = { ...node }
}

const openNodeEditor = (node: ProcessNode) => {
  selectedNode.value = { ...node }
  isEditModalOpen.value = true
}

const saveNodeEdit = () => {
  if (!selectedNode.value) return
  const idx = nodes.value.findIndex(n => n.id === selectedNode.value?.id)
  if (idx !== -1) {
    nodes.value[idx] = { ...selectedNode.value }
    showToast('✓ บันทึกข้อมูล Node สำเร็จ')
  }
  isEditModalOpen.value = false
}

const deleteSelectedNode = () => {
  if (!selectedNode.value) {
    showToast('กรุณาคลิกเลือก Node ที่ต้องการลบก่อน')
    return
  }
  const idToDelete = selectedNode.value.id
  nodes.value = nodes.value.filter(n => n.id !== idToDelete)
  selectedNode.value = null
  showToast('✓ ลบ Node สำเร็จ')
}

// Shape counts computation
const counts = computed(() => {
  const c = {
    process: 0,
    decision: 0,
    inspect: 0,
    terminator: 0,
    document: 0,
    data: 0,
    io: 0,
    prep: 0,
    delay: 0,
    text: 0,
    storage: 0
  }
  nodes.value.forEach(n => {
    if (c[n.type] !== undefined) c[n.type]++
  })
  return c
})

const totalNodesCount = computed(() => nodes.value.length)
const activeNodesCount = computed(() => nodes.value.length)

// Add shape handler
const addShape = (type: ProcessNode['type'], defaultName: string) => {
  const lastNode = nodes.value[nodes.value.length - 1]
  const newX = lastNode ? lastNode.x + 80 : 50
  const newY = lastNode ? lastNode.y : 100
  const newNode: ProcessNode = {
    id: `node-${Date.now()}`,
    name: defaultName,
    type,
    row: 3,
    x: newX,
    y: newY,
    width: type === 'inspect' ? 62 : type === 'decision' ? 60 : 90,
    height: type === 'inspect' ? 62 : type === 'decision' ? 60 : 38
  }
  nodes.value.push(newNode)
  selectNode(newNode)
  showToast(`✓ เพิ่ม Shape: ${defaultName} เรียบร้อยแล้ว`)
}

// Save Process Map
const isSaving = ref(false)
const saveMap = () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    showToast('✓ บันทึก Process Map สินค้าไก่ทอด สำเร็จเรียบร้อยแล้ว!')
  }, 600)
}

// Export Map
const exportMap = () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nodes.value, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', dataStr)
  downloadAnchor.setAttribute('download', `process-map-chicken-yield-${Date.now()}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  showToast('✓ ดาวน์โหลดไฟล์ Process Map JSON เรียบร้อย')
}

// Close and return to list
const closeCanvas = () => {
  router.push(`/admin/projects/${projectId.value}/measure/process-map`)
}

// Help Modal
const isHelpModalOpen = ref(false)
const isViewDetailsOpen = ref(false)
</script>

<template>
  <div class="space-y-4 -mt-2 select-none">
    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toastMsg"
        class="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold bg-gray-900 border border-teal-500 text-white"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- Top Breadcrumbs -->
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
      <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[220px]">
        {{ project?.name || 'Example เพิ่ม %Total Yield...' }}
      </NuxtLink>
      <span>›</span>
      <NuxtLink :to="`/admin/projects/${projectId}/measure/process-map`" class="hover:text-[#008779]">
        Measure
      </NuxtLink>
      <span>›</span>
      <span class="text-slate-900 font-bold">Process Map</span>
    </div>

    <!-- Layout: Left DMAIC Sidebar & Right Process Map Canvas -->
    <div class="flex flex-col lg:flex-row gap-5 items-start">
      <!-- DMAIC Sidebar -->
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Process Map"
      />

      <!-- Right Main Flowchart Canvas Card -->
      <div class="flex-1 min-w-0 w-full bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        
        <!-- 1. Canvas Top Toolbar Header -->
        <div class="px-4 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          
          <!-- Left: Add Shape Group -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-700">Add Shape:</span>
            
            <!-- Process Shape Button -->
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="addShape('process', 'New Process')"
            >
              <span class="w-3.5 h-2.5 border border-slate-500 rounded-xs inline-block"></span>
              <span>Process</span>
            </button>

            <!-- Decision Shape Button -->
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="addShape('decision', 'Decision')"
            >
              <span class="w-2.5 h-2.5 border border-amber-500 rotate-45 inline-block"></span>
              <span>Decision</span>
            </button>

            <!-- Inspect Shape Button -->
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="addShape('inspect', 'Inspect\nStation')"
            >
              <span class="w-3 h-3 rounded-full border border-blue-500 inline-block"></span>
              <span>Inspect</span>
            </button>

            <!-- More Shapes Dropdown Button -->
            <div class="relative group">
              <button
                type="button"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <UIcon name="i-lucide-sliders-horizontal" class="size-3.5 text-slate-500" />
                <span>More</span>
                <UIcon name="i-lucide-chevron-down" class="size-3 text-slate-400" />
              </button>

              <!-- Dropdown Menu -->
              <div class="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 hidden group-hover:block z-40">
                <button
                  type="button"
                  class="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  @click="addShape('storage', 'Cold\nStorage')"
                >
                  <span class="w-3 h-3 border-b-2 border-purple-500 border-l border-r rotate-180 inline-block"></span>
                  <span>Storage (Triangle)</span>
                </button>
                <button
                  type="button"
                  class="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  @click="addShape('delay', 'Delay / Queue')"
                >
                  <span class="w-3 h-2.5 border border-slate-400 rounded-r-full inline-block"></span>
                  <span>Delay</span>
                </button>
                <button
                  type="button"
                  class="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                  @click="addShape('document', 'SOP Document')"
                >
                  <UIcon name="i-lucide-file-text" class="size-3.5 text-slate-500" />
                  <span>Document</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Center: Title -->
          <div class="text-center">
            <h2 class="text-sm font-bold text-slate-900">Process Map สินค้าไก่ทอด</h2>
          </div>

          <!-- Right: Canvas Action Controls -->
          <div class="flex items-center gap-2">
            <!-- Zoom Out -->
            <button
              type="button"
              class="size-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              title="Zoom Out"
              @click="zoomOut"
            >
              <UIcon name="i-lucide-zoom-out" class="size-4" />
            </button>

            <!-- Zoom In -->
            <button
              type="button"
              class="size-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              title="Zoom In"
              @click="zoomIn"
            >
              <UIcon name="i-lucide-zoom-in" class="size-4" />
            </button>

            <!-- Fit Screen -->
            <button
              type="button"
              class="size-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              title="Fit to Screen"
              @click="resetZoom"
            >
              <UIcon name="i-lucide-scan" class="size-4" />
            </button>

            <!-- Delete Selected -->
            <button
              type="button"
              class="size-8 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
              title="Delete Selected Node"
              @click="deleteSelectedNode"
            >
              <UIcon name="i-lucide-trash-2" class="size-4" />
            </button>

            <!-- Download / Export -->
            <button
              type="button"
              class="size-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              title="Download JSON"
              @click="exportMap"
            >
              <UIcon name="i-lucide-download" class="size-4" />
            </button>

            <!-- Save Button -->
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              :disabled="isSaving"
              @click="saveMap"
            >
              <UIcon :name="isSaving ? 'i-lucide-loader-2' : 'i-lucide-save'" class="size-3.5" :class="isSaving ? 'animate-spin' : ''" />
              <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
            </button>

            <!-- Close Button -->
            <button
              type="button"
              class="size-8 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              title="Close"
              @click="closeCanvas"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>
        </div>

        <!-- 2. CANVAS WORKSPACE (Interactive Flowchart Area) -->
        <div class="relative bg-white min-h-[500px] overflow-auto p-4 flex flex-col justify-between">
          
          <!-- Scalable Canvas Container -->
          <div
            class="transition-transform duration-150 origin-top-left relative"
            :style="{ transform: `scale(${zoomLevel / 100})`, minWidth: '1200px', height: '480px' }"
          >
            <!-- SVG Connectors & Flow Arrows (3-Row S-Curve Layout) -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                  <polygon points="0 0, 7 2.5, 0 5" fill="#64748B" />
                </marker>
                <marker id="arrowhead-active" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                  <polygon points="0 0, 7 2.5, 0 5" fill="#008779" />
                </marker>
              </defs>

              <!-- Row 1: Left to Right lines -->
              <!-- n1 (168, 89) -> n2 (198, 86) -->
              <line x1="168" y1="89" x2="198" y2="86" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n2 (260, 86) -> n3 (288, 86) -->
              <line x1="260" y1="86" x2="288" y2="86" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n3 (348, 86) -> n4 (378, 89) -->
              <line x1="348" y1="86" x2="378" y2="89" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n4 (468, 89) -> n5 (494, 86) -->
              <line x1="468" y1="89" x2="494" y2="86" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n5 (556, 86) -> n6 (584, 86) -->
              <line x1="556" y1="86" x2="584" y2="86" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n6 (644, 86) -> n7 (674, 89) -->
              <line x1="644" y1="86" x2="674" y2="89" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n7 (764, 89) -> n8 (790, 86) -->
              <line x1="764" y1="89" x2="790" y2="86" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n8 (852, 86) -> n9 (880, 86) -->
              <line x1="852" y1="86" x2="880" y2="86" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />

              <!-- Row 1 to Row 2 Corner Turn: n9 (910, 116) -> Down -> Left to n10 (925, 220) -->
              <path d="M 910 116 L 910 168 L 925 168 L 925 220" fill="none" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />

              <!-- Row 2: Right to Left lines -->
              <!-- n10 (880, 236) -> n11 (852, 236) -->
              <line x1="880" y1="236" x2="852" y2="236" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n11 (790, 236) -> n12 (760, 236) -->
              <line x1="790" y1="236" x2="760" y2="236" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n12 (700, 236) -> n13 (675, 239) -->
              <line x1="700" y1="236" x2="675" y2="239" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n13 (590, 239) -> n14 (565, 239) -->
              <line x1="590" y1="239" x2="565" y2="239" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n14 (480, 239) -> n15 (452, 236) -->
              <line x1="480" y1="239" x2="452" y2="236" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n15 (390, 236) -> n16 (360, 236) -->
              <line x1="390" y1="236" x2="360" y2="236" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n16 (300, 236) -> n17 (275, 239) -->
              <line x1="300" y1="236" x2="275" y2="239" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />

              <!-- Row 2 to Row 3 Corner Turn: n17 (221, 258) -> Down to n18 (221, 365) -->
              <path d="M 221 258 L 221 315 L 221 365" fill="none" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />

              <!-- Row 3: Left to Right lines -->
              <!-- n18 (252, 396) -> n19 (280, 396) -->
              <line x1="252" y1="396" x2="280" y2="396" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n19 (340, 396) -> n20 (370, 399) -->
              <line x1="340" y1="396" x2="370" y2="399" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n20 (455, 399) -> n21 (480, 396) -->
              <line x1="455" y1="399" x2="480" y2="396" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n21 (542, 396) -> n22 (570, 396) -->
              <line x1="542" y1="396" x2="570" y2="396" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n22 (630, 396) -> n23 (660, 399) -->
              <line x1="630" y1="396" x2="660" y2="399" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n23 (745, 399) -> n24 (770, 393) -->
              <line x1="745" y1="399" x2="770" y2="393" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n24 (836, 393) -> n25 (866, 396) -->
              <line x1="836" y1="393" x2="866" y2="396" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n25 (926, 396) -> n26 (956, 399) -->
              <line x1="926" y1="396" x2="956" y2="399" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
              <!-- n26 (1046, 399) -> n27 (1080, 394) -->
              <line x1="1046" y1="399" x2="1080" y2="394" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#arrowhead)" />
            </svg>

            <!-- Render Nodes on Canvas -->
            <div
              v-for="node in nodes"
              :key="node.id"
              class="absolute cursor-pointer transition-all flex items-center justify-center text-center font-medium select-none"
              :style="{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width || 85}px`,
                height: `${node.height || 38}px`
              }"
              :class="[
                selectedNode?.id === node.id ? 'ring-2 ring-[#008779] ring-offset-2 scale-105 z-30' : 'hover:shadow-md z-10'
              ]"
              @click="selectNode(node)"
              @dblclick="openNodeEditor(node)"
            >
              <!-- 1. Process Node (Rounded Rectangle) -->
              <div
                v-if="node.type === 'process'"
                class="w-full h-full bg-[#EBF5FF] border border-[#93C5FD] rounded-lg shadow-2xs flex items-center justify-center px-2 py-1 text-[11px] text-[#1E3A8A] font-semibold leading-tight hover:border-blue-400"
              >
                {{ node.name }}
              </div>

              <!-- 2. Inspect Node (Circle) -->
              <div
                v-else-if="node.type === 'inspect'"
                class="w-full h-full bg-[#EBF5FF] border-2 border-[#3B82F6] rounded-full shadow-2xs flex items-center justify-center p-1 text-[10px] text-[#1E3A8A] font-bold leading-tight hover:border-blue-600 whitespace-pre-line"
              >
                {{ node.name }}
              </div>

              <!-- 3. Decision Node (Diamond) -->
              <div
                v-else-if="node.type === 'decision'"
                class="relative w-full h-full flex items-center justify-center"
              >
                <div class="absolute inset-1 bg-[#FEF9C3] border-2 border-[#F59E0B] rotate-45 rounded-sm shadow-2xs hover:border-amber-600"></div>
                <span class="relative z-10 text-[10px] font-bold text-[#92400E] leading-tight">
                  {{ node.name }}
                </span>
              </div>

              <!-- 4. Storage Node (Downward Triangle) -->
              <div
                v-else-if="node.type === 'storage'"
                class="relative w-full h-full flex items-center justify-center"
              >
                <svg viewBox="0 0 100 85" class="w-full h-full drop-shadow-2xs">
                  <polygon points="5,5 95,5 50,80" fill="#F3E8FF" stroke="#A855F7" stroke-width="4" />
                </svg>
                <span class="absolute top-2 z-10 text-[10px] font-bold text-[#6B21A8] leading-tight whitespace-pre-line">
                  {{ node.name }}
                </span>
              </div>

              <!-- Fallback generic shape -->
              <div
                v-else
                class="w-full h-full bg-slate-50 border border-slate-300 rounded p-1 text-[10px] text-slate-800 flex items-center justify-center font-medium"
              >
                {{ node.name }}
              </div>
            </div>

          </div>

          <!-- Bottom Right Floating Mini-Map Navigator (Matching Image) -->
          <div class="absolute bottom-4 right-4 bg-white/95 border border-slate-200 rounded-xl p-2.5 shadow-lg w-40 h-24 hidden sm:flex flex-col justify-between pointer-events-none z-20">
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mini-Map</div>
            <div class="flex-1 flex flex-col justify-around py-1 opacity-70">
              <!-- Mini row 1 -->
              <div class="flex items-center gap-1 justify-between">
                <span class="w-4 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
              </div>
              <!-- Mini row 2 -->
              <div class="flex items-center gap-1 justify-between flex-row-reverse">
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
              </div>
              <!-- Mini row 3 -->
              <div class="flex items-center gap-1 justify-between">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="w-2 h-2 rotate-45 bg-amber-400"></span>
                <span class="w-3 h-1.5 bg-blue-300 rounded-xs"></span>
                <span class="w-2.5 h-2 bg-purple-400 rounded-xs"></span>
              </div>
            </div>
            <div class="text-[8px] text-right text-slate-400">100% View</div>
          </div>
        </div>

        <!-- 3. CANVAS BOTTOM STATUS BAR (Shape Counters & Stats matching Image) -->
        <div class="px-4 py-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <!-- Left: Shape Counters and Total/Active -->
          <div class="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
            
            <!-- Shape count icons list -->
            <div class="flex items-center gap-3 border-r border-slate-200 pr-4 flex-wrap">
              <!-- Rectangle: 10 -->
              <div class="flex items-center gap-1.5">
                <span class="w-3.5 h-2.5 border border-slate-600 rounded-xs inline-block"></span>
                <span class="font-bold text-slate-800">{{ counts.process }}</span>
              </div>

              <!-- Diamond: 8 -->
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 border border-amber-600 rotate-45 inline-block"></span>
                <span class="font-bold text-slate-800">{{ counts.decision }}</span>
              </div>

              <!-- Circle: 9 -->
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full border border-blue-600 inline-block"></span>
                <span class="font-bold text-slate-800">{{ counts.inspect }}</span>
              </div>

              <!-- Pill/Terminator: 0 -->
              <div class="flex items-center gap-1.5 text-slate-400">
                <span class="w-3.5 h-2 rounded-full border border-slate-400 inline-block"></span>
                <span>{{ counts.terminator }}</span>
              </div>

              <!-- Document: 0 -->
              <div class="flex items-center gap-1.5 text-slate-400">
                <UIcon name="i-lucide-file-text" class="size-3" />
                <span>{{ counts.document }}</span>
              </div>

              <!-- Database: 0 -->
              <div class="flex items-center gap-1.5 text-slate-400">
                <UIcon name="i-lucide-database" class="size-3" />
                <span>{{ counts.data }}</span>
              </div>

              <!-- Parallelogram: 0 -->
              <div class="flex items-center gap-1.5 text-slate-400">
                <span class="w-3.5 h-2.5 border border-slate-400 -skew-x-12 inline-block"></span>
                <span>{{ counts.io }}</span>
              </div>

              <!-- Hexagon: 0 -->
              <div class="flex items-center gap-1.5 text-slate-400">
                <UIcon name="i-lucide-hexagon" class="size-3" />
                <span>{{ counts.prep }}</span>
              </div>

              <!-- Delay (D-shape): 0 -->
              <div class="flex items-center gap-1.5 text-slate-400">
                <span class="w-3 h-2.5 border border-slate-400 rounded-r-full inline-block"></span>
                <span>{{ counts.delay }}</span>
              </div>

              <!-- Text T: 0 -->
              <div class="flex items-center gap-1 text-slate-400">
                <span class="font-bold text-[11px]">T</span>
                <span>{{ counts.text }}</span>
              </div>

              <!-- Storage (Triangle): 1 -->
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 border-b border-l border-r border-purple-600 rotate-180 inline-block"></span>
                <span class="font-bold text-slate-800">{{ counts.storage }}</span>
              </div>
            </div>

            <!-- Stats: Total & Active -->
            <div class="flex items-center gap-3">
              <div>Total: <strong class="text-slate-900 font-bold">{{ totalNodesCount }}</strong></div>
              <div>Active: <strong class="text-slate-900 font-bold">{{ activeNodesCount }}</strong></div>
            </div>
          </div>

          <!-- Right: View & Help Action Buttons -->
          <div class="flex items-center gap-2">
            <!-- View Mode Button (Peach/Soft orange button matching image) -->
            <button
              type="button"
              class="bg-[#FDE8D0] hover:bg-[#FCD8B8] text-[#9A3412] text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="isViewDetailsOpen = true"
            >
              <UIcon name="i-lucide-eye" class="size-3.5 text-[#EA580C]" />
              <span>View</span>
            </button>

            <!-- Help Button (Teal button matching image) -->
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="isHelpModalOpen = true"
            >
              <UIcon name="i-lucide-help-circle" class="size-3.5" />
              <span>Help</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Node Detail / Edit Modal -->
    <div
      v-if="isEditModalOpen && selectedNode"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-2">
            <span class="size-3 rounded-full bg-[#008779]"></span>
            <h3 class="text-sm font-bold text-slate-900">แก้ไขข้อมูล Process Node</h3>
          </div>
          <button type="button" class="text-slate-400 hover:text-slate-600 p-1" @click="isEditModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-5 space-y-4 text-xs">
          <div>
            <label class="font-bold text-slate-700 block mb-1">ชื่อขั้นตอน (Node Label):</label>
            <textarea
              v-model="selectedNode.name"
              rows="2"
              class="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-slate-700 block mb-1">ประเภท (Shape Type):</label>
              <select
                v-model="selectedNode.type"
                class="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
              >
                <option value="process">Process (สี่เหลี่ยม)</option>
                <option value="inspect">Inspect (วงกลม)</option>
                <option value="decision">Decision (สี่เหลี่ยมขนมเปียกปูน)</option>
                <option value="storage">Storage (สามเหลี่ยม)</option>
                <option value="delay">Delay (ตัว D)</option>
                <option value="document">Document (เอกสาร)</option>
              </select>
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">แถว (Row Sequence):</label>
              <input
                v-model.number="selectedNode.row"
                type="number"
                min="1"
                max="3"
                class="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-[#008779]"
              />
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            @click="isEditModalOpen = false"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            @click="saveNodeEdit"
          >
            บันทึกการแก้ไข
          </button>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div
      v-if="isHelpModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UIcon name="i-lucide-help-circle" class="size-5 text-[#008779]" />
            <span>คำแนะนำการใช้งาน Process Map Canvas</span>
          </h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="isHelpModalOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>• <strong>Add Shape:</strong> กดปุ่มด้านบนเพื่อเพิ่มขั้นตอนใหม่ เช่น Process, Decision, Inspect</p>
          <p>• <strong>ดับเบิลคลิกที่ Node:</strong> เพื่อแก้ไขชื่อหรือประเภทของขั้นตอนนั้น</p>
          <p>• <strong>Zoom & Save:</strong> ใช้ปุ่มแว่นขยายขวาบนเพื่อย่อ/ขยาย และกดบันทึกเพื่ออัปเดตข้อมูล</p>
          <p>• <strong>28 Nodes Flow:</strong> แสดงผังกระบวนการผลิตสินค้าไก่ทอดตั้งแต่รับวัตถุดิบจนถึงจัดเก็บในคลังสินค้า</p>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="button"
            class="bg-[#008779] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            @click="isHelpModalOpen = false"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>

    <!-- View Details Modal -->
    <div
      v-if="isViewDetailsOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UIcon name="i-lucide-layers" class="size-5 text-[#008779]" />
            <span>รายละเอียดขั้นตอน Process Map ทั้งหมด (28 ขั้นตอน)</span>
          </h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="isViewDetailsOpen = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="divide-y divide-slate-100 text-xs">
          <div v-for="(n, idx) in nodes" :key="n.id" class="py-2 flex items-center justify-between gap-4">
            <div class="flex items-center gap-2.5">
              <span class="w-6 text-slate-400 font-mono text-[11px]">{{ idx + 1 }}.</span>
              <span class="font-bold text-slate-800">{{ n.name.replace('\n', ' ') }}</span>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="{
                'bg-blue-100 text-blue-800': n.type === 'process' || n.type === 'inspect',
                'bg-amber-100 text-amber-800': n.type === 'decision',
                'bg-purple-100 text-purple-800': n.type === 'storage'
              }"
            >
              {{ n.type }}
            </span>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="button"
            class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            @click="isViewDetailsOpen = false"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
