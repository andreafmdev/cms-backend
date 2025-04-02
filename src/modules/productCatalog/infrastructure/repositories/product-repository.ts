import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../mapper/product.mapper';
import { IProductRepository } from '@module/productCatalog/domain/repositories/product-repository.interface';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@module/productCatalog/domain/aggregates/product';

@Injectable()
export class ProductRepository
  extends BaseRepository<ProductOrmEntity, ProductId>
  implements IProductRepository
{
  constructor(
    @InjectRepository(ProductOrmEntity)
    repo: Repository<ProductOrmEntity>,
    private readonly mapper: ProductMapper,
  ) {
    super(repo);
  }
  /**
   * Find a product by its ID
   * @param id - The ID of the product to find
   * @returns The product domain entity if found, otherwise null (Product | null)
   */
  async findProductById(id: ProductId): Promise<Product | null> {
    const productOrm = await super.findById(id);
    return productOrm ? this.mapper.toDomain(productOrm) : null;
  }
  /**
   * Create a new product
   * @param product - The product domain entity to create
   * @returns The created product domain entity
   */
  async createProduct(product: Product): Promise<Product> {
    const productOrm = this.mapper.toPersistence(product);
    const createdProductOrm = await super.save(productOrm);
    return this.mapper.toDomain(createdProductOrm);
  }
}
