import { BaseFilterDto } from '@shared/dto/base.filter.dto';

import { IsOptional, IsString } from 'class-validator';

export class SearchBrandsRequestDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  name: string;
}
