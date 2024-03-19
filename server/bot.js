import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import { MusicService } from './services/MusicService.js'

export default function (app) {
  const TOKEN = process.env.APP_TELEGRAM_BOT_TOKEN
  const URL = process.env.PUBLIC_URL
  const bot = new TelegramBot(TOKEN, { polling: process.env.NODE_ENV !== 'production' })

  app.get('/setWebHook/:url?', async (req, res) => {
    const paramUrl = req.params.url
    try {
      const data = await bot.setWebHook(`${paramUrl || URL}/bot${TOKEN}`)
      res.send(data)
    } catch (error) {
      return res.send(error)
    }
  })

  app.post(`/bot${TOKEN}`,  express.json(), (req, res) => {
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
