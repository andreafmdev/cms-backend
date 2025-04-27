import { Expose, Type } from 'class-transformer';

export class CreateCategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
class CategoryDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => CategoryAttributeDto)
  categoryAttributes: CategoryAttributeDto[];

  @Expose()
  name: string;
}
class CategoryAttributeDto {
  @Expose()
  id: string;

  @Expose()
  categoryId: string;

  @Expose()
  @Type(() => CategoryAttributeTranslationDto)
  productCategoryAttributeTranslations: CategoryAttributeTranslationDto[];
}
class CategoryAttributeTranslationDto {
  @Expose()
  languageCode: string;

  @Expose()
  value: string;

  @Expose()
  attributeId: string;
}
