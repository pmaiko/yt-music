import { getListController } from './controllers/getListController.js'
import express from 'express'

const apiRouter = express.Router()

apiRouter.get('/get-list', getListController)

export default apiRouter
