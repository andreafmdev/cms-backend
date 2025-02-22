import { PermissionId } from '../value-objects/permission-id.vo';

export class Permission {
  private static readonly DEFAULT_NAME = 'READ';

  private static readonly VALID_PERMISSIONS = new Set([
    'READ',
    'WRITE',
    'DELETE',
  ]);

  private constructor(
    private readonly id: PermissionId,
    private readonly name: string,
  ) {
    if (!Permission.VALID_PERMISSIONS.has(name)) {
      throw new Error(`Invalid permission: ${name}`);
    }
  }

  /** Factory method per creare un nuovo permesso */
  static create(name: string): Permission {
    return new Permission(PermissionId.create(), name);
  }

  static isValid(name: string): boolean {
    return Permission.VALID_PERMISSIONS.has(name);
  }

  /** Crea un permesso di default */
  static createDefault(): Permission {
    return new Permission(PermissionId.create(), Permission.DEFAULT_NAME);
  }

  equals(other: Permission): boolean {
    return this.name === other.name;
  }

  getName(): string {
    return this.name;
  }
}
