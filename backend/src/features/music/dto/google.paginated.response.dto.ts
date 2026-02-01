import {
  PaginatedResponseInterface,
  PaginationMetaInterface,
} from '../../../common/interface/paginated.response.interface';

export class GooglePaginatedResponseDto<T>
  implements PaginatedResponseInterface<T, GooglePaginationMetaDto>
{
  constructor(
    public data: T[],
    public meta: GooglePaginationMetaDto,
  ) {}
}

export class GooglePaginationMetaDto
  implements Omit<PaginationMetaInterface, 'page'>
{
  constructor(
    public nextPageToken: string | null,
    public perPage: number,
    public total: number,
    public pages: number,
  ) {}
}
