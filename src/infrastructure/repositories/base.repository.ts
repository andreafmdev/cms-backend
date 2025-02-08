import {
  Repository,
  EntityTarget,
  DataSource,
  ObjectLiteral,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { UniqueId } from '@shared/value-object/unique-id.vo';
import { DatabaseException } from '@shared/exceptions/database.exception';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  createMany(data: DeepPartial<T>[]): T[] {
    return this.repository.create(data);
  }

  async save(data: DeepPartial<T>): Promise<T> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new DatabaseException('Error saving entity', error);
    }
  }

  async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new DatabaseException('Error saving multiple entities', error);
    }
  }

  async findOneById(id: UniqueId): Promise<T> {
    try {
      const result = await this.repository.findOne({
        where: { id: id.toString() } as unknown as FindOptionsWhere<T>,
      });

      if (!result) {
        throw new NotFoundException(
          `Entity with ID ${id.toString()} not found`,
        );
      }
      return result;
    } catch (error) {
      throw new DatabaseException('Error finding entity by ID', error);
    }
  }

  async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    try {
      const result = await this.repository.findOne(filterCondition);
      if (!result) {
        throw new NotFoundException('Entity not found');
      }
      return result;
    } catch (error) {
      throw new DatabaseException('Error finding entity by condition', error);
    }
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      throw new DatabaseException('Error fetching all entities', error);
    }
  }

  async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(relations);
    } catch (error) {
      throw new DatabaseException(
        'Error fetching entities with relations',
        error,
      );
    }
  }

  async preload(entityLike: DeepPartial<T>): Promise<T> {
    try {
      const result = await this.repository.preload(entityLike);
      if (!result) {
        throw new NotFoundException('Entity not found for preload');
      }
      return result;
    } catch (error) {
      throw new DatabaseException('Error preloading entity', error);
    }
  }

  async remove(data: T): Promise<T> {
    try {
      await this.repository.remove(data);
      return data;
    } catch (error) {
      throw new DatabaseException('Error removing entity', error);
    }
  }
}
