import TelegramBot from 'node-telegram-bot-api'

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
    bot.sendMessage(chatId, 'Received your message1')
  })
}
