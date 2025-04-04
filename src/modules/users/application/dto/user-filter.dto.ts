import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseFilterDto } from '@shared/dto/base.filter.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserFilterDto extends BaseFilterDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    required: false,
    format: 'email',
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'test',
    required: false,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  username?: string;
}
