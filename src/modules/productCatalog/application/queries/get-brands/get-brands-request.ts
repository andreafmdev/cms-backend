import { IsNotEmpty } from 'class-validator';

import { IsString } from 'class-validator';

export class GetBrandsRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
