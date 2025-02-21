import { UuidGenerator } from '@shared/value-object/uuid.vo';
import { Permission } from './Permission';
import { BaseDomainEntity } from '@/domain/BaseDomainEntity';

export class Group extends BaseDomainEntity {
  private readonly name: string;
  private readonly permissions: Permission[];
  private static readonly defaultName: string = 'BASE';
  /** Private constructor to enforce factory methods */
  private constructor(
    id: string,
    name: string,
    permissions: Permission[] = [],
  ) {
    super(id);
    this.name = name;
    this.permissions = [...permissions];
  }

  /** Factory method for creating a new Group with generated ID */
  static create(name: string, permissions: Permission[] = []): Group {
    return new Group(UuidGenerator.generate().toString(), name, permissions);
  }

  /** Factory method for rehydrating a Group from persistence */
  static createWithId(
    id: string,
    name: string,
    permissions: Permission[] = [],
  ): Group {
    return new Group(id, name, permissions);
  }

  static createDefault(): Group {
    return this.create(this.defaultName, [Permission.createDefault()]);
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
