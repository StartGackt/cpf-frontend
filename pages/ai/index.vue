<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')
const messages = ref([
  {
    role: 'assistant',
    content: 'Hello! I am your AI assistant powered by Nuxt UI. How can I help you manage the CPF portal today?'
  }
])

const isSending = ref(false)

function sendMessage() {
  if (!prompt.value.trim()) return
  
  messages.value.push({
    role: 'user',
    content: prompt.value
  })
  
  const userText = prompt.value
  prompt.value = ''
  isSending.value = true

  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `I received your query: "${userText}". Nuxt UI and CPF Admin components are fully linked and operational!`
    })
    isSending.value = false
  }, 500)
}
</script>

<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
    <!-- Chat Header -->
    <div class="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-primary/10 rounded-lg text-primary">
          <UIcon name="i-lucide-bot" class="size-6" />
        </div>
        <div>
          <h1 class="font-bold text-lg leading-tight text-neutral-900 dark:text-white">
            AI Assistant
          </h1>
          <p class="text-xs text-neutral-500">Ask questions, analyze reports, or generate insights</p>
        </div>
      </div>
      <UBadge color="primary" variant="subtle">Online</UBadge>
    </div>

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto my-4 space-y-4 pr-2 scrollbar-thin">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex gap-3"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          v-if="msg.role === 'assistant'"
          class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1"
        >
          <UIcon name="i-lucide-sparkles" class="size-4" />
        </div>

        <div
          class="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm"
          :class="msg.role === 'user'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-xs'"
        >
          {{ msg.content }}
        </div>
      </div>

      <div v-if="isSending" class="flex gap-2 items-center text-neutral-400 text-xs pl-11">
        <UIcon name="i-lucide-loader-2" class="size-4 animate-spin text-primary" />
        <span>Thinking...</span>
      </div>
    </div>

    <!-- Input Bar -->
    <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 shadow-xs flex items-center gap-2">
      <input
        v-model="prompt"
        type="text"
        placeholder="Type a message or prompt..."
        class="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
        @keydown.enter="sendMessage"
      />
      <UButton
        icon="i-lucide-send"
        color="primary"
        :disabled="!prompt.trim() || isSending"
        @click="sendMessage"
      />
    </div>
  </div>
</template>
