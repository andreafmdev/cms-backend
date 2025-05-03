import { ProductCatalogFilterDto } from '../../dto/filter/product-catalog-filter.dto';

export class GetProductCatalogQuery {
  constructor(
    public readonly filters?: ProductCatalogFilterDto,
    public readonly languageCode?: string,
  ) {
    this.languageCode = languageCode ?? 'it';
  }
}
