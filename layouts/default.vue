<template>
  <div class="min-h-screen bg-[#F4F5F7] text-gray-800 font-sans flex flex-col antialiased">
    <!-- Top Navbar -->
    <AppNavbar />

    <!-- Main Container -->
    <main class="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 pb-20">
      <slot />
    </main>

    <!-- Floating Help Button -->
    <button class="fixed bottom-6 right-6 bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 z-30 cursor-pointer">
      <UIcon name="i-lucide-help-circle" class="size-4" />
      <span>Help</span>
    </button>

    <!-- Footer Version Info -->
    <footer class="py-3 px-6 text-right text-[11px] text-gray-400">
      Version: v20251228.13c276e / v20260214.88733e
    </footer>
  </div>
</template>
