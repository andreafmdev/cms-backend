import { Expose, Type } from 'class-transformer';

class PermissionDto {
  @Expose()
  name: string;
}

class GroupDto {
  @Expose()
  name: string;

  @Expose()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class GetUsersResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Type(() => GroupDto)
  groups: GroupDto[];

  constructor(id: string, username: string, email: string, groups: GroupDto[]) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.groups = groups;
  }
}
