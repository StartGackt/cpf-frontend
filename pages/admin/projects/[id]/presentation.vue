<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { exportPresentationToPptx, type PresentationSlide, type SlideWidget } from '~/utils/pptxExport'
import { getDefaultSlides, SLIDE_TEMPLATES } from '~/utils/defaultSlides'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'
const projectName = 'Example เพิ่ม %Total Yield สินค้าไก่ทอด — โรงงานแปรรูปโชคชัย'

const STORAGE_KEY = `cpf_presentation_slides_${projectId}`

const fallbackSlide: PresentationSlide = {
  id: 1,
  title: '1. Executive Summary & Project Charter (PCR/PFR)',
  subtitle: 'Example เพิ่ม %Total Yield สินค้าไก่ทอด — โรงงานแปรรูปโชคชัย',
  headerTitle: 'INSIGHTGENIE SIX SIGMA PRESENTATION',
  headerSubtitle: 'CPF Digital Transformation & Quality Excellence',
  badge: 'Black Belt Certified Project',
  date: 'Feb 2026',
  footerText: 'Confidential — Internal CPF Six Sigma Documentation',
  layout: '2-col',
  widgets: []
}

// State
const slides = ref<PresentationSlide[]>([])
const currentSlideIndex = ref(0)
const isFullscreen = ref(false)
const isEditMode = ref(false)
const isPaletteOpen = ref(false)
const isAddSlideModalOpen = ref(false)
const isDownloadMenuOpen = ref(false)
const isFilmstripOpen = ref(true)
const isExporting = ref(false)
const exportProgressText = ref('')
const toastMessage = ref('')
let toastTimer: any = null

const slideCanvasRef = ref<HTMLElement | null>(null)

// Initialize Slides from LocalStorage or Default
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        slides.value = JSON.parse(saved)
      } else {
        slides.value = getDefaultSlides()
      }
    } catch (e) {
      console.warn('Failed to load saved slides, using defaults:', e)
      slides.value = getDefaultSlides()
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})

// Auto-save changes to localStorage
const saveSlides = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slides.value))
    } catch (e) {
      console.error('Failed to save slides:', e)
    }
  }
}

const showToast = (msg: string) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const currentSlide = computed<PresentationSlide>(() => {
  if (!slides.value.length) {
    const defaults = getDefaultSlides()
    return defaults[0] ?? fallbackSlide
  }
  const idx = Math.min(Math.max(0, currentSlideIndex.value), slides.value.length - 1)
  return slides.value[idx] ?? getDefaultSlides()[0] ?? fallbackSlide
})

// Navigation
const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

const nextSlide = () => {
  if (currentSlideIndex.value < slides.value.length - 1) {
    currentSlideIndex.value++
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < slides.value.length) {
    currentSlideIndex.value = index
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ignore if user is typing in an input or textarea
  const target = e.target as HTMLElement
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return
  }

  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    if (e.key === ' ') e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevSlide()
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen()
  } else if (e.key === 'e' || e.key === 'E') {
    isEditMode.value = !isEditMode.value
  } else if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

// Slide Management
const addSlideFromTemplate = (template: typeof SLIDE_TEMPLATES[0]) => {
  const newSlide = template.slide()
  newSlide.id = Date.now()
  slides.value.splice(currentSlideIndex.value + 1, 0, newSlide)
  currentSlideIndex.value++
  isAddSlideModalOpen.value = false
  saveSlides()
  showToast(`Added new slide: "${newSlide.title}"`)
}

const duplicateCurrentSlide = () => {
  const current = currentSlide.value
  const cloned: PresentationSlide = JSON.parse(JSON.stringify(current))
  cloned.id = Date.now()
  cloned.title = `${cloned.title} (Copy)`
  slides.value.splice(currentSlideIndex.value + 1, 0, cloned)
  currentSlideIndex.value++
  saveSlides()
  showToast('Slide duplicated successfully')
}

const deleteCurrentSlide = () => {
  if (slides.value.length <= 1) {
    alert('A presentation must have at least 1 slide.')
    return
  }
  if (confirm(`Are you sure you want to delete Slide ${currentSlideIndex.value + 1}?`)) {
    slides.value.splice(currentSlideIndex.value, 1)
    if (currentSlideIndex.value >= slides.value.length) {
      currentSlideIndex.value = slides.value.length - 1
    }
    saveSlides()
    showToast('Slide deleted')
  }
}

const moveSlide = (direction: 'left' | 'right') => {
  const idx = currentSlideIndex.value
  if (direction === 'left' && idx > 0) {
    const cur = slides.value[idx]
    const prev = slides.value[idx - 1]
    if (cur && prev) {
      slides.value[idx] = prev
      slides.value[idx - 1] = cur
      currentSlideIndex.value = idx - 1
      saveSlides()
    }
  } else if (direction === 'right' && idx < slides.value.length - 1) {
    const cur = slides.value[idx]
    const next = slides.value[idx + 1]
    if (cur && next) {
      slides.value[idx] = next
      slides.value[idx + 1] = cur
      currentSlideIndex.value = idx + 1
      saveSlides()
    }
  }
}

const resetToDefaultSlides = () => {
  if (confirm('Reset presentation to default Six Sigma slides? All custom edits will be reverted.')) {
    slides.value = getDefaultSlides()
    currentSlideIndex.value = 0
    saveSlides()
    showToast('Reverted to default slides')
  }
}

// Widget Management
const addWidgetToCurrentSlide = (type: SlideWidget['type']) => {
  const cur = currentSlide.value
  if (!cur) return
  if (!cur.widgets) cur.widgets = []

  let newWidget: SlideWidget

  switch (type) {
    case 'key-value':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Project Info & Milestones',
        icon: 'i-lucide-file-text',
        type: 'key-value',
        data: {
          items: [
            { label: 'Key Focus', value: 'Yield Optimization' },
            { label: 'Department', value: 'Production Line 2' },
            { label: 'Target Savings', value: '1,500,000 THB', isHighlight: true }
          ]
        }
      }
      break
    case 'kpi-grid':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Target Metrics & Thresholds',
        icon: 'i-lucide-target',
        type: 'kpi-grid',
        data: {
          kpis: [
            { label: 'CURRENT', value: '84.00%', color: 'red', desc: 'Baseline' },
            { label: 'BENCHMARK', value: '88.50%', color: 'amber', desc: 'Entitlement' },
            { label: 'TARGET', value: '87.50%', color: 'purple', desc: 'Goal' }
          ],
          rule: 'Target aligned with business annual KPI objectives.'
        }
      }
      break
    case 'stat-cards':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Key Results & Financial Impact',
        icon: 'i-lucide-trending-up',
        type: 'stat-cards',
        data: {
          stats: [
            { label: 'YIELD GAIN', value: '+4.20%', color: 'emerald' },
            { label: 'SAVINGS', value: '3.8M THB', color: 'teal' }
          ],
          note: 'Validated by Finance & Operations'
        }
      }
      break
    case 'fmea-table':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Risk Priority (FMEA)',
        icon: 'i-lucide-table',
        type: 'fmea-table',
        data: {
          description: 'Identified root causes and risk ranking:',
          rows: [
            { rank: '#1', cause: 'อุณหภูมิน้ำมันทอดไม่คงที่', s: 7, o: 8, d: 6, rpn: 336 },
            { rank: '#2', cause: 'การปรับความเร็วสายพานลำเลียง', s: 6, o: 5, d: 5, rpn: 150 }
          ]
        }
      }
      break
    case 'process-map':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Process Workflow Mapping',
        icon: 'i-lucide-git-merge',
        type: 'process-map',
        data: {
          description: 'Standard production pipeline nodes:',
          stages: [
            { name: 'Preparation', active: false },
            { name: 'Processing', active: true },
            { name: 'Quality Check', active: true },
            { name: 'Packaging', active: false }
          ],
          note: 'Critical controls active in Processing & QA.'
        }
      }
      break
    case 'hypothesis':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Statistical Hypothesis Test',
        icon: 'i-lucide-test-tube',
        type: 'hypothesis',
        data: {
          description: '2-Sample T-Test comparing Before vs After:',
          pValueText: 'P-Value = 0.001 (Significant at 95% Confidence)',
          conclusion: '✓ Null Hypothesis Rejected: Significant improvement confirmed.',
          isSignificant: true
        }
      }
      break
    case 'doe-settings':
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'DOE Optimization Parameters',
        icon: 'i-lucide-box',
        type: 'doe-settings',
        data: {
          description: 'Optimal response surface settings:',
          formula: 'Optimum Parameter Lock: Speed 42Hz, Temp 175°C',
          parameters: [
            { name: 'Speed', val: '42 Hz' },
            { name: 'Temperature', val: '175°C' }
          ]
        }
      }
      break
    case 'text-bullets':
    default:
      newWidget = {
        id: `w-${Date.now()}`,
        title: 'Key Insights & Action Items',
        icon: 'i-lucide-list',
        type: 'text-bullets',
        data: {
          description: 'Summary of findings and next steps:',
          bullets: [
            'Standardize machine setup across all 3 shifts',
            'Conduct weekly QA parameter auditing',
            'Review yield trends monthly with leadership'
          ]
        }
      }
      break
  }

  cur.widgets.push(newWidget)
  saveSlides()
  showToast(`Added "${newWidget.title}" card`)
}

const deleteWidget = (widgetIndex: number) => {
  if (!currentSlide.value?.widgets) return
  if (confirm('Delete this card from the slide?')) {
    currentSlide.value.widgets.splice(widgetIndex, 1)
    saveSlides()
    showToast('Card removed')
  }
}

const moveWidget = (fromIdx: number, toIdx: number) => {
  const widgets = currentSlide.value?.widgets
  if (widgets && toIdx >= 0 && toIdx < widgets.length) {
    const fromItem = widgets[fromIdx]
    const toItem = widgets[toIdx]
    if (fromItem && toItem) {
      widgets[fromIdx] = toItem
      widgets[toIdx] = fromItem
      saveSlides()
    }
  }
}

// Download & Export Handlers
const downloadPptx = async () => {
  try {
    isExporting.value = true
    exportProgressText.value = 'Creating 16:9 PowerPoint presentation...'
    isDownloadMenuOpen.value = false

    const filename = `CPF_SixSigma_${projectId}_${new Date().toISOString().slice(0, 10)}.pptx`
    await exportPresentationToPptx(slides.value, projectName, filename)

    showToast('PowerPoint presentation downloaded successfully!')
  } catch (error) {
    console.error('Error downloading PPTX:', error)
    alert('Failed to generate PowerPoint file: ' + (error as Error).message)
  } finally {
    isExporting.value = false
    exportProgressText.value = ''
  }
}

const downloadCurrentSlidePng = async () => {
  if (!slideCanvasRef.value) return

  try {
    isExporting.value = true
    exportProgressText.value = 'Rendering slide to high-res PNG image...'
    isDownloadMenuOpen.value = false

    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(slideCanvasRef.value, {
      scale: 2, // High DPI resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    const link = document.createElement('a')
    const slug = (currentSlide.value?.title || 'slide').replace(/[^a-zA-Z0-9ก-๙]/g, '_').slice(0, 30)
    link.download = `Slide_${currentSlideIndex.value + 1}_${slug}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    showToast(`Slide ${currentSlideIndex.value + 1} PNG downloaded!`)
  } catch (error) {
    console.error('Error exporting PNG:', error)
    alert('Failed to generate image: ' + (error as Error).message)
  } finally {
    isExporting.value = false
    exportProgressText.value = ''
  }
}

const downloadAllSlidesPng = async () => {
  try {
    isExporting.value = true
    isDownloadMenuOpen.value = false
    const html2canvas = (await import('html2canvas')).default

    const originalIdx = currentSlideIndex.value

    for (let i = 0; i < slides.value.length; i++) {
      currentSlideIndex.value = i
      exportProgressText.value = `Exporting Slide ${i + 1} of ${slides.value.length}...`
      await nextTick()
      // Brief pause to allow DOM re-render
      await new Promise(r => setTimeout(r, 200))

      if (slideCanvasRef.value) {
        const canvas = await html2canvas(slideCanvasRef.value, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        })

        const link = document.createElement('a')
        const slide = slides.value[i]
        const title = slide?.title || `Slide_${i + 1}`
        const slug = title.replace(/[^a-zA-Z0-9ก-๙]/g, '_').slice(0, 25)
        link.download = `Slide_${i + 1}_${slug}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    }

    currentSlideIndex.value = originalIdx
    showToast(`Downloaded all ${slides.value.length} slides as PNG images!`)
  } catch (error) {
    console.error('Error exporting all slides:', error)
    alert('Failed to export all slides: ' + (error as Error).message)
  } finally {
    isExporting.value = false
    exportProgressText.value = ''
  }
}

const printOrPdf = () => {
  isDownloadMenuOpen.value = false
  if (typeof window !== 'undefined') {
    window.print()
  }
}

const exportJsonBackup = () => {
  isDownloadMenuOpen.value = false
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(slides.value, null, 2))
  const link = document.createElement('a')
  link.setAttribute('href', dataStr)
  link.setAttribute('download', `CPF_Slides_Backup_${projectId}.json`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  showToast('Presentation JSON backup downloaded')
}

const importJsonBackup = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event: any) => {
      try {
        const imported = JSON.parse(event.target.result)
        if (Array.isArray(imported) && imported.length > 0) {
          slides.value = imported
          currentSlideIndex.value = 0
          saveSlides()
          showToast('Presentation imported successfully!')
        } else {
          alert('Invalid presentation JSON file format.')
        }
      } catch (err) {
        alert('Failed to read JSON file.')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Toast Feedback Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Exporting Loading Overlay -->
    <div
      v-if="isExporting"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-4"
    >
      <div class="size-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
      <p class="text-sm font-bold tracking-wide">{{ exportProgressText }}</p>
      <span class="text-xs text-gray-400">Please wait a moment...</span>
    </div>

    <!-- Breadcrumbs (hidden in fullscreen & print) -->
    <div v-if="!isFullscreen" class="flex items-center justify-between text-xs text-gray-500 pb-1 print:hidden">
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
          <UIcon name="i-lucide-home" class="size-3.5" />
          <span>Home</span>
        </NuxtLink>
        <span>›</span>
        <NuxtLink to="/admin/projects" class="hover:text-[#008779]">
          Projects
        </NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[200px]">
          Example เพิ่ม %Total Yield สินค้าไก่ทอด
        </NuxtLink>
        <span>›</span>
        <span class="text-gray-900 font-bold">Presentation Mode & Slide Builder</span>
      </div>

      <!-- Quick mode info indicator -->
      <div class="flex items-center gap-2">
        <span v-if="isEditMode" class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          <UIcon name="i-lucide-edit-3" class="size-3" />
          <span>Edit Mode Active (Changes Auto-Saved)</span>
        </span>
      </div>
    </div>

    <!-- Presentation Canvas & Controls Container -->
    <div
      class="bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all print:border-none print:shadow-none print:bg-white print:rounded-none"
      :class="isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'border border-gray-800 min-h-[760px]'"
    >
      <!-- Top Slide Presentation Toolbar (Hidden in Print) -->
      <div class="bg-gray-800/95 backdrop-blur-md px-5 py-2.5 border-b border-gray-700/80 flex items-center justify-between text-white text-xs print:hidden">
        <!-- Left: Mac-style dots + Slide Title header -->
        <div class="flex items-center gap-3 min-w-0 max-w-[45%]">
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="size-2.5 rounded-full bg-red-500/90"></span>
            <span class="size-2.5 rounded-full bg-amber-500/90"></span>
            <span class="size-2.5 rounded-full bg-emerald-500/90"></span>
          </div>

          <div class="border-l border-gray-700 pl-3 min-w-0">
            <template v-if="!isEditMode">
              <span class="font-bold text-xs text-gray-100 block truncate">{{ currentSlide.title }}</span>
              <span class="text-[10px] text-gray-400 block truncate">{{ currentSlide.subtitle }}</span>
            </template>
            <template v-else>
              <input
                v-model="currentSlide.title"
                type="text"
                class="bg-gray-700/80 border border-teal-500/60 rounded px-2 py-0.5 text-xs text-white w-full font-bold focus:outline-hidden focus:border-teal-400 mb-0.5"
                placeholder="Slide Title..."
                @input="saveSlides"
              />
              <input
                v-model="currentSlide.subtitle"
                type="text"
                class="bg-gray-700/80 border border-gray-600 rounded px-2 py-0.5 text-[10px] text-gray-300 w-full focus:outline-hidden focus:border-teal-400"
                placeholder="Slide Subtitle..."
                @input="saveSlides"
              />
            </template>
          </div>
        </div>

        <!-- Right Controls: Slide Counter, Edit Toggle, Downloads, Report, Fullscreen -->
        <div class="flex items-center gap-2">
          <!-- Slide Counter & Arrows -->
          <div class="bg-gray-700/70 px-2.5 py-1.5 rounded-md font-mono text-gray-300 font-bold text-xs flex items-center gap-2">
            <button
              type="button"
              class="hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
              :disabled="currentSlideIndex === 0"
              title="Previous Slide (← / PageUp)"
              @click="prevSlide"
            >
              <UIcon name="i-lucide-chevron-left" class="size-3.5" />
            </button>
            <span class="text-[11px] select-none">Slide {{ currentSlideIndex + 1 }} / {{ slides.length }}</span>
            <button
              type="button"
              class="hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
              :disabled="currentSlideIndex === slides.length - 1"
              title="Next Slide (→ / PageDown)"
              @click="nextSlide"
            >
              <UIcon name="i-lucide-chevron-right" class="size-3.5" />
            </button>
          </div>

          <!-- Edit Mode Toggle ("แก้ไขสไลด์") -->
          <button
            type="button"
            class="px-3 py-1.5 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            :class="isEditMode ? 'bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'"
            :title="isEditMode ? 'Exit Edit Mode' : 'Toggle Edit Mode to customize texts and cards'"
            @click="isEditMode = !isEditMode"
          >
            <UIcon :name="isEditMode ? 'i-lucide-check' : 'i-lucide-edit-3'" class="size-3.5" />
            <span>{{ isEditMode ? 'Done Editing' : 'Edit Slide' }}</span>
          </button>

          <!-- Add Widget Palette Toggle (Shown in Edit Mode) -->
          <button
            v-if="isEditMode"
            type="button"
            class="px-3 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            :class="isPaletteOpen ? 'bg-[#008779] text-white' : 'bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-teal-700'"
            @click="isPaletteOpen = !isPaletteOpen"
          >
            <UIcon name="i-lucide-plus-circle" class="size-3.5" />
            <span>+ Add Card</span>
          </button>

          <!-- Slide Action Dropdown (Add / Duplicate / Delete / Reorder) -->
          <div v-if="isEditMode" class="flex items-center gap-1 bg-gray-700/60 p-0.5 rounded-md border border-gray-600">
            <button
              type="button"
              class="p-1 text-gray-300 hover:text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
              title="Add New Slide"
              @click="isAddSlideModalOpen = true"
            >
              <UIcon name="i-lucide-plus" class="size-3.5" />
            </button>
            <button
              type="button"
              class="p-1 text-gray-300 hover:text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
              title="Duplicate Current Slide"
              @click="duplicateCurrentSlide"
            >
              <UIcon name="i-lucide-copy" class="size-3.5" />
            </button>
            <button
              type="button"
              class="p-1 text-gray-300 hover:text-white rounded hover:bg-gray-600 disabled:opacity-30 transition-colors cursor-pointer"
              :disabled="currentSlideIndex === 0"
              title="Move Slide Left"
              @click="moveSlide('left')"
            >
              <UIcon name="i-lucide-arrow-left" class="size-3.5" />
            </button>
            <button
              type="button"
              class="p-1 text-gray-300 hover:text-white rounded hover:bg-gray-600 disabled:opacity-30 transition-colors cursor-pointer"
              :disabled="currentSlideIndex === slides.length - 1"
              title="Move Slide Right"
              @click="moveSlide('right')"
            >
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </button>
            <button
              type="button"
              class="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-950/50 transition-colors cursor-pointer"
              title="Delete Slide"
              @click="deleteCurrentSlide"
            >
              <UIcon name="i-lucide-trash-2" class="size-3.5" />
            </button>
          </div>

          <!-- Download & Export Dropdown Menu ("ดาวโหลดได้") -->
          <div class="relative">
            <button
              type="button"
              class="bg-[#008779] hover:bg-[#007366] text-white px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              @click="isDownloadMenuOpen = !isDownloadMenuOpen"
            >
              <UIcon name="i-lucide-download" class="size-3.5" />
              <span>Download</span>
              <UIcon name="i-lucide-chevron-down" class="size-3" />
            </button>

            <!-- Dropdown Options -->
            <div
              v-if="isDownloadMenuOpen"
              class="absolute right-0 top-full mt-1.5 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-1 z-50 text-xs text-gray-200 animate-in fade-in zoom-in-95 duration-100"
            >
              <div class="px-2.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                Export & Download Options
              </div>

              <!-- PowerPoint PPTX -->
              <button
                type="button"
                class="w-full text-left px-2.5 py-2 hover:bg-teal-900/60 rounded flex items-center gap-2.5 transition-colors cursor-pointer text-gray-100 font-medium"
                @click="downloadPptx"
              >
                <div class="size-6 rounded bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                  P
                </div>
                <div class="min-w-0">
                  <span class="block font-bold text-gray-100">PowerPoint (.pptx)</span>
                  <span class="block text-[10px] text-gray-400">16:9 Widescreen slides, editable shapes & text</span>
                </div>
              </button>

              <!-- PNG Current Slide -->
              <button
                type="button"
                class="w-full text-left px-2.5 py-2 hover:bg-gray-700/60 rounded flex items-center gap-2.5 transition-colors cursor-pointer text-gray-100 font-medium"
                @click="downloadCurrentSlidePng"
              >
                <UIcon name="i-lucide-image" class="size-4 text-emerald-400 shrink-0" />
                <div class="min-w-0">
                  <span class="block font-bold text-gray-100">PNG Image (Current Slide)</span>
                  <span class="block text-[10px] text-gray-400">High-resolution 2x retina snapshot</span>
                </div>
              </button>

              <!-- PNG All Slides -->
              <button
                type="button"
                class="w-full text-left px-2.5 py-2 hover:bg-gray-700/60 rounded flex items-center gap-2.5 transition-colors cursor-pointer text-gray-100 font-medium"
                @click="downloadAllSlidesPng"
              >
                <UIcon name="i-lucide-images" class="size-4 text-cyan-400 shrink-0" />
                <div class="min-w-0">
                  <span class="block font-bold text-gray-100">PNG Images (All Slides)</span>
                  <span class="block text-[10px] text-gray-400">Batch export each slide as image</span>
                </div>
              </button>

              <!-- PDF / Print -->
              <button
                type="button"
                class="w-full text-left px-2.5 py-2 hover:bg-gray-700/60 rounded flex items-center gap-2.5 transition-colors cursor-pointer text-gray-100 font-medium border-t border-gray-700/60"
                @click="printOrPdf"
              >
                <UIcon name="i-lucide-printer" class="size-4 text-teal-400 shrink-0" />
                <div class="min-w-0">
                  <span class="block font-bold text-gray-100">Print / Save as PDF</span>
                  <span class="block text-[10px] text-gray-400">Formatted landscape print preview</span>
                </div>
              </button>

              <!-- Backup / JSON -->
              <div class="border-t border-gray-700/80 pt-1 mt-1 flex items-center gap-1">
                <button
                  type="button"
                  class="flex-1 text-left px-2 py-1 hover:bg-gray-700 rounded text-[11px] text-gray-300 flex items-center gap-1 cursor-pointer"
                  @click="exportJsonBackup"
                >
                  <UIcon name="i-lucide-file-code" class="size-3 text-gray-400" />
                  <span>Backup JSON</span>
                </button>
                <button
                  type="button"
                  class="flex-1 text-left px-2 py-1 hover:bg-gray-700 rounded text-[11px] text-gray-300 flex items-center gap-1 cursor-pointer"
                  @click="importJsonBackup"
                >
                  <UIcon name="i-lucide-upload" class="size-3 text-gray-400" />
                  <span>Import JSON</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Full Report Link -->
          <NuxtLink
            :to="`/admin/projects/${projectId}/report`"
            class="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <UIcon name="i-lucide-file-text" class="size-3.5" />
            <span>Full Report (PFR)</span>
          </NuxtLink>

          <!-- Fullscreen Toggle -->
          <button
            type="button"
            class="bg-gray-700 hover:bg-gray-600 text-gray-200 p-1.5 rounded-md transition-colors cursor-pointer"
            :title="isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen (F)'"
            @click="toggleFullscreen"
          >
            <UIcon :name="isFullscreen ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" class="size-4" />
          </button>
        </div>
      </div>

      <!-- Widget Palette Bar (When Add Card is clicked) -->
      <div
        v-if="isPaletteOpen && isEditMode"
        class="bg-teal-950/90 border-b border-teal-800/80 px-6 py-2.5 flex items-center justify-between text-xs text-teal-200 animate-in slide-in-from-top duration-200 print:hidden"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-palette" class="size-4 text-teal-400" />
          <span class="font-bold">Add Widget to Current Slide:</span>
          <span class="text-teal-300">Click to insert a new structured card block</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('key-value')"
          >
            <UIcon name="i-lucide-file-text" class="size-3" />
            <span>+ Key-Value Info</span>
          </button>
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('kpi-grid')"
          >
            <UIcon name="i-lucide-target" class="size-3" />
            <span>+ KPI Targets</span>
          </button>
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('stat-cards')"
          >
            <UIcon name="i-lucide-trending-up" class="size-3" />
            <span>+ Stat Metrics</span>
          </button>
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('fmea-table')"
          >
            <UIcon name="i-lucide-table" class="size-3" />
            <span>+ FMEA Table</span>
          </button>
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('text-bullets')"
          >
            <UIcon name="i-lucide-list" class="size-3" />
            <span>+ Bullet List</span>
          </button>
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('hypothesis')"
          >
            <UIcon name="i-lucide-test-tube" class="size-3" />
            <span>+ Hypothesis Box</span>
          </button>
          <button
            type="button"
            class="bg-teal-900/90 hover:bg-teal-800 text-white px-2.5 py-1 rounded border border-teal-700 flex items-center gap-1 transition-colors cursor-pointer"
            @click="addWidgetToCurrentSlide('doe-settings')"
          >
            <UIcon name="i-lucide-box" class="size-3" />
            <span>+ DOE Optimum</span>
          </button>
        </div>
      </div>

      <!-- Main Slide 16:9 Presentation Canvas Area -->
      <div
        class="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-auto relative print:bg-white print:p-0"
        :class="{ 'min-h-[560px]': !isFullscreen }"
      >
        <!-- 16:9 Aspect Ratio Slide Card Container -->
        <div
          ref="slideCanvasRef"
          class="w-full max-w-5xl aspect-16/9 bg-white rounded-lg shadow-2xl p-7 flex flex-col justify-between text-gray-900 relative overflow-hidden border border-gray-200 select-text print:shadow-none print:border-none print:aspect-auto print:max-w-none print:w-full print:p-8"
        >
          <!-- 1. Slide Watermark Header -->
          <div class="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="size-7 rounded bg-[#008779] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                IG
              </div>
              <div>
                <template v-if="!isEditMode">
                  <span class="font-bold text-xs tracking-tight text-gray-900 block leading-tight">
                    {{ currentSlide.headerTitle || 'INSIGHTGENIE SIX SIGMA PRESENTATION' }}
                  </span>
                  <span class="text-[10px] text-gray-500 block leading-tight">
                    {{ currentSlide.headerSubtitle || 'CPF Digital Transformation & Quality Excellence' }}
                  </span>
                </template>
                <template v-else>
                  <input
                    v-model="currentSlide.headerTitle"
                    type="text"
                    class="font-bold text-xs text-gray-900 border-b border-gray-300 focus:border-teal-500 focus:outline-hidden w-64 block py-0"
                    placeholder="Header Title"
                    @input="saveSlides"
                  />
                  <input
                    v-model="currentSlide.headerSubtitle"
                    type="text"
                    class="text-[10px] text-gray-500 border-b border-gray-200 focus:border-teal-500 focus:outline-hidden w-64 block py-0"
                    placeholder="Header Subtitle"
                    @input="saveSlides"
                  />
                </template>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <template v-if="!isEditMode">
                <span class="text-[10px] font-bold text-[#008779] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  {{ currentSlide.badge || 'Black Belt Certified Project' }}
                </span>
                <span class="text-[10px] text-gray-400 font-mono">Date: {{ currentSlide.date || 'Feb 2026' }}</span>
              </template>
              <template v-else>
                <input
                  v-model="currentSlide.badge"
                  type="text"
                  class="text-[10px] font-bold text-[#008779] bg-teal-50 border border-teal-300 px-2 py-0.5 rounded focus:outline-hidden w-36"
                  placeholder="Badge text"
                  @input="saveSlides"
                />
                <input
                  v-model="currentSlide.date"
                  type="text"
                  class="text-[10px] text-gray-500 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-hidden w-20 font-mono"
                  placeholder="Date"
                  @input="saveSlides"
                />
              </template>
            </div>
          </div>

          <!-- 2. Dynamic Slide Body Cards (Widgets) -->
          <div
            class="my-auto py-3 gap-5 items-stretch"
            :class="{
              'grid grid-cols-1': currentSlide.widgets?.length === 1,
              'grid grid-cols-2': currentSlide.widgets?.length === 2,
              'grid grid-cols-3': currentSlide.widgets?.length === 3,
              'grid grid-cols-2 gap-4': (currentSlide.widgets?.length || 0) >= 4
            }"
          >
            <div
              v-for="(widget, wIdx) in currentSlide.widgets"
              :key="widget.id || wIdx"
              class="bg-gray-50/80 border border-gray-200 rounded-lg p-4 space-y-3 flex flex-col justify-between relative group transition-all hover:border-gray-300"
            >
              <!-- Card Top Header with Edit Controls -->
              <div class="flex items-center justify-between border-b border-gray-200/60 pb-2">
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                  <UIcon :name="widget.icon || 'i-lucide-layout-grid'" class="size-4 text-[#008779] shrink-0" />
                  <template v-if="!isEditMode">
                    <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider truncate">
                      {{ widget.title }}
                    </h3>
                  </template>
                  <template v-else>
                    <input
                      v-model="widget.title"
                      type="text"
                      class="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-teal-500/80 bg-white px-1 py-0.5 rounded focus:outline-hidden w-full"
                      placeholder="Card Title"
                      @input="saveSlides"
                    />
                  </template>
                </div>

                <!-- Widget Action Buttons (Delete / Move) in Edit Mode -->
                <div v-if="isEditMode" class="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    v-if="wIdx > 0"
                    type="button"
                    class="p-0.5 text-gray-400 hover:text-gray-700 rounded transition-colors"
                    title="Move Left"
                    @click="moveWidget(wIdx, wIdx - 1)"
                  >
                    <UIcon name="i-lucide-chevron-left" class="size-3" />
                  </button>
                  <button
                    v-if="wIdx < (currentSlide.widgets?.length || 0) - 1"
                    type="button"
                    class="p-0.5 text-gray-400 hover:text-gray-700 rounded transition-colors"
                    title="Move Right"
                    @click="moveWidget(wIdx, wIdx + 1)"
                  >
                    <UIcon name="i-lucide-chevron-right" class="size-3" />
                  </button>
                  <button
                    type="button"
                    class="p-0.5 text-red-500 hover:text-red-700 rounded transition-colors"
                    title="Delete Card"
                    @click="deleteWidget(wIdx)"
                  >
                    <UIcon name="i-lucide-x" class="size-3.5" />
                  </button>
                </div>
              </div>

              <!-- Card Content Renderer based on Type -->
              <div class="flex-1 space-y-2 text-xs">
                <!-- TYPE 1: Key-Value List -->
                <template v-if="widget.type === 'key-value'">
                  <div class="space-y-2">
                    <div
                      v-for="(item, itemIdx) in widget.data?.items"
                      :key="itemIdx"
                      :class="item.isHighlight ? 'bg-teal-50 border border-teal-200 rounded p-2 text-[11px] text-teal-950 font-medium' : ''"
                    >
                      <template v-if="!isEditMode">
                        <strong class="text-gray-700 block text-[11px]">{{ item.label }}:</strong>
                        <span :class="item.isHighlight ? 'font-bold text-[#008779] text-xs' : 'font-medium text-gray-900'">
                          {{ item.value }}
                        </span>
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-1 mb-0.5">
                          <input
                            v-model="item.label"
                            type="text"
                            class="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded px-1 py-0.5 w-1/3 focus:outline-hidden"
                            placeholder="Label"
                            @input="saveSlides"
                          />
                          <input
                            v-model="item.value"
                            type="text"
                            class="text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded px-1.5 py-0.5 flex-1 focus:outline-hidden"
                            placeholder="Value"
                            @input="saveSlides"
                          />
                          <button
                            type="button"
                            class="text-red-400 hover:text-red-600 p-0.5"
                            title="Remove Field"
                            @click="widget.data.items.splice(itemIdx, 1); saveSlides()"
                          >
                            <UIcon name="i-lucide-trash-2" class="size-3" />
                          </button>
                        </div>
                      </template>
                    </div>

                    <button
                      v-if="isEditMode"
                      type="button"
                      class="text-[10px] text-[#008779] hover:underline font-bold flex items-center gap-1 pt-1"
                      @click="widget.data.items.push({ label: 'New Field', value: 'Value' }); saveSlides()"
                    >
                      <UIcon name="i-lucide-plus" class="size-3" />
                      <span>Add Key-Value Field</span>
                    </button>
                  </div>
                </template>

                <!-- TYPE 2: KPI Grid -->
                <template v-else-if="widget.type === 'kpi-grid'">
                  <div class="space-y-2.5">
                    <div
                      class="gap-2 text-center"
                      :class="`grid grid-cols-${Math.min(widget.data?.kpis?.length || 3, 4)}`"
                    >
                      <div
                        v-for="(kpi, kIdx) in widget.data?.kpis"
                        :key="kIdx"
                        class="bg-white border rounded p-2 transition-all shadow-2xs"
                        :class="[
                          kpi.color === 'red' ? 'border-red-200' :
                          kpi.color === 'amber' ? 'border-amber-200' :
                          kpi.color === 'emerald' ? 'border-emerald-200' :
                          'border-purple-200'
                        ]"
                      >
                        <template v-if="!isEditMode">
                          <span
                            class="text-[9px] font-bold block uppercase"
                            :class="[
                              kpi.color === 'red' ? 'text-red-500' :
                              kpi.color === 'amber' ? 'text-amber-500' :
                              kpi.color === 'emerald' ? 'text-emerald-600' :
                              'text-purple-600'
                            ]"
                          >
                            {{ kpi.label }}
                          </span>
                          <span
                            class="text-base font-bold font-mono block my-0.5"
                            :class="[
                              kpi.color === 'red' ? 'text-red-600' :
                              kpi.color === 'amber' ? 'text-amber-600' :
                              kpi.color === 'emerald' ? 'text-emerald-700' :
                              'text-purple-700'
                            ]"
                          >
                            {{ kpi.value }}
                          </span>
                          <span v-if="kpi.desc" class="text-[9px] text-gray-400 block truncate">
                            {{ kpi.desc }}
                          </span>
                        </template>
                        <template v-else>
                          <input
                            v-model="kpi.label"
                            type="text"
                            class="text-[9px] font-bold text-center w-full uppercase border border-gray-200 rounded px-0.5 py-0.5 mb-1 focus:outline-hidden"
                            placeholder="LABEL"
                            @input="saveSlides"
                          />
                          <input
                            v-model="kpi.value"
                            type="text"
                            class="text-sm font-bold text-center font-mono w-full border border-gray-200 rounded px-0.5 py-0.5 mb-1 focus:outline-hidden"
                            placeholder="Value"
                            @input="saveSlides"
                          />
                          <input
                            v-model="kpi.desc"
                            type="text"
                            class="text-[9px] text-gray-400 text-center w-full border border-gray-100 rounded px-0.5 py-0.5 focus:outline-hidden"
                            placeholder="Description"
                            @input="saveSlides"
                          />
                        </template>
                      </div>
                    </div>

                    <!-- Rule note -->
                    <div class="text-[11px] text-gray-600 bg-white border border-gray-100 rounded p-2">
                      <template v-if="!isEditMode">
                        <strong>Goal Formulation Rule:</strong> {{ widget.data?.rule }}
                      </template>
                      <template v-else>
                        <div class="flex items-center gap-1.5">
                          <strong class="shrink-0 text-[10px]">Rule:</strong>
                          <input
                            v-model="widget.data.rule"
                            type="text"
                            class="text-[11px] text-gray-700 bg-transparent border-b border-gray-300 w-full focus:outline-hidden focus:border-teal-500"
                            placeholder="Enter goal formulation rule"
                            @input="saveSlides"
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                </template>

                <!-- TYPE 3: FMEA Table -->
                <template v-else-if="widget.type === 'fmea-table'">
                  <div class="space-y-2">
                    <p v-if="!isEditMode" class="text-xs text-gray-600">
                      {{ widget.data?.description }}
                    </p>
                    <input
                      v-else
                      v-model="widget.data.description"
                      type="text"
                      class="text-xs text-gray-600 border border-gray-200 rounded px-1.5 py-0.5 w-full focus:outline-hidden"
                      @input="saveSlides"
                    />

                    <div class="border border-gray-200 rounded bg-white overflow-hidden">
                      <table class="w-full text-left text-[11px]">
                        <thead class="bg-gray-100/80 text-gray-600 font-semibold border-b border-gray-200 text-[10px]">
                          <tr>
                            <th class="p-1.5 text-center w-10">Rank</th>
                            <th class="p-1.5">Root Cause</th>
                            <th class="p-1.5 text-center w-8">S</th>
                            <th class="p-1.5 text-center w-8">O</th>
                            <th class="p-1.5 text-center w-8">D</th>
                            <th class="p-1.5 text-center w-12 font-bold text-red-600">RPN</th>
                            <th v-if="isEditMode" class="p-1.5 text-center w-6"></th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                          <tr v-for="(row, rIdx) in widget.data?.rows" :key="rIdx">
                            <td class="p-1.5 text-center font-bold font-mono text-gray-700">
                              <span v-if="!isEditMode">{{ row.rank }}</span>
                              <input
                                v-else
                                v-model="row.rank"
                                class="w-8 text-center border rounded px-0.5 py-0.5"
                                @input="saveSlides"
                              />
                            </td>
                            <td class="p-1.5 text-gray-900 font-medium">
                              <span v-if="!isEditMode">{{ row.cause }}</span>
                              <input
                                v-else
                                v-model="row.cause"
                                class="w-full border rounded px-1 py-0.5"
                                @input="saveSlides"
                              />
                            </td>
                            <td class="p-1.5 text-center text-gray-600">
                              <span v-if="!isEditMode">{{ row.s }}</span>
                              <input
                                v-else
                                v-model.number="row.s"
                                type="number"
                                class="w-7 text-center border rounded"
                                @input="row.rpn = row.s * row.o * row.d; saveSlides()"
                              />
                            </td>
                            <td class="p-1.5 text-center text-gray-600">
                              <span v-if="!isEditMode">{{ row.o }}</span>
                              <input
                                v-else
                                v-model.number="row.o"
                                type="number"
                                class="w-7 text-center border rounded"
                                @input="row.rpn = row.s * row.o * row.d; saveSlides()"
                              />
                            </td>
                            <td class="p-1.5 text-center text-gray-600">
                              <span v-if="!isEditMode">{{ row.d }}</span>
                              <input
                                v-else
                                v-model.number="row.d"
                                type="number"
                                class="w-7 text-center border rounded"
                                @input="row.rpn = row.s * row.o * row.d; saveSlides()"
                              />
                            </td>
                            <td class="p-1.5 text-center font-bold text-red-600 font-mono">
                              {{ row.rpn || (row.s * row.o * row.d) }}
                            </td>
                            <td v-if="isEditMode" class="p-1 text-center">
                              <button
                                type="button"
                                class="text-red-400 hover:text-red-600"
                                @click="widget.data.rows.splice(rIdx, 1); saveSlides()"
                              >
                                <UIcon name="i-lucide-trash" class="size-3" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button
                      v-if="isEditMode"
                      type="button"
                      class="text-[10px] text-[#008779] hover:underline font-bold flex items-center gap-1 pt-1"
                      @click="widget.data.rows.push({ rank: `#${widget.data.rows.length + 1}`, cause: 'New Root Cause', s: 5, o: 5, d: 5, rpn: 125 }); saveSlides()"
                    >
                      <UIcon name="i-lucide-plus" class="size-3" />
                      <span>Add FMEA Row</span>
                    </button>
                  </div>
                </template>

                <!-- TYPE 4: Process Map -->
                <template v-else-if="widget.type === 'process-map'">
                  <div class="space-y-2.5">
                    <p v-if="!isEditMode" class="text-xs text-gray-600 leading-relaxed">
                      {{ widget.data?.description }}
                    </p>
                    <textarea
                      v-else
                      v-model="widget.data.description"
                      rows="2"
                      class="text-xs text-gray-600 border border-gray-200 rounded p-1 w-full focus:outline-hidden"
                      @input="saveSlides"
                    ></textarea>

                    <!-- Flow Diagram Pipeline Visual -->
                    <div class="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                      <div class="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        <div
                          v-for="(stage, sIdx) in widget.data?.stages"
                          :key="sIdx"
                          class="flex items-center shrink-0"
                        >
                          <div
                            class="px-2.5 py-1 rounded text-[10px] font-bold border transition-colors flex items-center gap-1"
                            :class="stage.active ? 'bg-teal-50 border-teal-500 text-[#008779]' : 'bg-gray-50 border-gray-200 text-gray-600'"
                          >
                            <span v-if="stage.active" class="size-1.5 rounded-full bg-[#008779]"></span>
                            <span>{{ stage.name }}</span>
                            <button
                              v-if="isEditMode"
                              type="button"
                              class="text-gray-400 hover:text-red-500 ml-1"
                              @click="widget.data.stages.splice(sIdx, 1); saveSlides()"
                            >
                              ×
                            </button>
                          </div>
                          <span v-if="Number(sIdx) < (widget.data?.stages?.length ?? 0) - 1" class="text-gray-400 text-xs px-1">→</span>
                        </div>
                      </div>
                      <p class="text-[10px] text-gray-500 font-mono bg-gray-50 p-1.5 rounded border border-gray-100">
                        {{ widget.data?.note || 'Critical variation checkpoints highlighted in teal.' }}
                      </p>
                    </div>

                    <div v-if="isEditMode" class="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        class="text-[10px] text-[#008779] hover:underline font-bold flex items-center gap-1"
                        @click="widget.data.stages.push({ name: 'New Stage', active: false }); saveSlides()"
                      >
                        <UIcon name="i-lucide-plus" class="size-3" />
                        <span>Add Flow Stage</span>
                      </button>
                    </div>
                  </div>
                </template>

                <!-- TYPE 5: Hypothesis Testing -->
                <template v-else-if="widget.type === 'hypothesis'">
                  <div class="space-y-2.5">
                    <template v-if="!isEditMode">
                      <p class="text-xs text-gray-600">
                        {{ widget.data?.description }}
                      </p>
                      <div class="bg-gray-100/70 border border-gray-200 rounded p-2 text-xs font-mono font-bold text-gray-800">
                        {{ widget.data?.pValueText }}
                      </div>
                      <div class="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs text-emerald-900 font-bold">
                        {{ widget.data?.conclusion }}
                      </div>
                    </template>
                    <template v-else>
                      <textarea
                        v-model="widget.data.description"
                        rows="2"
                        class="text-xs text-gray-600 border border-gray-200 rounded p-1 w-full focus:outline-hidden"
                        placeholder="Hypothesis Description"
                        @input="saveSlides"
                      ></textarea>
                      <input
                        v-model="widget.data.pValueText"
                        type="text"
                        class="text-xs font-mono font-bold border border-gray-200 rounded px-2 py-1 w-full focus:outline-hidden"
                        placeholder="P-Value details"
                        @input="saveSlides"
                      />
                      <input
                        v-model="widget.data.conclusion"
                        type="text"
                        class="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 rounded px-2 py-1 w-full focus:outline-hidden"
                        placeholder="Conclusion banner"
                        @input="saveSlides"
                      />
                    </template>
                  </div>
                </template>

                <!-- TYPE 6: DOE Settings -->
                <template v-else-if="widget.type === 'doe-settings'">
                  <div class="space-y-2.5">
                    <template v-if="!isEditMode">
                      <p class="text-xs text-gray-600">
                        {{ widget.data?.description }}
                      </p>
                      <div class="bg-teal-50 border border-teal-200 rounded p-2.5 text-xs text-teal-950 font-bold font-mono">
                        {{ widget.data?.formula }}
                      </div>
                      <div v-if="widget.data?.parameters" class="flex items-center gap-2 flex-wrap">
                        <span
                          v-for="(param, pIdx) in widget.data?.parameters"
                          :key="pIdx"
                          class="bg-white border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-700"
                        >
                          {{ param.name }}: <span class="text-[#008779]">{{ param.val }}</span>
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <textarea
                        v-model="widget.data.description"
                        rows="2"
                        class="text-xs text-gray-600 border border-gray-200 rounded p-1 w-full focus:outline-hidden"
                        placeholder="DOE Description"
                        @input="saveSlides"
                      ></textarea>
                      <input
                        v-model="widget.data.formula"
                        type="text"
                        class="text-xs font-bold text-teal-950 bg-teal-50 border border-teal-300 rounded px-2 py-1 w-full font-mono focus:outline-hidden"
                        placeholder="Optimum Formula / Setting"
                        @input="saveSlides"
                      />
                    </template>
                  </div>
                </template>

                <!-- TYPE 7: Stat Cards & ROI -->
                <template v-else-if="widget.type === 'stat-cards'">
                  <div class="space-y-3">
                    <div
                      class="gap-3 text-center"
                      :class="`grid grid-cols-${Math.min(widget.data?.stats?.length || 2, 3)}`"
                    >
                      <div
                        v-for="(st, stIdx) in widget.data?.stats"
                        :key="stIdx"
                        class="border rounded-lg p-2.5"
                        :class="st.color === 'emerald' ? 'bg-emerald-50 border-emerald-200' : 'bg-teal-50 border-teal-200'"
                      >
                        <template v-if="!isEditMode">
                          <span
                            class="text-[10px] font-bold block uppercase"
                            :class="st.color === 'emerald' ? 'text-emerald-700' : 'text-teal-700'"
                          >
                            {{ st.label }}
                          </span>
                          <span
                            class="text-lg font-bold font-mono block mt-0.5"
                            :class="st.color === 'emerald' ? 'text-emerald-700' : 'text-[#008779]'"
                          >
                            {{ st.value }}
                          </span>
                        </template>
                        <template v-else>
                          <input
                            v-model="st.label"
                            type="text"
                            class="text-[9px] font-bold text-center w-full uppercase border border-gray-300 rounded px-0.5 py-0.5 mb-1"
                            @input="saveSlides"
                          />
                          <input
                            v-model="st.value"
                            type="text"
                            class="text-base font-bold text-center font-mono w-full border border-gray-300 rounded px-0.5 py-0.5"
                            @input="saveSlides"
                          />
                        </template>
                      </div>
                    </div>

                    <p v-if="!isEditMode && widget.data?.note" class="text-[11px] text-gray-600 text-center font-bold">
                      {{ widget.data?.note }}
                    </p>
                    <input
                      v-else-if="isEditMode"
                      v-model="widget.data.note"
                      type="text"
                      class="text-[11px] text-gray-700 text-center font-bold border border-gray-200 rounded px-2 py-0.5 w-full focus:outline-hidden"
                      placeholder="Note / Capability text"
                      @input="saveSlides"
                    />
                  </div>
                </template>

                <!-- TYPE 8: Text Bullets / Standard List -->
                <template v-else>
                  <div class="space-y-2">
                    <p v-if="!isEditMode && widget.data?.description" class="text-xs text-gray-600">
                      {{ widget.data?.description }}
                    </p>
                    <input
                      v-else-if="isEditMode && widget.data?.description !== undefined"
                      v-model="widget.data.description"
                      type="text"
                      class="text-xs text-gray-600 border border-gray-200 rounded px-1.5 py-0.5 w-full focus:outline-hidden mb-1"
                      placeholder="List description"
                      @input="saveSlides"
                    />

                    <ul class="text-xs text-gray-800 space-y-1.5 pl-4 list-disc font-medium">
                      <li
                        v-for="(bullet, bIdx) in (widget.data?.bullets || widget.data?.items)"
                        :key="bIdx"
                      >
                        <template v-if="!isEditMode">
                          <span>{{ typeof bullet === 'string' ? bullet : bullet.title }}</span>
                        </template>
                        <template v-else>
                          <div class="flex items-center gap-1">
                            <input
                              v-if="typeof bullet === 'string'"
                              v-model="widget.data.bullets[bIdx]"
                              type="text"
                              class="text-xs text-gray-900 border border-gray-200 rounded px-1.5 py-0.5 flex-1 focus:outline-hidden"
                              @input="saveSlides"
                            />
                            <input
                              v-else
                              v-model="bullet.title"
                              type="text"
                              class="text-xs text-gray-900 border border-gray-200 rounded px-1.5 py-0.5 flex-1 focus:outline-hidden"
                              @input="saveSlides"
                            />
                            <button
                              type="button"
                              class="text-red-400 hover:text-red-600 p-0.5"
                              @click="(widget.data.bullets || widget.data.items).splice(bIdx, 1); saveSlides()"
                            >
                              <UIcon name="i-lucide-x" class="size-3" />
                            </button>
                          </div>
                        </template>
                      </li>
                    </ul>

                    <button
                      v-if="isEditMode"
                      type="button"
                      class="text-[10px] text-[#008779] hover:underline font-bold flex items-center gap-1 pt-1"
                      @click="(widget.data.bullets ? widget.data.bullets.push('New Bullet Item') : widget.data.items.push({ title: 'New Item' })); saveSlides()"
                    >
                      <UIcon name="i-lucide-plus" class="size-3" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- 3. Slide Footer Area -->
          <div class="flex items-center justify-between border-t border-gray-100 pt-2.5 text-[10px] text-gray-400 shrink-0">
            <template v-if="!isEditMode">
              <span>{{ currentSlide.footerText || 'Confidential — Internal CPF Six Sigma Documentation' }}</span>
            </template>
            <template v-else>
              <input
                v-model="currentSlide.footerText"
                type="text"
                class="text-[10px] text-gray-500 border-b border-gray-200 focus:outline-hidden w-80"
                placeholder="Footer notice"
                @input="saveSlides"
              />
            </template>
            <span class="font-mono">Page {{ currentSlideIndex + 1 }} of {{ slides.length }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Filmstrip Slide Navigation Drawer (Collapsible) -->
      <div
        v-if="isFilmstripOpen && !isFullscreen"
        class="bg-gray-850 border-t border-gray-800 px-5 py-2.5 flex items-center justify-between gap-4 text-xs text-white print:hidden overflow-x-auto"
      >
        <div class="flex items-center gap-3 shrink-0">
          <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Slide Navigator:</span>
        </div>

        <!-- Thumbnail Cards Carousel -->
        <div class="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
          <button
            v-for="(sl, idx) in slides"
            :key="sl.id || idx"
            type="button"
            class="px-3 py-1.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer shrink-0"
            :class="currentSlideIndex === idx ? 'bg-teal-950/80 border-teal-500 text-teal-200 ring-1 ring-teal-500' : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:bg-gray-750 hover:text-gray-200'"
            @click="goToSlide(idx)"
          >
            <span class="size-4 rounded-full flex items-center justify-center font-mono font-bold text-[10px]" :class="currentSlideIndex === idx ? 'bg-[#008779] text-white' : 'bg-gray-700 text-gray-300'">
              {{ idx + 1 }}
            </span>
            <span class="truncate max-w-[140px] text-[11px] font-medium">{{ sl.title.split(':')[0] }}</span>
          </button>

          <!-- Add Slide Quick Button -->
          <button
            type="button"
            class="px-2.5 py-1.5 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-teal-500 text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            @click="isAddSlideModalOpen = true"
          >
            <UIcon name="i-lucide-plus" class="size-3.5" />
            <span>New Slide</span>
          </button>
        </div>

        <!-- Reset to Default Button -->
        <div class="shrink-0 flex items-center gap-2">
          <button
            type="button"
            class="text-[11px] text-gray-400 hover:text-gray-200 hover:underline flex items-center gap-1 cursor-pointer"
            title="Reset presentation to default template"
            @click="resetToDefaultSlides"
          >
            <UIcon name="i-lucide-rotate-ccw" class="size-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Add New Slide Template Picker -->
    <div
      v-if="isAddSlideModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-gray-900">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div>
            <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
              <UIcon name="i-lucide-layout-template" class="size-4 text-[#008779]" />
              <span>Choose a Slide Template</span>
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">Select a layout preset or start with a custom blank canvas</p>
          </div>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            @click="isAddSlideModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <!-- Template Grid -->
        <div class="p-6 grid grid-cols-2 gap-4">
          <div
            v-for="(tpl, tIdx) in SLIDE_TEMPLATES"
            :key="tIdx"
            class="border border-gray-200 hover:border-teal-500 hover:bg-teal-50/30 rounded-lg p-4 transition-all cursor-pointer space-y-2 group"
            @click="addSlideFromTemplate(tpl)"
          >
            <div class="flex items-center gap-2.5">
              <div class="size-8 rounded bg-teal-100 text-[#008779] flex items-center justify-center shrink-0 group-hover:bg-[#008779] group-hover:text-white transition-colors">
                <UIcon :name="tpl.icon" class="size-4" />
              </div>
              <div>
                <h4 class="font-bold text-xs text-gray-900 group-hover:text-[#008779] transition-colors">
                  {{ tpl.name }}
                </h4>
                <p class="text-[11px] text-gray-500 leading-tight">
                  {{ tpl.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
            @click="isAddSlideModalOpen = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: landscape;
    margin: 0.5cm;
  }
  body {
    background: white !important;
  }
}
</style>
