import { IsOptional } from 'class-validator';

import { IsString } from 'class-validator';

export class GetBrandsRequestDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;
}
