<template>
  <div class="music-page">
    <div
      v-if="state.items && !state.loading"
      class="music-page__list"
    >
      <div
        v-for="item in state.items"
        :key="item.id"
        class="music-page__list-item"
      >
        <MusicCard v-bind="item" />
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
  import { Player, Playlist } from '~/modules/Player.ts'

  const state = reactive<{
    items: [MusicItem] | null,
    loading: boolean
  }>({
    items: null,
    loading: true
  })

  const playlist: Array<Playlist> = []

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

    state.items?.forEach((item) => {
      if (item.audioURL) {
        playlist.push({
          id: item.id,
          src: item.audioURL
        })
      }
    })

    new Player(playlist)
  })
</script>
