import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCategoryRequest {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
