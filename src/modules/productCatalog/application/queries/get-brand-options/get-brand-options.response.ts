import { IsNotEmpty } from 'class-validator';

import { IsString } from 'class-validator';

export class GetBrandOptionsResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
