import { Brand } from '../aggregates/brand';
import { BrandId } from '../value-objects/brand-id';

export interface IBrandRepository {
  createBrand(brand: Brand): Promise<Brand>;
  findAllBrands(): Promise<Brand[]>;
  findBrandById(id: BrandId): Promise<Brand | null>;
}
