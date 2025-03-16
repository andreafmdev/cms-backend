import { IsOptional, IsPositive } from 'class-validator';

export class BaseFilterDto {
  //Specifies the page number you want to retrieve. It must be a positive integer.
  @IsOptional()
  @IsPositive()
  page: number = 0;
  //Specifies how many records you want to retrieve. It must be a positive integer.

  @IsOptional()
  @IsPositive()
  limit?: number = parseInt(process.env.DEFAULT_PAGINATION_LIMIT ?? '5');
}
