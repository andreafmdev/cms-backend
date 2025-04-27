import { IsString } from 'class-validator';

export class CreateCategoryRequestDto {
  @IsString()
  categoryName: string;

  @IsString()
  categoryDescription: string;

  @IsString()
  languageCode: string;

  @IsString()
  attributeName: string;

  @IsString()
  attributeDescription: string;

  @IsString()
  attributeLanguageCode: string;

  @IsString()
  attributeValue: string;
}
