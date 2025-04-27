import { BrandFilterDto } from '@productCatalogModule/application/dto/brand-filter.dto';

export class GetBrandsQuery {
  constructor(public readonly filters?: BrandFilterDto) {}
}
