import { Expose, Type } from 'class-transformer';

class BrandDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}

class ImageDto {
  @Expose()
  url: string;
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
  id: string;
  @Expose()
  name: string;
  @Expose()
  value: string;
}
@Expose()
export class GetProductDetailResponseDto {
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
  @Expose()
  attributes: AttributeDto[];
  @Expose()
  @Type(() => ImageDto)
  images: ImageDto[];
}
