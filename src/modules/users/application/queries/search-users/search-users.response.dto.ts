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
class UserDetailDto {
  @Expose()
  address: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  profilePictureUrl: string;

  @Expose()
  biography: string;
}
export class SearchUsersResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Type(() => GroupDto)
  groups: GroupDto[];

  @Expose()
  @Type(() => UserDetailDto)
  details: UserDetailDto;

  constructor(
    id: string,
    username: string,
    email: string,
    groups: GroupDto[],
    details: UserDetailDto,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.groups = groups;
    this.details = details;
  }
}
