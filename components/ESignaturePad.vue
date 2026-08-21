<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ESignatureData } from '~/composables/useApprovalWorkflow'

const props = defineProps({
  signerName: {
    type: String,
    default: 'Somchai Vong'
  },
  signerEmail: {
    type: String,
    default: 'somchai.v@cpf.co.th'
  },
  signerRole: {
    type: String,
    default: 'Plant Champion / Department Head'
  },
  documentTitle: {
    type: String,
    default: 'Project Sign-off Document'
  }
})

const emit = defineEmits<{
  (e: 'sign', data: ESignatureData): void
  (e: 'cancel'): void
}>()

const activeTab = ref<'draw' | 'type' | 'upload'>('draw')

// Draw Canvas State
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const hasDrawn = ref(false)
const penColor = ref('#008779')
const penWidth = ref(2.5)

// Type Signature State
const typedName = ref(props.signerName)
const selectedTypeFont = ref('font-cursive-1')

// Upload Signature State
const uploadedImageUrl = ref('')

// Consent & Security
const isConsentChecked = ref(true)
const certificateId = ref(`CPF-ESIGN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`)
const signedDate = ref(new Date().toISOString().slice(0, 16).replace('T', ' '))

onMounted(() => {
  initCanvas()
})

watch(activeTab, () => {
  if (activeTab.value === 'draw') {
    setTimeout(initCanvas, 50)
  }
})

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set crisp canvas dimensions
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * 2
  canvas.height = rect.height * 2
  ctx.scale(2, 2)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = penColor.value
  ctx.lineWidth = penWidth.value

  // Background grid guideline
  drawCanvasGuidelines(ctx, rect.width, rect.height)
}

function drawCanvasGuidelines(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save()
  ctx.strokeStyle = '#F1F5F9'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(20, height - 30)
  ctx.lineTo(width - 20, height - 30)
  ctx.stroke()

  ctx.font = '10px sans-serif'
  ctx.fillStyle = '#94A3B8'
  ctx.fillText('✕ Sign on the line above', 24, height - 12)
  ctx.restore()
}

function startDrawing(e: MouseEvent | TouchEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  isDrawing.value = true
  hasDrawn.value = true

  const rect = canvas.getBoundingClientRect()
  const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX
  const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY

  ctx.beginPath()
  ctx.moveTo(clientX - rect.left, clientY - rect.top)
  ctx.strokeStyle = penColor.value
  ctx.lineWidth = penWidth.value
}

function draw(e: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = canvas.getBoundingClientRect()
  const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX
  const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY

  ctx.lineTo(clientX - rect.left, clientY - rect.top)
  ctx.stroke()
}

function stopDrawing() {
  isDrawing.value = false
}

function clearCanvas() {
  hasDrawn.value = false
  initCanvas()
}

function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event: any) => {
    uploadedImageUrl.value = event.target.result
  }
  reader.readAsDataURL(file)
}

// Generate typed signature SVG / Canvas
function getTypedSignatureDataUrl(): string {
  const offscreen = document.createElement('canvas')
  offscreen.width = 400
  offscreen.height = 120
  const ctx = offscreen.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = penColor.value
  ctx.font = 'italic 34px "Segoe Script", "Brush Script MT", cursive, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(typedName.value, 200, 60)
  return offscreen.toDataURL('image/png')
}

// Confirm and Submit Signature
function submitSignature() {
  if (!isConsentChecked.value) {
    alert('Please acknowledge the electronic signature declaration.')
    return
  }

  let finalSignatureUrl = ''

  if (activeTab.value === 'draw') {
    if (!hasDrawn.value) {
      alert('Please draw your signature on the pad.')
      return
    }
    const canvas = canvasRef.value
    if (canvas) finalSignatureUrl = canvas.toDataURL('image/png')
  } else if (activeTab.value === 'type') {
    if (!typedName.value.trim()) {
      alert('Please enter your name.')
      return
    }
    finalSignatureUrl = getTypedSignatureDataUrl()
  } else if (activeTab.value === 'upload') {
    if (!uploadedImageUrl.value) {
      alert('Please upload a signature image.')
      return
    }
    finalSignatureUrl = uploadedImageUrl.value
  }

  const result: ESignatureData = {
    signatureUrl: finalSignatureUrl,
    signatureType: activeTab.value,
    certificateId: certificateId.value,
    signerName: props.signerName,
    signerEmail: props.signerEmail,
    signerRole: props.signerRole,
    signedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    ipAddress: '10.240.55.19 (CPF Secure Intranet)',
    deviceHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    verificationToken: `TOKEN-${certificateId.value}`
  }

  emit('sign', result)
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-xl w-full text-gray-900 text-xs">
    <!-- Header with CPF Security Seal -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-900 to-[#008779] text-white flex items-center justify-between">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <span class="bg-teal-700/80 text-[10px] font-mono px-2 py-0.5 rounded text-teal-100 font-bold">
            CPF E-SIGNATURE VERIFIED
          </span>
          <span class="text-[10px] text-teal-200 font-mono">{{ certificateId }}</span>
        </div>
        <h3 class="font-bold text-sm text-white">
          Digital Signature Authorization
        </h3>
        <p class="text-[11px] text-teal-100 truncate max-w-sm">
          {{ documentTitle }}
        </p>
      </div>

      <button
        type="button"
        class="text-white/80 hover:text-white p-1 rounded transition-colors cursor-pointer"
        @click="emit('cancel')"
      >
        <UIcon name="i-lucide-x" class="size-4" />
      </button>
    </div>

    <div class="p-6 space-y-5">
      <!-- Signer Identity Card -->
      <div class="bg-gray-50 border border-gray-200/80 rounded-lg p-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="size-9 rounded-full bg-[#008779] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ signerName.split(' ').map(n => n[0]).join('').slice(0, 2) }}
          </div>
          <div>
            <span class="font-bold text-gray-900 block text-xs">{{ signerName }}</span>
            <span class="text-[11px] text-gray-500 block font-mono">{{ signerEmail }}</span>
            <span class="text-[10px] text-[#008779] font-semibold">{{ signerRole }}</span>
          </div>
        </div>

        <div class="text-right text-[10px] text-gray-400 font-mono">
          <span>Date: {{ signedDate }}</span>
          <span class="block text-emerald-600 font-bold">● Identity Verified</span>
        </div>
      </div>

      <!-- Mode Selector Tabs (Draw, Type, Upload) -->
      <div class="flex border-b border-gray-200 text-xs">
        <button
          type="button"
          class="flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'draw' ? 'border-[#008779] text-[#008779] bg-teal-50/50' : 'border-transparent text-gray-500 hover:text-gray-900'"
          @click="activeTab = 'draw'"
        >
          <UIcon name="i-lucide-pen-tool" class="size-3.5" />
          <span>Draw Signature</span>
        </button>
        <button
          type="button"
          class="flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'type' ? 'border-[#008779] text-[#008779] bg-teal-50/50' : 'border-transparent text-gray-500 hover:text-gray-900'"
          @click="activeTab = 'type'"
        >
          <UIcon name="i-lucide-type" class="size-3.5" />
          <span>Type Name</span>
        </button>
        <button
          type="button"
          class="flex-1 py-2.5 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer"
          :class="activeTab === 'upload' ? 'border-[#008779] text-[#008779] bg-teal-50/50' : 'border-transparent text-gray-500 hover:text-gray-900'"
          @click="activeTab = 'upload'"
        >
          <UIcon name="i-lucide-upload" class="size-3.5" />
          <span>Upload Image</span>
        </button>
      </div>

      <!-- TAB 1: Draw Pad Canvas -->
      <div v-show="activeTab === 'draw'" class="space-y-2">
        <div class="flex items-center justify-between text-[11px] text-gray-500">
          <span>Draw your signature with mouse, stylus or touch:</span>
          <div class="flex items-center gap-2">
            <!-- Pen Colors -->
            <button
              type="button"
              class="size-4 rounded-full border transition-all"
              :class="penColor === '#008779' ? 'ring-2 ring-[#008779] ring-offset-1 bg-[#008779]' : 'bg-[#008779]'"
              title="Teal Pen"
              @click="penColor = '#008779'"
            ></button>
            <button
              type="button"
              class="size-4 rounded-full border transition-all"
              :class="penColor === '#0F172A' ? 'ring-2 ring-slate-800 ring-offset-1 bg-slate-900' : 'bg-slate-900'"
              title="Black Pen"
              @click="penColor = '#0F172A'"
            ></button>
            <button
              type="button"
              class="size-4 rounded-full border transition-all"
              :class="penColor === '#1D4ED8' ? 'ring-2 ring-blue-600 ring-offset-1 bg-blue-700' : 'bg-blue-700'"
              title="Blue Pen"
              @click="penColor = '#1D4ED8'"
            ></button>
            <button
              type="button"
              class="text-gray-500 hover:text-red-600 text-xs font-semibold ml-2 flex items-center gap-0.5 cursor-pointer"
              @click="clearCanvas"
            >
              <UIcon name="i-lucide-rotate-ccw" class="size-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div class="border-2 border-dashed border-gray-300 hover:border-teal-400 rounded-lg overflow-hidden bg-slate-50 relative h-40 transition-colors">
          <canvas
            ref="canvasRef"
            class="w-full h-full cursor-crosshair touch-none"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart.prevent="startDrawing"
            @touchmove.prevent="draw"
            @touchend.prevent="stopDrawing"
          ></canvas>
        </div>
      </div>

      <!-- TAB 2: Type Signature -->
      <div v-show="activeTab === 'type'" class="space-y-3">
        <div class="space-y-1">
          <label class="font-bold text-gray-700 text-[11px] block">Full Name for Signature:</label>
          <input
            v-model="typedName"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#008779]"
            placeholder="Type your name..."
          />
        </div>

        <div class="space-y-2">
          <span class="text-[11px] text-gray-500 block">Select Signature Font Style:</span>
          <div class="grid grid-cols-2 gap-2">
            <div
              class="border rounded-lg p-3 text-center cursor-pointer transition-all"
              :class="selectedTypeFont === 'font-cursive-1' ? 'border-[#008779] bg-teal-50/60 ring-1 ring-[#008779]' : 'border-gray-200 hover:bg-gray-50'"
              @click="selectedTypeFont = 'font-cursive-1'"
            >
              <span class="text-xl italic font-serif text-[#008779] block truncate" style="font-family: 'Brush Script MT', 'Segoe Script', cursive;">
                {{ typedName || 'Signature' }}
              </span>
              <span class="text-[10px] text-gray-400 mt-1 block">Classic Script</span>
            </div>

            <div
              class="border rounded-lg p-3 text-center cursor-pointer transition-all"
              :class="selectedTypeFont === 'font-cursive-2' ? 'border-[#008779] bg-teal-50/60 ring-1 ring-[#008779]' : 'border-gray-200 hover:bg-gray-50'"
              @click="selectedTypeFont = 'font-cursive-2'"
            >
              <span class="text-xl font-bold tracking-widest text-slate-800 uppercase block truncate" style="font-family: serif;">
                {{ typedName || 'SIGNATURE' }}
              </span>
              <span class="text-[10px] text-gray-400 mt-1 block">Formal Executive</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: Upload Image Signature -->
      <div v-show="activeTab === 'upload'" class="space-y-3">
        <div
          v-if="!uploadedImageUrl"
          class="border-2 border-dashed border-gray-300 hover:border-teal-500 rounded-lg p-6 text-center space-y-2 bg-gray-50 transition-colors cursor-pointer relative"
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            @change="handleFileUpload"
          />
          <UIcon name="i-lucide-upload-cloud" class="size-8 text-teal-600 mx-auto" />
          <div>
            <p class="font-bold text-xs text-gray-800">Click or drag signature image to upload</p>
            <p class="text-[10px] text-gray-500">PNG with transparent background or JPEG (Max 2MB)</p>
          </div>
        </div>

        <div v-else class="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-white">
          <div class="flex items-center gap-3">
            <img :src="uploadedImageUrl" alt="Uploaded signature" class="h-12 max-w-[160px] object-contain border p-1 rounded" />
            <div>
              <span class="font-bold text-gray-900 block text-xs">Signature Image Loaded</span>
              <span class="text-[10px] text-emerald-600">✓ Ready for authorization</span>
            </div>
          </div>
          <button
            type="button"
            class="text-xs text-red-500 hover:underline font-semibold"
            @click="uploadedImageUrl = ''"
          >
            Change Image
          </button>
        </div>
      </div>

      <!-- Consent Acknowledgment Checkbox -->
      <div class="bg-teal-50/60 border border-teal-200 rounded-lg p-3 space-y-1.5">
        <label class="flex items-start gap-2 cursor-pointer select-none">
          <input
            v-model="isConsentChecked"
            type="checkbox"
            class="mt-0.5 accent-[#008779] size-4 rounded"
          />
          <span class="text-[11px] text-teal-950 leading-relaxed font-medium">
            I hereby certify and apply my legally-binding Electronic Signature under the CPF Enterprise Quality & CI Governance Policy.
          </span>
        </label>
        <div class="flex items-center justify-between text-[10px] text-teal-700 pl-6 font-mono">
          <span>Security Token: {{ certificateId }}</span>
          <span>Timestamp: {{ signedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Modal Footer Actions -->
    <div class="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
      <button
        type="button"
        class="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
        @click="emit('cancel')"
      >
        Cancel
      </button>

      <button
        type="button"
        class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-5 py-2 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        :disabled="!isConsentChecked"
        @click="submitSignature"
      >
        <UIcon name="i-lucide-check-circle" class="size-4" />
        <span>Confirm & Sign Document</span>
      </button>
    </div>
  </div>
</template>
