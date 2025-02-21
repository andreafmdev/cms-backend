import {
  FindManyOptions,
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
  DeepPartial,
  FindOneOptions,
} from 'typeorm';
import { IBaseRepository } from '@base/infrastructure/interfaces/base-repository.interface';
import { Uuid } from '@shared/value-object/uuid.vo';

export abstract class BaseRepository<
  OrmEntity extends ObjectLiteral,
  IdType = string | number | Uuid,
> implements IBaseRepository<OrmEntity, IdType>
{
  constructor(protected readonly repository: Repository<OrmEntity>) {}
  create(data: DeepPartial<OrmEntity>): OrmEntity {
    throw new Error('Method not implemented.');
  }
  createMany(data: DeepPartial<OrmEntity>[]): OrmEntity[] {
    throw new Error('Method not implemented.');
  }
  saveMany(data: DeepPartial<OrmEntity>[]): Promise<OrmEntity[]> {
    throw new Error('Method not implemented.');
  }

  findWithRelations(
    relations: FindManyOptions<OrmEntity>,
  ): Promise<OrmEntity[]> {
    throw new Error('Method not implemented.');
  }
  preload(entityLike: DeepPartial<OrmEntity>): Promise<OrmEntity> {
    throw new Error('Method not implemented.');
  }
  async save(entity: OrmEntity): Promise<OrmEntity> {
    const savedEntity = await this.repository.save(entity);
    return savedEntity;
  }

  async findOneById(id: IdType): Promise<OrmEntity | null> {
    const whereFilter: FindOptionsWhere<OrmEntity | null> = {
      id,
    } as unknown as FindOptionsWhere<OrmEntity>;

    const result = await this.repository.findOne({ where: whereFilter });

    return result;
  }

  async findAll(options?: FindManyOptions<OrmEntity>): Promise<OrmEntity[]> {
    const ormOptions = options as unknown as FindManyOptions<OrmEntity>;
    const results = await this.repository.find(ormOptions);
    return results;
  }

  async findByCondition(filterCondition): Promise<OrmEntity | null> {
    const ormOptions = filterCondition as unknown as FindOneOptions<OrmEntity>;
    const result = await this.repository.findOne(ormOptions);

    return result;
  }
  async remove(entity: OrmEntity): Promise<OrmEntity> {
    const deletedEntity = await this.repository.remove(entity);
    return deletedEntity;
  }
  /*create(data: DeepPartial<BaseDomainEntity>): BaseDomainEntity {
    throw new Error('Method not implemented.');
  }
  createMany(data: DeepPartial<T>[]): T[] {
    throw new Error('Method not implemented.');
  }
  saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  preload(entityLike: DeepPartial<T>): Promise<T> {
    throw new Error('Method not implemented.');
  }*/
}
