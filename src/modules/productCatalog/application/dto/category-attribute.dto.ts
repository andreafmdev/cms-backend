import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CategoryAttributeTranslationDto } from './category-attribute-translation.dto';
import { Type } from 'class-transformer';

export class CategoryAttributeDto {
  @IsUUID()
  @IsOptional()
  id: string; //for update id attribute

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CategoryAttributeTranslationDto)
  translations: CategoryAttributeTranslationDto[];
}
