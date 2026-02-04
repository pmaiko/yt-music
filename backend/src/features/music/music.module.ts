import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './services/music.service';
import { YtMusicService } from './services/yt-music.service';
import { Mp3wrParserService } from './parsers/mp3wr-parser.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService, YtMusicService, Mp3wrParserService],
  exports: [MusicService, YtMusicService, Mp3wrParserService],
})
export class MusicModule {}
