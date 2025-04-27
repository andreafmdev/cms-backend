import { ApiProperty } from '@nestjs/swagger';

export class LocalAuthResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  @ApiProperty({
    description: 'The username of the user',
    example: 'test',
  })
  username: string;
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  email: string;
  // eventuali altri campi che vuoi esporre
}
