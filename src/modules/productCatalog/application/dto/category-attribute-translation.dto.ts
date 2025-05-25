import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryAttributeTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
