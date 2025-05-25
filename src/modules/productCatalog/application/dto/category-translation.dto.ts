import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
