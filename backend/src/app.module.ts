import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { RequestModule } from './common/request/request.module';
import { HelperModule } from './common/services/helper.module';
import { MusicModule } from './features/music/music.module';
import { CatsModule } from './features/cats/cats.module';
import { TelegramModule } from './features/telegram/telegram.module';
import { StorageModule } from './features/storage/storage.module';
import { GoogleDriveModule } from './features/google-drive/google-drive.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule,
    RequestModule,
    HelperModule,
    MusicModule,
    CatsModule,
    TelegramModule,
    StorageModule,
    GoogleDriveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
