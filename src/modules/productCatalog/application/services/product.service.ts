import { Product } from '@module/productCatalog/domain/aggregates/product';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { ProductRepository } from '@module/productCatalog/infrastructure/repositories/product-repository';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findProductById(id: ProductId): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }
  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
  async findProductsByFilters(filters: any): Promise<Product[]> {
    return await this.productRepository.findAllByCondition(
      filters as FindOptionsWhere<ProductOrmEntity>,
    );
  }
  async createProduct(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }
}
