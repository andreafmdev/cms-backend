import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { ProductRepository } from '@module/productCatalog/infrastructure/repositories/product-repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async findBrandById(id: BrandId): Promise<Brand | null> {
    return await this.brandRepository.findBrandById(id);
  }
  async findAllBrands(): Promise<Brand[]> {
    return await this.brandRepository.findAllBrands();
  }
  async createBrand(name: string): Promise<Brand> {
    const brand = Brand.create({ name });
    return await this.brandRepository.createBrand(brand);
  }
  async updateBrand(name: string, id: string): Promise<Brand> {
    const brand = await this.findBrandById(BrandId.create(id));
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const productsCount = await this.productRepository.searchProductsCount({
      brandId: id,
    });
    if (productsCount > 0) {
      throw new ConflictException(
        `Brand has ${productsCount} products, cannot be deleted`,
      );
    }
    return await this.brandRepository.save(brand.update({ name }));
  }
  async deleteBrand(id: string): Promise<boolean> {
    const brand = await this.findBrandById(BrandId.create(id));
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const productsCount = await this.productRepository.searchProductsCount({
      brandId: id,
    });
    if (productsCount > 0) {
      throw new ConflictException(
        `Brand has ${productsCount} products, cannot be deleted`,
      );
    }
    await this.brandRepository.remove(brand);
    const deletedBrand = await this.findBrandById(BrandId.create(id));
    return !deletedBrand;
  }
  async searchBrands(filters: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<Brand[]> {
    const params = {
      filters: {
        name: filters.name,
      },
      pagination: {
        page: filters.page,
        limit: filters.limit,
      },
    };
    return await this.brandRepository.findAllByCondition(params);
  }
  async countSearchBrands(filters: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<number> {
    return await this.brandRepository.count(filters);
  }
}
