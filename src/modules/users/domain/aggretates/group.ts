import { Permission } from '../entities/permission';
import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { GroupId } from '../value-objects/group-id.vo';

export class Group extends AggregateRoot {
  //#region PROPERTIES
  private readonly name: string;
  private readonly permissions: Permission[];
  //#endregion

  private static readonly DEFAULT_NAME: string = 'BASE';

  /** Private constructor to enforce factory methods */
  private constructor(
    id: GroupId,
    name: string,
    permissions: Permission[] = [],
  ) {
    super(id);
    this.name = name;
    this.permissions = [...permissions]; // Garantisce l'immutabilità
  }

  /** Factory method for creating a new Group with generated ID */
  static create(name: string, permissions: Permission[] = []): Group {
    return new Group(GroupId.create(), name, permissions);
  }

  static createDefault(): Group {
    return this.create(Group.DEFAULT_NAME, [Permission.createDefault()]);
  }

  static reconstitute(
    id: GroupId,
    name: string,
    permissions: Permission[],
  ): Group {
    return new Group(id, name, permissions);
  }

  getName(): string {
    return this.name;
  }

  //#region Permissions
  getPermissions(): Permission[] {
    return [...this.permissions];
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.some((p) => p.equals(permission));
  }

  /** Aggiunge un permesso al gruppo (immutabilità) */
  addPermission(permission: Permission): Group {
    if (this.hasPermission(permission)) {
      return this; // Nessuna modifica se il permesso esiste già
    }
    return new Group(this.getId() as GroupId, this.name, [
      ...this.permissions,
      permission,
    ]);
  }

  /** Rimuove un permesso dal gruppo (immutabilità) */
  removePermission(permissionName: string): Group {
    return new Group(
      this.getId() as GroupId,
      this.name,
      this.permissions.filter((p) => p.getName() !== permissionName),
    );
  }
  //#endregion
}
