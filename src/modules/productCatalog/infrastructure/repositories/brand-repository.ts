import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandOrmEntity } from '../entities/brand.orm-entity';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { IBrandRepository } from '@module/productCatalog/domain/repositories/brand-repository.interface';
import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { BrandMapper } from '../mapper/brand-mapper';

@Injectable()
export class BrandRepository
  extends BaseRepository<Brand, BrandOrmEntity, BrandId>
  implements IBrandRepository
{
  constructor(
    @InjectRepository(BrandOrmEntity)
    repo: Repository<BrandOrmEntity>,
    mapper: BrandMapper,
  ) {
    super(repo, mapper);
  }
  async findAllBrands(): Promise<Brand[]> {
    const brands = await super.findAll();
    return brands;
  }
  /**
   * Find a product by its ID
   * @param id - The ID of the product to find
   * @returns The product domain entity if found, otherwise null (Product | null)
   */
  async findBrandById(id: BrandId): Promise<Brand | null> {
    const brand = await super.findById(id);
    return brand;
  }
  /**
   * Create a new brand
   * @param brand - The brand domain entity to create
   * @returns The created brand domain entity
   */
  async createBrand(brand: Brand): Promise<Brand> {
    const createdBrand = await super.save(brand);
    return createdBrand;
  }
}
