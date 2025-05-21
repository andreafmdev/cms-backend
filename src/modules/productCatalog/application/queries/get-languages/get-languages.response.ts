import { IsBoolean, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GetLanguagesResponse {
  @ApiProperty({ type: String })
  @IsString()
  languageCode: string;

  @ApiProperty({ type: String })
  @IsString()
  languageName: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isDefault: boolean;
}
