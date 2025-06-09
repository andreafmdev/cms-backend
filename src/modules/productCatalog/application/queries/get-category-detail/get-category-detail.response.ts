import { Expose, Type } from 'class-transformer';

class TranslationDto {
  @Expose()
  languageCode: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
}

class AttributeTranslationDto {
  @Expose()
  languageCode: string;
  @Expose()
  value: string;
}

class AttributeDto {
  @Expose()
  id: string;

  // Per visualizzazione normale (una lingua)
  @Expose()
  name?: string;

  // Per edit (tutte le lingue)
  @Expose()
  @Type(() => AttributeTranslationDto)
  translations?: AttributeTranslationDto[];
}

@Expose()
export class GetCategoryDetailResponseDto {
  @Expose()
  id: string;

  // Per visualizzazione normale (una lingua)
  @Expose()
  name?: string;
  @Expose()
  description?: string;

  // Per edit (tutte le lingue)
  @Expose()
  @Type(() => TranslationDto)
  translations?: TranslationDto[];

  @Expose()
  @Type(() => AttributeDto)
  attributes: AttributeDto[];
}
