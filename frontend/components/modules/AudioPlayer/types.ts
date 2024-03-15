export interface Track {
  id: string
  title: string // name song
  artist: string
  album: string | undefined
  image: string
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
