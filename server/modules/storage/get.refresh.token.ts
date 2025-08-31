import 'dotenv/config'
import { google } from 'googleapis'
import readline from 'readline'

const SCOPES = ['https://www.googleapis.com/auth/drive']

const oAuth2Client = new google.auth.OAuth2(
  process.env.APP_GOOGLE_CLIENT_ID,
  process.env.APP_GOOGLE_CLIENT_SECRET,
  process.env.APP_GOOGLE_REDIRECT_URI
)

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
})

console.log('Visit this URL to authorize the app:', authUrl)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Enter the code from Google: ', async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code)
    console.log('New refresh token:', tokens.refresh_token)
    rl.close()
  } catch (err) {
    console.error('Error retrieving token:', err)
    rl.close()
  }
})
