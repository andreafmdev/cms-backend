import { IsNotEmpty } from 'class-validator';

import { IsString } from 'class-validator';

export class GetBrandDetailRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
