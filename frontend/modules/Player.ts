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
      const currentTrackIndex = this.playlist.findIndex(item => item.id === this.playingAudio?.id)
      const nextTrackIndex = (currentTrackIndex + 1) % this.playlist.length
      const nextAudioData = this.playlist[nextTrackIndex]

      if (nextAudioData) {
        this.play(nextAudioData)
      }

      this.changeStatus({ message: 'Audio ended' })
    })
  }

  play (audioData: AudioData) {
    if (this.playingAudio?.id === audioData.id && !this.audio.paused) {
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

  changeStatus ({ message }: { message?: string } = {}) {
    const status: Status =  {
      playingAudio: this.playingAudio,
      paused: this.audio.paused,
      message: message || ''
    }

    this.onChangeStatus(status)
    return status
  }

  destroy () {
    this.audio.pause()
    this.audio = new Audio()
    this.playingAudio = null
  }
}
