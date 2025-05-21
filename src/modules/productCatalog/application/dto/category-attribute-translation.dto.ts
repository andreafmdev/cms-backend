import { IsString } from 'class-validator';

export class CategoryAttributeTranslationDto {
  @IsString()
  name: string;
  @IsString()
  languageCode: string;
}
