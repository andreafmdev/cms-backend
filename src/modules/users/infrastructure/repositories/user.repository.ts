import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, getMetadataArgsStorage, Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { Uuid } from '@shared/value-object/uuid.vo';

@Injectable()
export class UserRepository
  extends BaseRepository<UserOrmEntity>
  implements IUserRepository
{
  private readonly baseRelations: string[] = [
    'groups',
    'details',
    'permissions',
  ];
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {
    super(userRepository);
  }
  async findById(id: string): Promise<UserOrmEntity> {
    const user = await this.findOneById(Uuid.fromString(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Recupera automaticamente tutte le relazioni dichiarate nell'entità TypeORM.
   */
  private getRelations(entity: any): string[] {
    return getMetadataArgsStorage()
      .relations.filter((relation) => relation.target === entity)
      .map((relation) => relation.propertyName);
  }
  async findByCondition(
    condition: FindOneOptions<UserOrmEntity>,
  ): Promise<UserOrmEntity> {
    const result = await this.userRepository.findOne(condition);
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }
}
