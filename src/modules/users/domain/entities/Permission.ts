import { UniqueId } from '@shared/value-object/unique-id.vo';

export class Permission {
  private readonly id: UniqueId;
  private readonly name: string;

  constructor(id: UniqueId, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): UniqueId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
