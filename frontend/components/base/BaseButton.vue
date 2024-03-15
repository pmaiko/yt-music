<template>
  <button
    :class="classes"
  >
    <slot />

    <AppLoader
      v-if="loading"
      class="base-button__loading"
    />
  </button>
</template>
<script setup lang="ts">
  import AppLoader from '~/components/shared/AppLoader.vue'

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
    text-transform: uppercase;
    cursor: pointer;
    background-color: $c-primary;
    border: 1px solid transparent;
    border-radius: 4px;
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
    }

    &_loading {
      pointer-events: none;
    }
  }
</style>
