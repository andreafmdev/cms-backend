import { User } from '../aggretates/user';
import { UserId } from '../value-objects/user-id.vo';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
}
