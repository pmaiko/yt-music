import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MusicService {
  constructor(private configService: ConfigService) {
    configService.get('BASE_URL');
  }
}
