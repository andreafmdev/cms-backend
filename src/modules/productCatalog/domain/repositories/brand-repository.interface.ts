import { Brand } from '../entities/brand';

export interface IBrandRepository {
  createBrand(brand: Brand): Promise<Brand>;
  findAllBrands(): Promise<Brand[]>;
}
