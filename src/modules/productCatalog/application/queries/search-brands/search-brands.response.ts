import { Expose } from 'class-transformer';

@Expose()
export class SearchBrandsResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
