import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { MusicService } from './music.service.js'

ffmpeg.setFfmpegPath(ffmpegPath.path)

export const musicController = async (req, res) => {
  const pageToken = req.query.pageToken || null

  const data = await MusicService.get({
    pageToken
  })

  res.send(data)
}
