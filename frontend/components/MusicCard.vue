<template>
  <article class="music-card">
    <div class="music-card__inner">
      <div
        class="music-card__image"
        @click="onPlay"
      >
        <img
          :src="image"
          alt="image"
        >
        <slot
          name="playPause"
          v-bind="{className: 'music-card__play-pause'}"
        />
      </div>
      <div class="music-card__content">
        <h4 class="music-card__title">
          {{ title }}
        </h4>
        <h6 class="music-card__description">
          {{ title }}
        </h6>

        <div class="music-card__links">
          <a
            :href="src || ''"
            target="_blank"
            class="music-card__link"
          >
            <BaseIcon
              icon="link"
              class="music-card__link-icon"
            />
            <span class="music-card__link-text">
              Audio URL
            </span>
          </a>
          <a
            :href="links.saveFrom"
            target="_blank"
            class="music-card__link"
          >
            <BaseIcon
              icon="link"
              class="music-card__link-icon"
            />
            <span class="music-card__link-text">
              SaveFrom
            </span>
          </a>
          <a
            v-for="(sefon, index) in links.seFon"
            :key="sefon"
            :href="sefon"
            target="_blank"
            class="music-card__link"
          >
            <BaseIcon
              icon="link"
              class="music-card__link-icon"
            />
            <span class="music-card__link-text">
              SeFon {{ index + 1 }}
            </span>
          </a>
          <a
            v-for="(fm, index) in links.fm"
            :key="fm"
            :href="fm"
            target="_blank"
            class="music-card__link"
          >
            <BaseIcon
              icon="link"
              class="music-card__link-icon"
            />
            <span class="music-card__link-text">
              Fm {{ index + 1 }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
  import { MusicItem } from '~/types'
  import BaseIcon from '~/components/base/BaseIcon.vue'

  defineProps<MusicItem>()

  const emit = defineEmits({
    clickImage: () => {
      return true
    }
  })
  const onPlay = () => {
    emit('clickImage')
  }
</script>
<style lang="scss">
  .music-card {
    &__inner {
      display: flex;
    }

    &__image {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 84px;
      margin-right: 1rem;
    }

    &__play-pause {
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 0.5rem;
      background-color: rgba(red, 0.8);
      border-radius: 0.25rem;
      transform: translate(-50%, -50%);
    }

    &__description {
      margin-top: 0.5rem;
    }

    &__links {
      display: flex;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    &__link {
      display: flex;
      text-transform: uppercase;
      word-break: break-word;

      &:not(:last-child) {
        margin-right: 1rem;
        margin-bottom: 1rem;
      }

      &-icon {
        margin-right: 0.225rem;
      }
    }
  }
</style>
