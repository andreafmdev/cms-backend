import { IsOptional } from 'class-validator';

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchCategoriesTreeRequest {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, default: 'it' })
  @IsString()
  @IsOptional()
  languageCode: string = 'it';
}
