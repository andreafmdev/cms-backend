import { Expose, Type } from 'class-transformer';

export class GetGroupsResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class PermissionDto {
  @Expose()
  name: string;
}
