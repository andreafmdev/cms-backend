import { ProductFilterDto } from '../../dto/product-filter.dto';

export class GetProductsQuery {
  constructor(public readonly filters?: ProductFilterDto) {}
}
