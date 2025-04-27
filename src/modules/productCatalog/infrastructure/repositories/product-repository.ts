import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../mapper/product-mapper';
import { IProductRepository } from '@module/productCatalog/domain/repositories/product-repository.interface';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@module/productCatalog/domain/aggregates/product';

@Injectable()
export class ProductRepository
  extends BaseRepository<Product, ProductOrmEntity, ProductId>
  implements IProductRepository
{
  constructor(
    @InjectRepository(ProductOrmEntity)
    repo: Repository<ProductOrmEntity>,
    mapper: ProductMapper,
  ) {
    super(repo, mapper);
  }
  /**
   * Find a product by its ID
   * @param id - The ID of the product to find
   * @returns The product domain entity if found, otherwise null (Product | null)
   */
  async findProductById(id: ProductId): Promise<Product | null> {
    const productOrm = await super.findById(id);
    return productOrm;
  }
  /**
   * Create a new product
   * @param product - The product domain entity to create
   * @returns The created product domain entity
   */
  async createProduct(product: Product): Promise<Product> {
    const newProduct: Product = await super.save(product);

    return newProduct;
  }
}
