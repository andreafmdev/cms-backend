import { IsString, IsOptional } from 'class-validator';

export class GetUsersRequestDto {
  @IsString()
  @IsOptional()
  id?: string;
}
