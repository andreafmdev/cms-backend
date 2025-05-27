import { IsNotEmpty, IsString } from 'class-validator';

export class GetCategoryAttributeResponse {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string = 'it';
}
