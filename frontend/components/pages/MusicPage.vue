<template>
  <div class="music-page">
    <div class="container">
      <div class="music-page__wrapper">
        <template
          v-if="state.items"
        >
          <div class="music-page__player">
            <audio
              ref="audioRef"
              id="audioPlayer"
              controls
            />
          </div>
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
                @clickImage="onPlay(item)"
              >
                <template v-slot:playPause="{className}">
                  <BaseIcon
                    :class="className"
                    :icon="state.playerStatus?.playingAudio?.id === item.id && !state.playerStatus?.paused ? 'pause' : 'play'"
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
  import { MusicItem, AudioData, PageInfo } from '~/types'
  import MusicCard from '~/components/MusicCard.vue'
  import { Player, Status } from '~/modules/Player.ts'
  import BaseIcon from '~/components/base/BaseIcon.vue'
  import BaseButton from '~/components/base/BaseButton.vue'

  type State = {
    items: Array<MusicItem> | null,
    pageInfo: PageInfo | null
    loading: boolean,
    playerStatus: Status | null
  }

  const audioRef = ref<HTMLAudioElement | null>(null)
  const state = reactive<State>({
    items: null,
    pageInfo: null,
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
          audioURL: item.audioURL || ''
        }
      }) || []
  })

  onMounted(async () => {
    await fetchMusic()

    if (audioRef.value) {
      player = new Player(playlist.value, audioRef.value, onChangeStatus)
    }
  })

  onBeforeUnmount(() => {
    player?.destroy()
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
    player?.updatePlaylist(playlist.value)
  }

  const onPlay = (musicItem: MusicItem) => {
    if (musicItem.audioURL) {
      player?.play({
        id: musicItem.id,
        audioURL: musicItem.audioURL
      })
    }
  }

  const onChangeStatus = (status: Status) => {
    state.playerStatus = status
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
