<script setup lang="ts">
const route = useRoute()

const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  return parts.map((part, index) => {
    const to = '/' + parts.slice(0, index + 1).join('/')
    const label = part.charAt(0).toUpperCase() + part.slice(1)
    return { label, to }
  })
})
</script>

<template>
  <header class="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
    <!-- Left: Breadcrumb / Title -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <NuxtLink to="/admin" class="hover:text-primary transition-colors flex items-center gap-1">
          <UIcon name="i-lucide-home" class="size-4" />
        </NuxtLink>
        <span v-if="breadcrumbs.length" class="text-neutral-300 dark:text-neutral-700">/</span>
        <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.to">
          <NuxtLink
            :to="crumb.to"
            class="transition-colors capitalize font-medium"
            :class="idx === breadcrumbs.length - 1 ? 'text-neutral-900 dark:text-white' : 'hover:text-primary'"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span v-if="idx < breadcrumbs.length - 1" class="text-neutral-300 dark:text-neutral-700">/</span>
        </template>
      </div>
    </div>

    <!-- Right: Search & Actions -->
    <div class="flex items-center gap-3">
      <!-- Search Input -->
      <div class="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary/50 text-sm">
        <UIcon name="i-lucide-search" class="size-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search..."
          class="bg-transparent outline-none text-xs w-44 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
        />
        <UKbd size="xs">Ctrl K</UKbd>
      </div>

      <!-- Notifications -->
      <UButton
        icon="i-lucide-bell"
        variant="ghost"
        color="neutral"
        size="sm"
        class="relative"
      >
        <span class="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full ring-2 ring-white dark:ring-neutral-900"></span>
      </UButton>

      <!-- Quick AI Link -->
      <UButton
        to="/ai"
        icon="i-lucide-sparkles"
        label="AI Chat"
        size="xs"
        color="primary"
        variant="soft"
      />
    </div>
  </header>
</template>
