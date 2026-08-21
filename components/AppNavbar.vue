<script setup lang="ts">
import { ref } from 'vue'
import { useCompanyDirectory } from '~/composables/useCompanyDirectory'

const route = useRoute()
const { pendingRequestsCount } = useCompanyDirectory()

const isAdminDropdownOpen = ref(false)

const isActive = (path: string) => {
  if (path === '/admin' || path === '/') {
    return route.path === '/admin' || route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 select-none shadow-2xs">
    <div class="max-w-[1800px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <!-- Left: Logo & Nav Items -->
      <div class="flex items-center gap-6 lg:gap-8">
        <!-- Logo -->
        <NuxtLink to="/admin" class="flex items-center select-none group cursor-pointer py-1">
          <!-- IN in Brand Teal -->
          <span class="text-[#008779] font-black text-xl tracking-tight leading-none">IN</span>

          <!-- Magic Lamp & Smoke Emblem -->
          <div class="relative mx-1 -mt-0.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg class="h-6 w-7" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Magic Lamp Body -->
              <path d="M4 17.2C4 17.2 5.5 18.8 11 18.8C16.5 18.8 21.5 17.8 23.5 15.3C24.8 13.6 23.5 12 20.8 12C18.5 12 16.5 13.3 12 13.3C8 13.3 5.8 11.8 4.5 13.8C3.8 15.2 4 17.2 4 17.2Z" fill="url(#lampGrad)" />
              <!-- Lamp Stand Base -->
              <path d="M8 18.8C8 18.8 9.5 20.2 13.5 20.2C17.5 20.2 19 18.8 19 18.8H8Z" fill="#008779" />
              <!-- Lamp Handle -->
              <path d="M21 12.3C23.2 12.3 25.5 10.8 25.5 9.3C25.5 7.8 23.5 8.3 21.8 9.3C20.5 10 20.8 11.6 21 12.3Z" fill="#2563EB" />
              <!-- Magic Smoke Rising from Spout -->
              <path d="M6 13.8C5 11.8 5.5 9.6 7.5 7.8C9 6.3 8 4.6 9.2 3C9.8 2.3 10.8 2 11.5 2.6C12.2 3.2 11.2 4.8 12.5 6C13.5 7 12.8 9.3 10 11" stroke="url(#smokeGrad)" stroke-width="1.6" stroke-linecap="round" />
              <!-- Sparkles / Magic Stars -->
              <circle cx="12.5" cy="2" r="1.1" fill="#008779" />
              <circle cx="15.2" cy="4.5" r="0.8" fill="#3B82F6" />
              <path d="M7 5.8L7.6 7L8.8 7.6L7.6 8.2L7 9.4L6.4 8.2L5.2 7.6L6.4 7L7 5.8Z" fill="#00A896" />
              <defs>
                <linearGradient id="lampGrad" x1="4" y1="12" x2="24" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#008779" />
                  <stop offset="0.5" stop-color="#0284C7" />
                  <stop offset="1" stop-color="#1E40AF" />
                </linearGradient>
                <linearGradient id="smokeGrad" x1="6" y1="2" x2="12" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#00A896" />
                  <stop offset="0.6" stop-color="#0284C7" />
                  <stop offset="1" stop-color="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- IGHTGENIE in Navy -->
          <span class="text-[#071E3D] font-black text-xl tracking-tight leading-none">IGHTGENIE</span>
        </NuxtLink>

        <!-- Navigation Tabs (Pill Style like Gemini) -->
        <nav class="flex items-center gap-1">
          <!-- Dashboard Tab -->
          <NuxtLink
            to="/admin"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            :class="isActive('/admin')
              ? 'bg-[#E3E8EF] text-[#008779] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <UIcon name="i-lucide-layout-dashboard" class="size-3.5" />
            <span>Dashboard</span>
          </NuxtLink>

          <!-- Projects Tab -->
          <NuxtLink
            to="/admin/projects"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            :class="isActive('/admin/projects')
              ? 'bg-[#E3E8EF] text-[#008779] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <UIcon name="i-lucide-folder-kanban" class="size-3.5" />
            <span>Projects</span>
          </NuxtLink>

          <!-- Approvals Tab Direct Link -->
          <NuxtLink
            to="/admin/approvals"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all relative"
            :class="isActive('/admin/approvals')
              ? 'bg-[#E3E8EF] text-[#008779] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <UIcon name="i-lucide-clipboard-check" class="size-3.5" />
            <span>Approvals</span>
            <span
              v-if="pendingRequestsCount > 0"
              class="size-1.5 rounded-full bg-amber-500 animate-pulse"
              title="Pending approvals / requests"
            ></span>
          </NuxtLink>

          <!-- KM Repository Tab -->
          <NuxtLink
            to="/admin/km-repository"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            :class="isActive('/admin/km-repository')
              ? 'bg-[#E3E8EF] text-[#008779] shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <UIcon name="i-lucide-book-open" class="size-3.5" />
            <span>GenieWisdom (KM)</span>
          </NuxtLink>

          <!-- Chatbot Tab -->
          <NuxtLink
            to="/admin/chatbot"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            :class="isActive('/admin/chatbot')
              ? 'bg-gradient-to-r from-teal-50 to-indigo-50 text-[#008779] border border-teal-200/80 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            <UIcon name="i-lucide-bot" class="size-3.5 text-[#008779]" />
            <span class="bg-gradient-to-r from-[#008779] to-indigo-600 bg-clip-text text-transparent font-bold">Chatbot AI</span>
          </NuxtLink>

          <!-- Admin Dropdown Tab -->
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              @click="isAdminDropdownOpen = !isAdminDropdownOpen"
            >
              <UIcon name="i-lucide-settings" class="size-3.5" />
              <span>Admin</span>
              <UIcon name="i-lucide-chevron-down" class="size-3 text-slate-400" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isAdminDropdownOpen"
              class="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
              @click="isAdminDropdownOpen = false"
            >
              <NuxtLink to="/admin/users" class="flex items-center justify-between px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#008779] rounded-lg mx-1">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-users" class="size-4 text-slate-500" />
                  <span>User Management</span>
                </div>
                <span v-if="pendingRequestsCount > 0" class="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                  {{ pendingRequestsCount }}
                </span>
              </NuxtLink>
              <NuxtLink to="/admin/approvals" class="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#008779] rounded-lg mx-1">
                <UIcon name="i-lucide-check-square" class="size-4 text-slate-500" />
                <span>Approval Center (PCR/PFR)</span>
              </NuxtLink>
              <NuxtLink to="/admin/e-learning" class="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#008779] rounded-lg mx-1">
                <UIcon name="i-lucide-graduation-cap" class="size-4 text-slate-500" />
                <span>E-Learning</span>
              </NuxtLink>
              <NuxtLink to="/admin/master-data" class="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#008779] rounded-lg mx-1">
                <UIcon name="i-lucide-database" class="size-4 text-slate-500" />
                <span>Master Data</span>
              </NuxtLink>
              <NuxtLink to="/admin/data-migration" class="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#008779] rounded-lg mx-1">
                <UIcon name="i-lucide-file-spreadsheet" class="size-4 text-slate-500" />
                <span>Data Migration</span>
              </NuxtLink>
            </div>
          </div>
        </nav>
      </div>

      <!-- Right: Actions & User Info (Gemini Capsule) -->
      <div class="flex items-center gap-3">
        <!-- Notification Bell with Badge -->
        <NuxtLink
          to="/admin/approvals"
          class="relative size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Pending Approvals & Notifications"
        >
          <UIcon name="i-lucide-bell" class="size-4" />
          <span
            v-if="pendingRequestsCount > 0"
            class="absolute top-1 right-1 size-2 bg-amber-500 rounded-full ring-2 ring-white"
          ></span>
        </NuxtLink>

        <!-- User Profile Pill -->
        <div class="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 rounded-full pl-1 pr-3 py-1 transition-colors cursor-pointer shadow-2xs">
          <div class="size-6 rounded-full bg-[#008779] text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
            RT
          </div>
          <div class="hidden sm:flex items-center gap-1.5 text-xs">
            <span class="font-semibold text-slate-800 text-[11px]">Romteera T.</span>
            <span class="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full border border-purple-200">
              Black Belt
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
