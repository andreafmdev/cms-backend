import { Injectable } from '@nestjs/common';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findAll();
  }
}
