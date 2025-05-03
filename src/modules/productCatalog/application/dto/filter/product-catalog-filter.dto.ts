import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class ProductCatalogFilterDto extends BaseFilterDto {
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
}
