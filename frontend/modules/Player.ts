export interface AudioData {
  id: string,
  src: string
}

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

  constructor(playlist: Array<AudioData>, onChangeStatus: (status: Status) => void) {
    this.playlist = playlist
    this.audio = new Audio()
    this.onChangeStatus = onChangeStatus
  }

  play (audioData: AudioData) {
    if (this.playingAudio?.id === audioData.id && !this.audio.paused) {
      this.audio.pause()
      this.changeStatus({ message: 'Audio paused' })
      return
    } else if (this.audio.paused) {
      this.audio.play()
      this.changeStatus({ message: 'Audio play again' })
      return
    }

    this.audio.src = audioData.src
    this.audio.play()
    this.playingAudio = audioData

    this.changeStatus()

    this.audio.addEventListener('ended', () => {
      const currentAudioDataIndex = this.playlist.findIndex(item => item.id === this.playingAudio?.id)
      console.log(currentAudioDataIndex)
      console.log(currentAudioDataIndex + 1)
      console.log(this.playlist)
      const nextAudioData = this.playlist[currentAudioDataIndex + 1]

      if (nextAudioData) {
        this.play(nextAudioData)
      }

      this.changeStatus({ message: 'Audio ended' })
    })
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
}
