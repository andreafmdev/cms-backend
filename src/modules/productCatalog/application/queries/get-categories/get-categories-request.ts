import { IsNotEmpty } from 'class-validator';

import { IsString } from 'class-validator';

export class GetCategoriesRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  languageCode: string;
}
