import { UniqueId } from '@shared/value-object/unique-id.vo';
import { Role } from './Role';

export class User {
  private readonly id: UniqueId;
  private username: string;
  private email: string;
  private password: string;
  private roles: string[];

  constructor(
    id: UniqueId,
    username: string,
    email: string,
    password: string,
    roles: string[] = [],
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
  getId(): UniqueId {
    return this.id;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  addRole(role: Role): void {
    if (!this.hasRole(role.getName())) {
      this.roles.push(role.getName());
    }
  }

  removeRole(roleName: string): void {
    this.roles = this.roles.filter((role) => role !== roleName);
  }
}
