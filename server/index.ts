import 'tsconfig-paths/register.js'
import 'dotenv/config'
import ip from 'ip'
import express, { type Request, type Response } from 'express'
import ViteExpress from 'vite-express'
import { resolve } from 'path'
import apiRouter from './router'
import tgBot from './modules/tg-bot/index'

// (global as any).__dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3001

if (process.env.NODE_ENV === 'production') {
  ViteExpress.config({ mode: process.env.NODE_ENV })
  app.use(express.static(resolve(__dirname, '../build')))

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(resolve(__dirname, '../build/index.html'))
  })
}

app.use('/api', apiRouter)
tgBot(app)

ViteExpress.listen(app, port, () => {
  console.log(`App listening on port http://localhost:${port}`)
  console.log(`App listening on port http://${ip.address()}:${port}`)
})
