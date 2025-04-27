import { IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BrandFilterDto extends BaseFilterDto {
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
  id?: string;

  @ApiProperty({
    description: 'The name of the brand',
    example: 'test',
    required: false,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
