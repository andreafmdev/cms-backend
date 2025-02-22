import { IsString, IsOptional } from 'class-validator';

export class GetGroupsRequestDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
