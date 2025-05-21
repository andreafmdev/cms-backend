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
  /**
   * Search products by filters
   * @param filters - The filters to search the products
   * @returns The products domain entities
   */
  async searchProducts(filters: {
    name?: string;
    categoryId?: string;
    brandId?: string;
    price?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
    languageCode?: string;
  }): Promise<Product[]> {
    const query = this.buildSearchQuery(filters);

    const limit = filters.limit ?? process.env.DEFAULT_LIMIT;
    const page = filters.page ?? process.env.DEFAULT_PAGE;
    const safePage = Math.max(1, Number(page) || 1); // assicura che sia almeno 1
    const safeLimit = Math.max(1, Number(limit) || 10); // assicura che sia almeno 1

    query.skip((safePage - 1) * safeLimit).take(safeLimit);
    const ormEntities = await query.getMany();
    return ormEntities.map((orm) => this.mapper.toDomain(orm));
  }
  /**
   * Count the number of products by filters
   * @param filters - The filters to count the products
   * @returns The number of products
   */
  async searchProductsCount(filters: {
    name?: string;
    categoryId?: string;
    brandId?: string;
    price?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
  }): Promise<number> {
    const query = this.buildSearchQuery(filters);
    return await query.getCount();
  }
  /**
   * Build the query to search products
   * @param filters - The filters to search the products
   * @returns The query builder
   */
  private buildSearchQuery(filters: {
    name?: string;
    categoryId?: string;
    brandId?: string;
    price?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    languageCode?: string;
  }) {
    const query = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.translations', 'translation')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.attributesValues', 'attributeValue');

    if (filters.name) {
      query.andWhere('translation.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters.categoryId) {
      query.andWhere('product.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }
    if (filters.languageCode) {
      query.andWhere('translation.languageCode = :languageCode', {
        languageCode: filters.languageCode,
      });
    }
    if (filters.brandId) {
      query.andWhere('product.brandId = :brandId', {
        brandId: filters.brandId,
      });
    }
    if (filters.price) {
      query.andWhere('product.price = :price', { price: filters.price });
    }
    if (filters.isAvailable !== undefined) {
      query.andWhere('product.isAvailable = :isAvailable', {
        isAvailable: filters.isAvailable,
      });
    }
    if (filters.isFeatured !== undefined) {
      query.andWhere('product.isFeatured = :isFeatured', {
        isFeatured: filters.isFeatured,
      });
    }
    return query;
  }
}
