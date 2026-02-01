import {
  PaginatedResponseInterface,
  PaginationMetaInterface,
} from '../interface/paginated.response.interface';

export class PaginationMetaDto implements PaginationMetaInterface {
  constructor(
    public page: number,
    public perPage: number,
    public total: number,
    public pages: number,
  ) {}
}

export class PaginatedResponseDto<T> implements PaginatedResponseInterface<T> {
  constructor(
    public data: T[],
    public meta: PaginationMetaDto,
  ) {}
}
