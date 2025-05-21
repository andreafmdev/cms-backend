import { IsNotEmpty, IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetCategoriesRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  languageCode: string;
}
