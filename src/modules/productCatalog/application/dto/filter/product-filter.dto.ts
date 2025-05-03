import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

class ProductTranslationDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
    required: true,
    type: String,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The language code of the product',
    example: 'en',
    required: true,
    type: String,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Product 1 description',
    required: true,
    type: String,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ProductFilterDto extends BaseFilterDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The ID of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'The ID of the brand',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 100,
    required: false,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The is active of the product',
    example: true,
    required: false,
    type: Boolean,
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'The translations of the product',
    example: [],
    required: false,
    type: [ProductTranslationDto],
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto;
}
