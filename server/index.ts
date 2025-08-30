import 'dotenv/config'
import path from 'path'
import ip from 'ip'
import express, { type Request, type Response } from 'express'
import ViteExpress from 'vite-express'
import apiRouter from './router'
import tgBot from './modules/tg-bot/index'

const app = express()
const port = 3001

app.use('/api', apiRouter)
tgBot(app)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../build')))
  app.use(express.static(path.resolve(__dirname, '../static')))

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../build/index.html'))
  })
}

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

ViteExpress.listen(app, port, () => {
  console.log(`App listening on port http://localhost:${port}`)
  console.log(`App listening on port http://${ip.address()}:${port}`)
})
