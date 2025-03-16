import { IsString, IsOptional } from 'class-validator';

export class SearchUsersRequestDto {
  @IsString()
  @IsOptional()
  id?: string;
}
