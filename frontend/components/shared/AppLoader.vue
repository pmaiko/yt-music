<template>
  <div class="app-loader">
    <BaseIcon
      icon="spinner"
      class="app-loader__spinner"
    />
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss">
  .app-loader {
    &__spinner {
      transform-origin: center center;
      animation: rotate 1s infinite linear;

      @keyframes rotate {
        0% {
          transform: rotate(0);
        }

        100% {
          transform: rotate(360deg);
        }
      }
    }
  }
</style>
