import { SearchCategoriesRequestDto } from './search-categories.request';
export class SearchCategoriesQuery {
  filters: Partial<SearchCategoriesRequestDto>;
  constructor(request: SearchCategoriesRequestDto) {
    this.filters = request;
  }
}
