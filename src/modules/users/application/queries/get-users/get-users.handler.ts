import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/get-users/get-users.query';
import { GetUsersQueryResult } from '@module/users/application/queries/get-users/get-users.response.dto';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { User } from '@module/users/domain/aggretates/user';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(query: GetUsersQuery): Promise<GetUsersQueryResult[]> {
    const usersResults: User[] = [];

    if (query.id) {
      const userOrm = await this.userRepository.findAllByCondition(query.id);

      usersResults.push(
        ...userOrm.map((userOrm) => this.userMapper.toDomain(userOrm)),
      );
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
