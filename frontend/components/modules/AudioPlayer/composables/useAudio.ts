import { Track, Details } from '../types.ts'

export const useAudio = ({ getNextTrack, getPreviousTrack }: {
  getNextTrack: (currentTrack: Track) => Track,
  getPreviousTrack: (currentTrack: Track) => Track
}) => {
  let audioElement: HTMLAudioElement | null = new Audio()
  // audioElement.controls = true
  // document.body.append(audioElement)

  const state = reactive<Details>({
    track: null,
    paused: false,
    progress: 0,
    progressLoading: 0,
    currentTime: 0,
    duration: 0,
    isLoadeddata: false,
    isLoadedmetadata: false
  })

  const loading = computed(() => {
    return !state.isLoadeddata && !state.isLoadedmetadata && !!state.track
  })

  const playTrack = (track: Track) => {
    if (audioElement) {
      const newAudio = new Audio(track.src)
      newAudio.onloadedmetadata = () => {
        if (audioElement) {
          audioElement.src = newAudio.src
          audioElement.play()
        }
      }

      state.track = track
      state.paused = false
      state.progress = 0
      state.currentTime = 0
      state.isLoadeddata = false
      state.isLoadedmetadata = false

      navigator.mediaSession.playbackState = 'playing'
      navigator.mediaSession.metadata = new MediaMetadata({
        title: state.track?.title,
        artist: state.track?.artist,
        album: undefined,
        artwork: [
          {
            src: state.track?.image || ''
          }
        ]
      })
    }
  }

  const resumeTrack = () => {
    audioElement?.play()
    state.paused = false
  }

  const pauseTrack = () => {
    audioElement?.pause()
    state.paused = true

    navigator.mediaSession.playbackState = 'paused'
  }

  const stopTrack = () => {

  }

  const toggleTrack = (track: Track) => {
    if (state.paused || track.src !== audioElement?.src) {
      if (track.src === audioElement?.src) {
        resumeTrack()
      } else {
        playTrack(track)
      }
    } else {
      pauseTrack()
    }
  }

  const nextTrack = () => {
    state.track && playTrack(getNextTrack(state.track))
  }

  const prevTrack = () => {
    state.track && playTrack(getPreviousTrack(state.track))
  }

  const changeProgressHandler = (event: MouseEvent) => {
    if (audioElement && event.currentTarget instanceof HTMLElement) {
      const percent = event.offsetX / event.currentTarget.clientWidth * 100
      const duration = state.duration || 0
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

    state.progress = currentTime / duration * 100
    state.currentTime = currentTime
    state.duration = duration
  })

  audioElement.addEventListener('loadeddata', () => {
    state.isLoadeddata = true
  })
  audioElement.addEventListener('loadedmetadata', () => {
    state.isLoadedmetadata = true
  })
  audioElement.addEventListener('progress', () => {
    if (audioElement) {
      state.progressLoading = (audioElement.buffered.end(0) / audioElement.duration) * 100
    }
  })
  audioElement.addEventListener('ended', () => {
    state.track && playTrack(getNextTrack(state.track))
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
    state.track && playTrack(state.track)
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
    details: state,
    loading,

    playTrack,
    pauseTrack,
    stopTrack,
    toggleTrack,
    nextTrack,
    changeProgressHandler,
    destroy
  }
}
