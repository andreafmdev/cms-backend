import { UuidGenerator } from '@shared/value-object/uuid.vo';
import { Group } from './Group';
import { UserDetail } from './UserDetail';
import { BaseDomainEntity } from '@/domain/BaseDomainEntity';

export class User extends BaseDomainEntity {
  private readonly username: string;
  private readonly email: string;
  private password: string;
  private readonly groups: Group[];
  private readonly details: UserDetail;

  /**
   * private constructor: Forces the use of `create()`.
   */
  private constructor(
    id: string | undefined, // Ora l'ID è opzionale
    username: string,
    email: string,
    password: string,
    groups: Group[],
    details: UserDetail,
  ) {
    super(id);

    this.username = username;
    this.email = email;
    this.password = password;
    this.groups = groups;
    this.details = details;
  }

  /**
   * Factory method to create a new user with a generated ID.
   */
  static create(
    username: string,
    email: string,
    password: string,
    groups: Group[] = [],
    details?: UserDetail | null,
  ): User {
    return new User(
      UuidGenerator.generate().toString(),
      username,
      email,
      password,
      groups && groups.length > 0 ? [...groups] : [],
      details ?? UserDetail.createDefault(),
    );
  }

  /** Returns the user ID. */
  getId(): string {
    return this.id;
  }

  /** Returns the username. */
  getUsername(): string {
    return this.username;
  }

  /** Returns the email. */
  getEmail(): string {
    return this.email;
  }

  /** Returns the groups the user belongs to (defensive copy). */
  getGroups(): Group[] {
    return [...this.groups];
  }

  /**
   * Checks if the user has a given permission.
   */
  hasPermission(permission: string): boolean {
    return this.groups.some((group) => group.hasPermission(permission));
  }

  /**
   * Returns a new user instance with an added group (immutability).
   */
  withAddedGroup(group: Group): User {
    if (this.groups.some((g) => g.getName() === group.getName())) {
      return this; // No modification needed
    }
    return new User(
      this.id,
      this.username,
      this.email,
      this.password,
      [...this.groups, group],
      this.details,
    );
  }

  /**
   * Returns a new user instance with a removed group (immutability).
   */
  withRemovedGroup(groupName: string): User {
    return new User(
      this.id,
      this.username,
      this.email,
      this.password,
      this.groups.filter((group) => group.getName() !== groupName),
      this.details,
    );
  }

  withUpdatedPassword(newPassword: string): User {
    return new User(
      this.id,
      this.username,
      this.email,
      newPassword,
      this.groups,
      this.details,
    );
  }

  /*Utility methods*/
  static createWithId(
    id: string,
    username: string,
    email: string,
    password: string,
    groups: Group[] = [],
    details: UserDetail,
  ): User {
    return new User(id, username, email, password, groups, details);
  }
}
