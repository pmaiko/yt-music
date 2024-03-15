import { Track, Info } from '../types.ts'
import { useMediaSession } from '../composables/useMediaSession.ts'

export const useAudio = (playlist: Array<Track>) => {
  const playTrack = async (newTrack: Track) => {
    info.isLoadingMetadata = true

    const src = await getSrcTrack(newTrack.src)

    audioElement.src = src
    await audioElement.play().catch(() => {})

    track.value = newTrack

    info.src = src
    info.paused = !src
    info.progress = 0
    info.currentTime = 0

    setMediaSessionMetaData(newTrack.title, newTrack.artist, newTrack.album, newTrack.image)
  }

  const resumeTrack = () => {
    audioElement.play()
    info.paused = false
  }

  const pauseTrack = () => {
    audioElement.pause()
    info.paused = true
  }

  const stopTrack = () => {}

  const toggleTrack = (newTrack: Track) => {
    if (info.paused || newTrack.src !== audioElement?.src) {
      if (newTrack.src === audioElement?.src) {
        resumeTrack()
      } else {
        playTrack(newTrack)
      }
    } else {
      pauseTrack()
    }
  }

  const nextTrack = () => {
    track.value && playTrack(getNextTrack(track.value, playlist))
  }

  const prevTrack = () => {
    track.value && playTrack(getPreviousTrack(track.value, playlist))
  }

  const seekToTrack = (details: MediaSessionActionDetails) => {
    if (details.seekTime) {
      audioElement.currentTime = details.seekTime
    }
  }

  const setVolumeTrack = (volume: number) => {
    audioElement.volume = volume
  }

  const changeProgressHandler = (event: MouseEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
      const percent = event.offsetX / event.currentTarget.clientWidth * 100
      const duration = info.duration || 0
      audioElement.currentTime = duration - (duration / 100 * (100 - percent))
    }
  }

  const timeupdateHandler = () => {
    const currentTime = audioElement.currentTime
    const duration = audioElement.duration

    info.progress = currentTime / duration * 100
    info.currentTime = currentTime
  }

  const loadedmetadataHandler = () => {
    info.isLoadingMetadata = false
    info.duration = audioElement.duration || 0
  }

  const errorHandler = () => {
    info.isLoadingMetadata = false
  }

  const progressHandler = () => {
    info.progressLoading = (audioElement.buffered.end(0) / audioElement.duration) * 100
  }

  const destroy = () => {
    audioElement.pause()
    audioElement = new Audio()
  }

  let audioElement: HTMLAudioElement = new Audio()
  audioElement.addEventListener('timeupdate', timeupdateHandler)
  audioElement.addEventListener('loadedmetadata', loadedmetadataHandler)
  audioElement.addEventListener('error', errorHandler)
  audioElement.addEventListener('progress', progressHandler)
  audioElement.addEventListener('loadeddata', () => {})
  audioElement.addEventListener('ended', nextTrack)

  const track = ref<Track | null>(null)

  const info = reactive<Info>({
    src: '',
    paused: false,
    progress: 0,
    progressLoading: 0,
    currentTime: 0,
    duration: 0,
    isLoadingMetadata: false
  })

  const { setMediaSessionMetaData } = useMediaSession({
    prevTrack,
    nextTrack,
    seekToTrack,
    toggleTrack: () => {
      track.value && toggleTrack(track.value)
    }
  })

  return {
    track,
    info,

    playTrack,
    pauseTrack,
    stopTrack,
    toggleTrack,
    nextTrack,
    prevTrack,
    seekToTrack,
    setVolumeTrack,
    changeProgressHandler,
    destroy
  }
}


const getSrcTrack = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const audio = new Audio(src)
    audio.onloadedmetadata = () => {
      resolve(audio.src)
    }
    audio.onerror = () => {
      resolve('')
    }
  })
}

const getNextTrack = (currentTrack: Track, playlist: Array<Track>) : Track => {
  const currentTrackIndex = getIndexTrack(currentTrack, playlist)
  const nextTrackIndex = (currentTrackIndex + 1) % playlist.length
  return playlist[nextTrackIndex]
}

const getPreviousTrack = (currentTrack: Track, playlist: Array<Track>) : Track => {
  const currentTrackIndex = getIndexTrack(currentTrack, playlist)
  const prevTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length

  return playlist[prevTrackIndex]
}

const getIndexTrack = (track: Track, playlist: Array<Track>) : number => {
  return playlist.findIndex(item => item.id === track.id)
}

// https://www.w3schools.com/tags/ref_av_dom.asp
// playsinline
