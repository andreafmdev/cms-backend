import { Uuid, UuidGenerator } from '@shared/value-object/uuid.vo';

export class Permission {
  private readonly id: Uuid;
  private readonly name: string;

  /** Private constructor to enforce factory methods */
  private constructor(id: Uuid, name: string) {
    this.id = id;
    this.name = name;
  }

  /** Factory method for creating a new Permission with generated ID */
  static create(name: string): Permission {
    return new Permission(UuidGenerator.generate(), name);
  }

  /** Factory method for rehydrating a Permission from persistence */
  static createWithId(id: Uuid, name: string): Permission {
    return new Permission(id, name);
  }

  getId(): Uuid {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
