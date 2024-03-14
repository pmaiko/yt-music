import { Track, Info } from '../types.ts'

// playsinline
export const useAudio = ({ volume, getNextTrack, getPreviousTrack }: {
  volume: Ref<number>
  getNextTrack: (currentTrack: Track) => Track,
  getPreviousTrack: (currentTrack: Track) => Track
}) => {
  let audioElement: HTMLAudioElement | null = new Audio()

  const track = ref<Track | null>(null)
  const info = reactive<Info>({
    paused: false,
    progress: 0,
    progressLoading: 0,
    currentTime: 0,
    duration: 0,
    isLoadeddata: false,
    isLoadedmetadata: false
  })

  const loading = computed(() => {
    return !info.isLoadeddata && !info.isLoadedmetadata && !!track.value
  })

  watch(volume, () => {
    if (audioElement) {
      audioElement.volume = volume.value
    }
  }, {
    immediate: true
  })

  const playTrack = (_track: Track) => {
    if (audioElement) {
      const newAudio = new Audio(_track.src)
      newAudio.onloadedmetadata = () => {
        if (audioElement) {
          audioElement.src = newAudio.src
          audioElement.play()
        }
      }

      track.value = _track
      info.paused = false
      info.progress = 0
      info.currentTime = 0
      info.isLoadeddata = false
      info.isLoadedmetadata = false

      navigator.mediaSession.playbackState = 'playing'
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.value?.title,
        artist: track.value?.artist,
        album: undefined,
        artwork: [
          {
            src: track.value?.image || ''
          }
        ]
      })
    }
  }

  const resumeTrack = () => {
    audioElement?.play()
    info.paused = false
  }

  const pauseTrack = () => {
    audioElement?.pause()
    info.paused = true

    navigator.mediaSession.playbackState = 'paused'
  }

  const stopTrack = () => {

  }

  const toggleTrack = (_track: Track) => {
    if (info.paused || _track.src !== audioElement?.src) {
      if (_track.src === audioElement?.src) {
        resumeTrack()
      } else {
        playTrack(_track)
      }
    } else {
      pauseTrack()
    }
  }

  const nextTrack = () => {
    track.value && playTrack(getNextTrack(track.value))
  }

  const prevTrack = () => {
    track.value && playTrack(getPreviousTrack(track.value))
  }

  const changeProgressHandler = (event: MouseEvent) => {
    if (audioElement && event.currentTarget instanceof HTMLElement) {
      const percent = event.offsetX / event.currentTarget.clientWidth * 100
      const duration = info.duration || 0
      audioElement.currentTime = duration - (duration / 100 * (100 - percent))
    }
  }

  const destroy = () => {
    navigator.mediaSession.playbackState = 'none'
    audioElement?.pause()
    audioElement = null
  }

  audioElement.addEventListener('timeupdate', () => {
    const currentTime = audioElement?.currentTime || 0
    const duration = audioElement?.duration || 0

    info.progress = currentTime / duration * 100
    info.currentTime = currentTime
    info.duration = duration
  })

  audioElement.addEventListener('loadeddata', () => {
    info.isLoadeddata = true
  })
  audioElement.addEventListener('loadedmetadata', () => {
    info.isLoadedmetadata = true
  })
  audioElement.addEventListener('progress', () => {
    if (audioElement) {
      info.progressLoading = (audioElement.buffered.end(0) / audioElement.duration) * 100
    }
  })
  audioElement.addEventListener('ended', () => {
    track.value && playTrack(getNextTrack(track.value))
    nextTrack()
  })

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    nextTrack()
  })
  navigator.mediaSession.setActionHandler('seekforward', () => {
    nextTrack()
  })
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    prevTrack()
  })
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    prevTrack()
  })
  navigator.mediaSession.setActionHandler('play', () => {
    track.value && playTrack(track.value)
  })
  navigator.mediaSession.setActionHandler('pause', () => {
    pauseTrack()
  })
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (audioElement && details.seekTime) {
      audioElement.currentTime = details.seekTime
    }
  })

  return {
    audioElement,
    track,
    info,
    loading,

    playTrack,
    pauseTrack,
    stopTrack,
    toggleTrack,
    nextTrack,
    prevTrack,
    changeProgressHandler,
    destroy
  }
}
