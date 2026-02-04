export default () => ({
  serverAddress: process.env.SERVER_ADDRESS,
  port: process.env.PORT || 3000,
  isProd: process.env.NODE_ENV === 'production',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  googleApiKey: process.env.GOOGLE_API_KEY,
});
