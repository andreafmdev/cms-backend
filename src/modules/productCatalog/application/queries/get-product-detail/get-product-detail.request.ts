import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetProductDetailRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  languageCode: string = process.env.DEFAULT_LANGUAGE_CODE || 'it';
}
