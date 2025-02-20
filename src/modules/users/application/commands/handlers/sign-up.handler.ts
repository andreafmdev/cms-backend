import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from '@userModule/application/commands/impl/sign-up.command';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { UserMapper } from '@userModule/application/mapper/user-mapper';
import { User } from '@userModule/domain/entities/User';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {
    console.log('✅ SignUpHandler registrato!');
  }

  async execute(command: SignUpCommand): Promise<void> {
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
    return;
  }
}
