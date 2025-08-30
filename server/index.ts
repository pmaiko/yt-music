import 'dotenv/config'
import ip from 'ip'
import express from 'express'
import ViteExpress from 'vite-express'
import { resolve } from 'path'
import apiRouter from './router'
import tgBot from './modules/tg-bot/index'

const app = express()
const port = 3001

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(resolve(__dirname, '../build')))
  app.use(express.static(resolve(__dirname, '../static')))
}

app.use('/api', apiRouter)
tgBot(app)

ViteExpress.listen(app, port, () => {
  console.log(`App listening on port http://localhost:${port}`)
  console.log(`App listening on port http://${ip.address()}:${port}`)
})
