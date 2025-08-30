import type { Request, Response } from 'express'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { MusicService } from './music.service.ts'

ffmpeg.setFfmpegPath(ffmpegPath.path)

export const musicController = async (req: Request, res: Response) => {
  const pageToken = req.query.pageToken || null

  const data = await MusicService.get({
    pageToken
  } as any)

  res.send(data)
}
