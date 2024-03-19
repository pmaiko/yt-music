import TelegramBot from 'node-telegram-bot-api'
import express from 'express'

export default function (app) {
  const TOKEN = process.env.APP_TELEGRAM_BOT_TOKEN
  const URL = process.env.PUBLIC_URL
  const bot = new TelegramBot(TOKEN)

  bot.setWebHook(`${URL}/bot${TOKEN}`)

  app.use(express.json())

  app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
  })

  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]
    bot.sendMessage(chatId, resp)
  })

  bot.on('message', (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Received your message')
  })
}
