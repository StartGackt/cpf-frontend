<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()

const isAdminDropdownOpen = ref(false)

const isActive = (path: string) => {
  if (path === '/admin' || path === '/') {
    return route.path === '/admin' || route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
      <!-- Left: Logo & Nav Items -->
      <div class="flex items-center gap-8">
        <!-- Logo -->
        <NuxtLink to="/admin" class="flex items-center gap-1.5 select-none group">
          <!-- Magic Lamp Logo Representation -->
          <div class="flex items-center">
            <span class="text-[#008779] font-black text-lg tracking-tight">IN</span>
            <!-- Lamp Icon -->
            <svg class="size-6 text-[#008779] inline-block mx-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C12.5 3 13 3.5 13 4C13 4.5 12.8 5 12.5 5.5L12 6C11 7.5 10 9 10 11H14C14.8 11 15.5 11.4 16 12L19 15C19.5 15.5 20 16 21 16H22V17C22 18.1 21.1 19 20 19H7C5.9 19 5 18.1 5 17V16H6C7 16 7.5 15.5 8 15L10 13V11C10 9 9 7.5 8 6L7.5 5.5C7.2 5 7 4.5 7 4C7 3.5 7.5 3 8 3C9 3 9.5 4 10 5L10.5 5.8C10.9 5.3 11.4 5 12 5C12.3 5 12.7 5.2 13 5.5L12 3Z" fill="url(#lampGrad)" />
              <path d="M8 19V20C8 20.6 8.4 21 9 21H15C15.6 21 16 20.6 16 20V19H8Z" fill="#008779" />
              <defs>
                <linearGradient id="lampGrad" x1="5" y1="3" x2="22" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00A896" />
                  <stop offset="0.5" stop-color="#008779" />
                  <stop offset="1" stop-color="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
            <span class="text-gray-800 font-black text-lg tracking-tight">IGHTGENIE</span>
          </div>
        </NuxtLink>

        <!-- Navigation Tabs -->
        <nav class="flex items-center gap-1 h-14">
          <!-- Dashboard Tab -->
          <NuxtLink
            to="/admin"
            class="flex items-center gap-2 px-3 h-14 text-sm font-medium transition-colors relative"
            :class="isActive('/admin') ? 'text-[#008779]' : 'text-gray-600 hover:text-gray-900'"
          >
            <UIcon name="i-lucide-home" class="size-4" />
            <span>Dashboard</span>
            <!-- Active indicator border at bottom -->
            <div
              v-if="isActive('/admin')"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008779]"
            />
          </NuxtLink>

          <!-- Projects Tab -->
          <NuxtLink
            to="/admin/projects"
            class="flex items-center gap-2 px-3 h-14 text-sm font-medium transition-colors relative"
            :class="isActive('/admin/projects') ? 'text-[#008779]' : 'text-gray-600 hover:text-gray-900'"
          >
            <UIcon name="i-lucide-folder" class="size-4" />
            <span>Projects</span>
            <div
              v-if="isActive('/admin/projects')"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008779]"
            />
          </NuxtLink>

          <!-- Admin Tab with dropdown -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 px-3 h-14 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
              @click="isAdminDropdownOpen = !isAdminDropdownOpen"
            >
              <UIcon name="i-lucide-settings" class="size-4" />
              <span>Admin</span>
              <UIcon name="i-lucide-chevron-down" class="size-3.5 text-gray-400" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isAdminDropdownOpen"
              class="absolute top-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-sm"
              @click="isAdminDropdownOpen = false"
            >
              <NuxtLink to="/admin" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-layout-dashboard" class="size-4" />
                <span>Dashboard</span>
              </NuxtLink>
              <NuxtLink to="/ai" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-bot" class="size-4" />
                <span>AI Assistant</span>
              </NuxtLink>
              <NuxtLink to="/admin/roadmap" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-map" class="size-4" />
                <span>Roadmap V2.0</span>
              </NuxtLink>
              <NuxtLink to="/admin/users" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-users" class="size-4" />
                <span>User Management</span>
              </NuxtLink>
              <NuxtLink to="/admin/master-data" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-database" class="size-4" />
                <span>Master Data</span>
              </NuxtLink>
              <NuxtLink to="/admin/approvals" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-check-square" class="size-4" />
                <span>Approvals</span>
              </NuxtLink>
              <NuxtLink to="/admin/data-migration" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-file-spreadsheet" class="size-4" />
                <span>Data Migration</span>
              </NuxtLink>
              <NuxtLink to="/admin/e-learning" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#008779]">
                <UIcon name="i-lucide-graduation-cap" class="size-4" />
                <span>E-Learning</span>
              </NuxtLink>
            </div>
          </div>
        </nav>
      </div>

      <!-- Right: Actions & User Info -->
      <div class="flex items-center gap-4">
        <!-- Font Size Tool -->
        <button class="text-xs font-semibold text-gray-500 hover:text-gray-800 px-1.5 py-0.5 rounded border border-gray-300 hover:border-gray-400 transition-colors">
          Aa
        </button>

        <!-- Language Switcher Flag -->
        <div class="flex items-center cursor-pointer hover:opacity-80">
          <span class="text-base" title="English">🇺🇸</span>
        </div>

        <!-- Notification Bell with Red Badge -->
        <button class="relative p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
          <UIcon name="i-lucide-bell" class="size-5" />
          <span class="absolute 0 top-0.5 right-0.5 size-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
            2
          </span>
        </button>

        <!-- User Greeting -->
        <div class="hidden sm:block text-sm text-gray-700">
          Welcome, <span class="font-medium text-gray-900">Romteera Tadderm</span>
        </div>

        <!-- User Avatar Circle Initials -->
        <div class="size-8 rounded-full bg-[#008779] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#008779]/30 transition-all">
          RT
        </div>
      </div>
    </div>
  </header>
</template>
