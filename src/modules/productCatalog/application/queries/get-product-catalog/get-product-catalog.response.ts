import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

import { IsString } from 'class-validator';

class BrandDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
/*class CategoryAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

}*/
class CategoryDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
export class GetProductCatalogResponseDto {
  constructor(
    id: string,
    name: string,
    description: string,
    brand: BrandDto,
    category: CategoryDto,
    isAvailable: boolean,
    isFeatured: boolean,
    price: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.brand = brand;
    this.category = category;
    this.price = price;
    this.isAvailable = isAvailable;
    this.isFeatured = isFeatured;
  }

  @IsString()
  id: string;

  @IsString()
  name: string;
  @IsBoolean()
  isAvailable: boolean;
  @IsBoolean()
  isFeatured: boolean;

  @IsString()
  description: string;

  @Type(() => BrandDto)
  brand: BrandDto;

  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNumber()
  price: number;

  @Type(() => ImageDto)
  images: ImageDto[];
}
class ImageDto {
  @IsString()
  url: string;
}
