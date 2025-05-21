import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CategoryAttributeTranslationDto } from './category-attribute-translation.dto';
import { Type } from 'class-transformer';

export class CategoryAttributeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => CategoryAttributeTranslationDto)
  translations: CategoryAttributeTranslationDto[];
}
