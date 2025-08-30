import { musicController } from './modules/music/music.controller.js'
import express from 'express'

const apiRouter = express.Router()

apiRouter.get('/music', musicController)
apiRouter.get('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')
  let body = `
    <html>
    <body>
    Привет
  `

  setTimeout(() => {
    body = 'Петя'
    res.write(body)
  }, 2000)

  setTimeout(() => {
    body = ', Ya node js'
    res.write(body)
    res.end()
  }, 10000)
  res.write(body)
})

let counter = 0

apiRouter.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const intervalId = setInterval(() => {
    counter++
    res.write(`data: Новое сообщение ${counter}\n\n`)
  }, 2000)

  req.on('close', () => {
    clearInterval(intervalId)
    res.end()
  })
})

export default apiRouter
