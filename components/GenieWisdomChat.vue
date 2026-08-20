<script setup lang="ts">
import { ref } from 'vue'

const isChatOpen = ref(false)
const userMessage = ref('')
const isTyping = ref(false)

const chatMessages = ref([
  {
    sender: 'ai',
    text: 'สวัสดีครับคุณ Romteera (Black Belt)! ผมคือ **GenieWisdom AI Copilot** ผู้ช่วยอัจฉริยะด้าน Lean Six Sigma ประจำ InsightGenie มีอะไรให้ผมช่วยวิเคราะห์ข้อมูลสถิติ แนะนำเครื่องมือ DMAIC หรือตีความสมการ DOE ในโครงการของคุณไหมครับ?',
    time: '14:50'
  },
  {
    sender: 'user',
    text: 'ควรเลือกใช้ 2-Sample T Test หรือ One-Way ANOVA ในการวิเคราะห์ค่าความเร็วเครื่อง Predust ดีครับ?',
    time: '14:51'
  },
  {
    sender: 'ai',
    text: '💡 **คำแนะนำจาก GenieWisdom:**\n- หากคุณต้องการเปรียบเทียบ **2 ระดับความเร็ว** (เช่น 30Hz vs 40Hz) ให้ใช้ **2-Sample T Test** (หรือ Mann-Whitney หากข้อมูลไม่ Normal)\n- แต่หากคุณทดสอบ **3 ระดับขึ้นไป** (เช่น 30Hz, 40Hz, 50Hz) ให้ใช้ **One-Way ANOVA** เพื่อควบคุม Family-wise Error Rate (Type I Error) ครับ!',
    time: '14:52'
  }
])

const quickQuestions = [
  'Cpk ต่ำกว่า 1.0 ควรทำอย่างไร?',
  'อธิบายหลักการ Best Subsets Regression',
  'วิธีจัดทำ 5-Why Fishbone [C] vs [N]',
  'สรุปผลตอบแทน 12-Month Realization'
]

const sendMessage = (textToSend?: string) => {
  const content = textToSend || userMessage.value.trim()
  if (!content) return

  chatMessages.value.push({
    sender: 'user',
    text: content,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  userMessage.value = ''
  isTyping.value = true

  setTimeout(() => {
    isTyping.value = false
    chatMessages.value.push({
      sender: 'ai',
      text: `🤖 **GenieWisdom ตอบกลับสำหรับข้อคำถาม:** "${content}"\n\nระบบได้ดึงบริบทโครงการปัจจุบัน (*%Total Yield สินค้าไก่ทอดแช่แข็ง*) เข้ามาประมวลผล แนะนำให้ใช้ระเบียบวิธี Six Sigma DMAIC โดยตรวจสอบ P-Value (< 0.05) และล็อกมาตรฐานใน SOP ประจำจุดผลิตครับ`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  }, 1000)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 select-none">
    <!-- Floating Trigger Button with Magic Lamp Icon -->
    <button
      v-if="!isChatOpen"
      type="button"
      class="bg-gradient-to-r from-[#008779] to-teal-700 hover:from-teal-700 hover:to-[#007366] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 group border-2 border-amber-300/40"
      @click="isChatOpen = true"
    >
      <UIcon name="i-lucide-sparkles" class="size-5 text-amber-300 animate-pulse" />
      <span class="text-xs font-bold pr-1 font-sans">GenieWisdom AI</span>
      <span class="size-2 rounded-full bg-emerald-400"></span>
    </button>

    <!-- Chat Modal Window -->
    <div
      v-if="isChatOpen"
      class="w-[380px] sm:w-[440px] h-[580px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-[#008779] via-teal-800 to-teal-900 text-white p-4 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2.5">
          <div class="size-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <UIcon name="i-lucide-sparkles" class="size-4 text-amber-300" />
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h3 class="text-xs font-bold tracking-tight">GenieWisdom AI Copilot</h3>
              <span class="text-[9px] bg-emerald-500/30 border border-emerald-400 text-emerald-200 px-1.5 py-0.2 rounded-full font-semibold">Online</span>
            </div>
            <p class="text-[10px] text-teal-200 mt-0.5">Personalized Lean Six Sigma Expert</p>
          </div>
        </div>

        <button
          type="button"
          class="text-teal-200 hover:text-white p-1 rounded-md transition-colors"
          @click="isChatOpen = false"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>

      <!-- Context Tag Banner -->
      <div class="bg-teal-50/70 border-b border-teal-100 px-4 py-2 flex items-center justify-between text-[11px] text-teal-900">
        <span class="truncate">Context: <strong>%Total Yield สินค้าไก่ทอด</strong></span>
        <span class="text-[10px] text-[#008779] font-mono font-bold">Phase: DMAIC</span>
      </div>

      <!-- Messages Body -->
      <div class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
        <div
          v-for="(msg, idx) in chatMessages"
          :key="idx"
          class="flex flex-col"
          :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] rounded-xl p-3 space-y-1"
            :class="msg.sender === 'user' ? 'bg-[#008779] text-white rounded-br-none shadow-xs' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-2xs'"
          >
            <p class="whitespace-pre-line leading-relaxed">{{ msg.text }}</p>
            <span
              class="text-[9px] block text-right font-mono"
              :class="msg.sender === 'user' ? 'text-teal-100' : 'text-gray-400'"
            >
              {{ msg.time }}
            </span>
          </div>
        </div>

        <div v-if="isTyping" class="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg p-2.5 w-fit">
          <UIcon name="i-lucide-loader-2" class="size-3.5 animate-spin text-[#008779]" />
          <span>GenieWisdom กำลังวิเคราะห์ข้อมูลสถิติ...</span>
        </div>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div class="p-2.5 bg-white border-t border-gray-100 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <button
          v-for="(q, qIdx) in quickQuestions"
          :key="qIdx"
          type="button"
          class="shrink-0 bg-gray-100 hover:bg-teal-50 hover:text-[#008779] text-gray-700 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors border border-gray-200/80 cursor-pointer"
          @click="sendMessage(q)"
        >
          {{ q }}
        </button>
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          v-model="userMessage"
          type="text"
          placeholder="ถาม GenieWisdom เกี่ยวกับสถิติ หรือ DMAIC..."
          class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#008779] focus:bg-white"
          @keyup.enter="sendMessage()"
        />
        <button
          type="button"
          class="bg-[#008779] hover:bg-[#007366] text-white p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          :disabled="!userMessage.trim()"
          @click="sendMessage()"
        >
          <UIcon name="i-lucide-send" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
