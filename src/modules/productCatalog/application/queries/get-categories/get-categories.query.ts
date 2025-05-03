import { CategoryFilterDto } from '@module/productCatalog/application/dto/filter/category-filter.dto';

export class GetCategoriesQuery {
  constructor(public readonly filters?: CategoryFilterDto) {}
}
