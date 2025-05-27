import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetCategoryDetailRequestDto {
  @IsString()
  @IsOptional()
  languageCode: string = process.env.DEFAULT_LANGUAGE_CODE || 'it';
}
