<template>
  <div
    class="audio-player-progress"
    @click="changeProgressHandler"
  >
    <!--<audio-->
    <!--  ref="audioElement"-->
    <!--  controls-->
    <!--  playsinline-->
    <!--/>-->
    <!--<div-->
    <!--  ref="prevButton"-->
    <!--  id="prevButton"-->
    <!--&gt;-->
    <!--  prev-->
    <!--</div>-->
    <!--<br>-->
    <!--<br>-->
    <!--<button-->
    <!--  ref="nextButton"-->
    <!--  id="nextButton"-->
    <!--  @click="nextTrack"-->
    <!--&gt;-->
    <!--  next-->
    <!--</button>-->
    <div class="audio-player-progress__passive" />
    <div
      class="audio-player-progress__active audio-player-progress__active_loading"
      :style="{width: `${details?.progressLoading}%`}"
    />
    <div
      class="audio-player-progress__active"
      :style="{width: `${details?.progress}%`}"
    />
  </div>
</template>
<!-- https://www.w3schools.com/tags/ref_av_dom.asp -->
<script setup lang="ts">
  import { Track } from './types.ts'
  import { useAudio } from './composables/useAudio.ts'
  import { onBeforeUnmount } from 'vue'

  const props = defineProps<{
    playlist: Array<Track>
  }>()

  // const audioElement = ref<HTMLAudioElement | null>(null)

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
    details,
    playTrack,
    toggleTrack,
    changeProgressHandler,
    destroy
  } = useAudio({ getNextTrack, getPreviousTrack })

  onBeforeUnmount(() => {
    destroy()
  })

  defineExpose({
    details,
    playTrack,
    toggleTrack
  })
</script>
<style lang="scss">
  .audio-player {
    background-color: red;
  }

  .audio-player-progress {
    position: relative;
    width: 200px;
    height: 5px;

    &__passive,
    &__active {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
    }

    &__passive {
      background-color: aliceblue;
    }

    &__active {
      background-color: #349b41;

      &_loading {
        background-color: #686565;
      }
    }
  }
</style>
