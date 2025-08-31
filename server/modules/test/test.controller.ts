import type { Request, Response, Router } from 'express'

export class TestController {
  constructor(router: Router) {
    router.get('/test', (_req: Request, res: Response) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Transfer-Encoding', 'chunked')
      let body = `
        <html>
        <body>
        HELLO WORLD
      `

      setTimeout(() => {
        body = 'PETYA'
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

    router.get('/sse', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const intervalId = setInterval(() => {
        counter++
        res.write(`data: New message ${counter}\n\n`)
      }, 2000)

      req.on('close', () => {
        clearInterval(intervalId)
        res.end()
      })
    })
  }
}
