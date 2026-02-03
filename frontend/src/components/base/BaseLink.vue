<template>
  <RouterLink :to="url">
    <slot />
  </RouterLink>
</template>
<script setup lang="ts">
  import { Routes } from '~/router.ts'
  import { LocationQueryRaw } from 'vue-router'

  defineProps<{
    url: string | {
      path?: string,
      name: Routes,
      params?: any,
      query?: LocationQueryRaw;
      hash?: string;
    }
  }>()
</script>
