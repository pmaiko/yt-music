<template>
  <div class="music-page">
    <div
      v-if="state.items && !state.loading"
      class="music-page__list"
    >
      <audio
        ref="audioRef"
        id="audioPlayer"
        controls
      >
        <source
          v-for="item in playlist"
          :key="item.id"
          :src="item.src"
          type="audio/webm"
        >
      </audio>
      <div
        v-for="item in state.items"
        :key="item.id"
        class="music-page__list-item"
      >
        <MusicCard
          v-bind="item"
        />
        <div
          v-if="item.audioURL"
          @click="onPlay({
            id: item.id,
            src: item.audioURL
          })"
        >
          {{ state.playerStatus?.playingAudio?.id === item.id && !state.playerStatus?.paused ? 'Pause' : 'Play' }}
        </div>
      </div>
    </div>
    <div v-else-if="state.loading">
      Loading...
    </div>
    <div v-else>
      Not found
    </div>
  </div>
</template>
<script setup lang="ts">
  import { MusicItem } from '~/types'
  import MusicCard from '~/components/MusicCard.vue'
  import { Player, AudioData, Status } from '~/modules/Player.ts'

  const audioRef = ref<HTMLAudioElement | null>(null)

  const state = reactive<{
    items: [MusicItem] | null,
    loading: boolean,
    playerStatus: Status | null
  }>({
    items: null,
    loading: true,
    playerStatus: null
  })

  let player: InstanceType<typeof Player> | null = null

  const playlist: ComputedRef<Array<AudioData>> = computed(() => {
    return state.items
      ?.filter(item => item.audioURL)
      ?.map(item => {
        return {
          id: item.id,
          src: item.audioURL || ''
        }
      }) || []
  })

  const fetchMusic = async () => {
    try {
      state.loading = true
      const { data } = await useApi().getMusic()
      state.items = data
    } catch (event) {
      console.log(event)
    } finally {
      state.loading = false
    }
  }

  onMounted(async () => {
    await fetchMusic()

    if (audioRef.value) {
      player = new Player(playlist.value, audioRef.value, onChangeStatus)
    }
  })

  onBeforeUnmount(() => {
    player?.destroy()
  })

  const onPlay = (audioData: AudioData) => {
    player?.play(audioData)
  }

  const onChangeStatus = (status: Status) => {
    state.playerStatus = status
  }
</script>
