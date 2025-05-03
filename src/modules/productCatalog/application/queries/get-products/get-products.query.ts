import { ProductFilterDto } from '../../dto/filter/product-filter.dto';

export class GetProductsQuery {
  constructor(public readonly filters?: ProductFilterDto) {}
}
