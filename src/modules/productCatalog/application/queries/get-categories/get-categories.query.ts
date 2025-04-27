import { CategoryFilterDto } from '@productCatalogModule/application/dto/category-filter.dto';

export class GetCategoriesQuery {
  constructor(public readonly filters?: CategoryFilterDto) {}
}
