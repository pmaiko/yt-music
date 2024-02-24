import { musicController, getAudioURL } from './controllers/musicController.js'
import express from 'express'

const apiRouter = express.Router()

apiRouter.get('/music', musicController)
apiRouter.get('/yt-video/:videoId', getAudioURL)

export default apiRouter
