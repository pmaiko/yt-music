import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService) {}
  async get<T = any, D = any>(
    url?: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<AxiosResponse<T, D>> {
    return await firstValueFrom(
      this.httpService.get<T, D>(url || 'https://google.com', config),
    );
  }
}
