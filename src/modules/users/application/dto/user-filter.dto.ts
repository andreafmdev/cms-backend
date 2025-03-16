import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseFilterDto } from '@shared/dto/base.filter.dto';

export class UserFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
