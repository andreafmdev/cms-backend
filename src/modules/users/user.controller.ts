import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/get-users/get-users.query';
import { GetUsersQueryResult } from './application/queries/get-users/get-users.response.dto';
import { SignUpCommand } from './application/commands/sign-up/sign-up.command';
import { SignUpDto } from './application/commands/sign-up/sign-up.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Post('sign-up')
  async create(@Body() signUpDto: SignUpDto): Promise<void> {
    const { username, email, password } = signUpDto;
    const command = new SignUpCommand(username, email, password);
    await this.commandBus.execute(command);
  }
  @Get()
  async findAll(): Promise<GetUsersQueryResult[]> {
    return await this.queryBus.execute(new GetUsersQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUsersQueryResult> {
    return await this.queryBus.execute(new GetUsersQuery(id));
  }
}
