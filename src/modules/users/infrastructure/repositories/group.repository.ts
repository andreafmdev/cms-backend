import { Injectable } from '@nestjs/common';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { GroupId } from '@module/users/domain/value-objects/group-id.vo';
import { GroupMapper } from '../mapper/group.mapper';
import { Group } from '@module/users/domain/aggretates/group';

@Injectable()
export class GroupRepository extends BaseRepository<
  Group,
  GroupOrmEntity,
  GroupId
> {
  constructor(
    @InjectRepository(GroupOrmEntity)
    repo: Repository<GroupOrmEntity>,
    mapper: GroupMapper,
  ) {
    super(repo, mapper);
  }
  async findByName(name: string): Promise<Group | null> {
    const filter: FindOptionsWhere<GroupOrmEntity> = { name };
    const group = await super.findOneByCondition(filter);

    return group;
  }

  async findByNameOrId(name: string, id: GroupId): Promise<Group | null> {
    const filter: FindOptionsWhere<GroupOrmEntity> = {
      name,
      id: id.toString(),
    };
    const group = await super.findOneByCondition(filter);

    return group;
  }
}
