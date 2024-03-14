<template>
  <div :class="classes">
    <FontAwesomeIcon :icon="icons[icon]" />
  </div>
</template>
<script setup lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { fas } from '@fortawesome/free-solid-svg-icons'
  import { far } from '@fortawesome/free-regular-svg-icons'
  import { fab } from '@fortawesome/free-brands-svg-icons'

  library.add(fas)
  library.add(far)
  library.add(fab)

  const icons = {
    play: ['fas', 'play'],
    pause: ['fas', 'pause'],
    next: ['fas', 'caret-right'],
    prev: ['fas', 'caret-left'],
    link: ['fas', 'link'],
    spinner: ['fas', 'circle-notch']
  }

  const props = withDefaults(defineProps<{
    icon: keyof typeof icons,
    size?: '1x' | '2x' | '3x'
  }>(), {
    size: '1x'
  })

  const classes = computed(() => ([
    'base-icon',
    `base-icon_${props.size}`
  ]))
</script>
<style lang="scss">
  .base-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
    }

    &_1x {
      width: 1rem;
      height: 1rem;
    }

    &_2x {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
