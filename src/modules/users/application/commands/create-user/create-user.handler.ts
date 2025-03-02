import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { User } from '../../../domain/aggretates/user';
import { UserMapper } from '../../../infrastructure/mapper/user-mapper';
import { BadRequestException } from '@nestjs/common';
import { Password } from '@module/users/domain/value-objects/password.vo';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { username, email, password } = command;
    const userPresent = await this.userRepository.findOneByCondition({
      where: { username },
    });
    if (userPresent) {
      throw new BadRequestException('User already exists');
    }
    const user = User.create({
      username,
      email,
      password: Password.fromPlaintext(password),
    });
    const userOrm = this.userMapper.toPersistence(user);
    await this.userRepository.save(userOrm);
  }
}
