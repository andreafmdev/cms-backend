import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';

@Injectable()
export class GroupRepository extends BaseRepository<GroupOrmEntity> {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly groupRepository: Repository<GroupOrmEntity>,
  ) {
    super(groupRepository);
  }
  async findByName(name: string): Promise<GroupOrmEntity | null> {
    const group = await super.findByCondition({
      where: { name },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }
  async findByNameOrId(
    name: string,
    id: string,
  ): Promise<GroupOrmEntity | null> {
    const group = await super.findByCondition({
      where: [{ name: name }, { id: id }],
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }
}
