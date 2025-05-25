import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryAttributeDto } from '../../dto/category-attribute.dto';
import { CategoryTranslationDto } from '../../dto/category-translation.dto';
import { IsArray } from 'class-validator';

export class UpdateCategoryRequestDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryAttributeDto)
  attributes: CategoryAttributeDto[];
}
