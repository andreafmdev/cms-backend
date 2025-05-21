import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class SearchCategoryOptionsResponse {
  constructor() {}
  @ApiProperty({
    description: 'The id of the category',
    type: String,
    example: '13123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The name of the category',
    type: String,
    example: 'Piano',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
