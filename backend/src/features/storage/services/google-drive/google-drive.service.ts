import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';
import { JWT } from 'google-auth-library/build/src/auth/jwtclient';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { EnvironmentVariables } from '../../../../config/configuration';
import { Readable } from 'node:stream';
import { HelperService } from '../../../../common/services/helper.service';
import * as fs from 'node:fs';

type AuthType = JWT | OAuth2Client;

@Injectable()
export class GoogleDriveService {
  private readonly authClient: AuthType;
  private readonly googleDriveFolderId: string;
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly helperService: HelperService,
  ) {
    this.authClient = this.getOAuthClient();
    this.googleDriveFolderId = this.configService.get('googleDriveFolderId')!;
  }

  getOAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get('googleClientId'),
      this.configService.get('googleClientSecret'),
      this.configService.get('googleRedirectUri'),
    );
    oauth2Client.setCredentials({
      refresh_token: this.configService.get('googleRefreshToken'),
    });
    return oauth2Client;
  }

  async authorize() {
    const apiKeys = JSON.parse(
      this.configService.get('googleServiceAccountKey')!,
    ) as Record<string, string>;
    const scopes = ['https://www.googleapis.com/auth/drive'];

    const auth = new google.auth.JWT({
      email: apiKeys.client_email,
      key: apiKeys.private_key.replace(/\\n/g, '\n'),
      scopes,
    });

    try {
      await auth.authorize();
      return auth;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error authorizing Google Drive API: ${error.message}`);
      }
    }
  }

  async listFiles() {
    const drive = google.drive({ version: 'v3', auth: this.authClient });

    const response = await drive.files.list({
      pageSize: 100,
      q: `'${this.googleDriveFolderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
    });

    return response.data.files ?? [];
  }

  readFile() {
    return Buffer.from('test');
  }

  async uploadFile(buffer: Buffer, filename: string, mimetype?: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient });
    const stream = Readable.from(buffer);

    try {
      const response = await drive.files.create({
        requestBody: {
          name: filename,
          parents: [this.googleDriveFolderId], // petyamaiko/yt-music
        },
        media: {
          mimeType: mimetype || this.helperService.getMimeType(filename),
          body: stream,
        },
        fields: 'id, name',
      });

      if (response) {
        console.log('File uploaded successfully. File ID:', response.data.id);
        return response.data;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error uploading file to Google Drive: ${error.message}`,
        );
      }
    }
  }

  async deleteFile(fileId: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient });

    try {
      await drive.files.delete({
        fileId: fileId,
      });

      console.log('File deleted successfully.');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error deleting file from Google Drive: ${error.message}`,
        );
      }
    }
  }

  async updateFile(fileId: string, filePath: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient });

    const fileMetadata = {
      name: filePath.split('/').pop(), // Extract file name from path
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath), // Readable stream for file update
    };

    try {
      const response = await drive.files.update({
        requestBody: fileMetadata,
        fileId: fileId,
        media: media,
      });

      console.log('File updated successfully.', response);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error updating file in Google Drive: ${error.message}`,
        );
      }
    }
  }

  async getFileByName(filename: string) {
    const drive = google.drive({ version: 'v3', auth: this.authClient });

    try {
      const response = await drive.files.list({
        q: `'${this.googleDriveFolderId}' in parents and name='${filename}' and trashed=false`,
        fields: 'files(id, name, mimeType)',
        pageSize: 1,
      });

      const files = response.data.files;
      if (files?.length) {
        console.log('Found file:', files[0].name, files[0].id);
        return files[0];
      } else {
        console.log('No file found with this name.');
        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting file by name: ${error.message}`);
      }
    }
  }

  async getStream(file: drive_v3.Schema$File) {
    const drive = google.drive({ version: 'v3', auth: this.authClient });

    const fileRes = await drive.files.get(
      {
        fileId: file.id!,
        alt: 'media',
      },
      {
        responseType: 'stream',
      },
    );

    return {
      stream: fileRes.data,
      mimeType: file.mimeType || 'application/octet-stream',
      name: file.name,
    };
  }
}
