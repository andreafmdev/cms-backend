import { IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetBrandOptionsRequestDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}
