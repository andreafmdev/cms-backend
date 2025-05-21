import { IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetProductDetailRequestDto {
  @IsString()
  @IsOptional()
  languageCode: string;
}
