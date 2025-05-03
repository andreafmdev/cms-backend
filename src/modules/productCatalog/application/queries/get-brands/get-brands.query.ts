import { BrandFilterDto } from '@module/productCatalog/application/dto/filter/brand-filter.dto';

export class GetBrandsQuery {
  constructor(public readonly filters?: BrandFilterDto) {}
}
