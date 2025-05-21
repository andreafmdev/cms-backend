import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
