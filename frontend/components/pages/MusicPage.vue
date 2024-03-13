<template>
  <div class="music-page">
    <div class="container">
      <div class="music-page__wrapper">
        <template
          v-if="state.items"
        >
          <AudioPlayer
            ref="audioPlayer"
            v-if="playlist"
            :playlist="playlist"
            class="music-page__player"
          />
          <div
            class="music-page__list"
          >
            <div
              v-for="item in state.items"
              :key="item.id"
              class="music-page__list-item"
            >
              <MusicCard
                v-bind="item"
                @clickImage="playTrack(item)"
              >
                <template v-slot:playPause="{className}">
                  <BaseIcon
                    :class="className"
                    :icon="audioPlayerDetails?.track?.id === item.id && !audioPlayerDetails?.paused ? 'pause' : 'play'"
                  />
                </template>
              </MusicCard>
            </div>
          </div>
          <BaseButton
            :loading="state.loading"
            class="music-page__load-more"
            @click="loadMore"
          >
            Load more
          </BaseButton>
        </template>
        <div v-else-if="state.loading">
          Loading...
        </div>
        <div v-else>
          Not found
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { MusicItem, PageInfo } from '~/types.ts'
  import { Track } from '~/components/modules/AudioPlayer/index.ts'

  import MusicCard from '~/components/MusicCard.vue'
  import BaseIcon from '~/components/base/BaseIcon.vue'
  import BaseButton from '~/components/base/BaseButton.vue'
  import AudioPlayer from '~/components/modules/AudioPlayer/AudioPlayer.vue'

  const state = reactive<{
    items: Array<MusicItem> | null,
    pageInfo: PageInfo | null
    loading: boolean
  }>({
    items: null,
    pageInfo: null,
    loading: true
  })

  const audioPlayer = ref<InstanceType<typeof AudioPlayer> | null>(null)
  const audioPlayerDetails = computed(() => {
    return audioPlayer.value?.details
  })

  const playlist = computed<Array<Track> | null>(() => {
    return state.items
      ?.filter(item => item.src)
      ?.map(item => {
        return {
          id: item.id,
          title: item.title,
          artist: item.videoOwnerChannelTitle,
          album: null,
          image: item.image,
          src: item.src as string
        }
      }) || null
  })

  onMounted(async () => {
    await fetchMusic()
  })

  const fetchMusic = async (loadMore = false) => {
    try {
      state.loading = true
      const { data } = await useApi().getMusic(loadMore && state.pageInfo?.pageToken || null)
      if (loadMore) {
        state.items = [...(state.items || []), ...data.items]
      } else {
        state.items = data.items
      }
      state.pageInfo = data.pageInfo
    } catch (event) {
      console.log(event)
    } finally {
      state.loading = false
    }
  }

  const loadMore = async () => {
    await fetchMusic(true)
  }

  const playTrack = (item: MusicItem) => {
    if (item.src) {
      audioPlayer.value?.toggleTrack({
        id: item.id,
        title: item.title,
        artist: item.videoOwnerChannelTitle,
        album: null,
        image: item.image,
        src: item.src
      })
    }
  }
</script>
<style lang="scss">
  .music-page {
    padding: 80px 0;

    &__wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__player {
      position: fixed;
      top: 0.25rem;
      left: 50%;
      z-index: 99;
      transform: translateX(-50%);
    }

    &__load-more {
      margin-top: 3rem;
    }

    &__list {
      &-item {
        &:not(:last-child) {
          margin-bottom: 2rem;
        }
      }
    }
  }
</style>
