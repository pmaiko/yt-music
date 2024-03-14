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
          v-bind="{className: 'music-card__toggle'}"
        />
      </div>
      <div class="music-card__content">
        <h4 class="music-card__title">
          {{ title }}
        </h4>
        <h6 class="music-card__owner bold">
          {{ videoOwnerChannelTitle }}
        </h6>
        <h6 class="music-card__description">
          {{ description }}
        </h6>

        <button
          @click="openLinks"
          class="music-card__links text-uppercase"
        >
          Links
        </button>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
  import { MusicItem } from '~/types'
  import ModalLinks from '~/components/modals/ModalLinks.vue'

  const props = defineProps<MusicItem>()

  const emit = defineEmits({
    clickImage: () => {
      return true
    }
  })
  const onPlay = () => {
    emit('clickImage')
  }
  const openLinks = () => {
    const { open } = useModal({
      component: ModalLinks,
      attrs: {
        src: props.src,
        links: props.links
      }
    })

    open()
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

    &__toggle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &__title,
    &__owner,
    &__description {
      word-break: break-word;
    }

    &__owner,
    &__description {
      margin-top: 0.5rem;
    }

    &__links {
      margin-top: 0.5rem;
    }
  }
</style>
