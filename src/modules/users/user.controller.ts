import { Controller, Get } from '@nestjs/common';
import { UserService } from '@userModule/application/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
