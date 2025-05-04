import { IsString } from 'class-validator';

export class GetBrandDetailResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
