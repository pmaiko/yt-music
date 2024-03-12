<template>
  <div class="icon">
    <i :class="icons[icon]" />
  </div>
</template>
<script setup lang="ts">
  const icons = {
    play: 'icofont-ui-play',
    pause: 'icofont-ui-pause',
    next: 'icofont-ui-next',
    previous: 'icofont-ui-previous',
    link: 'icofont-ui-social-link',
    spinner: 'icofont-spinner'
  }
  defineProps<{
    icon: keyof typeof icons
  }>()
</script>
