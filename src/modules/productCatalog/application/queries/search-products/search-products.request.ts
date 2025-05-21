import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class SearchProductsRequestDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  brandId: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured: boolean;

  @IsString()
  @IsOptional()
  languageCode;
}
