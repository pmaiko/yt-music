import 'dotenv/config'
import ip from 'ip'
import express from 'express'
import ViteExpress from 'vite-express'
import { dirname } from 'path'
import { fileURLToPath } from 'node:url'
import apiRouter from './router.ts'
import tgBot from './modules/tg-bot/index.ts'

(global as any).__dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3001

app.use('/api', apiRouter)
tgBot(app)

ViteExpress.listen(app, port, () => {
  console.log(`App listening on port http://localhost:${port}`)
  console.log(`App listening on port http://${ip.address()}:${port}`)
})
