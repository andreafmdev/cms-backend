import { BaseFilterDto } from '@shared/dto/base.filter.dto';

import { IsOptional, IsString } from 'class-validator';

export class SearchCategoriesRequestDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  languageCode: string = 'it';
}
