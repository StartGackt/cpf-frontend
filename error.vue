<script setup>
defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, message: 'Page not found' })
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6 text-center">
    <UCard class="max-w-md w-full p-6 space-y-4">
      <div class="size-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <UIcon name="i-lucide-alert-triangle" class="size-8" />
      </div>

      <div>
        <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
          {{ error.statusCode || 404 }}
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 mt-2 text-sm">
          {{ error.message || 'The page you are looking for does not exist.' }}
        </p>
      </div>

      <div class="pt-4 flex justify-center gap-3">
        <UButton
          label="Back to Home"
          icon="i-lucide-home"
          color="primary"
          @click="handleError"
        />
      </div>
    </UCard>
  </div>
</template>
