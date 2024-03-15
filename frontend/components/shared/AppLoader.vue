<template>
  <div class="app-loader">
    <BaseIcon
      v-if="loading"
      icon="spinner"
      class="app-loader__spinner"
    />
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    loading: boolean
  }>()
</script>
<style lang="scss">
</style>
