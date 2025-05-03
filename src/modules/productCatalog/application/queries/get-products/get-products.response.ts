import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

import { IsString } from 'class-validator';
class ProductTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
class CategoryTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
class BrandDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class CategoryDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];
}
export class GetProductsResponseDto {
  constructor(
    id: string,
    translations: ProductTranslationDto[],
    brand: BrandDto,
    category: CategoryDto,
    price: number,
  ) {
    this.id = id;
    this.translations = translations;
    this.brand = brand;
    this.category = category;
    this.price = price;
  }

  @IsString()
  @IsNotEmpty()
  id: string;

  @Type(() => BrandDto)
  brand: BrandDto;

  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];
}
