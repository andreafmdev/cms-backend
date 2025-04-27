import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { PermissionId } from '../value-objects/permission-id.vo';
export class Permission extends BaseDomainEntity<PermissionId> {
  private static readonly DEFAULT_NAME = 'READ';

  private static readonly VALID_PERMISSIONS = new Set([
    'READ',
    'WRITE',
    'DELETE',
  ]);

  private constructor(
    private readonly name: string,
    id: PermissionId,
  ) {
    super(id);
    if (!Permission.VALID_PERMISSIONS.has(name)) {
      throw new Error(`Invalid permission: ${name}`);
    }
  }

  /** Factory method per creare un nuovo permesso */
  static create(name: string): Permission {
    return new Permission(name, PermissionId.create());
  }

  static isValid(name: string): boolean {
    return Permission.VALID_PERMISSIONS.has(name);
  }

  /** Crea un permesso di default */
  static createDefault(): Permission {
    return new Permission(Permission.DEFAULT_NAME, PermissionId.create());
  }

  equals(other: Permission): boolean {
    return this.name === other.name;
  }

  getName(): string {
    return this.name;
  }

  /**
   * Reconstitutes a permission from its properties
   * @param id - The ID of the permission
   * @param name - The name of the permission
   * @returns A new permission with the same properties as the current permission
   */
  static reconstitute(id: PermissionId, name: string): Permission {
    return new Permission(name, id);
  }
}
