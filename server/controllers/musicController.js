import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'

import { MusicService } from '../services/MusicService.js'
// import { HttpsProxyAgent } from 'https-proxy-agent'
//
// console.log(HttpsProxyAgent)
// const proxy = 'http://23.227.38.217'
// const agent = new HttpsProxyAgent(proxy)

ffmpeg.setFfmpegPath(ffmpegPath.path)

export const musicController = async (req, res) => {
  const pageToken = req.query.pageToken || null

  const data = await MusicService.get({
    pageToken
  })

  res.send(data)
}
