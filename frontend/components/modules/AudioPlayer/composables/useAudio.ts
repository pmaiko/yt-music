import { Track, Details } from '../types.ts'

export const useAudio = ({ getNextTrack, getPreviousTrack }: {
  getNextTrack: (currentTrack: Track) => Track,
  getPreviousTrack: (currentTrack: Track) => Track
}) => {
  let audioElement = new Audio()

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

  watch(() => state.track, () => {
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
  })

  const playTrack = (track: Track) => {
    audioElement.src = track.src
    audioElement.play()

    state.track = track
    state.paused = false
    state.progress = 0
    state.currentTime = 0
    state.isLoadeddata = false
    state.isLoadedmetadata = false
  }

  const resumeTrack = () => {
    audioElement.play()
    state.paused = false
    console.log('resumeTrack')
  }

  const pauseTrack = () => {
    audioElement.pause()
    state.paused = true
    console.log('pauseTrack')
  }

  const stopTrack = () => {

  }

  const toggleTrack = (track: Track) => {
    if (state.paused || track.src !== audioElement.src) {
      if (track.src === audioElement.src) {
        resumeTrack()
      } else {
        playTrack(track)
      }
    } else {
      pauseTrack()
    }
  }

  const changeProgressHandler = (event: MouseEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
      const percent = event.offsetX / event.currentTarget.clientWidth * 100
      const duration = state.duration || 0
      audioElement.currentTime = duration - (duration / 100 * (100 - percent))
    }
  }

  const destroy = () => {
    audioElement.pause()
    audioElement = new Audio()
  }

  audioElement.addEventListener('timeupdate', () => {
    const currentTime = audioElement.currentTime
    const duration = audioElement.duration

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
    const loadedPercentage = (audioElement.buffered.end(0) / audioElement.duration) * 100
    console.log(loadedPercentage)
    state.progressLoading = loadedPercentage
  })

  audioElement.addEventListener('ended', () => {
    state.track && playTrack(getNextTrack(state.track))
  })

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    state.track && playTrack(getNextTrack(state.track))
  })
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    state.track && playTrack(getPreviousTrack(state.track))
  })
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    state.track && playTrack(getPreviousTrack(state.track))
  })
  navigator.mediaSession.setActionHandler('seekforward', () => {
    state.track && playTrack(getNextTrack(state.track))
  })
  navigator.mediaSession.setActionHandler('play', () => {
    state.track && playTrack(state.track)
  })
  navigator.mediaSession.setActionHandler('pause', () => {
    pauseTrack()
  })

  return {
    audioElement,
    details: state,
    loading,

    playTrack,
    pauseTrack,
    stopTrack,
    toggleTrack,
    changeProgressHandler,
    destroy
  }
}
