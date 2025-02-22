import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';

@Injectable()
export class PermissionRepository extends BaseRepository<PermissionOrmEntity> {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly baseRepository: Repository<PermissionOrmEntity>,
  ) {
    super(baseRepository);
  }

  async findByNames(names: string[]): Promise<PermissionOrmEntity[]> {
    return this.baseRepository.find({
      where: names.map((name) => ({ name })),
    });
  }
}
