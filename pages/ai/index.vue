<script setup>
import { ref } from 'vue'

const prompt = ref('')
const messages = ref([
  {
    role: 'assistant',
    content: 'Hello! I am your AI assistant powered by Nuxt UI. How can I help you today?'
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
      content: `Thanks for asking about: "${userText}". Nuxt UI v4 provides rich components for AI chat interfaces!`
    })
    isSending.value = false
  }, 600)
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-primary/10 rounded-lg text-primary">
          <UIcon name="i-lucide-bot" class="size-6" />
        </div>
        <div>
          <h1 class="font-bold text-lg leading-none">AI Chat Assistant</h1>
          <p class="text-xs text-neutral-500 mt-1">Nuxt UI Chat Interface</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton to="/" label="Home" icon="i-lucide-home" variant="ghost" color="neutral" />
        <UButton to="/admin" label="Admin" icon="i-lucide-shield-check" variant="ghost" color="neutral" />
      </div>
    </header>

    <!-- Chat Area -->
    <main class="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col justify-between">
      <!-- Message List -->
      <div class="space-y-4 my-4 overflow-y-auto">
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
            class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
            :class="msg.role === 'user'
              ? 'bg-primary text-white'
              : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm'"
          >
            {{ msg.content }}
          </div>
        </div>

        <div v-if="isSending" class="flex gap-3 items-center text-neutral-400 text-xs">
          <UIcon name="i-lucide-loader-2" class="size-4 animate-spin text-primary" />
          <span>AI is thinking...</span>
        </div>
      </div>

      <!-- Input Box -->
      <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 shadow-sm flex items-center gap-2">
        <input
          v-model="prompt"
          type="text"
          placeholder="Ask anything..."
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
    </main>
  </div>
</template>
