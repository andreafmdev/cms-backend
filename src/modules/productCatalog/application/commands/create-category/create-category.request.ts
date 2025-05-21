import { CategoryTranslationDto } from '../../dto/category-translation.dto';
import { CategoryAttributeDto } from '../../dto/category-attribute.dto';
import { ArrayNotEmpty } from 'class-validator';
import { ValidateNested } from 'class-validator';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryAttributeDto)
  attributes: CategoryAttributeDto[];
}
