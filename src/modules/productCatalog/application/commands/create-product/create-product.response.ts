import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductResponseDto {
  /**
   * The id of the product
   */
  @ApiProperty({
    description: 'The id of the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;
}
