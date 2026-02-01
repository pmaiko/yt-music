import type { Request, Response, Router } from 'express'
import multer from 'multer'
import { MusicService } from './music.service'
import { StorageService } from '../storage/storage.service'

const storage = multer.memoryStorage()
const upload = multer({ storage })

export class MusicController {
  constructor(router: Router) {
    router.get('/music', this.getMusic)
    router.post('/music', upload.fields([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 }
    ]), this.uploadMusic)
    router.get('/music/:filename', this.getFilename)
  }
  
  async getMusic(req: Request, res: Response) {
    const pageToken = req.query.pageToken || null

    const data = await MusicService.get({
      pageToken
    } as any)

    res.send(data)
  }

  uploadMusic = async (req: Request, res: Response) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }

    const { title, description } = req.body

    const audio = files?.audio?.[0]

    if (!audio) {
      return res.status(400).json({ message: 'Missing files or fields' })
    }

    const buffer = Buffer.from(audio.buffer)

    const storage = new StorageService('' as unknown as any)
    const data = await storage.uploadFile(buffer, 'audio', audio.mimetype)

    return res.json({
      message: 'Files uploaded successfully',
      data,
      title,
      description
    })
  }

  async getFilename (req: Request, res: Response) {
    const fileName = req.params.filename

    const storage = new StorageService('' as unknown as any)

    const file = await storage.getFileByName(fileName)
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const data = await storage.getStream(file)

    res.setHeader('Content-Type', data.mimeType || 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${data.name}"`)

    data.stream.pipe(res)
  }
}
