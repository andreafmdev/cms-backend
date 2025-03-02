import { Injectable } from '@nestjs/common';
import { GroupRepository } from '@module/users/infrastructure/repositories/group.repository';
import { Group } from '@module/users/domain/aggretates/group';
import { Permission } from '@module/users/domain/entities/permission';
import { PermissionRepository } from '@module/users/infrastructure/repositories/permission.repository';
import { PermissionMapper } from '@module/users/infrastructure/mapper/permission.mapper';
import { GroupMapper } from '@module/users/infrastructure/mapper/group.mapper';
import { Filter, FilterComposite } from '@shared/helpers/query-filter';
import { GroupId } from '@module/users/domain/value-objects/group-id.vo';
/**
 * Service responsible for managing group-related operations
 */
@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly permissionMapper: PermissionMapper,
    private readonly groupMapper: GroupMapper,
  ) {}

  /**
   * Creates a new group with the specified name and permissions
   * @param name The name of the group to create
   * @param permissionNames Array of permission names to assign to the group
   * @returns The created group
   * @throws Error if group already exists
   */
  async createGroup(name: string, permissionNames: string[]): Promise<Group> {
    // Check if group already exists
    const existingGroup = await this.groupRepository.findOneByCondition({
      where: { name },
    });

    if (existingGroup) {
      throw new Error('Group already exists');
    }
    const permissionsOrm =
      await this.permissionRepository.findByNames(permissionNames);

    const permissions: Permission[] = permissionsOrm.map((p) =>
      this.permissionMapper.toDomain(p),
    );
    const permissionObjects = permissions.map((p) =>
      Permission.create(p.getName()),
    );

    // Create the group
    const group = Group.create(name, permissionObjects);
    const groupOrm = this.groupMapper.toPersistence(group);
    await this.groupRepository.save(groupOrm);
    return group;
  }

  /**
   * Finds a group by its name
   * @param name The name of the group to find
   * @returns The found group or null if not found
   */
  async findGroupByName(name: string): Promise<Group | null> {
    const groupOrm = await this.groupRepository.findByName(name);
    if (!groupOrm) {
      return null;
    }
    return this.groupMapper.toDomain(groupOrm);
  }

  /**
   * Finds a group by its ID
   * @param id The ID of the group to find
   * @returns The found group or null if not found
   */
  async findGroupById(id: GroupId): Promise<Group | null> {
    const groupOrm = await this.groupRepository.findById(id.getValue());
    return groupOrm ? this.groupMapper.toDomain(groupOrm) : null;
  }

  /**
   * Finds groups by either name or ID
   * @param name The name to search for
   * @param id The ID to search for
   * @returns Array of matching groups
   */
  async findGroupByNameOrId(name: string, id: GroupId): Promise<Group | null> {
    const groupOrm = await this.groupRepository.findByNameOrId(name, id);

    return groupOrm ? this.groupMapper.toDomain(groupOrm) : null;
  }

  /**
   * Retrieves all groups from the repository
   * @returns Array of all groups
   */
  async findAllGroups(): Promise<Group[]> {
    const groupsOrm = await this.groupRepository.findAll();
    return groupsOrm.map((groupOrm) => this.groupMapper.toDomain(groupOrm));
  }

  /**
   * Finds groups based on the provided filter
   * @param filter The filter to apply to the groups
   * @returns Array of groups matching the filter
   */
  async findGroups(filter: Filter | FilterComposite): Promise<Group[]> {
    const groups: Group[] = [];

    const groupsOrm = await this.groupRepository.findAllByCondition(filter);
    if (!groupsOrm) {
      return groups;
    }
    groups.push(
      ...groupsOrm.map((groupOrm) => this.groupMapper.toDomain(groupOrm)),
    );
    return groups;
  }
}
