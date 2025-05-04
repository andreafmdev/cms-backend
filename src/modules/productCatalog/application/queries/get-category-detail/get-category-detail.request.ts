import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetCategoryDetailRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  languageCode: string = 'it';
}
