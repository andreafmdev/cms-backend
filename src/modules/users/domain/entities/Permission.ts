import { UuidGenerator } from '@shared/value-object/uuid.vo';
import { BaseDomainEntity } from '@/domain/BaseDomainEntity';

export class Permission extends BaseDomainEntity {
  private readonly name: string;
  private static readonly defaultPermission: string = 'READ';
  /** Private constructor to enforce factory methods */
  private constructor(id: string, name: string) {
    super(id);
    this.name = name;
  }

  /** Factory method for creating a new Permission with generated ID */
  static create(name: string): Permission {
    return new Permission(UuidGenerator.generate().toString(), name);
  }

  /** Factory method for rehydrating a Permission from persistence */
  static createWithId(id: string, name: string): Permission {
    return new Permission(id, name);
  }

  static createDefault(): Permission {
    return this.create(this.defaultPermission);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
