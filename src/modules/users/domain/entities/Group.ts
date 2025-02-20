import { Uuid, UuidGenerator } from '@shared/value-object/uuid.vo';
import { Permission } from './Permission';

export class Group {
  private readonly id: Uuid;
  private readonly name: string;
  private readonly permissions: Permission[];
  private static readonly defaultName: string = 'BASE';
  /** Private constructor to enforce factory methods */
  private constructor(id: Uuid, name: string, permissions: Permission[] = []) {
    this.id = id;
    this.name = name;
    this.permissions = [...permissions];
  }

  /** Factory method for creating a new Group with generated ID */
  static create(name: string, permissions: Permission[] = []): Group {
    return new Group(UuidGenerator.generate(), name, permissions);
  }

  /** Factory method for rehydrating a Group from persistence */
  static createWithId(
    id: Uuid,
    name: string,
    permissions: Permission[] = [],
  ): Group {
    return new Group(id, name, permissions);
  }

  static createDefault(): Group {
    return this.create(this.defaultName, [Permission.createDefault()]);
  }

  getId(): Uuid {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPermissions(): Permission[] {
    return [...this.permissions];
  }

  hasPermission(permission: string): boolean {
    return this.permissions.some((p) => p.getName() === permission);
  }
}
