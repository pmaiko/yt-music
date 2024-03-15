<template>
  <div class="audio-player">
    <div class="audio-player-info">
      <p class="audio-player-info__title">
        {{ track?.title || '---' }}
      </p>
      <p class="audio-player-info__artist">
        {{ track?.artist || '---' }}
      </p>
    </div>
    <AppLoader :loading="info.isLoadingMetadata" />
    {{ track && !info.src ? 'error' : '' }}
    {{ formatDuration(info.currentTime) }}
    {{ formatDuration(info.duration) }}
    <div
      class="audio-player-progress"
      @click="changeProgressHandler"
    >
      <div class="audio-player-progress__passive" />
      <div
        class="audio-player-progress__active audio-player-progress__active_loading"
        :style="{width: `${info.progressLoading}%`}"
      />
      <div
        class="audio-player-progress__active"
        :style="{width: `${info.progress}%`}"
      />
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
            v-model="volume"
            :min="0"
            :max="1"
            :step="0.1"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<!-- https://www.w3schools.com/tags/ref_av_dom.asp -->
<script setup lang="ts">
  import { Track } from './types.ts'
  import { useAudio } from './composables/useAudio.ts'
  import Vue3Slider from 'vue3-slider'
  import AppLoader from '~/components/shared/AppLoader.vue'

  const props = defineProps<{
    playlist: Array<Track>
  }>()

  const volume = ref(1)

  const getNextTrack = (currentTrack: Track) : Track => {
    const currentTrackIndex = getTrackIndex(currentTrack)
    const nextTrackIndex = (currentTrackIndex + 1) % props.playlist.length
    return props.playlist[nextTrackIndex]
  }

  const getPreviousTrack = (currentTrack: Track) : Track => {
    const currentTrackIndex = getTrackIndex(currentTrack)
    const prevTrackIndex = (currentTrackIndex - 1 + props.playlist.length) % props.playlist.length

    return props.playlist[prevTrackIndex]
  }

  const getTrackIndex = (track: Track) : number => {
    return props.playlist.findIndex(item => item.id === track.id)
  }

  const {
    info,
    track,
    playTrack,
    toggleTrack,
    nextTrack,
    prevTrack,
    changeProgressHandler,
    destroy
  } = useAudio({ volume, getNextTrack, getPreviousTrack })

  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const seconds = Math.floor(durationInSeconds % 60)

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

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
    padding: 1rem 0;
    background-color: transparent;
    backdrop-filter: blur(3px);
  }

  .audio-player-info {
    margin-bottom: 1rem;

    &__artist {
      margin-top: 0.5rem;
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

      &_loading {
        background-color: $c-secondary;
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
