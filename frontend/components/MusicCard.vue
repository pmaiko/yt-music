<template>
  <article class="music-card">
    {{ title }}
  </article>
</template>
<script setup lang="ts">
  import { MusicItem } from '~/types'

  defineProps<MusicItem>()
</script>
<style>

</style>
