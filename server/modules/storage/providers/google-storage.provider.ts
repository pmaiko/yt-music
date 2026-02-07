import fs from 'fs'
import { Readable } from 'stream'
import { drive_v3, google } from 'googleapis'
import { JWT } from 'google-auth-library/build/src/auth/jwtclient'
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client'
import { getMimeType } from '../utils/get-mime-type.ts'
type AuthType = JWT | OAuth2Client

const apiKeys = JSON.parse(process.env.APP_GOOGLE_SERVICE_ACCOUNT_KEY!)
const SCOPES = ['https://www.googleapis.com/auth/drive']

export class GoogleStorageProvider {
  authClient!: AuthType

  constructor() {
    this.authClient = this.getOAuthClient()
  }

  getOAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.APP_GOOGLE_CLIENT_ID!,
      process.env.APP_GOOGLE_CLIENT_SECRET!,
      process.env.APP_GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials({ refresh_token: process.env.APP_GOOGLE_REFRESH_TOKEN })
    return oauth2Client
  }

  async authorize() {
    const auth = new google.auth.JWT(
      apiKeys.client_email,
      undefined,
      apiKeys.private_key.replace(/\\n/g, '\n'),
      SCOPES
    )

    try {
      await auth.authorize()
      return auth
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error authorizing Google Drive API: ${error.message}`)
      }
    }
  }

  async listFiles() {
    const drive = google.drive({ version: 'v3', auth: this.authClient })

    try {
      const response = await drive.files.list({
        pageSize: 100,
        fields: 'nextPageToken, files(id, name)',
        q: `'${process.env.APP_GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
      })

      const files = response.data.files
      if (files?.length) {
        console.log('Available files:')
        files.forEach(file => {
          console.log(`${file.name} (${file.id})`)
        })
      } else {
        console.log('No files found.')
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error listing files in Google Drive: ${error.message}`)
      }
    }
  }

  async readFile () {
    return Buffer.from('test')
  }

  async writeFile(buffer: Buffer, filename: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient })
    const stream = Readable.from(buffer)

    const mimetype = getMimeType(filename)

    try {
      const response = await drive.files.create({
        requestBody: {
          name: filename,
          parents: [process.env.APP_GOOGLE_DRIVE_FOLDER_ID!] // petyamaiko/yt-music
        },
        media: {
          mimeType: mimetype,
          body: stream
        },
        fields: 'id, name'
      })

      if (response) {
        console.log('File uploaded successfully. File ID:', response.data.id)
        return response.data
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error uploading file to Google Drive: ${error.message}`)
      }
    }
  }

  async deleteFile(fileId: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient })

    try {
      await drive.files.delete({
        fileId: fileId
      })

      console.log('File deleted successfully.')
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting file from Google Drive: ${error.message}`)
      }
    }
  }

  async updateFile(fileId: string, filePath: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient })

    const fileMetadata = {
      name: filePath.split('/').pop() // Extract file name from path
    }

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath) // Readable stream for file update
    }

    try {
      const response = await drive.files.update({
        requestBody: fileMetadata,
        fileId: fileId,
        media: media
      })

      console.log('File updated successfully.', response)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating file in Google Drive: ${error.message}`)
      }
    }
  }

  async getFileByName(filename: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient })

    try {
      const response = await drive.files.list({
        q: `'${process.env.APP_GOOGLE_DRIVE_FOLDER_ID!}' in parents and name='${filename}' and trashed=false`,
        fields: 'files(id, name, mimeType)',
        pageSize: 1,
      })

      const files = response.data.files
      if (files?.length) {
        console.log('Found file:', files[0].name, files[0].id)
        return files[0]
      } else {
        console.log('No file found with this name.')
        return null
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting file by name: ${error.message}`)
      }
    }
  }

  async getStream(file: drive_v3.Schema$File) {
    const drive = google.drive({ version: 'v3', auth: this.authClient })

    const fileRes = await drive.files.get(
      {
        fileId: file.id!, alt: 'media'
      },
      {
        responseType: 'stream'
      }
    )

    return {
      stream: fileRes.data,
      mimeType: file.mimeType || 'application/octet-stream',
      name: file.name
    }
  }
}
