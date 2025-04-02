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
class UserDetailsDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  address: string;
}

export class GetUserDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Type(() => GroupDto)
  groups: GroupDto[];

  @Type(() => UserDetailsDto)
  details: UserDetailsDto;

  constructor(
    id: string,
    username: string,
    email: string,
    groups: GroupDto[],
    details: UserDetailsDto,
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.groups = groups;
    this.details = details;
  }
}
