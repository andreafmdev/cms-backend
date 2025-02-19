import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';

export interface IUserRepository extends IBaseRepository<UserOrmEntity> {
  findById(id: string): Promise<UserOrmEntity | null>;
  findAll(): Promise<UserOrmEntity[]>;
}
