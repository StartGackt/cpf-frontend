<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-shield-check" class="text-primary size-7" />
        <h1 class="text-xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          to="/ai"
          icon="i-lucide-bot"
          label="AI Assistant"
          variant="subtle"
          color="info"
        />
        <UButton
          icon="i-lucide-log-out"
          label="Logout"
          color="error"
          variant="soft"
        />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-6 space-y-6">
      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">Total Users</p>
              <h2 class="text-2xl font-bold mt-1">1,284</h2>
            </div>
            <div class="p-3 bg-primary/10 rounded-xl">
              <UIcon name="i-lucide-users" class="size-6 text-primary" />
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">Active Sessions</p>
              <h2 class="text-2xl font-bold mt-1">342</h2>
            </div>
            <div class="p-3 bg-success/10 rounded-xl">
              <UIcon name="i-lucide-activity" class="size-6 text-success" />
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-neutral-500 dark:text-neutral-400">System Status</p>
              <div class="flex items-center gap-2 mt-1">
                <UBadge color="success" variant="subtle" label="Operational" />
              </div>
            </div>
            <div class="p-3 bg-info/10 rounded-xl">
              <UIcon name="i-lucide-server" class="size-6 text-info" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Welcome Card -->
      <UCard>
        <template #header>
          <h3 class="font-semibold text-lg">Admin Overview</h3>
        </template>
        <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Welcome to the CPF Frontend Admin panel. Nuxt UI v4 components and routing are functioning properly.
        </p>
      </UCard>
    </main>
  </div>
</template>
