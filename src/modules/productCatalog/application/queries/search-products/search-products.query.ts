import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { SearchProductsRequestDto } from './search-products.request';

export class SearchProductsQuery extends BaseFilterDto {
  filters: Partial<SearchProductsRequestDto>;
  constructor(request: SearchProductsRequestDto) {
    super();
    this.filters = request;
  }
}
