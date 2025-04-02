import { ProductId } from '../value-objects/product-id';
import { Product } from '../aggregates/product';
export interface IProductRepository {
  findProductById(id: ProductId): Promise<Product | null>; // ✅ ENTITÀ DI DOMINIO
  createProduct(product: Product): Promise<Product>;
}
