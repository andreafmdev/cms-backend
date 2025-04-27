import { IsNotEmpty } from 'class-validator';

import { IsString } from 'class-validator';

export class GetBrandsResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
