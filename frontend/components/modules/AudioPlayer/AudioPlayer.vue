<template>
  <div class="audio-player">
    <div class="audio-player-info">
      <p class="audio-player-info__title bold">
        {{ track?.title || 'Title' }}
      </p>
      <p class="audio-player-info__artist h4 normal">
        {{ track?.artist || 'Artist' }}
      </p>
      <p
        v-if="track && !info.src"
        class="audio-player-info__error bold"
      >
        Error src
      </p>
    </div>
    <div class="audio-player-info-status">
      <div class="audio-player-info-status__times h6">
        <div class="audio-player-info-status__times-current bold">
          {{ useFormatDuration(info.currentTime) }}
        </div>
        <div class="audio-player-info-status__times-duration">
          {{ useFormatDuration(info.duration) }}
        </div>
      </div>
    </div>
    <div
      class="audio-player-progress"
      @click="changeProgressHandler"
    >
      <div class="audio-player-progress__passive" />
      <div
        v-if="info.isLoadingMetadata"
        class="audio-player-progress__active audio-player-progress__active_meta"
      />
      <template v-else>
        <div
          class="audio-player-progress__active audio-player-progress__active_loading"
          :style="{width: `${info.progressLoading}%`}"
        />
        <div
          class="audio-player-progress__active"
          :style="{width: `${info.progress}%`}"
        />
      </template>
    </div>
    <div class="audio-player-action">
      <div class="audio-player-action__left">
        <div class="audio-player-action-controls">
          <button
            class="audio-player-action-controls__prev"
            @click="prevTrack"
          >
            <BaseIcon
              icon="prev"
              size="2x"
            />
          </button>
          <button
            v-if="info.paused || !track"
            class="audio-player-action-controls__play"
            @click="toggleTrack(track || playlist[0])"
          >
            <BaseIcon
              icon="play"
              size="2x"
            />
          </button>
          <button
            v-else
            class="audio-player-action-controls__pause"
            @click="toggleTrack(track || playlist[0])"
          >
            <BaseIcon
              icon="pause"
              size="2x"
            />
          </button>
          <button
            class="audio-player-action-controls__next"
            @click="nextTrack"
          >
            <BaseIcon
              icon="next"
              size="2x"
            />
          </button>
        </div>
      </div>
      <div class="audio-player-action__right">
        <div class="audio-player-action__volume">
          <Vue3Slider
            :modelValue="volume"
            :min="0"
            :max="1"
            :step="0.1"
            @update:modelValue="setVolumeTrack"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import Vue3Slider from 'vue3-slider'

  import { Track } from './types.ts'
  import { useAudio } from './composables/useAudio.ts'
  import { useFormatDuration } from './composables/useFormatDuration.ts'

  const props = defineProps<{
    playlist: Array<Track>
  }>()

  const volume = ref(1)

  const {
    info,
    track,
    playTrack,
    toggleTrack,
    nextTrack,
    prevTrack,
    setVolumeTrack,
    changeProgressHandler,
    destroy
  } = useAudio(props.playlist)

  onBeforeUnmount(() => {
    destroy()
  })

  defineExpose({
    info,
    track,
    playTrack,
    toggleTrack
  })
</script>
<style lang="scss">
  .audio-player {
    width: 400px;
    padding: 1rem;
    background-color: transparent;
    backdrop-filter: blur(6px);
    border-radius: 0.5rem;
  }

  .audio-player-info {
    margin-bottom: 1rem;

    &__artist,
    &__error {
      margin-top: 0.5rem;
    }

    &__error {
      color: $c-error;
    }
  }

  .audio-player-info-status {
    margin-bottom: 0.25rem;

    &__times {
      display: flex;
      justify-content: space-between;

      &-current {
        background-color: transparent;
      }
    }
  }

  .audio-player-progress {
    position: relative;
    width: 100%;
    height: 7px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 0.5rem;

    &__passive,
    &__active {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: 0.5rem;
    }

    &__passive {
      background-color: $c-dark;
    }

    &__active {
      background-color: $c-primary;
      transition: width 0.3s ease;

      &_loading {
        background-color: $c-secondary;
      }

      &_meta {
        animation: move 0.7s infinite;

        @keyframes move {
          0% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(100%);
          }

          50.001% {
            transform: translateX(-100%);
          }


          100% {
            transform: translateX(0);
          }
        }
      }
    }
  }

  .audio-player-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;

    &__left {
      justify-content: flex-start;
    }

    &__right {
      justify-content: flex-end;
    }

    &__volume {
      width: 7rem;

      .vue3-slider {
        --height: 7px !important;
        --color: #{$c-primary} !important;
        --track-color: #{$c-dark} !important;
      }
    }
  }

  .audio-player-action-controls {
    display: flex;

    &__play {
      background-color: transparent;
      transform: translateX(10%);
    }
  }
</style>
