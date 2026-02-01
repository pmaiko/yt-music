import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  normalizeString(str: string): string {
    if (!str) {
      return '';
    }
    return str.replace(/(\([^)]*\)|\[[^\]]*\])/g, '');
  }
}
