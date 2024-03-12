import { AudioData } from '~/types.ts'

export interface Status {
  playingAudio: AudioData | null,
  paused: boolean,
  message: string
}

export class Player {
  private playlist: Array<AudioData>
  private audio: HTMLAudioElement
  private playingAudio: AudioData | null = null
  private onChangeStatus: (status: Status) => void

  constructor(playlist: Array<AudioData>, audio: HTMLAudioElement, onChangeStatus: (status: Status) => void) {
    this.playlist = playlist
    this.audio = audio
    this.onChangeStatus = onChangeStatus

    this.audio.addEventListener('ended', () => {
      this.nextTrack()
    })
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      this.nextTrack()
    })
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      this.previousTrack()
    })
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      this.previousTrack()
    })
    navigator.mediaSession.setActionHandler('seekforward', () => {
      this.nextTrack()
    })
    navigator.mediaSession.setActionHandler('play', () => {
      this.audio.play()
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      this.audio.pause()
    })
    navigator.mediaSession.metadata = new MediaMetadata({
      title: '---',
      artist: 'artist',
      album: 'album'
    })
  }

  play (audioData: AudioData) {
    if (this.playingAudio?.id === audioData.id) {
      if (this.audio.paused) {
        this.audio.play()
        this.changeStatus({ message: 'Audio play again' })
      } else {
        this.audio.pause()
        this.changeStatus({ message: 'Audio paused' })
      }
      return null
    }

    this.audio.src = audioData.audioURL
    this.audio.play()
    this.playingAudio = audioData

    this.changeStatus()
  }

  nextTrack () {
    const currentTrackIndex = this.getCurrentTrackIndex()
    const nextTrackIndex = (currentTrackIndex + 1) % this.playlist.length
    const nextAudioData = this.playlist[nextTrackIndex]

    this.play(nextAudioData)
    this.changeStatus({ message: 'Audio ended' })
  }

  previousTrack () {
    const currentTrackIndex = this.getCurrentTrackIndex()
    const prevTrackIndex = (currentTrackIndex - 1 + this.playlist.length) % this.playlist.length
    const nextAudioData = this.playlist[prevTrackIndex]

    this.play(nextAudioData)
    this.changeStatus({ message: 'Audio ended' })
  }

  getCurrentTrackIndex () {
    return this.playlist.findIndex(item => item.id === this.playingAudio?.id)
  }

  changeStatus ({ message }: { message?: string } = {}) {
    const status: Status =  {
      playingAudio: this.playingAudio,
      paused: this.audio.paused,
      message: message || ''
    }

    this.onChangeStatus(status)
    return status
  }

  updatePlaylist (playlist: Array<AudioData>) {
    this.playlist = playlist
  }

  destroy () {
    this.audio.pause()
    this.audio = new Audio()
    this.playingAudio = null
  }
}
