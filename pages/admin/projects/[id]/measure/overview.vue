<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectData } from '~/composables/useProjectData'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const { project, passELearningQuiz } = useProjectData(projectId)

const activeTab = ref<'tools' | 'editor' | 'pareto'>('tools')

// E-Learning Quiz Gate State (Requirement Image 4)
const isELearningPassed = computed(() => project.value.eLearningPassed?.Measure === true)
const isQuizModalOpen = ref(false)
const quizAnswers = ref<Record<number, number>>({})
const quizSubmitted = ref(false)
const quizScore = ref(0)
const quizError = ref('')

const quizQuestions = [
  {
    id: 1,
    question: '1. ค่าดัชนี Cpk (Process Capability Index) มีเกณฑ์มาตรฐานขั้นต่ำสำหรับการผลิตที่มีคุณภาพเสถียรอยู่ที่เท่าใด?',
    options: ['Cpk ≥ 0.67', 'Cpk ≥ 1.00', 'Cpk ≥ 1.33 (เกณฑ์ 4-Sigma Industry STD)', 'Cpk ≥ 2.50'],
    correct: 2
  },
  {
    id: 2,
    question: '2. การศึกษา Measurement System Analysis (MSA) Gage R&R ค่า %Study Variation (%SV) ที่ยอมรับได้ต้องเป็นไปตามข้อใด?',
    options: ['%SV < 10% (Acceptable) และ 10-30% (Marginal)', '%SV > 50%', '%SV เท่ากับ 100%', 'ไม่ต้องสนใจค่า %SV'],
    correct: 0
  },
  {
    id: 3,
    question: '3. ในแผนผังสาเหตุและผล (Ishikawa Fishbone Diagram) หลักการ 5M1E ประกอบด้วยปัจจัยใดบ้าง?',
    options: [
      'Money, Market, Month, Minute, Model, Email',
      'Man, Machine, Material, Method, Measurement, Environment',
      'Manage, Maintain, Measure, Move, Make, Energy',
      'Matrix, Mean, Median, Mode, Maximum, Minimum'
    ],
    correct: 1
  }
]

const handleTakeQuiz = () => {
  quizAnswers.value = {}
  quizSubmitted.value = false
  quizError.value = ''
  isQuizModalOpen.value = true
}

const submitQuiz = () => {
  if (Object.keys(quizAnswers.value).length < quizQuestions.length) {
    quizError.value = 'กรุณาตอบคำถามให้ครบทุกข้อก่อนส่งแบบทดสอบ'
    return
  }

  let score = 0
  quizQuestions.forEach((q, idx) => {
    if (quizAnswers.value[idx] === q.correct) {
      score++
    }
  })

  quizScore.value = score
  quizSubmitted.value = true

  if (score === quizQuestions.length) {
    passELearningQuiz('Measure')
    quizError.value = ''
  } else {
    quizError.value = `คุณได้ ${score}/${quizQuestions.length} คะแนน ต้องตอบถูกทุกข้อเพื่อผ่านเกณฑ์ กรุณาลองใหม่อีกครั้ง`
  }
}

// Toast Feedback Notification
const toastMsg = ref('')
const showToast = (msg: string) => {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

// WYSIWYG Editor Content
const editorNotes = ref(`<h3>บทสรุปการวัดผลกระบวนการ (Measure Phase Executive Summary)</h3>
<p>จากการเก็บข้อมูลเชิงสถิติในสายการผลิตไก่ทอดแช่แข็ง พบว่าปัจจัยหลักที่ส่งผลให้ค่า <strong>%Total Yield ต่ำกว่าเป้าหมาย</strong> ประกอบด้วย 3 ปัจจัยหลักตามกฎ Pareto 80/20:</p>
<ul>
  <li><strong>1. น้ำหนักส่วนเกิน (Giveaway Overweight):</strong> มีสัดส่วน 48% ของ Defect ทั้งหมด</li>
  <li><strong>2. ความหนืดแป้งชุบไม่สม่ำเสมอ (Batter Viscosity):</strong> มีสัดส่วน 26%</li>
  <li><strong>3. อุณหภูมิน้ำมันทอดแกว่งตัว (Fryer Temperature Variation):</strong> มีสัดส่วน 14%</li>
</ul>
<p>ทั้ง 3 ปัจจัยคิดเป็น <strong>88% ของความสูญเสียทั้งหมด</strong> จึงถูกคัดเลือกเข้าสู่การวิเคราะห์ต่อใน Fishbone และ FMEA Matrix</p>`)

const isSaveConfirmed = ref(false)
const saveEditorNotes = () => {
  isSaveConfirmed.value = true
  setTimeout(() => { isSaveConfirmed.value = false }, 3000)
}

// Pareto Chart Data (80/20 Rule)
const paretoData = [
  { defect: 'Giveaway น้ำหนักเกิน', count: 142, pct: 44.4, cumPct: 44.4, color: '#008779' },
  { defect: 'ความหนืดแป้งชุบไม่ได้มาตรฐาน', count: 85, pct: 26.6, cumPct: 71.0, color: '#0284C7' },
  { defect: 'อุณหภูมิน้ำมันทอดแกว่งตัว', count: 46, pct: 14.4, cumPct: 85.4, color: '#D97706' },
  { defect: 'แป้ง Predust ร่วงหล่นสูญเสีย', count: 28, pct: 8.8, cumPct: 94.2, color: '#9333EA' },
  { defect: 'ความชื้นเนื้อไก่ไม่สม่ำเสมอ', count: 19, pct: 5.8, cumPct: 100.0, color: '#E11D48' }
]

const measureActivities = [
  {
    title: 'Capability Analysis',
    desc: 'Process capability assessment (Cp, Cpk, Pp, Ppk) with dynamic normal distribution bell curve and histogram.',
    status: 'Complete',
    icon: 'i-lucide-gauge',
    link: `/admin/projects/${projectId}/measure/capability`
  },
  {
    title: 'Measurement System Analysis (MSA)',
    desc: 'Gage R&R studies to assess repeatability and reproducibility variation across inspection equipment.',
    status: 'Complete',
    icon: 'i-lucide-ruler',
    link: `/admin/projects/${projectId}/measure/msa`
  },
  {
    title: 'Process Map',
    desc: 'Visual representation of the process flow to identify value-added and non-value-added steps.',
    status: 'Complete',
    icon: 'i-lucide-git-merge',
    link: `/admin/projects/${projectId}/measure/process-map`
  },
  {
    title: 'Fishbone Diagram',
    desc: 'Cause-and-effect analysis to systematically brainstorm potential causes across 6 categories.',
    status: 'Complete',
    icon: 'i-lucide-git-branch',
    link: `/admin/projects/${projectId}/measure/fishbone`
  },
  {
    title: 'FMEA',
    desc: 'Failure Mode and Effects Analysis to quantify risk and prioritize top 20% high-impact causes (RPN).',
    status: 'Complete',
    icon: 'i-lucide-table',
    link: `/admin/projects/${projectId}/measure/fmea`
  },
  {
    title: 'Introduction to Hypothesis Testing',
    desc: 'Formulate null and alternative hypotheses to statistically test critical root causes.',
    status: 'Complete',
    icon: 'i-lucide-file-question',
    link: `/admin/projects/${projectId}/measure/intro-hypothesis`
  }
]
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-200 select-none pb-12">
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
        v-if="toastMsg"
        class="fixed top-5 right-5 z-50 bg-gray-900 border border-teal-500 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-semibold"
      >
        <UIcon name="i-lucide-check-circle-2" class="size-4 text-teal-400" />
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- Breadcrumbs -->
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
      <NuxtLink :to="`/admin/projects/${projectId}`" class="hover:text-[#008779] truncate max-w-[200px]">
        {{ project.name }}
      </NuxtLink>
      <span>›</span>
      <span class="text-slate-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-slate-900 font-bold">Overview</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex flex-col lg:flex-row gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Overview"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-5 min-w-0 w-full">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-teal-950 via-[#008779] to-indigo-950 rounded-3xl text-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div class="space-y-1 relative z-10">
            <h2 class="text-xl font-bold tracking-tight">
              Measure Phase Suite & Tool Registry
            </h2>
            <p class="text-xs text-teal-200">
              Quantify baseline process variability, validate measurement systems, and prioritize root causes
            </p>
          </div>
          
          <!-- Sub-Tab Navigation -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-2xl flex items-center gap-1 relative z-10 shrink-0">
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="activeTab === 'tools' ? 'bg-white text-[#008779] shadow-sm' : 'text-white hover:bg-white/10'"
              @click="activeTab = 'tools'"
            >
              <UIcon name="i-lucide-layout-grid" class="size-3.5" />
              <span>Tool Registry</span>
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="activeTab === 'pareto' ? 'bg-white text-[#008779] shadow-sm' : 'text-white hover:bg-white/10'"
              @click="activeTab = 'pareto'"
            >
              <UIcon name="i-lucide-bar-chart-2" class="size-3.5" />
              <span>Pareto Chart (80/20)</span>
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              :class="activeTab === 'editor' ? 'bg-white text-[#008779] shadow-sm' : 'text-white hover:bg-white/10'"
              @click="activeTab = 'editor'"
            >
              <UIcon name="i-lucide-file-text" class="size-3.5" />
              <span>WYSIWYG Summary</span>
            </button>
          </div>
        </div>

        <!-- E-LEARNING PREREQUISITE & QUIZ GATING BANNER (Matching Image 4) -->
        <div
          v-if="!isELearningPassed"
          class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl text-white p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300"
        >
          <div class="flex items-center gap-3.5">
            <div class="size-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base shrink-0 border border-white/30">
              <UIcon name="i-lucide-graduation-cap" class="size-6 text-amber-100" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold tracking-tight">
                  เงื่อนไขการเรียนรู้ (E-Learning Prerequisite): Measure Phase Training
                </h3>
                <span class="bg-white/20 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Quiz Pending
                </span>
              </div>
              <p class="text-xs text-amber-100/90 mt-0.5 leading-relaxed">
                สำหรับผู้ใช้งานใหม่ ระบบได้ตั้งค่าให้ต้องผ่านบทเรียนและทำแบบทดสอบ (Quiz) ประจำเฟส Measure ให้ผ่านก่อน จึงจะสามารถบันทึกเครื่องมือในขั้นตอนถัดไปได้
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2.5 shrink-0">
            <NuxtLink
              to="/admin/e-learning"
              class="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer border border-white/30 flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-book-open" class="size-3.5" />
              <span>ดูหลักสูตร</span>
            </NuxtLink>

            <button
              type="button"
              class="bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              @click="handleTakeQuiz"
            >
              <UIcon name="i-lucide-check-circle" class="size-3.5 text-amber-700" />
              <span>ทำแบบทดสอบ Quiz (3 ข้อ)</span>
            </button>
          </div>
        </div>

        <!-- E-LEARNING COMPLETED BADGE -->
        <div
          v-else
          class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900 shadow-2xs"
        >
          <div class="flex items-center gap-2.5">
            <div class="size-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <UIcon name="i-lucide-badge-check" class="size-4" />
            </div>
            <div>
              <span class="font-bold">✓ ผ่านเกณฑ์ E-Learning Measure Phase Certified เรียบร้อยแล้ว</span>
              <p class="text-emerald-700 text-[11px]">ปลดล็อกเครื่องมือทุกตัวในหมวด Measure Phase สำหรับโครงการนี้เรียบร้อยแล้ว</p>
            </div>
          </div>

          <button
            type="button"
            class="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            @click="handleTakeQuiz"
          >
            <UIcon name="i-lucide-rotate-ccw" class="size-3" />
            <span>ทำแบบทดสอบทบทวนใหม่</span>
          </button>
        </div>

        <!-- 1. TOOL REGISTRY VIEW -->
        <div v-if="activeTab === 'tools'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink
            v-for="act in measureActivities"
            :key="act.title"
            :to="act.link"
            class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-[#008779] hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="size-9 rounded-xl bg-teal-50 text-[#008779] flex items-center justify-center group-hover:bg-[#008779] group-hover:text-white transition-colors">
                  <UIcon :name="act.icon" class="size-5" />
                </div>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <UIcon name="i-lucide-check-circle-2" class="size-3" />
                  <span>{{ act.status }}</span>
                </span>
              </div>
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-[#008779] transition-colors">
                {{ act.title }}
              </h3>
              <p class="text-xs text-slate-500 leading-relaxed">
                {{ act.desc }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-[#008779]">
              <span>Open Tool Workspace</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </NuxtLink>
        </div>

        <!-- 2. PARETO 80/20 VIEW -->
        <div v-else-if="activeTab === 'pareto'" class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Pareto 80/20 Loss Analysis</h3>
              <p class="text-xs text-slate-500">จำแนกสาเหตุที่ทำให้สูญเสียผลผลิต 80% แรกเพื่อมุ่งเน้นแก้ไขตรงจุด</p>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="item in paretoData" :key="item.defect" class="space-y-1 text-xs">
              <div class="flex justify-between font-semibold">
                <span class="text-slate-800">{{ item.defect }}</span>
                <span class="font-mono text-slate-600">{{ item.count }} ครั้ง ({{ item.pct }}% | สะสม {{ item.cumPct }}%)</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div :style="`width: ${item.pct}%; background-color: ${item.color}`" class="h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. WYSIWYG EDITOR VIEW -->
        <div v-else-if="activeTab === 'editor'" class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Executive Summary Editor</h3>
              <p class="text-xs text-slate-500">บันทึกข้อสรุปภาพรวมเพื่อนำไปแสดงในสไลด์นำเสนอและรายงานอัตโนมัติ</p>
            </div>
            <button
              type="button"
              class="bg-[#008779] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#007366] transition-colors cursor-pointer"
              @click="saveEditorNotes"
            >
              Save Notes
            </button>
          </div>

          <div v-if="isSaveConfirmed" class="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
            ✓ Executive Summary notes updated successfully.
          </div>

          <div class="border border-slate-200 rounded-2xl p-4 min-h-[220px] text-xs leading-relaxed text-slate-800 space-y-2 bg-slate-50/50" v-html="editorNotes"></div>
        </div>

      </div>
    </div>

    <!-- E-LEARNING QUIZ MODAL (Matching Requirement Image 4) -->
    <div
      v-if="isQuizModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-5 bg-gradient-to-r from-teal-900 via-[#008779] to-teal-800 text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="size-8 rounded-xl bg-white/20 flex items-center justify-center">
              <UIcon name="i-lucide-graduation-cap" class="size-5 text-amber-300" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">
                แบบทดสอบความรู้: Measure Phase Certification Quiz
              </h3>
              <span class="text-[10px] text-teal-200">เกณฑ์การผ่าน: ตอบถูก 3/3 ข้อ</span>
            </div>
          </div>
          <button
            type="button"
            class="text-white/80 hover:text-white p-1 rounded-lg cursor-pointer"
            @click="isQuizModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
          <div v-if="quizError" class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="size-4 text-rose-600 shrink-0" />
            <span>{{ quizError }}</span>
          </div>

          <div v-if="quizSubmitted && quizScore === quizQuestions.length" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl space-y-2">
            <div class="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <UIcon name="i-lucide-party-popper" class="size-5 text-emerald-600" />
              <span>ยินดีด้วย! คุณผ่านแบบทดสอบ Measure Phase (คะแนน 3/3)</span>
            </div>
            <p class="text-xs text-emerald-700">ระบบได้ปลดล็อกสิทธิ์การใช้งานเครื่องมือในเฟสนี้ให้แก่คุณเรียบร้อยแล้ว</p>
          </div>

          <div v-for="(q, qIdx) in quizQuestions" :key="q.id" class="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2.5">
            <h4 class="font-bold text-slate-900 leading-snug">{{ q.question }}</h4>
            <div class="space-y-1.5 pl-1">
              <label
                v-for="(opt, optIdx) in q.options"
                :key="optIdx"
                class="flex items-start gap-2.5 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                :class="quizAnswers[qIdx] === optIdx ? 'bg-white border-[#008779] shadow-2xs font-semibold text-[#008779]' : 'text-slate-700'"
              >
                <input
                  type="radio"
                  :name="`q_${q.id}`"
                  :value="optIdx"
                  v-model="quizAnswers[qIdx]"
                  class="accent-[#008779] mt-0.5"
                />
                <span class="text-xs">{{ opt }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            class="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            @click="isQuizModalOpen = false"
          >
            ปิด
          </button>
          <button
            type="button"
            class="bg-[#008779] hover:bg-[#007366] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            @click="submitQuiz"
          >
            ส่งคำตอบแบบทดสอบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
