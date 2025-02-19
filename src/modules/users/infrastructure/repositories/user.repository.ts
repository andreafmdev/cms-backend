import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getMetadataArgsStorage, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly baseRelations: string[] = [
    'groups',
    'details',
    'permissions',
  ];
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}
  async findById(id: string): Promise<UserOrmEntity | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user ? plainToInstance(UserOrmEntity, user) : null;
  }

  async findAll(): Promise<UserOrmEntity[]> {
    const users = await this.userRepository.find({});
    return users;
  }
  /**
   * Recupera automaticamente tutte le relazioni dichiarate nell'entità TypeORM.
   */
  private getRelations(entity: any): string[] {
    return getMetadataArgsStorage()
      .relations.filter((relation) => relation.target === entity)
      .map((relation) => relation.propertyName);
  }
}
