import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { IBaseRepository } from '@base/infrastructure/interfaces/base-repository.interface';
import { FindOneOptions } from 'typeorm';

export interface IUserRepository extends IBaseRepository<UserOrmEntity> {
  findById(id: string): Promise<UserOrmEntity>;
  findAll(): Promise<UserOrmEntity[]>;
  findByCondition(
    condition: FindOneOptions<UserOrmEntity>,
  ): Promise<UserOrmEntity>;
}
