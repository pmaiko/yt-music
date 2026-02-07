import { Module } from '@nestjs/common';
import { GoogleDriveService } from './services/google-drive/google-drive.service';
import { StorageController } from './storage.controller';
import { HelperModule } from '../../common/services/helper.module';

@Module({
  imports: [HelperModule],
  providers: [GoogleDriveService],
  controllers: [StorageController],
})
export class StorageModule {}
