import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { UserId } from '../value-objects/user-id.vo';

export interface IUserRepository {
  findById(id: UserId): Promise<UserOrmEntity | null>;
}
