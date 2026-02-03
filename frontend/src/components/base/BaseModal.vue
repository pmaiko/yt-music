<template>
  <VueFinalModal
    class="base-modal"
    contentClass="base-modal-content"
    overlayTransition="vfm-fade"
    contentTransition="vfm-fade"
  >
    <slot />
  </VueFinalModal>
</template>
<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal'
</script>
<style lang="scss">
  .base-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    &-content {
      display: flex;
      flex-direction: column;
      width: 300px;
      max-width: 100%;
      padding: 1rem;
      color: $c-text;
      word-break: break-word;
      background: $c-body;
      border-radius: 0.5rem;
    }
  }
</style>
