import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

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
    price: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.brand = brand;
    this.category = category;
    this.price = price;
  }

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => BrandDto)
  brand: BrandDto;

  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNumber()
  price: number;
}
