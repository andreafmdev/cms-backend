import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
