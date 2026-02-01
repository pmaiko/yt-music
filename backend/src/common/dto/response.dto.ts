import { ResponseInterface } from '../interface/response.interface';

export class ResponseDto<D, M> implements ResponseInterface<D, M> {
  constructor(
    public data: D,
    public meta: M,
  ) {}
}
