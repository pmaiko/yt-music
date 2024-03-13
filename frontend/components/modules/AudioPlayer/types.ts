export interface Track {
  id: string
  title: string // name song
  artist: string
  album: string | null
  image: string
  src: string
}

export interface Details {
  track: Track | null,
  paused: boolean,
  progress: number,
  progressLoading: number,
  currentTime: number,
  duration: number,
  isLoadeddata: boolean,
  isLoadedmetadata: boolean
}
