import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/impl/get-users.query';
import { GetUsersQueryResult } from '@userModule/application/dtos/get-users.dto';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { UserMapper } from '@module/users/application/mapper/user-mapper';
import { User } from '@module/users/domain/entities/User';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(query: GetUsersQuery): Promise<GetUsersQueryResult[]> {
    const usersResults: User[] = [];

    if (query.id) {
      const userOrm = await this.userRepository.findById(query.id);
      if (!userOrm) {
        throw new NotFoundException(`User with ID ${query.id} not found`);
      }
      const user: User = this.userMapper.toDomain(userOrm);
      usersResults.push(user);
    } else {
      const usersOrm = await this.userRepository.findAll();
      if (usersOrm.length === 0) {
        throw new NotFoundException('No users found');
      }
      usersResults.push(
        ...usersOrm.map((userOrm) => this.userMapper.toDomain(userOrm)),
      );
    }

    // Map domain with class transfomer
    return plainToInstance(GetUsersQueryResult, usersResults, {
      excludeExtraneousValues: true,
    });
  }
}
