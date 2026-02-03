export interface Track {
  id: string
  title: string // name song
  artist: string | null
  album: string | null
  image: string | null
  src: string
}

export interface Info {
  src: string,
  paused: boolean,
  progress: number,
  progressLoading: number,
  currentTime: number,
  duration: number,
  isLoadingMetadata: boolean
}
