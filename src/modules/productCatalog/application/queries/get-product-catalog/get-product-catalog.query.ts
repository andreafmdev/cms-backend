import { ProductCatalogFilterDto } from '../../dto/filter/product-catalog-filter.dto';

export class GetProductCatalogQuery {
  constructor(
    public readonly filters?: ProductCatalogFilterDto,
    public languageCode?: string,
  ) {
    this.languageCode = languageCode ?? 'it';
  }
}
