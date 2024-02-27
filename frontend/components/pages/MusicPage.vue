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
        <!--<source-->
        <!--  v-for="item in playlist"-->
        <!--  :key="item.id"-->
        <!--  :src="item.src"-->
        <!--  type="audio/webm"-->
        <!--&gt;-->
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
          v-if="item.audioData.audioApiURL"
          @click="onPlay(item.audioData)"
        >
          {{ state.playerStatus?.playingAudio?.id === item.id && !state.playerStatus?.paused ? 'Pause' : 'Play' }}
        </div>
        <div
          class="load"
          @click="onLoad(item.audioData)"
        >
          Load
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
  import { MusicItem, AudioData } from '~/types'
  import MusicCard from '~/components/MusicCard.vue'
  import { Player, Status } from '~/modules/Player.ts'

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
      ?.filter(item => item.audioData.audioApiURL)
      ?.map(item => {
        return {
          id: item.id,
          audioURL: item.audioData.audioApiURL || '',
          audioApiURL: item.audioData.audioApiURL || '',
          contentLength: item.audioData.contentLength
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

  const onLoad = (audioData: AudioData) => {
    const fetchAudio = async (url: string, params?: any) => {
      const { data } = await useApi().axios.get(url, {
        responseType: 'arraybuffer',
        params
      })
      return data
    }

    fetchAudio(audioData.audioApiURL)
  }

  const onChangeStatus = (status: Status) => {
    state.playerStatus = status
  }
</script>
