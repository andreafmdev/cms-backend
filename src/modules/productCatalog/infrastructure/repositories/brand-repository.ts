import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { ILike, Repository } from 'typeorm';
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
  /**
   * Find a brand by its name
   * @param name - The name of the brand to find
   * @returns The brand domain entity if found, otherwise null (Brand | null)
   */
  async findBrandsByName(name: string): Promise<Brand[]> {
    const brands = await super.findAllByCondition({
      filters: {
        name: ILike(`%${name}%`),
      },
    });
    return brands;
  }
  /**
   * Find a brand by its name
   * @param name - The name of the brand to find
   * @returns The brand domain entity if found, otherwise null (Brand | null)
   */
  async findBrandByName(name: string): Promise<Brand | null> {
    const brand = await super.findOneByCondition({
      name: ILike(`${name}`),
    });
    return brand;
  }
}
