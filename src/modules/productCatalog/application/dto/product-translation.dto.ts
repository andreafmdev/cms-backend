import { IsString } from 'class-validator';

export class ProductTranslationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  languageCode: string;
}
