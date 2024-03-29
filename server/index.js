import 'dotenv/config'
import ip from 'ip'
import express from 'express'
import ViteExpress from 'vite-express'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'
import apiRouter from './router.js'
import bot from './bot.js'

global.__dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000

if (process.env.NODE_ENV === 'production') {
  ViteExpress.config({ mode: process.env.NODE_ENV })
  app.use(express.static(resolve(__dirname, '../build')))
  app.use(express.static(resolve(__dirname, '../static')))
}

app.use('/api', apiRouter)
bot(app)

ViteExpress.listen(app, port, () => {
  console.log(`App listening on port http://localhost:${port}`)
  console.log(`App listening on port http://${ip.address()}:${port}`)
})
