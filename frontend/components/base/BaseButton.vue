<template>
  <button
    :class="classes"
  >
    <slot />

    <BaseIcon
      v-if="loading"
      icon="spinner"
      class="base-button__loading"
    />
  </button>
</template>
<script setup lang="ts">
  import BaseIcon from '~/components/base/BaseIcon.vue'

  const props = defineProps<{
    loading?: boolean
  }>()

  const classes = computed(() => [
    'base-button',
    {'base-button_loading': props.loading}
  ])
</script>
<style lang="scss">
  .base-button {
    display: flex;
    align-items: center;
    padding: 0.6em 1.2em;
    font-family: inherit;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    background-color: $c-primary;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: border-color 0.25s;

    &:hover {
      border-color: $c-primary;
    }

    &:focus,
    &:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    &__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      margin-left: 1rem;
      transform-origin: center;
      animation: rotate 1s infinite;
    }

    &_loading {
      pointer-events: none;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
