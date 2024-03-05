<template>
  <article class="music-card">
    <div class="music-card__inner">
      <div class="music-card__image">
        <img
          :src="image"
          alt="image"
        >
      </div>
      <div class="music-card__content">
        <h4 class="music-card__title">
          {{ title }}
        </h4>
        <h6 class="music-card__description">
          {{ title }}
        </h6>
        <a
          :href="audioURL || ''"
          target="_blank"
          class="music-card__link"
        >
          Link
        </a>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
  import { MusicItem } from '~/types'

  defineProps<MusicItem>()
</script>
<style lang="scss">
  .music-card {
    &__inner {
      display: flex;
    }

    &__image {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 84px;
      margin-right: 1rem;
    }

    &__description {
      margin-top: 0.5rem;
    }

    &__link {
      word-break: break-word;
    }
  }
</style>
