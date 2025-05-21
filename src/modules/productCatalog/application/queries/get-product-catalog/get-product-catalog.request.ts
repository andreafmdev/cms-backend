import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetProductCatalogRequest {
  @IsString()
  @IsOptional()
  id: string;

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
  isActive: boolean;

  @IsString()
  @IsOptional()
  languageCode: string = 'it';
}
