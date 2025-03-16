import { UserDetail } from '../entities/user-detail';
import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { Group } from './group';
import { UserSignedUpDomainEvent } from '../events/user-signed-up.event';
import { UserId } from '../value-objects/user-id.vo';
import { Permission } from '../entities/permission';
import { Email } from '../value-objects/email.vo';
import { UserEmailVerifiedDomainEvent } from '../events/user-email-verified.event';
import { Password } from '../value-objects/password.vo';
/**
 * User aggregate root entity
 */
export class User extends AggregateRoot {
  //#region Properties
  private isActive: boolean;
  private isEmailVerified: boolean;
  private readonly username: string;
  private readonly email: Email;
  private password: Password;
  private readonly groups: Group[];
  private details: UserDetail;
  //#endregion

  private constructor(
    id: UserId,
    username: string,
    email: Email,
    password: Password,
    isActive: boolean,
    isEmailVerified: boolean,
    groups: Group[],
    details: UserDetail,
  ) {
    super(id);
    this.username = username;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.isEmailVerified = isEmailVerified;
    this.groups = groups;
    this.details = details;
  }

  /** Creates a new user */
  static create(props: {
    username: string;
    email: string;
    password: Password;
    groups?: Group[];
    details?: UserDetail;
    isActive?: boolean;
    isEmailVerified?: boolean;
    applyEvents?: boolean;
  }): User {
    const userId = UserId.create();
    const user = new User(
      userId,
      props.username,
      Email.create(props.email),
      props.password,
      props.isActive ?? true,
      props.isEmailVerified ?? false, // Default: email non verificata
      props.groups ?? [],
      props.details ?? UserDetail.createDefault(),
    );
    if (props.applyEvents ?? true) {
      user.apply(
        new UserSignedUpDomainEvent(userId, props.email, props.username),
      );
    }

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
  getPassword(): Password {
    return this.password;
  }

  isVerified(): boolean {
    return this.isEmailVerified;
  }

  getId(): UserId {
    return super.getId() as UserId;
  }

  /** Verifica l'email dell'utente */
  verifyEmail(): void {
    if (!this.isEmailVerified) {
      this.isEmailVerified = true;
      this.updateTimestamp();
      this.apply(
        new UserEmailVerifiedDomainEvent(this.getId(), this.email.getValue()),
      );
    }
  }

  /** Attiva o disattiva l'account utente */
  setActive(active: boolean): void {
    if (this.isActive !== active) {
      this.isActive = active;
      this.updateTimestamp();
    }
  }

  /** Checks if user has specific permission */
  hasPermission(permission: Permission): boolean {
    return this.groups.some((group) => group.hasPermission(permission));
  }

  /** Updates user password */
  updatePassword(newPassword: Password): void {
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
  verifyPassword(password: string): boolean {
    return this.password.verify(password);
  }
  createPassword(password: string): Password {
    return Password.fromPlaintext(password);
  }

  /**
   * Reconstitutes a user from its properties
   * @param id - The ID of the user
   * @param username - The username of the user
   * @param email - The email of the user
   * @param password - The password of the user
   * @param isActive - Whether the user is active
   * @param isEmailVerified - Whether the user's email is verified
   * @param groups - The groups of the user
   * @param details - The details of the user
   * @returns A new user with the same properties as the current user but with the new ID
   */
  static reconstitute(
    id: UserId,
    username: string,
    email: Email,
    password: Password,
    isActive: boolean,
    isEmailVerified: boolean,
    groups: Group[],
    details: UserDetail,
  ): User {
    return new User(
      id,
      username,
      email,
      password,
      isActive,
      isEmailVerified,
      groups,
      details,
    );
  }
}
