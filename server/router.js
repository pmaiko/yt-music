import { musicController } from './controllers/musicController.js'
import express from 'express'

const apiRouter = express.Router()

apiRouter.get('/music', musicController)

export default apiRouter
