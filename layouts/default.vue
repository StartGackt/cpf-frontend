<template>
  <div class="min-h-screen bg-[#F4F5F7] text-gray-800 font-sans flex flex-col antialiased">
    <!-- Top Navbar -->
    <AppNavbar />

    <!-- Main Container -->
    <main class="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 pb-20">
      <slot />
    </main>

    <!-- GenieWisdom Global AI Chatbot Copilot (Module 8 Requirement) -->
    <GenieWisdomChat />

    <!-- Footer Version Info -->
    <footer class="py-3 px-6 text-right text-[11px] text-gray-400">
      Version: v20251228.13c276e / v20260214.88733e
    </footer>
  </div>
</template>
