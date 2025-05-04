import { Expose, Type } from 'class-transformer';

class AttributeDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}

@Expose()
export class GetCategoryDetailResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  @Type(() => AttributeDto)
  attributes: AttributeDto[];
}
