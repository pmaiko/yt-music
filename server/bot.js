import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import { MusicService } from './modules/music/music.service.js'

export default function (app) {
  const isProd = process.env.NODE_ENV === 'production'

  const TOKEN = process.env.APP_TELEGRAM_BOT_TOKEN
  const URL = process.env.PUBLIC_URL
  const bot = new TelegramBot(TOKEN, { polling: !isProd })

  if (isProd) {
    const webhookUrl = `${process.env.PUBLIC_URL}/bot${TOKEN}`
    bot.setWebHook(webhookUrl)
      .then(data => console.log('Webhook set successfully:', webhookUrl, data))
      .catch(err => console.error('Error setting webhook:', err))
  }

  app.get('/bot/me', async (req, res) => {
    const data = await bot.getMe()
    res.send(data)
  })

  app.get('/bot/setWebHook/:url?', async (req, res) => {
    const paramUrl = req.params.url
    try {
      const data = await bot.setWebHook(`${paramUrl || URL}/bot${TOKEN}`)
      res.send('Webhook set successfully:', data)
    } catch (error) {
      return res.send('Error setting webhook:', error)
    }
  })

  app.get('/bot/getWebHookInfo', async (req, res) => {
    const data = await bot.getWebHookInfo()
    res.send(data)
  })

  app.get('/bot/deleteWebHook', async (req, res) => {
    const data = await bot.deleteWebHook()
    res.send(data)
  })

  app.post(`/bot${TOKEN}`, express.json(), (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
  })

  // /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Hello!', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Open Web App',
              web_app: { url: 'http://192.168.60.47:4000/403/test.html' }
            },
            {
              text: 'Посетить наш сайт',
              url: 'http://192.168.60.47:4000/403/test.html'
            },
            {
              text: 'get location',
              request_location: true
            },
            {
              text: 'get contact',
              request_contact: true
            },
            {
              text: '/playlist'
            },
            {
              text: 'ok'
            }
          ],
          ['close']
        ],
        one_time_keyboard: true
      }
    })
  })

  // /test
  bot.onText(/\/test/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, '<b>Hello!</b>', {
      parse_mode: 'HTML'
    })
  })

  // /playlist
  bot.onText(/\/playlist/, async (msg) => {
    const chatId = msg.chat.id
    const data = await MusicService.get()
    data.items.forEach(item => {
      bot.sendMessage(chatId, `<a href="${item.src}">${item.title}!</a>`, {
        parse_mode: 'HTML'
      })
    })
  })

  // /echo
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]
    bot.sendMessage(chatId, resp)
  })

  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    if (msg.text === 'close') {
      bot.sendMessage(chatId, 'closed!', {
        reply_markup: {
          remove_keyboard: true
        }
      })
    }
  })
}
