import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  ObjectLiteral,
} from 'typeorm';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { UniqueId } from '@shared/value-object/unique-id.vo';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseAbstractRepostitory<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: UniqueId): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id.toString(),
    } as unknown as FindOptionsWhere<T>;

    const result = await this.entity.findOneBy(options);
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    const result = await this.entity.findOne(filterCondition);
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    const result = await this.entity.preload(entityLike);
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }

  public async findOne(options: FindOneOptions<T>): Promise<T> {
    const result = await this.entity.findOne(options);
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }
}
