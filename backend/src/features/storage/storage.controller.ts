import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 }, // 50M
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.googleDriveService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @Get()
  getList() {
    return this.googleDriveService.listFiles();
  }
}
