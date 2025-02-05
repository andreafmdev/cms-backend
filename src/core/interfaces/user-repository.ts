// src/core/domain/interfaces/user-repository.interface.ts
import { User } from '../domain/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}
