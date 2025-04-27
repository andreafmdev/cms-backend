import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

class ProductTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ProductFilterDto {
  constructor(
    public readonly _isActive: boolean,
    public readonly _translations: ProductTranslationDto,
  ) {
    this.isActive = _isActive ?? false;
    this.translations = _translations ?? [];
  }
  @IsString()
  id: string;

  @IsString()
  categoryId: string;

  @IsString()
  brandId: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto;
}
