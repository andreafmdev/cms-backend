import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class CategoryTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}

export class CategoryFilterDto {
  @IsArray()
  @IsNotEmpty()
  translations: CategoryTranslationDto;
}
