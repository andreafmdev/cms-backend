import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../infrastructure/mapper/product.mapper';
import { ProductId } from '../domain/value-objects/product-id';
import { Product } from '../domain/aggregates/product';
import { IProductRepository } from '../domain/repositories/product-repository.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async findProductById(id: ProductId): Promise<Product | null> {
    const productOrm: Product | null =
      await this.productRepository.findProductById(id);
    return productOrm ? productOrm : null;
  }
  async createProduct(product: Product): Promise<Product> {
    const createdProductOrm =
      await this.productRepository.createProduct(product);
    return createdProductOrm;
  }
}
