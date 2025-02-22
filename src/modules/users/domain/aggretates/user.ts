import { UserDetail } from '../entities/user-detail';
import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { Group } from './group';
import { UserSignedUpDomainEvent } from '../events/user-signed-up.event';
import { UserId } from '../value-objects/user-id.vo';
import { Permission } from '../entities/permission';
import { Email } from '../value-objects/email.vo';

/**
 * User aggregate root entity
 */
export class User extends AggregateRoot {
  private constructor(
    id: UserId,
    private readonly username: string,
    private readonly email: Email,
    private password: string,
    private readonly groups: Group[],
    private details: UserDetail, // Rimosso readonly per permettere l'aggiornamento
  ) {
    super(id);
  }

  /** Creates a new user */
  static create(props: {
    username: string;
    email: string;
    password: string;
    groups?: Group[];
    details?: UserDetail;
  }): User {
    const user = new User(
      UserId.create(),
      props.username,
      Email.create(props.email),
      props.password,
      props.groups ?? [],
      props.details ?? UserDetail.createDefault(),
    );
    user.apply(
      new UserSignedUpDomainEvent(UserId.create(), props.email, props.username),
    );

    return user;
  }

  // Getters
  getUsername(): string {
    return this.username;
  }
  getEmail(): Email {
    return this.email;
  }
  getGroups(): Group[] {
    return [...this.groups];
  }
  getDetails(): UserDetail {
    return this.details;
  }
  getPassword(): string {
    return this.password;
  }
  /** Checks if user has specific permission */
  hasPermission(permission: Permission): boolean {
    return this.groups.some((group) => group.hasPermission(permission));
  }

  /** Updates user password */
  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.updateTimestamp();
  }

  /** Adds a new group to user */
  addGroup(group: Group): void {
    if (!this.groups.some((g) => g.getName() === group.getName())) {
      this.groups.push(group);
      this.updateTimestamp();
    }
  }

  /** Removes a group from user */
  removeGroup(groupName: string): void {
    const index = this.groups.findIndex((g) => g.getName() === groupName);
    if (index >= 0) {
      this.groups.splice(index, 1);
      this.updateTimestamp();
    }
  }

  /** Updates user details */
  /** Updates user details in an explicit way */
  //?how to use this method?
  //?user.updateDetails({ address: '123 Main St', phoneNumber: '1234567890' });

  updateDetails({
    address,
    phoneNumber,
    profilePictureUrl,
    biography,
  }: {
    address?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    biography?: string;
  }): void {
    this.details = UserDetail.create(
      address ?? this.details.getAddress(),
      phoneNumber ?? this.details.getPhoneNumber(),
      profilePictureUrl ?? this.details.getProfilePictureUrl(),
      biography ?? this.details.getBiography(),
    );
    this.updateTimestamp();
  }
}
