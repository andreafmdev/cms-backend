import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/impl/get-users.query';
import { GetUsersQueryResult } from '@userModule/application/dtos/get-users.dto';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { UserMapper } from '@module/users/application/mapper/user-mapper';
import { User } from '@module/users/domain/entities/User';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(query: GetUsersQuery): Promise<GetUsersQueryResult[]> {
    let usersOrm: UserOrmEntity[];

    if (query.id) {
      const user = await this.userRepository.findById(query.id);
      if (!user) {
        throw new NotFoundException(`User with ID ${query.id} not found`);
      }
      usersOrm = [user];
    } else {
      usersOrm = await this.userRepository.findAll();
      if (usersOrm.length === 0) {
        throw new NotFoundException('No users found');
      }
    }
    const usersDomain: User[] = usersOrm.map((user) =>
      this.userMapper.toDomain(user),
    );

    // Map domain with class transfomer
    return plainToInstance(GetUsersQueryResult, usersDomain, {
      excludeExtraneousValues: true,
    });
  }
}
