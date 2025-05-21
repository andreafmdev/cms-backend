import { IsString } from 'class-validator';

export class CreateBrandResponseDto {
  @IsString()
  id: string;
}
