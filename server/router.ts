import express from 'express'
import { MusicController } from './modules/music/music.controller'
import { TestController } from './modules/test/test.controller'

const apiRouter = express.Router()

new MusicController(apiRouter)
new TestController(apiRouter)

export default apiRouter
