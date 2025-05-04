import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { SearchCategoriesRequestDto } from './search-categories.request';
export class SearchCategoriesQuery extends BaseFilterDto {
  filters: Partial<SearchCategoriesRequestDto>;
  constructor(request: SearchCategoriesRequestDto) {
    super();
    this.filters = request;
  }
}
