<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div
    class="text-slate-800 font-sans flex flex-col antialiased"
    :class="route.path.startsWith('/admin/chatbot') ? 'h-screen overflow-hidden bg-white' : 'min-h-screen bg-[#F8FAFD]'"
  >
    <!-- Top Navbar -->
    <AppNavbar />

    <!-- Main Container -->
    <main
      class="flex-1 w-full"
      :class="route.path.startsWith('/admin/chatbot') ? 'p-0 m-0 max-w-none h-[calc(100vh-3.5rem)] overflow-hidden' : 'max-w-[1700px] mx-auto px-4 sm:px-6 py-6 pb-20'"
    >
      <slot />
    </main>

    <!-- GenieWisdom Global AI Chatbot Copilot (Module 8 Requirement) -->
    <GenieWisdomChat v-if="!route.path.startsWith('/admin/chatbot')" />

    <!-- Footer Version Info -->
    <footer v-if="!route.path.startsWith('/admin/chatbot')" class="py-3 px-6 text-right text-[11px] text-slate-400">
      InsightGenie Enterprise Lean Six Sigma Platform • Version: v20260214.88733e
    </footer>
  </div>
</template>
