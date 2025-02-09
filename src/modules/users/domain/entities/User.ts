import { Role } from './Role';
import { Uuid } from '@shared/value-object/uuid.vo';

export class User {
  private readonly id: Uuid;
  private username: string;
  private email: string;
  private password: string;
  private roles: string[];

  constructor(
    id: Uuid,
    username: string,
    email: string,
    password: string,
    roles: string[] = [],
    //?: date handled by typeorm
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }

  getId(): Uuid {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
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
