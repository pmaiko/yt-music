import { Controller, Get, Query } from '@nestjs/common';
// import { RequestService } from '../../common/request/request.service';
import { YtMusicService } from './services/yt-music.service';
import { GoogleMusicQueryDto } from './dto/google.music.query.dto';

@Controller('music')
export class MusicController {
  constructor(private ytService: YtMusicService) {}
  @Get()
  async getMusic(@Query() query: GoogleMusicQueryDto) {
    const data = await this.ytService.getPlaylistItems(query);
    return data;
    // return new ResponseDto(data);
  }
}
