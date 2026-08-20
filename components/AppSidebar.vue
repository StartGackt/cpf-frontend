<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()
const colorMode = useColorMode()

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

interface NavItem {
  label: string
  icon: string
  to?: string
  badge?: string
  badgeColor?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  children?: { label: string; to: string; badge?: string }[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/admin'
      },
      {
        label: 'Analytics',
        icon: 'i-lucide-bar-chart-3',
        to: '/admin/analytics',
        badge: 'Pro',
        badgeColor: 'neutral'
      }
    ]
  },
  {
    title: 'AI & Automation',
    items: [
      {
        label: 'AI Assistant',
        icon: 'i-lucide-bot',
        to: '/ai',
        badge: 'New',
        badgeColor: 'primary'
      },
      {
        label: 'Prompt Studio',
        icon: 'i-lucide-sparkles',
        to: '/ai/prompts'
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        label: 'Users & Roles',
        icon: 'i-lucide-users',
        to: '/admin/users'
      },
      {
        label: 'Products',
        icon: 'i-lucide-package',
        to: '/admin/products'
      },
      {
        label: 'Orders',
        icon: 'i-lucide-shopping-cart',
        to: '/admin/orders',
        badge: '12',
        badgeColor: 'success'
      }
    ]
  },
  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        icon: 'i-lucide-settings',
        to: '/admin/settings'
      },
      {
        label: 'Activity Logs',
        icon: 'i-lucide-file-text',
        to: '/admin/logs'
      }
    ]
  }
]

const isActive = (path?: string) => {
  if (!path) return false
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="relative flex flex-col h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 ease-in-out shrink-0 select-none z-30"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Brand / Header -->
    <div class="h-16 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
      <NuxtLink to="/admin" class="flex items-center gap-3 overflow-hidden">
        <div class="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shrink-0 shadow-md shadow-primary/20">
          <UIcon name="i-lucide-shield-check" class="size-6" />
        </div>
        <div v-if="!isCollapsed" class="flex flex-col overflow-hidden transition-opacity duration-200">
          <span class="font-bold text-base tracking-tight text-neutral-900 dark:text-white truncate">
            CPF Portal
          </span>
          <span class="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Admin System
          </span>
        </div>
      </NuxtLink>

      <!-- Collapse / Expand Toggle Button -->
      <UButton
        :icon="isCollapsed ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'"
        variant="ghost"
        color="neutral"
        size="xs"
        class="hidden lg:flex"
        @click="toggleSidebar"
      />
    </div>

    <!-- Navigation List -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 scrollbar-thin">
      <div v-for="(section, idx) in navigationSections" :key="idx" class="space-y-1">
        <!-- Section Header (Only when expanded) -->
        <p
          v-if="!isCollapsed"
          class="px-3 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider"
        >
          {{ section.title }}
        </p>
        <div v-else class="h-px bg-neutral-200 dark:bg-neutral-800 my-2 mx-2"></div>

        <!-- Section Items -->
        <NuxtLink
          v-for="item in section.items"
          :key="item.label"
          :to="item.to || '#'"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative"
          :class="[
            isActive(item.to)
              ? 'bg-primary text-white shadow-sm shadow-primary/30'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
          ]"
        >
          <!-- Icon -->
          <UIcon
            :name="item.icon"
            class="size-5 shrink-0 transition-transform group-hover:scale-110"
            :class="isActive(item.to) ? 'text-white' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary'"
          />

          <!-- Label -->
          <span
            v-if="!isCollapsed"
            class="truncate flex-1"
          >
            {{ item.label }}
          </span>

          <!-- Badge -->
          <UBadge
            v-if="!isCollapsed && item.badge"
            :color="isActive(item.to) ? 'neutral' : (item.badgeColor || 'primary')"
            variant="subtle"
            size="xs"
            class="ml-auto font-semibold"
          >
            {{ item.badge }}
          </UBadge>

          <!-- Tooltip indicator for collapsed state -->
          <div
            v-if="isCollapsed"
            class="absolute left-full ml-3 px-2.5 py-1.5 bg-neutral-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap"
          >
            {{ item.label }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Sidebar Footer (Theme Toggle & User Profile) -->
    <div class="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-2">
      <!-- Quick Actions (Theme toggle) -->
      <div
        class="flex items-center gap-2 p-1 rounded-lg"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <div v-if="!isCollapsed" class="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" class="size-4" />
          <span>{{ colorMode.value === 'dark' ? 'Dark Mode' : 'Light Mode' }}</span>
        </div>

        <UButton
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          variant="ghost"
          color="neutral"
          size="xs"
          @click="toggleColorMode"
        />
      </div>

      <!-- User Profile Card -->
      <div
        class="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 shadow-xs"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <UAvatar
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
          alt="Admin"
          size="sm"
          class="ring-2 ring-primary/20 shrink-0"
        />

        <div v-if="!isCollapsed" class="flex flex-col min-w-0 flex-1">
          <p class="text-xs font-semibold text-neutral-900 dark:text-white truncate">
            Admin User
          </p>
          <p class="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
            admin@cpf.co.th
          </p>
        </div>

        <UButton
          v-if="!isCollapsed"
          icon="i-lucide-log-out"
          variant="ghost"
          color="error"
          size="xs"
          class="shrink-0"
        />
      </div>
    </div>
  </aside>
</template>
