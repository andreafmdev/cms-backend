import { IsString } from 'class-validator';

export class ProductAttributeValueDto {
  @IsString()
  attributeId: string;

  @IsString()
  value: string;
}
