import { ProductId } from '../value-objects/product-id';
import { Product } from '../aggregates/product';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';

export interface IProductRepository
  extends BaseRepository<Product, ProductOrmEntity, ProductId> {
  findProductById(id: ProductId): Promise<Product | null>; // ✅ ENTITÀ DI DOMINIO
  createProduct(product: Product): Promise<Product>;
}
