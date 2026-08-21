<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useProjectData } from '~/composables/useProjectData'
import { useCompanyDirectory } from '~/composables/useCompanyDirectory'

const isChatOpen = ref(false)
const userMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// Project context connection
const defaultProjectId = ref('example-total-yield')
const projectStore = computed(() => useProjectData(defaultProjectId.value))
const project = computed(() => projectStore.value.project.value)
const summary = computed(() => projectStore.value.projectSummary.value)
const capability = computed(() => projectStore.value.capabilityMetrics.value)

// User context
const { users } = useCompanyDirectory()
const activeUser = computed(() => users.value?.[0] || { name: 'Romteera Tadderm', initials: 'RT', belt: 'Black Belt' })

interface MiniMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  time: string
  thought?: string
  showThought?: boolean
  copied?: boolean
  feedback?: 'like' | 'dislike'
  hasMiniTrend?: boolean
  hasMiniTable?: boolean
}

const chatMessages = ref<MiniMessage[]>([
  {
    id: 'm1',
    sender: 'ai',
    text: 'สวัสดีครับคุณ Romteera (Black Belt)! ผมคือ **GenieWisdom 2.5 Pro** ผู้ช่วยอัจฉริยะด้าน Lean Six Sigma\n\nระบบเชื่อมโยงข้อมูลโครงการ **Example เพิ่ม %Total Yield สินค้าไก่ทอด (Improve Phase)** เรียบร้อยแล้ว พร้อมช่วยวิเคราะห์สถิติ, วาดกราฟแนวโน้ม, หรือทบทวน Stage Gate ครับ ✨',
    time: '14:50',
    thought: 'Synced project store: example-total-yield • Current Yield = 87.70% • Cpk = 1.12 • Alpha = 0.05',
    showThought: false
  },
  {
    id: 'm2',
    sender: 'user',
    text: 'ควรเลือกใช้ 2-Sample T Test หรือ One-Way ANOVA ในการวิเคราะห์ค่าความเร็วเครื่อง Predust ดีครับ?',
    time: '14:51'
  },
  {
    id: 'm3',
    sender: 'ai',
    text: '💡 **คำแนะนำการเลือกสถิติ:**\n\n- **2 ระดับความเร็ว (30Hz vs 40Hz):** ให้ใช้ **2-Sample T Test** (หรือ Mann-Whitney หากข้อมูลไม่ Normal)\n- **3 ระดับขึ้นไป (30Hz, 40Hz, 50Hz):** ให้ใช้ **One-Way ANOVA (F-Test)** เพื่อคุม Family-wise Error Rate\n\n📊 *ข้อมูลในระบบของท่านพบว่าความเร็ว 40Hz มีนัยสำคัญสูงสุด ($P = 0.012$)*',
    time: '14:52',
    thought: 'Queried HypothesisTests: Factor Predust Speed • One-Way ANOVA P = 0.012 < 0.05 • Vital Few Confirmed',
    showThought: false,
    hasMiniTrend: true
  }
])

const quickQuestions = [
  '📈 พล็อตกราฟแนวโน้ม Yield 12 เดือน',
  '📊 วิเคราะห์ Process Cpk Bell Curve',
  '🧪 สถิติ ANOVA Predust 40Hz',
  '💰 สรุป Financial Realization'
]

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const sendMessage = (textToSend?: string) => {
  const content = textToSend || userMessage.value.trim()
  if (!content || isTyping.value) return

  chatMessages.value.push({
    id: `m-${Date.now()}`,
    sender: 'user',
    text: content,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  userMessage.value = ''
  isTyping.value = true
  scrollToBottom()

  setTimeout(() => {
    isTyping.value = false
    let replyText = ''
    let thought = ''
    let hasMiniTrend = false
    let hasMiniTable = false

    const p = project.value
    const sum = summary.value
    const cap = capability.value

    if (content.includes('แนวโน้ม') || content.includes('Trend') || content.includes('Forecast') || content.includes('กราฟ')) {
      thought = `Computed Linear Regression Trendline: Beta = +0.33%/month • Target = 87.15% • Forecast Q4 = 89.20%`
      replyText = `📈 **วิเคราะห์แนวโน้ม Yield & Forecast:**\n- **Baseline เดิม:** ${sum.baselineYield}\n- **ยอด Yield ปัจจุบัน:** **${sum.finalYield}** (${sum.yieldImprovement})\n- **คาดการณ์ปลายปี (Forecast):** **89.20%** (เกินเป้าหมาย ${sum.goalLssYield})\n- **ประหยัดสะสม:** ${sum.verifiedAnnualSavings}`
      hasMiniTrend = true
    } else if (content.includes('Cpk') || content.includes('Capability') || content.includes('ระฆัง')) {
      thought = `Loaded Capability Metrics: Mean = ${p.capability.sampleMean}%, StdDev = ${p.capability.sampleStdDev}, USL = ${p.capability.usl}%, LSL = ${p.capability.lsl}%`
      replyText = `📊 **วิเคราะห์ Process Cpk:**\n- **ค่า Process Cpk ปัจจุบัน:** **${cap.cpk}** (${cap.isCapable ? 'Capable' : '⚠️ ต่ำกว่า 1.33'})\n- **Mean กระบวนการ:** ${p.capability.sampleMean}%\n- **คำแนะนำ:** ปรับ Mean ไปที่ Target ${p.capability.targetVal}% และลด StdDev ให้ $\\le 0.95$`
    } else {
      thought = `Analyzed Six Sigma intent for project: ${p.name} • Phase: ${p.phase}`
      replyText = `🤖 **GenieWisdom 2.5 Pro ตอบกลับ:** "${content}"\n\nจากการตรวจสอบข้อมูลโครงการ **${p.name}** ระบบได้อัปเดตสถิติและแผน Action Items ล่าสุดแล้ว หากต้องการดูการวิเคราะห์แบบเต็มจอ สามารถคลิกปุ่ม **"เปิดหน้าจอเต็ม"** ด้านบนได้เลยครับ!`
    }

    chatMessages.value.push({
      id: `m-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thought: thought,
      showThought: false,
      hasMiniTrend: hasMiniTrend,
      hasMiniTable: hasMiniTable
    })

    scrollToBottom()
  }, 700)
}

const copyMessage = (msg: MiniMessage) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(msg.text)
    msg.copied = true
    setTimeout(() => {
      msg.copied = false
    }, 2000)
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 select-none">
    
    <!-- Floating Trigger Capsule Button (Gemini Sparkle Style) -->
    <button
      v-if="!isChatOpen"
      type="button"
      class="bg-gradient-to-r from-[#008779] via-teal-700 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-2.5 cursor-pointer transition-all duration-300 transform hover:scale-105 group border border-white/20"
      @click="isChatOpen = true"
    >
      <div class="size-6 rounded-full bg-white/20 flex items-center justify-center">
        <UIcon name="i-lucide-sparkles" class="size-3.5 text-amber-300 animate-pulse" />
      </div>
      <div class="text-left">
        <div class="flex items-center gap-1.5 leading-none">
          <span class="text-xs font-bold font-sans">Ask GenieWisdom</span>
          <span class="size-1.5 rounded-full bg-emerald-400"></span>
        </div>
        <span class="text-[10px] text-teal-100 font-normal">Six Sigma AI Copilot</span>
      </div>
    </button>

    <!-- Gemini-Style Floating Chat Modal Window -->
    <div
      v-if="isChatOpen"
      class="w-[390px] sm:w-[450px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Gemini Top Header Bar -->
      <div class="h-14 px-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shrink-0">
        <!-- Left: Logo & Model Pill -->
        <div class="flex items-center gap-2">
          <div class="size-7 rounded-full bg-gradient-to-tr from-[#008779] to-indigo-600 text-white flex items-center justify-center shadow-2xs">
            <UIcon name="i-lucide-sparkles" class="size-4 text-amber-300" />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="bg-gradient-to-r from-[#008779] to-indigo-600 bg-clip-text text-transparent font-bold text-sm">
              GenieWisdom
            </span>
            <span class="text-[10px] font-medium bg-teal-50 text-[#008779] border border-teal-200/80 px-2 py-0.2 rounded-full">
              2.5 Pro
            </span>
          </div>
        </div>

        <!-- Right: Actions (Open Fullscreen, Close) -->
        <div class="flex items-center gap-1">
          <!-- Direct Link to Full Chatbot Page -->
          <NuxtLink
            to="/admin/chatbot"
            class="p-1.5 text-slate-400 hover:text-[#008779] hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
            title="Open Full Page Chatbot"
            @click="isChatOpen = false"
          >
            <UIcon name="i-lucide-maximize-2" class="size-3.5" />
            <span class="text-[10px]">Full View</span>
          </NuxtLink>

          <!-- Close Modal -->
          <button
            type="button"
            class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            @click="isChatOpen = false"
            title="Close"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>

      <!-- Active Project Context Strip -->
      <div class="bg-[#F0F4F9] border-b border-slate-200/70 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-700 shrink-0">
        <div class="flex items-center gap-1.5 truncate max-w-[70%]">
          <UIcon name="i-lucide-folder-kanban" class="size-3 text-[#008779] shrink-0" />
          <span class="truncate font-medium text-[10px]">{{ project.name }}</span>
        </div>
        <span class="text-[9px] font-bold bg-[#008779] text-white px-1.5 py-0.2 rounded-full">
          {{ project.phase }} Phase
        </span>
      </div>

      <!-- Messages Body (Gemini Minimalist Bubble Layout) -->
      <div
        ref="chatContainer"
        class="flex-1 p-4 overflow-y-auto space-y-4 bg-white text-xs scrollbar-thin"
      >
        <div
          v-for="msg in chatMessages"
          :key="msg.id"
          class="space-y-1.5 animate-in fade-in duration-150"
        >
          <!-- User Message -->
          <div v-if="msg.sender === 'user'" class="flex justify-end items-start gap-2">
            <div class="bg-[#E3E8EF] text-slate-900 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs max-w-[85%] leading-relaxed shadow-2xs font-normal">
              {{ msg.text }}
            </div>
            <div class="size-6 rounded-full bg-[#008779] text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
              {{ activeUser.initials }}
            </div>
          </div>

          <!-- AI Message -->
          <div v-else class="flex items-start gap-2.5 group">
            <div class="size-6 rounded-full bg-gradient-to-tr from-[#008779] to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <UIcon name="i-lucide-sparkles" class="size-3 text-amber-300" />
            </div>

            <div class="flex-1 space-y-2 min-w-0">
              <!-- AI Header & Thought Process Pill -->
              <div class="flex items-center gap-1.5 text-[10px]">
                <span class="font-bold text-slate-900">GenieWisdom</span>
                
                <button
                  v-if="msg.thought"
                  type="button"
                  class="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.2 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                  @click="msg.showThought = !msg.showThought"
                >
                  <UIcon name="i-lucide-brain" class="size-2.5 text-[#008779]" />
                  <span>{{ msg.showThought ? 'Hide thought' : 'Thought process' }}</span>
                </button>
              </div>

              <!-- Expanded Thought Box -->
              <div v-if="msg.showThought && msg.thought" class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 font-mono">
                {{ msg.thought }}
              </div>

              <!-- Message Body -->
              <div class="text-xs text-slate-800 leading-relaxed space-y-1.5 whitespace-pre-line font-normal">
                {{ msg.text }}
              </div>

              <!-- Mini Interactive Trend Graphic (if applicable) -->
              <div v-if="msg.hasMiniTrend" class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 my-2 space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-slate-600 font-medium">
                  <span>Yield Trendline (M1 ➜ M12 Forecast)</span>
                  <span class="text-[#008779] font-bold">+0.33%/mo</span>
                </div>
                <div class="h-20 w-full">
                  <svg class="w-full h-full" viewBox="0 0 320 80">
                    <!-- Background Grid Line -->
                    <line x1="10" y1="65" x2="310" y2="65" stroke="#e2e8f0" stroke-width="1" />
                    <!-- Target Line (Red Dashed) -->
                    <line x1="10" y1="28" x2="310" y2="28" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3" />
                    <!-- Actual Yield Curve -->
                    <polyline
                      points="20,60 50,45 80,45 110,50 140,55 170,38 200,24"
                      fill="none"
                      stroke="#008779"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    />
                    <!-- Forecast Curve (Dashed Indigo) -->
                    <polyline
                      points="200,24 230,30 260,25 290,20 310,14"
                      fill="none"
                      stroke="#6366f1"
                      stroke-width="2"
                      stroke-dasharray="4,3"
                      stroke-linecap="round"
                    />
                    <!-- Dots -->
                    <circle cx="20" cy="60" r="3" fill="#008779" />
                    <circle cx="200" cy="24" r="3.5" fill="#008779" stroke="#fff" stroke-width="1.5" />
                    <circle cx="310" cy="14" r="3.5" fill="#6366f1" stroke="#fff" stroke-width="1.5" />
                  </svg>
                </div>
              </div>

              <!-- Action Toolbar -->
              <div class="flex items-center gap-2 pt-0.5 text-slate-400 text-[10px]">
                <button
                  type="button"
                  class="hover:text-slate-700 flex items-center gap-1 p-0.5 rounded transition-colors cursor-pointer"
                  @click="copyMessage(msg)"
                  title="Copy text"
                >
                  <UIcon :name="msg.copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3" :class="msg.copied ? 'text-emerald-600' : ''" />
                </button>
                <button
                  type="button"
                  class="hover:text-emerald-600 p-0.5 rounded transition-colors cursor-pointer"
                  :class="msg.feedback === 'like' ? 'text-emerald-600 font-bold' : ''"
                  @click="msg.feedback = msg.feedback === 'like' ? undefined : 'like'"
                  title="Good response"
                >
                  <UIcon name="i-lucide-thumbs-up" class="size-3" />
                </button>
                <button
                  type="button"
                  class="hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                  :class="msg.feedback === 'dislike' ? 'text-rose-600 font-bold' : ''"
                  @click="msg.feedback = msg.feedback === 'dislike' ? undefined : 'dislike'"
                  title="Bad response"
                >
                  <UIcon name="i-lucide-thumbs-down" class="size-3" />
                </button>
                <span class="ml-auto text-[9px] text-teal-700 flex items-center gap-1">
                  <UIcon name="i-lucide-database" class="size-2.5 text-[#008779]" />
                  <span>Grounding Synced</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex items-center gap-2 pt-1 text-slate-500 text-xs">
          <div class="size-5 rounded-full bg-gradient-to-tr from-[#008779] to-indigo-600 text-white flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-sparkles" class="size-3 text-amber-300 animate-spin" />
          </div>
          <span class="text-[11px]">GenieWisdom is thinking...</span>
        </div>
      </div>

      <!-- Quick Prompt Suggestions Carousel -->
      <div class="p-2 bg-slate-50/90 border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
        <button
          v-for="(q, qIdx) in quickQuestions"
          :key="qIdx"
          type="button"
          class="shrink-0 bg-white hover:bg-teal-50 hover:text-[#008779] hover:border-teal-200 text-slate-700 text-[10px] font-normal px-2.5 py-1 rounded-full transition-colors border border-slate-200/80 cursor-pointer shadow-2xs"
          @click="sendMessage(q)"
        >
          {{ q }}
        </button>
      </div>

      <!-- Gemini Floating Capsule Input Area -->
      <div class="p-3 bg-white border-t border-slate-100 shrink-0">
        <div class="bg-[#F0F4F9] focus-within:bg-white border border-transparent focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-[#008779]/15 rounded-2xl p-2 transition-all flex items-center gap-2">
          <!-- Text Input -->
          <input
            v-model="userMessage"
            type="text"
            placeholder="Ask GenieWisdom (Gemini for Six Sigma)..."
            class="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none px-1 leading-relaxed"
            @keydown.enter.prevent="sendMessage()"
          />

          <!-- Action Send Button (Circle Arrow) -->
          <button
            type="button"
            class="size-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
            :class="userMessage.trim() && !isTyping
              ? 'bg-[#008779] text-white hover:bg-[#007366]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
            :disabled="!userMessage.trim() || isTyping"
            @click="sendMessage()"
          >
            <UIcon name="i-lucide-arrow-up" class="size-3.5" />
          </button>
        </div>

        <p class="text-center text-[9px] text-slate-400 mt-1">
          GenieWisdom can make mistakes. Verify critical Six Sigma decisions.
        </p>
      </div>

    </div>

  </div>
</template>
