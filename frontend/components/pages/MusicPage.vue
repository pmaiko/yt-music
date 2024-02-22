<template>
  <div>
    {{ title }}
  </div>
</template>
<script setup lang="ts">
  defineProps({
    title: { type: String, required: true }
  })
</script>
