import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
} from 'typeorm';
import { IBaseRepository } from '@base/infrastructure/interfaces/base-repository.interface';
import { NotFoundException } from '@nestjs/common';
import { Uuid } from '@shared/value-object/uuid.vo';

export abstract class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  constructor(protected readonly repository: Repository<T>) {}
  create(data: DeepPartial<T>): T {
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
  }

  async save(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  async findOneById(id: Uuid): Promise<T> {
    const result = await this.repository.findOne({
      where: { id: id.toString() } as any as FindOptionsWhere<T>,
    });
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }

  async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    const result = await this.repository.findOne(filterCondition);
    if (!result) {
      throw new NotFoundException('Entity not found');
    }
    return result;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async remove(data: T): Promise<T> {
    return await this.repository.remove(data);
  }
}
