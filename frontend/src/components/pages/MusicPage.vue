<template>
  <div class="music-page">
    <div class="container">
      <div class="music-page__wrapper">
        <template
          v-if="state.items"
        >
          <AudioPlayer
            v-if="playlist"
            ref="audioPlayer"
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
                :active="audioPlayerTrack?.id === item.id"
                @clickImage="playTrack(item)"
              >
                <template v-slot:playPause="{className}">
                  <BaseIcon
                    :class="className"
                    :icon="audioPlayerTrack?.id === item.id && !audioPlayerInfo?.paused ? 'pause' : 'play'"
                  />
                </template>
              </MusicCard>
            </div>
          </div>
          <div
            ref="observeElement"
            data-repeat="true"
          >
            <BaseButton
              :loading="state.loading"
              class="music-page__load-more"
              @click="loadMore"
            >
              Load more
            </BaseButton>
          </div>
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
  import ElementObserver from '~/components/helpers/Observer.ts'

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
  const audioPlayerInfo = computed(() => {
    return audioPlayer.value?.info
  })
  const audioPlayerTrack = computed(() => {
    return audioPlayer.value?.track
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
      const { data } = await useApi().getMusic(loadMore && state.pageInfo?.nextPageToken || null)
      if (loadMore) {
        state.items = [...(state.items || []), ...data.data]
      } else {
        state.items = data.data
      }
      state.pageInfo = data.meta
    } catch (error) {
      console.log(error)
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

  const observeElement = ref<HTMLElement | null>(null)
  watch(observeElement, () => {
    const observer = new ElementObserver(undefined, {
      onInView: () => {
        loadMore()
      }
    })
    observer.observe(observeElement.value)
  })
</script>
<style lang="scss">
  .music-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 0 0 3rem;

    &__wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__player {
      position: sticky;
      top: 0.25rem;
      left: 50%;
      z-index: 99;
    }

    &__load-more {
      margin-top: 3rem;
    }

    &__list {
      margin-top: 1rem;

      &-item {
        &:not(:last-child) {
          margin-bottom: 2rem;
        }
      }
    }
  }
</style>
