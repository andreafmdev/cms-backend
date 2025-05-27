import { IsNotEmpty, IsString } from 'class-validator';

export class GetCategoryAttributesRequestDto {
  @IsString()
  @IsNotEmpty()
  languageCode: string = 'it';
}
