import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { Permission } from '@module/users/domain/entities/permission';
import { PermissionId } from '@module/users/domain/value-objects/permission-id.vo';
import { PermissionMapper } from '../mapper/permission.mapper';

@Injectable()
export class PermissionRepository extends BaseRepository<
  Permission,
  PermissionOrmEntity,
  PermissionId
> {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    repo: Repository<PermissionOrmEntity>,
    mapper: PermissionMapper,
  ) {
    super(repo, mapper);
  }

  async findByNames(names: string[]): Promise<PermissionOrmEntity[]> {
    return this.repository.find({
      where: names.map((name) => ({ name })),
    });
  }
}
