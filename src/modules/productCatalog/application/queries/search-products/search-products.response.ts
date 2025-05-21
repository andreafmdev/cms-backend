import { Expose, Type } from 'class-transformer';

class BrandDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}

class CategoryDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  attributes: AttributeDto[];
}

class AttributeDto {
  @Expose()
  name: string;
}
@Expose()
export class SearchProductsResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;

  @Expose()
  description: string;
  @Expose()
  price: number;
  @Expose()
  isAvailable: boolean;
  @Expose()
  isFeatured: boolean;
  @Expose()
  @Type(() => BrandDto)
  brand: BrandDto;
  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
