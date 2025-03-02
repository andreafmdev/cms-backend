import { Injectable } from '@nestjs/common';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { GroupId } from '@module/users/domain/value-objects/group-id.vo';

@Injectable()
export class GroupRepository extends BaseRepository<GroupOrmEntity> {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly ormRepository: Repository<GroupOrmEntity>,
  ) {
    super(ormRepository);
  }
  async findByName(name: string): Promise<GroupOrmEntity | null> {
    const group = await super.findOneByCondition({
      where: { name },
    });

    return group;
  }

  async findByNameOrId(
    name: string,
    id: GroupId,
  ): Promise<GroupOrmEntity | null> {
    const group = await super.findOneByCondition({
      where: [{ name: name }, { id: id.getValue() }],
    });

    return group;
  }
}
