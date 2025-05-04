import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { SearchBrandsRequestDto } from './search-brands.request';
export class SearchBrandsQuery extends BaseFilterDto {
  filters: Partial<SearchBrandsRequestDto>;
  constructor(request: SearchBrandsRequestDto) {
    super();
    this.filters = request;
  }
}
