import { IsString } from 'class-validator';

export class CategoryTranslationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  languageCode: string;
}
