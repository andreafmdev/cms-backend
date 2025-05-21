import { IsBoolean, IsOptional } from 'class-validator';

export class GetLanguagesRequest {
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;
}
