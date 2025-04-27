import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { User } from '../../../domain/aggretates/user';
import { BadRequestException } from '@nestjs/common';
import { Password } from '@module/users/domain/value-objects/password.vo';
import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { FindOptionsWhere } from 'typeorm';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { username, email, password } = command;
    const filter: FindOptionsWhere<UserOrmEntity> = {
      username,
    };
    const userPresent = await this.userRepository.findOneByCondition(filter);
    if (userPresent) {
      throw new BadRequestException('User already exists');
    }
    const user = User.create({
      username,
      email,
      password: Password.fromPlaintext(password),
    });
    await this.userRepository.save(user);
  }
}
