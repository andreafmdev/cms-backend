import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { SignUpCommand } from '@userModule/application/commands/impl/sign-up.command';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '@userModule/domain/entities/User';
import { UserMapper } from '@userModule/application/mapper/user-mapper';
import { GroupRepository } from '@userModule/infrastructure/repositories/group.repository';
import { SignUpUserEvent } from '@userModule/application/events/sign-up-user.event';
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
    const user: User = User.create(username, email, password, []);
    const userOrm = this.userMapper.toOrm(user);
    await this.userRepository.save(userOrm);
    this.eventBus.publish(new SignUpUserEvent(userOrm.id, userOrm.username));

    return;
  }
}
