import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MusicService {
  constructor(private configService: ConfigService) {
    configService.get('APP_API_URL');
  }
}
