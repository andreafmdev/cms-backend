import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { IsString } from 'class-validator';

export class GetProductsResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => BrandDto)
  brand: BrandDto;

  @Type(() => CategoryDto)
  category: CategoryDto;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

class BrandDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class CategoryDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
