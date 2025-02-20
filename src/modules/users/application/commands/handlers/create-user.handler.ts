import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { User } from '../../../domain/entities/User';
import { UserMapper } from '../../mapper/user-mapper';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { username, email, password } = command;
    const userPresent = await this.userRepository.findByCondition({
      where: { username },
    });
    if (userPresent) {
      throw new BadRequestException('User already exists');
    }
    const user = User.create(username, email, password);
    const userOrm = this.userMapper.toOrm(user);
    await this.userRepository.save(userOrm);
  }
}
