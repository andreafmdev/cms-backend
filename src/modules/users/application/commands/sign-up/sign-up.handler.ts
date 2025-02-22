import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { SignUpCommand } from '@module/users/application/commands/sign-up/sign-up.command';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '@module/users/domain/aggretates/user';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { GroupRepository } from '@userModule/infrastructure/repositories/group.repository';
//import { Injectable } from '@nestjs/common';
@CommandHandler(SignUpCommand)
//@Injectable()
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly userMapper: UserMapper,
    private readonly eventBus: EventBus,
  ) {
    console.log('✅ SignUpHandler registrato!');
  }

  async execute(command: SignUpCommand): Promise<void> {
    const { username, email, password } = command;
    const userPresent = await this.userRepository.findByCondition({
      where: [{ email }, { username }],
    });
    if (userPresent) {
      throw new BadRequestException('User already exists');
    }
    const group = await this.groupRepository.findByName('Viewer');
    if (!group) {
      throw new BadRequestException('Base Group Not Found');
    }
    const user: User = User.create({ username, email, password });
    const userOrm = this.userMapper.toPersistence(user);
    await this.userRepository.save(userOrm);

    return;
  }
}
