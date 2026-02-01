import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { HelperService } from '../../common/services/helper.service';
import { MusicService } from './services/music.service';
import { YtMusicService } from './services/yt-music.service';
import { Mp3wrParserService } from './parsers/mp3wr-parser.service';

@Module({
  controllers: [MusicController],
  providers: [HelperService, MusicService, YtMusicService, Mp3wrParserService],
  imports: [],
})
export class MusicModule {}
