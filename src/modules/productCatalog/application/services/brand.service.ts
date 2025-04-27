import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async findBrandById(id: BrandId): Promise<Brand | null> {
    return await this.brandRepository.findBrandById(id);
  }
  async findAllBrands(): Promise<Brand[]> {
    return await this.brandRepository.findAllBrands();
  }
  async createBrand(brand: Brand): Promise<Brand> {
    return await this.brandRepository.createBrand(brand);
  }
}
