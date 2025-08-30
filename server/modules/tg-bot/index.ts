import express, { type Express, type Request, type Response } from 'express'
import TelegramBot from 'node-telegram-bot-api'
import { MusicService } from '../music/music.service'

export default function (app: Express) {
  const isProd = process.env.NODE_ENV === 'production'

  const TOKEN: string = process.env.APP_TELEGRAM_BOT_TOKEN as string
  const URL = process.env.PUBLIC_URL as string

  const botInstance = new TelegramBot(TOKEN, { polling: !isProd })

  if (isProd) {
    const webhookUrl = `${URL}/bot${TOKEN}`
    botInstance.setWebHook(webhookUrl)
      .then(data => console.log('Webhook set successfully:', webhookUrl, data))
      .catch(err => console.error('Error setting webhook:', err))
  }

  app.get('/bot/me', async (_req: Request, res: Response) => {
    const data = await botInstance.getMe()
    res.send(data)
  })

  app.get('/bot/setWebHook/:url?', async (req: Request, res: Response) => {
    const paramURL = req.params.url
    try {
      await botInstance.setWebHook(`${paramURL || URL}/bot${TOKEN}`)
      res.send('Webhook set successfully:')
    } catch (error) {
      return res.send('Error setting webhook:')
    }
  })

  app.get('/bot/getWebHookInfo', async (_req: Request, res: Response) => {
    const data = await botInstance.getWebHookInfo()
    res.send(data)
  })

  app.get('/bot/deleteWebHook', async (_req: Request, res: Response) => {
    const data = await botInstance.deleteWebHook()
    res.send(data)
  })

  app.post(`/bot${TOKEN}`, express.json(), (req: Request, res: Response) => {
    botInstance.processUpdate(req.body)
    res.sendStatus(200)
  })

  // /start
  botInstance.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    botInstance.sendMessage(chatId, 'Hello!', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Open Web App',
              web_app: { url: URL }
            },
            {
              text: 'Get Location',
              request_location: true
            },
            {
              text: 'Get Contact',
              request_contact: true
            },
            {
              text: '/playlist'
            },
            {
              text: 'ok'
            }
          ],
        ],
        one_time_keyboard: true
      }
    })
  })

  botInstance.onText(/\/test/, (msg) => {
    const chatId = msg.chat.id
    botInstance.sendMessage(chatId, '<b>Hello!</b>', {
      parse_mode: 'HTML'
    })
  })

  botInstance.onText(/\/playlist/, async (msg) => {
    const chatId = msg.chat.id
    const data = await MusicService.get()
    data.items.forEach((item: any) => {
      botInstance.sendMessage(chatId, `<a href="${item.src}">${item.title}!</a>`, {
        parse_mode: 'HTML'
      })
    })
  })

  botInstance.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    if (match) {
      const resp = match[1]
      botInstance.sendMessage(chatId, resp)
    }
  })

  botInstance.on('message', (msg) => {
    const chatId = msg.chat.id
    if (msg.text === 'close') {
      botInstance.sendMessage(chatId, 'closed!', {
        reply_markup: {
          remove_keyboard: true
        }
      })
    }
  })
}
