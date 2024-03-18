<template>
  <div class="about-page">
    AboutPage - {{ route.params.id }} {{ route.params.alias }}
  </div>
</template>
<script setup lang="ts">
  const route = useRoute()
</script>
<style lang="scss">
</style>
