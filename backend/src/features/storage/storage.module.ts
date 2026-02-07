import { Module } from '@nestjs/common';
import { HelperModule } from '../../common/services/helper.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { StorageController } from './storage.controller';

@Module({
  imports: [HelperModule, GoogleDriveModule],
  controllers: [StorageController],
})
export class StorageModule {}
