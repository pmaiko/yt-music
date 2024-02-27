import { AxiosInstance } from 'axios'
import { AudioData } from '~/types.ts'

export interface Status {
  playingAudio: AudioData | null,
  paused: boolean,
  message: string
}

export class Player {
  private axios: AxiosInstance
  private playlist: Array<AudioData>
  private audio: HTMLAudioElement
  private mediaSource: MediaSource
  private playingAudio: AudioData | null = null
  private onChangeStatus: (status: Status) => void

  constructor(axios: AxiosInstance, playlist: Array<AudioData>, audio: HTMLAudioElement, onChangeStatus: (status: Status) => void) {
    this.axios = axios
    this.playlist = playlist
    this.audio = audio
    this.mediaSource = new MediaSource()
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

    this.playingAudio = audioData
    this.mediaSource = new MediaSource()
    this.mediaSource.addEventListener('sourceopen', this.sourceOpen)
    this.audio.src = URL.createObjectURL(this.mediaSource)

    // this.audio.src = audioData.src
    // this.audio.play()
    // this.playingAudio = audioData

    this.changeStatus()
  }

  sourceOpen = async () => {
    const sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg')
    // const sourceBuffer = this.mediaSource.addSourceBuffer('audio/webm; codecs="opus"')

    const step = 100000 / 10 // 100 килобай
    const contentLength = this.playingAudio?.contentLength || 0
    const count = Math.ceil(contentLength / step)
    const ranges: Array<{ start: number, end: number }> = []
    for (let i = 0; i < count; i++) {
      const start = i * step
      const end = Math.min((i + 1) * step - 1, contentLength)

      ranges.push({
        start,
        end
      })
    }

    let chunkNumber = 0
    const read = async (params?: any) => {
      if (this.playingAudio?.audioApiURL) {
        const buffer = await this.fetchAudio(this.playingAudio?.audioApiURL, params)
        chunkNumber++

        sourceBuffer.addEventListener('updateend', () => {
          console.log('updateend')
          if (!this.mediaSource.endOfStream) {
            this.mediaSource.endOfStream()
          }
        })

        sourceBuffer.appendBuffer(buffer)
        console.log(1)
        this.audio.play()

        console.log('before setTimeout')
        setTimeout(() => {
          read({
            ...(ranges[chunkNumber] || {}),
            prevStart: ranges[chunkNumber -1]?.start,
            prevEnd: ranges[chunkNumber -1]?.end
          })
        }, 1000)
      }
    }

    read({
      ...(ranges[chunkNumber] || {})
    })
  }

  async fetchAudio (url: string, params?: any) {
    const { data } = await this.axios.get(url, {
      responseType: 'arraybuffer',
      params
    })
    return data
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
