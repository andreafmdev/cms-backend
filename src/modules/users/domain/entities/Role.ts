import { Uuid } from '@shared/value-object/uuid.vo';

export class Role {
  private readonly id: Uuid;
  private readonly name: string;

  constructor(id: Uuid, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): Uuid {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
