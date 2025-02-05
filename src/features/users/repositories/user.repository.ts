// src/features/users/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '@core/domain/user.entity';
import { BaseRepository } from '../../../infrastructure/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
