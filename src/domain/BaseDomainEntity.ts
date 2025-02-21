import { UuidGenerator } from '@shared/value-object/uuid.vo';

export abstract class BaseDomainEntity {
  protected readonly id: string;

  protected constructor(id?: string) {
    this.id = id ?? UuidGenerator.generate().toString();
  }

  /** Returns the entity ID */
  getId(): string {
    return this.id;
  }
}
