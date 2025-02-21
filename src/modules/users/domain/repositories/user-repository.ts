import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';

export interface IUserRepository {
  findById(id: string): Promise<UserOrmEntity | null>;
}
