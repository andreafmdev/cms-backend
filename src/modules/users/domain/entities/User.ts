import { UniqueId } from '@shared/value-object/unique-id.vo';

export class User {
  id: UniqueId;
  username: string;
  email: string;
  password: string;
  roles: string[];

  constructor(
    username: string,
    email: string,
    password: string,
    roles: string[] = [],
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
