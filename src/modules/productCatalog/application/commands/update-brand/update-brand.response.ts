import { IsString } from 'class-validator';

export class UpdateBrandResponseDto {
  @IsString()
  id: string;
}
