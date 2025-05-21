import { IsString, IsOptional } from 'class-validator';

export class UpdateBrandRequestDto {
  @IsString()
  @IsOptional()
  name: string;
}
