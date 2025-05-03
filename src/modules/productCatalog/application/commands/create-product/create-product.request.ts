import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ProductTranslationDto } from '../../dto/product-translation.dto';
import { ProductImageDto } from '../../dto/product-image.dto';
export class CreateProductRequestDto {
  @IsNumber()
  price: number;

  @IsString()
  brandId: string;
  @IsString()
  categoryId: string;

  @IsBoolean()
  isActive: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  image?: ProductImageDto[] = [];
}
